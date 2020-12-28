module.exports = function (runner) {
    let resultSet = {
        testExecutionKey: "",
        info: {},
        tests: [],
    };

    resultSet.testExecutionKey = process.env.EXEKEY;
    resultSet.info.testEnvironments = [process.env.DEVICE];

    console.log("Tets - Result set: ", resultSet);
    return resultSet;
};
