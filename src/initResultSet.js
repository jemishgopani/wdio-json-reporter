module.exports = function (runner) {
    let resultSet = {
        testExecutionKey: "",
        info: {},
    };

    resultSet.testExecutionKey = process.env.EXEKEY;
    resultSet.info.testEnvironments = [process.env.DEVICE];
    resultSet.info.Status = ["Done"];
    resultSet.tests = [];

    return resultSet;
};
