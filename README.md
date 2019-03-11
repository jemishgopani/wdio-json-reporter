WDIO JSON Reporter
===================

> A WebdriverIO plugin. Report results in json format.


## WDIO Version Compatibility

There are breaking changes between WDIO v4 and v5 with how custom reporters work.  The chart below shows the versions of this reporter and their WDIO compatibility version.

| WDIO Json Reporter | WDIO |
| ------------------ | ---- |
| ^0.4.0             | v4   |
| ^1.0.0             | v5   |



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