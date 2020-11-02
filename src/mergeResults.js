const fs = require("fs");
const path = require("path");

const mergeResults = (...args) => {
    const dir = args[0] || process.argv[2];
    const filePattern = args[1] || process.argv[3];
    const customFileName = args[2] || process.argv[4];

    const rawData = getDataFromFiles(dir, filePattern);
    const mergedResults = mergeData(rawData);
    writeFile(dir, mergedResults, customFileName);
};

function getDataFromFiles(dir, filePattern) {
    const fileNames = fs
        .readdirSync(dir)
        .filter((file) => file.match(filePattern));
    const data = [];

    fileNames.forEach((fileName) => {
        data.push(JSON.parse(fs.readFileSync(`${dir}/${fileName}`)));
    });

    return data;
}

function mergeData(rawData) {
    let mergedResults;

    rawData.forEach((data) => {
        if (mergedResults === undefined) {
            // use the first result so that we have the right shape
            mergedResults = {};
            Object.assign(mergedResults, data);
        } else {
            mergedResults.tests.push(...data.tests);
        }
    });

    mergedResults.tests.forEach((suite) => {
        mergedResults.end =
            suite.end > mergedResults.end ? suite.end : mergedResults.end;
    });

    mergedResults.tests.sort((a, b) => (a.status < b.status ? 1 : -1));

    return mergedResults;
}

function writeFile(dir, mergedResults, customFileName) {
    let fileName = customFileName || "wdio-merged.json";
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(mergedResults));
}

module.exports = mergeResults;
