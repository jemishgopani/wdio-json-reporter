const fs = require('fs')
const path = require('path')

const mergeResults = (...args) => {
    const dir = process.argv[2]
    const filePattern = process.argv[3]

    const rawData = getDataFromFiles(dir, filePattern)
    const mergedResults = mergeData(rawData)
    writeFile(dir, mergedResults)
}

function getDataFromFiles (dir, filePattern) {
    const fileNames = fs.readdirSync(dir).filter(file => file.match(filePattern))
    const data = []

    fileNames.forEach(fileName => {
        data.push(JSON.parse(fs.readFileSync(`${dir}/${fileName}`)))
    })

    return data
}

function mergeData (rawData) {
    let mergedResults

    rawData.forEach(data => {
        if (mergedResults === undefined) {
            // use the first result so that we have the right shape
            mergedResults = {}
            Object.assign(mergedResults, data)
            mergedResults.capabilities = [mergedResults.capabilities] // make this an array so we can capture all caps
        } else {
            mergedResults.suites.push(...data.suites)
            mergedResults.specs.push(...data.specs)
            mergedResults.state.passed += data.state.passed
            mergedResults.state.failed += data.state.failed
            mergedResults.state.skipped += data.state.skipped
            mergedResults.capabilities.push(data.capabilities)
        }
    })

    return mergedResults
}

function writeFile (dir, mergedResults) {
    const fileName = 'wdio-merged.json'
    const filePath = path.join(dir, fileName)
    fs.writeFileSync(filePath, JSON.stringify(mergedResults))
}

module.exports = mergeResults
