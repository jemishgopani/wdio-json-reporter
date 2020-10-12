const runnerMock = require("./__mocks__/runner.json");
const initResultSet = require("../src/initResultSet");

describe("Tests to validate initializing the result set", () => {
    it("Should successfully map runner attributes to the result set object", () => {
        const resultSet = initResultSet(runnerMock);
        expect(resultSet.start).toBe(runnerMock.start);
        expect(resultSet.end).toBe(runnerMock.end);
        expect(resultSet.capabilities.browserName).toBe(
            runnerMock.capabilities.browserName
        );
        expect(resultSet.tests).toHaveLength(0);
        expect(resultSet.specs).toHaveLength(0);
        expect(resultSet.state).toMatchObject({
            passed: 0,
            failed: 0,
            skipped: 0,
        });
    });
});
