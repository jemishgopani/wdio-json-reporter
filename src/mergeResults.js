const fs = require("fs");
const path = require("path");

function getDataFromFiles(dir, filePattern) {
    const fileNames = fs
        .readdirSync(dir)
        .filter((file) => file.match(filePattern));
    const data = [];
    fileNames.forEach((fileName) => {
        let fileContent = "";
        try {
            fileContent = fs.readFileSync(`${dir}/${fileName}`, "utf8");
            data.push(JSON.parse(fileContent));
        } catch (error) {
            console.log("ERROR getDataFromFiles: ", error);
        }
    });
    return data;
}

function mergeData(rawData) {
    const mergedResults = {
        testExecutionKey: rawData[0].testExecutionKey,
        info: rawData[0].info,
        tests: [],
    };

    rawData.forEach((data) => {
        if (mergedResults === undefined) {
            Object.assign(mergedResults, data);
        } else {
            mergedResults.tests.push(...data.tests);
        }
    });
    mergedResults.tests.sort((a, b) => (a.status < b.status ? 1 : -1));
    return mergedResults;
}

function writeFile(dir, mergedResults, customFileName) {
    let fileName = customFileName || "wdio-merged.json";
    const filePath = path.join(dir, fileName);
    try {
        fs.writeFileSync(filePath, JSON.stringify(mergedResults));
    } catch (error) {
        console.log("ERROR on write in writeFile: ", error);
    }
}

const mergeResults = (...args) => {
    const dir = args[0] || process.argv[2];
    const filePattern = args[1] || process.argv[3];
    const customFileName = args[2] || process.argv[4];
    const rawData = getDataFromFiles(dir, filePattern);
    const mergedResults = mergeData(rawData);
    writeFile(dir, mergedResults, customFileName);
};
module.exports = mergeResults;
