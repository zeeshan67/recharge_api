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
var config = require('../config');
var parseString = require('xml2js').parseString;
router.use(auth);


router.get('/',function(req,res,next){
    logger.debug({req_uuid:req.req_uuid})
    postgres.pool.query('SELECT * from recharge_reports', function(err, result) {
        if (err) {
            return console.error('error running query', err);
        }
        console.log("CURRENT TIME",result.rows[0]);
    })
    res.send("request received")

})

router.post('/user_recharge',function(req,res,next)
{
    logger.debug('Inside caller recharge api');
    var params = req.body;
    var mobile_number = params.mobile_number.toString().substr(-10);
    var amount = parseInt(params.amount);
    var circle = params.circle;
    var request_id = req.req_uuid; //params.request_id;
    var username = params.username;
    var user_id = parseInt(params.user_id);
    console.log('Mobile Number',mobile_number);
    var request_time = moment();
    var operator_code = parseInt(params.operator_code);
    var event_date= request_time.format('YYYY-MM-DD');
    res.send("request received");

    var query_params = {uid:config.recharge_api.user_id,pwd:config.recharge_api.pwd,mn:mobile_number,op:34,amt:amount,reqid:request_id};
    httpreq.post(config.recharge_api.recharge_url,query_params,function(err,response)
    {
        if (err)
        {
            logger.error("Error occurred while hiting recharge url",{error:err})
        }
        else{
            logger.debug([mobile_number,amount,circle,operator,new Date(),event_date,request_id,
                response.body.toString(),username,user_id
            ])

            var sql = 'insert into recharge_reports(mobile_number,amount,circle,operator,date_time,date,request_id,' +
            'recharge_status,username,user_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ;'

            parseString(response.body.toString(), function (err, result) {
                postgres.pool.query('insert into recharge_reports(mobile_number,amount,circle,operator_code,date_time,date,request_id,' +
                        'user_name,user_id,recharge_status,remark,balance) ' +
                        'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
                    [mobile_number,amount,circle,operator_code,new Date(),event_date,request_id,username,user_id,
                        result.Result.status[0],result.Result.remark[0],result.Result.balance[0] || 0.0

                                 ],
                     function(err, result) {
                        if(!err){
                            logger.info('Successful Inserted response from recharge API');
                        }else{
                            logger.error(err)
                            logger.error('Error while inserting Response from recharge API!!!!!!');
                        }

                })
            });
        }
    });
//    https://joloapi.com/api/findplan.php?userid=yourusername&key=yourapikey&opt=operatorcode&cir=circlecode&typ=categorycode&amt=amount&max=10&type=json

})


module.exports = router;