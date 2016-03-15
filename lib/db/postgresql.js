/**
 * Created by verna on 10/3/16.
 */

var pgsql = require('pg');
var config = require('../../config');
var __logger = require('../logger');

var postgres_sql = {}

postgres_sql.init = function (__callback) {

     pgsql.connect(config.postgresql_connection_str, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            __logger.error('connection failed with postgresql', {host: config.postgresql.options.host});
            __callback({message: 'postgresql connection failed', err: err, mysql: config.postgresql});
        }
        else {
            __logger.info('connection established with postgresql', {host: config.postgresql.options.host});
            postgres_sql.pool = client;
            __callback(null);
        }
    });
};

module.exports = postgres_sql;