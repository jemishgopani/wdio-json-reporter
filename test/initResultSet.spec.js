const runnerMock = require("./__mocks__/runner.json");
const initResultSet = require("../src/initResultSet");

describe("Tests to validate initializing the result set", () => {
    it("Should successfully map runner attributes to the result set object", () => {
        const resultSet = initResultSet(runnerMock);
        expect(resultSet.start).toBe(runnerMock.start);
        expect(resultSet.end).toBe(runnerMock.end);
        expect(resultSet.capabilities).toBe(runnerMock.capabilities);
        expect(resultSet.host).toBe(runnerMock.config.hostname);
        expect(resultSet.port).toBe(runnerMock.config.port);
        expect(resultSet.baseUrl).toBe(runnerMock.config.baseUrl);
        expect(resultSet.waitForTimeout).toBe(runnerMock.config.waitForTimeout);
        expect(resultSet.framework).toBe(runnerMock.config.framework);
        expect(resultSet.mochaOpts).toBe(runnerMock.config.mochaOpts);
        expect(resultSet.suites).toHaveLength(0);
        expect(resultSet.specs).toHaveLength(0);
        expect(resultSet.state).toMatchObject({
            passed: 0,
            failed: 0,
            skipped: 0,
        });
    });
});
