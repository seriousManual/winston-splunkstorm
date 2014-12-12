var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');

var winston = require('winston');

var WinstonSplunkstorm = require('../');

describe('WinstonSplunkstorm', function () {
    it('should register itself at the winston transports list', function () {
        expect(winston.transports.Splunkstorm).to.equal(WinstonSplunkstorm);
    });

    it('should throw if no apiKey is set', function () {
        expect(function () {
            new WinstonSplunkstorm({projectId: 'foo', apiHostName: 'fooApiHost'});
        }).to.throw();
    });

    it('should throw if no projectId is set', function () {
        expect(function () {
            new WinstonSplunkstorm({apiKey: 'foo', apiHostName: 'fooApiHostName'});
        }).to.throw();
    });

    it('should throw if no apiHostName is set', function () {
        expect(function () {
            new WinstonSplunkstorm({apiKey: 'foo', projectId: 'fooProjectId'});
        }).to.throw();
    });

    it('should throw if parameters are missing', function () {
        expect(function () {
            new WinstonSplunkstorm({});
        }).to.throw();
    });

    it('should create instance', function () {
        var a = new WinstonSplunkstorm({
            projectId: 'projectId',
            apiKey: 'apiKey',
            apiHostName: 'hostName'
        });

        expect(a._options).to.deep.equal({
            projectId: 'projectId',
            apiKey: 'apiKey',
            apiHostName: 'hostName'
        });
    });

    it('should call log with the correct parameters', function () {
        var loggerInstance = new WinstonSplunkstorm({
            projectId: 'projectId',
            apiKey: 'apiKey',
            apiHostName: 'apiHostName',
            sourceType: 'fooSourceType',
            source: 'fooSource',
            host: 'fooHostName'
        });

        loggerInstance._storm = {
            send: sinon.spy()
        };

        loggerInstance.log('info', 'foo', {a: 'a'}, 'callback');
        expect(loggerInstance._storm.send).to.be.calledWith({a: "a", hst: "fooHostName", lvl: "info", mssg: "foo" }, 'fooSourceType', 'fooHostName', 'fooSource', 'callback');
    });
});