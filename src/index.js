const WDIOReporter = require("@wdio/reporter").default;
const MapHooks = require("./mapHooks");
const MapTests = require("./mapTests");
const initResultSet = require("./initResultSet");

class JsonReporter extends WDIOReporter {
    constructor(options) {
        options = Object.assign(options);
        super(options);
    }

    onRunnerEnd(runner) {
        let json = this.prepareJson(runner);
        this.write(JSON.stringify(json));
    }

    prepareJson(runner) {
        var resultSet = initResultSet(runner);

        for (let specId of Object.keys(runner.specs)) {
            resultSet.specs.push(runner.specs[specId]);
            for (let suiteKey of Object.keys(this.suites)) {
                const suite = this.suites[suiteKey];
                let alltests = [];
                for (let testName of Object.keys(suite.tests)) {
                    const test = suite.tests[testName];
                    const testCase = {};

                    let specPathArray = runner.specs[specId].split("_");
                    let specPath = specPathArray[0].split("/");
                    testCase.testKey = specPath[specPath.length - 1];
                    testCase.name = test.title;
                    testCase.start = test.start;
                    testCase.end = test.end;
                    testCase.duration = test._duration;
                    let status;

                    switch (test.state) {
                        case "passed":
                            status = "PASS";
                            break;
                        case "failed":
                            status = "FAIL";
                            break;
                        default:
                            status = "TODO";
                            break;
                    }

                    testCase.status = status;

                    if (test.error) {
                        if (test.error.type) {
                            testCase.comment = test.error.type;
                        }
                        if (test.error.message) {
                            testCase.comment = test.error.message;
                        }
                    }

                    alltests.push(testCase);
                }
                resultSet.tests = [...resultSet.tests, ...alltests];
            }
        }

        return resultSet;
    }
}

exports.default = JsonReporter;
