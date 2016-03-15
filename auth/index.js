/**
 * Created by verna on 15/2/16.
 */

var uuid = require('node-uuid');

module.exports = function (req, res, next) {
    req.req_uuid = uuid.v4();
    return next();
};
