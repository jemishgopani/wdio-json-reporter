WDIO JSON Reporter
===================

> A WebdriverIO plugin. Report results in json format.

This project was derived from the 'wdio-junit-reporter' found [here](https://github.com/webdriverio/wdio-junit-reporter)


## Installation

The easiest way is to keep `wdio-json-reporter` as a dependency in your `package.json`.

```json
{
  "dependencies": {
    "wdio-json-reporter": "~0.1.0"
  }
}
```

You can simply do it by:

```bash
npm install wdio-json-reporter --save
```

Instructions on how to install `WebdriverIO` can be found [here](http://webdriver.io/guide/getstarted/install.html).

## Configuration

Following code shows the default wdio test runner configuration. Just add `'json'` as reporter
to the array. To get some output during the test you can run the [WDIO Dot Reporter](https://github.com/webdriverio/wdio-dot-reporter) and the WDIO JSON Reporter at the same time:

```js
// wdio.conf.js
module.exports = {
  // ...
  reporters: ['dot', 'json'],
  reporterOptions: {
    outputDir: './'
  },
  // ...
};
```

It's also possible to combine all the resulting jsons into one.

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

Another option is to configure the resulting filename of the JSON, if combined is set to false or not set a number is added after the file name: wdio-results-0-1.json etc.


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

You can also choose to send the reporter output to stdout instead of writing to a file:

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