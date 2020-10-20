module.exports = function (runner) {
    let resultSet = {
        info: {},
    };

    resultSet.testExecutionKey = process.env.EXEKEY;
    resultSet.info.start = runner.start;
    resultSet.info.finish = runner.end;
    resultSet.info.testEnvironments = process.env.DEVICE;
    resultSet.tests = [];

    return resultSet;
};
