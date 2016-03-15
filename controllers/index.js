/**
 * Created by verna on 15/2/16.
 */

'use strict';
var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var moment = require('moment');
var auth = require('../auth');
var logger = require('../lib/logger');
var httpreq = require('../lib/util/httpreq')
var postgres = require('../lib/db/postgresql');
router.use(auth);


router.get('/',function(req,res,next){
    logger.debug({req_uuid:req.req_uuid})
    postgres.pool.query('SELECT NOW() AS "theTime"', function(err, result) {
        if (err) {
            return console.error('error running query', err);
        }
        console.log(result.rows[0].theTime);
    })
    res.send("request received")

})

router.post('/user_recharge',function(req,res,next)
{
    logger.debug('Inside caller recharge api');
    var params = req.body;

    var mobile_number = params.mobile_number.substr(-10);
    var amount = ParseInt(params.amount);
    var circle = params.circle;
    var operator = params.operator;
    console.log('Mobile Number',mobile_number);
    res.send("request received")


    var query_params = {}
    httpreq.get('https://joloapi.com/api/findplan.php')
//    https://joloapi.com/api/findplan.php?userid=yourusername&key=yourapikey&opt=operatorcode&cir=circlecode&typ=categorycode&amt=amount&max=10&type=json

})


module.exports = router;