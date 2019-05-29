const WDIOReporter = require('@wdio/reporter').default
const MapHooks = require('./mapHooks')
const MapTests = require('./mapTests')
const initResultSet = require('./initResultSet')

class JsonReporter extends WDIOReporter {
    constructor (options) {
        options = Object.assign(options)
        super(options)
    }

    onRunnerEnd (runner) {
        let json = this.prepareJson(runner)
        this.write(JSON.stringify(json))
    }

    prepareJson (runner) {
        var resultSet = initResultSet(runner)

        for (let specId of Object.keys(runner.specs)) {
            resultSet.specs.push(runner.specs[specId])
            for (let suiteKey of Object.keys(this.suites)) {
                const suite = this.suites[suiteKey]
                let testSuite = {}
                testSuite.name = suite.title
                testSuite.duration = suite._duration
                testSuite.start = suite.start
                testSuite.end = suite.end
                testSuite.sessionId = runner.sessionId
                testSuite.tests = MapTests(suite.tests)
                testSuite.hooks = MapHooks(suite.hooks)

                resultSet.state.failed += testSuite.hooks.filter(hook => hook.error).length
                resultSet.state.passed += testSuite.tests.filter(test => test.state === 'passed').length
                resultSet.state.failed += testSuite.tests.filter(test => test.state === 'failed').length
                resultSet.state.skipped += testSuite.tests.filter(test => test.state === 'skipped').length
                resultSet.suites.push(testSuite)
            }
        }

        return resultSet
    }
}

exports.default = JsonReporter
