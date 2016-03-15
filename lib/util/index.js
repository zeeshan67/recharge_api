var moment = require('moment-timezone');
var StatsD = require('node-statsd').StatsD;
var httpreq = require('./httpreq');

var util = {};
util.date = {};
util.statsd = {};
util.statsd.load = function (_host, _port) {
    var client = new StatsD({host: _host, port: _port});
    util.stats = client;
}

util.date.now_in_ms = function () {
    return moment().format('x');
};

util.date.now = function () {
    return moment().format('X');
};

util.date.nowUTC_in_ms = function () {
    return moment().utc().format('x');
};

util.date.nowUTC = function () {
    return moment().utc().format('X');
};
util.date.convertUTCToLocalTimeZone = function (utcepochtime, timezone) {
    return moment().tz(moment.utc(utcepochtime * 1000), timezone).format('X');
};

util.httpreq = httpreq;

module.exports = util;