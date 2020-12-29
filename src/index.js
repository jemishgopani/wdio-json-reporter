const WDIOReporter = require("@wdio/reporter").default;
const initResultSet = require("./initResultSet");

class JsonReporter extends WDIOReporter {
    constructor(options) {
        options = Object.assign(options);
        super(options);
    }

    onRunnerEnd(runner) {
        let json = this.prepareJson(runner);

        console.log('BEFORE stringify: ', json)
        console.log('AFTER stringify: ', JSON.stringify(json))

        // let json = {
        //     testExecutionKey: "CBC-9920",
        //     info: {
        //         testEnvironments: ["desktop"],
        //     },
        //     tests: [
        //         {
        //             testKey: "CBC-6965",
        //             comment: 'chrome,SCENARIO: desktop | Gallery | Social Share Buttons | Verify Facebook button functionality(custom facebook popup) on richverse.com | 202 | qa-automation-post-01,STEP 7: Check that the Stay up to date popup is closing,Error:element (".qa-fb-like-popup__close-icon") still not existing after 10000ms',
        //             status: "FAIL",
        //         },
        //     ],
        // };
        this.write(JSON.stringify(json));
    }

    prepareJson(runner) {
        var resultSet = initResultSet(runner);

        for (let specId of Object.keys(runner.specs)) {
            for (let suiteKey of Object.keys(this.suites)) {
                const suite = this.suites[suiteKey];
                let alltests = [];
                for (let testName of Object.keys(suite.tests)) {
                    const test = suite.tests[testName];
                    const testCase = {};
                    const comments = [];

                    let specPathArray = runner.specs[specId].split("_");
                    let specPath = specPathArray[0].split("/");
                    testCase.testKey = specPath[specPath.length - 1];
                    comments.push(runner.capabilities.browserName);
                    comments.push(suite.title);
                    comments.push(test.title);
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

                    if (test.error) {
                        if (test.error.type) {
                            comments.push(
                                test.error.type + ":" + test.error.message
                            );
                        }
                    }

                    testCase.comment = comments.join();
                    testCase.status = status;

                    alltests.push(testCase);
                }
                resultSet.tests = [...resultSet.tests, ...alltests];
            }
        }
        return resultSet;
    }
}

exports.default = JsonReporter;
