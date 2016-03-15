/**
 * Created by verna on 10/3/16.
 */


var lib_mongo = {};
var mongodb = require('mongodb');
var __config = require('../../config');
var __logger = require('../../lib/logger');
var MongoClient = require('mongodb').MongoClient;

lib_mongo.init = function (__callback) {
    MongoClient.connect(__config.mongo.uri, function (err, database) {
        if (err) {
            __logger.error('lib_mongo.init, error connecting mongodb in init():', {uri: __config.mongo.uri});
            __callback(err);
        }
        else {
            __logger.info('lib_mongo.init, success connection to mongodb in init():', {uri: __config.mongo.uri});
            lib_mongo.db = database;
            __callback(null);
            database.on('error', function () {
                __logger.error('lib_mongo.init, error connecting mongodb:', {uri: __config.mongo.uri});
                lib_mongo.db = null;
            });
            database.on('close', function () {
                __logger.error('lib_mongo.init, closing mongodb connection:', {uri: __config.mongo.uri});
            });
            database.on('reconnect', function () {
                __logger.info('lib_mongo.init, re-connected to mongodb:', {uri: __config.mongo.uri});
                lib_mongo.db = database;
            });
        }
    });
};

module.exports = lib_mongo;