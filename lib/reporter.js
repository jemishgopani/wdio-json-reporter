import events from 'events'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

/**
 * Initialize a new `Json` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class JsonReporter extends events.EventEmitter {
    constructor (baseReporter, config, options = {}) {
        super()

        this.baseReporter = baseReporter
        this.config = config
        this.options = options

        const { epilogue } = this.baseReporter

        this.on('end', () => {
            for (let cid of Object.keys(this.baseReporter.stats.runners)) {
                const capabilities = this.baseReporter.stats.runners[cid]
                const start = this.baseReporter.stats.start
                const end = this.baseReporter.stats.end
                const json = this.prepareJson(start, end, capabilities)
                this.write(capabilities, cid, json)
            }
            epilogue.call(baseReporter)
        })
    }

    prepareJson (start, end, capabilities) {
        const resultSet = {}
        resultSet.start = start
        resultSet.end = end
        resultSet.capabilities = capabilities.capabilities
        resultSet.host = capabilities.config.host
        resultSet.port = capabilities.config.port
        resultSet.baseUrl = capabilities.config.baseUrl
        resultSet.waitForTimeout = capabilities.config.waitForTimeout
        resultSet.framework = capabilities.config.framework
        resultSet.mochaOpts = capabilities.config.mochaOpts
        resultSet.suites = []

        for (let specId of Object.keys(capabilities.specs)) {
            const spec = capabilities.specs[specId]

            for (let suiteName of Object.keys(spec.suites)) {
                const suite = spec.suites[suiteName]
                const testSuite = {}

                testSuite.name = suiteName.toLowerCase().split(/[^a-z0-9]+/).filter((item) => item && item.length).join('_')
                testSuite.duration = suite._duration
                testSuite.start = suite.start
                testSuite.end = suite.end
                testSuite.tests = []

                for (let testName of Object.keys(suite.tests)) {
                    const test = suite.tests[testName]
                    const testCase = {}

                    testCase.name = testName
                    testCase.start = suite.tests[testName].start
                    testCase.end = suite.tests[testName].end
                    testCase.duration = suite.tests[testName].duration

                    if (test.state === 'pending') {
                        testCase.state = 'skipped'
                    } else {
                        testCase.state = test.state
                    }

                    if (test.error) {
                        if (test.error.type) {
                            testCase.errorType = test.error.type
                        }
                        if (test.error.message) {
                            testCase.error = test.error.message
                        }
                        if (test.error.stack) {
                            testCase.standardError = test.error.stack
                        }
                    }

                    testSuite.tests.push(testCase)
                }
                resultSet.suites.push(testSuite)
            }
        }
        console.log(JSON.stringify(resultSet))
        return resultSet
    }

    write (capabilities, cid, json) {
        if (!this.options || typeof this.options.outputDir !== 'string') {
            return console.log(`Cannot write json report: empty or invalid 'outputDir'.`)
        }

        try {
            const dir = path.resolve(this.options.outputDir)
            const filename = 'WDIO.json.' + capabilities.sanitizedCapabilities + '.' + cid + '.json'
            const filepath = path.join(dir, filename)
            mkdirp.sync(dir)
            fs.writeFileSync(filepath, json)
            console.log(`Wrote json report to [${this.options.outputDir}].`)
        } catch (e) {
            console.log(`Failed to write json report to [${this.options.outputDir}]. Error: ${e}`)
        }
    }

    format (val) {
        return JSON.stringify(this.baseReporter.limit(val))
    }
}

export default JsonReporter
