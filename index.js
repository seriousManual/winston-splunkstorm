var os = require("os");
var util = require("util");
var winston = require("winston");
var SplunkStorm = require("splunkstorm");

var PATTERN_WHITESPACE_REPLACE = /[\r\n]/g;
var PATTERN_WHITESPACE_DETECT = /\s/;
var PATTERN_QUOTE = /"/g;

var LEVEL_KEY = 'lvl';
var MESSAGE_KEY = 'mssg';
var HOST_KEY = 'hst';

/**
 * Constructor function for the Splunkstorm constructor
 * @param options
 * @constructor
 */
var WinstonSplunkstorm = function (options) {
    winston.Transport.call(this);

    options = options || {};

    var apiKey = options.apiKey;
    var projectId = options.projectId;
    var apiHostName = options.apiHostName;

    if(!apiKey || !projectId || !apiHostName) {
        throw new Error('apiKey, projectId and apiHostName are neccessary');
    }

    this._storm = new SplunkStorm({
        apiKey: apiKey,
        projectId: projectId,
        apiHostName: apiHostName
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
    var kvString = this._buildKeyValuePairs(level, message, meta);
    var logMessage = util.format("%s %s", (new Date()).toISOString(), kvString);

    this._storm.send(logMessage, this._sourceType, this._host, this._source, callback);
};

/**
 * creates a string from key value pairs
 * @param level string implies the importance of the log message
 * @param message string the message that should be logged
 * @param pairs object a key value pair hash
 * @returns String
 * @private
 */
WinstonSplunkstorm.prototype._buildKeyValuePairs = function(level, message, pairs) {
    var parameters = pairs || {};

    if(message) {
        parameters[MESSAGE_KEY] = message;
    }

    parameters[LEVEL_KEY] = level;
    parameters[HOST_KEY] = this._options.host || os.hostname();

    return Object.keys(parameters)
        .map(function(key) {
            var value = (parameters[key] + '')
                .replace(PATTERN_WHITESPACE_REPLACE, '')
                .replace(PATTERN_QUOTE, '\'')
                .trim();

            if(value.match(PATTERN_WHITESPACE_DETECT)) {
                value = util.format('"%s"', value);
            }

            if(!value) {
                value = '""';
            }

            return util.format('%s=%s', key, value);
        })
        .join(', ');
};

module.exports = WinstonSplunkstorm;