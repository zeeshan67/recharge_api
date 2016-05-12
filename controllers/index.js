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
        console.log("CURRENT TIME",result.rows[0],config.recharge_api.apiToken);

    })
    res.send("request received")
//    postgres.pool.query('update user_master set credit_used=$1 ,credit_available=$2 where id =$3;',[10,1490,1],function(er,update_result)
//    {
//        if(!er){logger.info('Update Successfull')}
//        else{
//            logger.error('Update Failed')
//            logger.error(er)
//        }
//    })
//    res.send("request received")

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
    var credit_used = parseFloat(params.credit_used);
    var credit_available = parseFloat(params.credit_available);
    var user_id = parseInt(params.user_id);
    var request_time = moment();
    var operator_code = parseInt(params.operator_code);
    var event_date= request_time.format('YYYY-MM-DD');

    var query_params = {apiToken:config.recharge_api.apiToken.toString(),mn:mobile_number,op:operator_code,amt:amount,reqid:request_id,field1:"",field2:""};
    logger.debug("Query params of recharge api",query_params)
    httpreq.post(config.recharge_api.recharge_url,query_params,function(err,response)
    {
        if (err)
        {
            logger.error("Error occurred while hiting recharge url",{error:err})
            res.end(JSON.stringify({"code":500,"recharge_status":"failed","remark":err,"request_id":request_id}))
        }

        else{
            logger.debug([mobile_number,amount,circle,operator_code,new Date(),event_date,request_id,
                response.body.toString(),username,user_id
            ])

            var sql = 'insert into recharge_reports(mobile_number,amount,circle,operator,date_time,date,request_id,' +
            'recharge_status,username,user_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ;'

            parseString(response.body.toString(), function (parse_err, result) {
                var status = result.Result.status[0];
                postgres.pool.query('insert into recharge_reports(mobile_number,amount,circle,operator_code,date_time,date,request_id,' +
                        'user_name,user_id,recharge_status,remark,balance,error_code,operator_transaction_id) ' +
                        'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
                    [mobile_number,amount,circle,operator_code,new Date(),event_date,request_id,username,user_id,
                        result.Result.status[0],result.Result.remark[0],result.Result.balance[0] || 0.0,parseInt(result.Result.ec),
                        result.Result.field1
                                 ],
                     function(pgerr, pgresult) {
                        if(!pgerr){
                            res.end(JSON.stringify({"code":200,"recharge_status":status,"remark":result.Result.remark[0],"request_id":request_id}))
                            if (status == 'SUCCESS'){

                                postgres.pool.query('update user_master set credit_used=$1 ,credit_available=$2 where id =$3;',[credit_used+amount,credit_available-amount,user_id],function(er,update_result)
                                {
                                    if(!er){logger.info('Update Successfull')}
                                    else{
                                        logger.error('Update Failed')
                                        logger.error(er)
                                    }
                                })
                            }
                            logger.info('Successful Inserted response from recharge API');
                        }else{
                            res.end(JSON.stringify({"code":500,"recharge_status":"failed","remark":err,"request_id":request_id}))
                            logger.error(pgerr)
                            logger.error('Error while inserting Response from recharge API!!!!!!');
                        }

                })
            });
        }
    });
//    https://joloapi.com/api/findplan.php?userid=yourusername&key=yourapikey&opt=operatorcode&cir=circlecode&typ=categorycode&amt=amount&max=10&type=json

})


module.exports = router;