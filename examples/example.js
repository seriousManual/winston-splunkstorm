var winston = require('winston');
var SplunkStorm = require('../');

winston.add(SplunkStorm, {
    apiKey: 'api-key',
    projectId: 'project-id',
    apiHostName: 'api-host-name'
});

winston.info({a: 'b'});