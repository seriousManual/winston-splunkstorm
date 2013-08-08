var os          = require("os")
var util        = require("util")
var winston     = require("winston")
var splunkstorm = require("splunkstorm")

/**
 * @param options {
 *     "apiKey": "",
 *     "projectId": "",
 *     "level": "info",
 *     "sourcetype": undefined,
 *     "host": <os.hostname()>,
 *     "source": undefined
 * }
 *
 * @type {Function}
 */
var SplunkStorm = winston.transports.SplunkStorm = function (options) {

    this.name = 'SplunkStorm'

    this.level = options.level || 'info'

    if(typeof options.host === 'undefined') {
        options.host = os.hostname()
    }

    this.options = options

    this.storm = new splunkstorm.Log(options.apiKey, options.projectId)
}


util.inherits(SplunkStorm, winston.Transport)

SplunkStorm.prototype.log = function (level, msg, meta, callback) {
    this.storm.send(level + " " + msg, this.options.sourcetype, this.options.host, this.options.source, function(err) {

        callback(err, !err)

    })

};

/*
* Logs the specified `msg`, `meta` and responds to the callback once the log
* operation is complete to ensure that the event loop will not exit before
* all logging has completed.
*
* @param msg {string} Message to log
* @param meta {Object} **Optional** Additional metadata to attach
* @param callback {function} Continuation to respond to when complete.
*/
SplunkStorm.prototype.logException = function (msg, meta, callback) {
    this.storm.send("Exception " + msg, this.options.sourcetype, this.options.host, this.options.source, function(err) {

        callback(err, !err)

    })
};

module.exports = SplunkStorm