module.exports = function (runner) {
    let resultSet = {};

    resultSet.start = runner.start;
    resultSet.end = runner.end;
    resultSet.capabilities = runner.capabilities.browserName;
    resultSet.tests = [];
    resultSet.specs = [];
    resultSet.state = { passed: 0, failed: 0, skipped: 0 };

    return resultSet;
};
