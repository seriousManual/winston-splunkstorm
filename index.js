var os = require("os");
var util = require("util");
var winston = require("winston");
var SplunkStorm = require("splunkstorm");

var LEVEL_KEY = 'lvl';
var MESSAGE_KEY = 'mssg';
var HOST_KEY = 'hst';

/**
 * Constructor function for the Splunkstorm constructor
 * @param options
 * @constructor
 */
var WinstonSplunkstorm = function (options) {
    winston.Transport.call(this, options);

    options = options || {};

    var apiKey = options.apiKey;
    var projectId = options.projectId;
    var apiHostName = options.apiHostName;
    var formatter = options.formatter || 'kvp';

    if (!apiKey || !projectId || !apiHostName) {
        throw new Error('apiKey, projectId and apiHostName are neccessary');
    }

    this._storm = new SplunkStorm({
        apiKey: apiKey,
        projectId: projectId,
        apiHostName: apiHostName,
        formatter: formatter
    });
    this._sourceType = options.sourceType || 'syslog';
    this._source = options.source || '';
    this._host = options.host || os.hostname();

    this._options = options;
};

//inheritance
util.inherits(WinstonSplunkstorm, winston.Transport);

//Expose the name of the transport on the prototype
WinstonSplunkstorm.prototype.name = 'Splunkstorm';

// Define a getter so that `winston.transports.Splunkstorm`
// is available and thus backwards compatible.
winston.transports.Splunkstorm = WinstonSplunkstorm;

/**
 * core logging method for winston
 * @param level string implies the importance of the log message
 * @param message string the message that should be logged
 * @param meta object a hash that holds additional diagnostics
 * @param callback function will be called when logging is done
 */
WinstonSplunkstorm.prototype.log = function (level, message, meta, callback) {
    this._storm.send(this._buildParameters(level, message, meta), this._sourceType, this._host, this._source, callback);
};

/**
 * build a hash representing the log message
 * @param level
 * @param message
 * @param meta
 * @returns {*|{}}
 * @private
 */
WinstonSplunkstorm.prototype._buildParameters = function(level, message, meta) {
    var parameters = meta || {};

    if (message) {
        parameters[MESSAGE_KEY] = message;
    }

    parameters[LEVEL_KEY] = level;
    parameters[HOST_KEY] = this._options.host || os.hostname();

    return parameters;
};

module.exports = WinstonSplunkstorm;
