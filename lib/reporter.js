import events from 'events'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'
import uuid from 'uuid'

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
                const runnerInfo = this.baseReporter.stats.runners[cid]
                const start = this.baseReporter.stats.start
                const end = this.baseReporter.stats.end
                const json = this.prepareJson(start, end, runnerInfo)
                this.write(runnerInfo, cid, json)
            }
            epilogue.call(baseReporter)
        })
    }

    prepareJson (start, end, runnerInfo) {
        var resultSet = {}
        var skippedCount = 0
        var passedCount = 0
        var failedCount = 0
        resultSet.start = start
        resultSet.end = end
        resultSet.capabilities = runnerInfo.capabilities
        resultSet.host = runnerInfo.config.host
        resultSet.port = runnerInfo.config.port
        resultSet.baseUrl = runnerInfo.config.baseUrl
        resultSet.waitForTimeout = runnerInfo.config.waitForTimeout
        resultSet.framework = runnerInfo.config.framework
        resultSet.mochaOpts = runnerInfo.config.mochaOpts
        resultSet.suites = []

        for (let specId of Object.keys(runnerInfo.specs)) {
            const spec = runnerInfo.specs[specId]

            for (let suiteName of Object.keys(spec.suites)) {
                const suite = spec.suites[suiteName]
                const testSuite = {}

                testSuite.name = suite.title
                testSuite.duration = suite._duration
                testSuite.start = suite.start
                testSuite.end = suite.end
                testSuite.tests = []
                testSuite.hooks = []

                for (let hookName of Object.keys(suite.hooks)){
                    const hook = suite.hooks[hookName]
                    const hookResult = {}

                    hookResult.start = hook.start
                    hookResult.end = hook.end
                    hookResult.duration = hook.duration
                    hookResult.title = hook.title
                    hookResult.associatedSuite = hook.parent
                    hookResult.associatedTest = hook.currentTest
                    testSuite.hooks.push(hookResult)
                }

                for (let testName of Object.keys(suite.tests)) {
                    const test = suite.tests[testName]
                    const testCase = {}

                    testCase.name = test.title
                    testCase.start = test.start
                    testCase.end = test.end
                    testCase.duration = test.duration

                    if (test.state === 'pending') {
                        skippedCount = skippedCount + 1
                        testCase.state = 'skipped'
                    } else if (test.state === 'pass') {
                        passedCount = passedCount + 1
                        testCase.state = test.state
                    } else if (test.state === 'fail') {
                        failedCount = failedCount + 1
                        testCase.state = test.state
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
                resultSet.state = {}
                resultSet.state.passed = passedCount
                resultSet.state.failed = failedCount
                resultSet.state.skipped = skippedCount
                resultSet.suites.push(testSuite)
            }
        }
        return resultSet
    }

    write (runnerInfo, cid, json) {
        if (!this.options || typeof this.options.outputDir !== 'string') {
            return console.log(`Cannot write json report: empty or invalid 'outputDir'.`)
        }

        try {
            const dir = path.resolve(this.options.outputDir)
            const filename = 'WDIO.json.' + runnerInfo.sanitizedCapabilities + '.' + uuid.v1() + '.json'
            const filepath = path.join(dir, filename)
            mkdirp.sync(dir)
            fs.writeFileSync(filepath, JSON.stringify(json))
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
