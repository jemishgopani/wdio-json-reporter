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
            fileContent = fs.readFileSync(`${dir}/${fileName}`);

            data.push(JSON.parse(fileContent));
        } catch (error) {
            console.log("error getDataFromFiles: ", error);
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
    console.log("FILEPATH: ", filePath);
    console.log("DIR: ", dir);
    console.log("mergedResults: ", mergedResults);
    console.log("customFileName: ", customFileName);
    try {
        fs.writeFileSync(filePath, JSON.stringify(mergedResults));
    } catch (error) {
        console.log("ERROR on write in writeFile: ", error);
  }
}