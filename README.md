WDIO JSON Reporter
===================

> A WebdriverIO plugin. Report results in json format.


## WDIO Version Compatibility

There are breaking changes between WDIO v4 and v5 with how custom reporters work.  The chart below shows the versions of this reporter and their WDIO compatibility version.

| WDIO Json Reporter | WDIO |
| ------------------ | ---- |
| ^0.4.0             | v4   |
| ^1.0.0             | v5   |
| ^2.0.0             | v6   |
| ^3.0.0             | v7   |



# WDIO v5 Compatibility

## Installation

* NPM
```bash
npm install wdio-json-reporter --save-dev
```

* Yarn
```bash
yarn add wdio-json-reporter --dev
```

## Configuration

### Results to STDOUT
```js
reporters: [
  'dot',
  ['json',{ stdout: true }]
],
```

### Results to File
```js
reporters: [
  'dot',
  ['json',{
      outputDir: './Results'
  }]
],
```

### Results to File with custom file name
```js
reporters: [
  'dot',
  ['json',{
    outputDir: './Results',
    outputFileFormat: function(opts) {
        return `results-${opts.cid}.${opts.capabilities}.json`
    }
  }]
],
```

## Result Files
With WDIO v5, reporting has moved from a centralized process to one that is handled by each of the "sessions" spun up for parallel test execution.
This change helped reduce the amount of chatter during WDIO test execution and thus improved performance.  The downside is we are no longer able
to get a single report for ALL test execution.  Consider the following:

2 suites of tests configured to run in 2 browsers:

* WDIO v4: 1 json file with execution results
* WDIO v5: 4 json files with execution results


`wdio-json-reporter` provides a utility function to merge the multiple json files into a single file.  Follow the steps below to take advantage of the utility.

1) Create a small node script
```javascript
const mergeResults = require('wdio-json-reporter/mergeResults')
mergeResults('./Results', 'wdio-json-*', 'wdio-custom-filename.json')
```

*Note:* `wdio-custom-filename.json` is optional, is the parameter is not provided the default value is `wdio-merged.json`

2) Call node script from command line and pass 2 arguments

* <RESULTS_DIR>: Directory where results files are written
* <FILE_REGEX>: Regex pattern for finding `wdio-json-reporter` result files in <RESULTS_DIR>.  This is necessary because multiple reporters produce `json` result files

Example:
```bash
node mergeResults.json ./Results "wdio-json-*"
```

3) As part of a wdio hook

```js
// Located in your wdio.conf.js file
onComplete: function (exitCode, config, capabilities, results) {
  const mergeResults = require('wdio-json-reporter/mergeResults')
  mergeResults('./Results', 'results-*', 'wdio-custom-filename.json')
}
```

Upon completion, the merge script will output a single json file named `wdio-merged.json` in the provided <RESULTS_DIR>


# WDIO v4 Compatibility

## Installation

* NPM
```bash
npm install wdio-json-reporter@^0.4.0 --save-dev
```

* Yarn
```bash
yarn add wdio-json-reporter@^0.4.0 --dev
```

## Configuration

### Standard
Following code shows the default wdio test runner configuration. Just add `'json'` as reporter
to the array. To get some output during the test you can run the [WDIO Dot Reporter](https://github.com/webdriverio/wdio-dot-reporter) and the WDIO JSON Reporter at the same time:

```js
// wdio.conf.js
module.exports = {
  // ...
  reporters: ['dot', 'json'],
  reporterOptions: {
    outputDir: './Results'
  },
  // ...
};
```

### Single Results File

```js
// wdio.conf.js
module.exports = {
  // ...
  reporters: ['dot', 'json'],
  reporterOptions: {
    outputDir: './',
    combined: true
  },
  // ...
};
```

### Custom File Name

```js
// wdio.conf.js
module.exports = {
  // ...
  reporters: ['dot', 'json'],
  reporterOptions: {
    outputDir: './',
    filename: 'wdio-results'
  },
  // ...
};
```

### STDOUT

```js
// wdio.conf.js
module.exports = {
  // ...
  reporters: ['json'],
  reporterOptions: {
    useStdout: true
  },
  // ...
};
```

If you do not want to print out the mocha epilogue (i.e. `1 passing (5.2s)`), you can suppress it:

```js
// wdio.conf.js
module.exports = {
  // ...
  reporters: ['json'],
  reporterOptions: {
    suppressEpilogue: true
  },
  // ...
};
```



For more information on WebdriverIO see the [homepage](http://webdriver.io).
