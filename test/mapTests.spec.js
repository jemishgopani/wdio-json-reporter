const MapTest = require("../src/mapTests");
const passingTest = require("./__mocks__/passing.json");
const skippedTest = require("./__mocks__/skipped.json");
const failingTest = require("./__mocks__/failing.json");

describe("Tests to validate mapping Tests", () => {
    it("Should successfully map a passing test", () => {
        const testData = MapTest([passingTest]);

        expect(testData).toHaveLength(1);
        expect(testData[0]).toMatchObject({
            name: passingTest.title,
            start: passingTest.start,
            end: passingTest.end,
            duration: passingTest._duration,
            state: passingTest.state,
        });
    });

    it("Should successfully map a skipped test", () => {
        const testData = MapTest([skippedTest]);

        expect(testData).toHaveLength(1);
        expect(testData[0]).toMatchObject({
            name: skippedTest.title,
            start: skippedTest.start,
            duration: skippedTest._duration,
            state: skippedTest.state,
        });
    });

    it("Should successfully map a failing test", () => {
        const testData = MapTest([failingTest]);

        expect(testData).toHaveLength(1);
        expect(testData[0]).toMatchObject({
            name: failingTest.title,
            start: failingTest.start,
            end: failingTest.end,
            duration: failingTest._duration,
            state: failingTest.state,
            errorType: failingTest.error.type,
            error: failingTest.error.message,
            standardError: failingTest.error.stack,
        });
    });

    it("Should successfully map multiple tests", () => {
        const testData = MapTest([passingTest, skippedTest, failingTest]);

        expect(testData).toHaveLength(3);
    });
});
