/**
 * Created by verna on 10/3/16.
 */

var db = {};

db.mongo = require('./mongo');
db.mysql = require('./mysql');
db.redis = require('./redis');
db.postgres = require('./postgresql');
module.exports = db;