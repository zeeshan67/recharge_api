//http://api.voice360.in/Inbound.asmx/get_caller_details?destination=2227816035
var httpreq = {};
var request = require('request');
var querystring = require('query-string');

httpreq.get = function (url, params, cb) {
    request(url + '?' + querystring.stringify(params), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            cb(null, body);
        }
        else {
            cb(1, 'error');
        }
    });
};
httpreq.post = function (url, post_data, cb) {
    request.post({url: url, form: post_data}, function (err, httpResponse, body) {
        cb(err, httpResponse, body);
    });
};
module.exports = httpreq;





