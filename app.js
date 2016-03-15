/**
 * Created by verna on 15/2/16.
 */

var http = require("http");
var express = require("express");
var body_parser = require("body-parser");
var async = require('async');
var timeout = require('connect-timeout');
var serveStatic = require('serve-static');
var jwt = require('express-jwt');
var __logger = require('./lib//logger');
var __controller = require('./controllers');
var __db = require('./lib/db');
var __auth = require('./controllers/auth')
var __config = require('./config')
var __res = require('./controllers/response_handler');
var app = express();



function run_express_server(){
    console.log(new Date() + '   >> Worker PID:', process.pid);
    app.use(body_parser.json());       // to support JSON-encoded bodies
    app.use(body_parser({limit: '50mb'}));
    app.use(body_parser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));
    app.use(timeout(__config.default_server_response_timeout, {respond: false}));
    app.use(haltOnTimedout);

    process.secret_key = '3(_yrq&@7+^_+a0%-$@g!q+-^1px(%6&%5*tt9qc9jz&1jc1p-';

    app.use(jwt({
        secret: process.secret_key,
        exp: 1
    }).unless({
        path: ['/auth','/api']
    }));

    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            console.log("Unauthorized access not allowed",req.hostname)
            response = {code:"401","msg":"invalid access not allowed"}
            new __res.AUTH_FAILED("Unauthorized access not allowed").send(res);
        }
    });

//  Routing region
    app.use('/api', __controller);
    app.use('/sc', serveStatic(__dirname + '/public'));
    app.use('/auth', __auth);

    app.route('/*').get(function (req, res, next) {
        res.send('Hello! The API is at http://localhost:' + __config.port + '/api');
    });

     app.server = http.createServer(app);
     app.server.listen(__config.port)
     console.log("Server is listening");
}

function haltOnTimedout(req, res, next) {
    if (!req.timedout) {
        next()
    }
    else {
        __logger.error('haltOnTimedout, request timedout', {req_uuid: req.req_uuid});
        new __res.SERVER_TIMEDOUT("request from client timedout").send(res);
    }
    req.on('timeout', function (time, next) {
        __logger.error('haltOnTimedout, server response timedout', {req_uuid: req.req_uuid});
        new __res.SERVER_TIMEDOUT('server timed out after ' + time + ' milliseconds').send(res);
    });
}

async.series(
    [
//        __db.mongo.init
         __db.postgres.init
        //__db.mysql.init_sms_dlr
    ],
    function (err, results) {
        if (err) {
            __logger.error('failed to run all databases', {err: err});
            process.exit(1);
        } else {
            run_express_server();
        }
    }
);


