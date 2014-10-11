# winston-splunkstorm [![Build Status](https://travis-ci.org/zaphod1984/winston-splunkstorm.png)](https://travis-ci.org/zaphod1984/winston-splunkstorm)

[![NPM](https://nodei.co/npm/winston-splunkstorm.png)](https://nodei.co/npm/winston-splunkstorm/)

[![NPM](https://nodei.co/npm-dl/winston-splunkstorm.png?months=3)](https://nodei.co/npm/winston-splunkstorm/)

In their [Logging Best Practises](http://dev.splunk.com/view/logging-best-practices/SP-CAAADP6) Splunk strongly encourages the usage of key-value pairs in logs.
This [winston](https://github.com/flatiron/winston) plugin takes messages and meta data hashes and creates a key-value structured string out of it.

## Installation

````
npm install winston-splunkstorm
````

## Example Usage

````javascript
var winston = require('winston');
var splunkstorm = require('winston-splunkstorm');

winston.add(splunkstorm, {
    apiKey: 'api-key',
    projectId: 'project-id',
    apiHostName: 'api-host-name'
});

winston.info({a: 'b'});

//output: 2013-12-09T07:10:49.522Z a=b, lvl=info, hst=fooHost
````

### Parameters for the splunkstorm constructor:

* `apiKey` your apiKey at splunkstorm.com (mandatory)
* `projectId` your projectId at splunkstorm.com (mandatory)
* `apiHostName` the hostname assigned to your project by splunkStorm

Find more Details [here](https://github.com/zaphod1984/splunkstorm).

Built with [splunkstorm](https://www.npmjs.org/package/splunkstorm) the client for the splunkstorm api.

Happy Logging!