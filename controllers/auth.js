var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var __res = require('./response_handler');
var logger = require('../lib/logger')
/* GET users listing. */


router.post('/', function(req, res, next) {
    logger.debug("Inside AUTH")
    var response = {};
    var username = req.body.username;
    var password = req.body.password;
    response.username = username;
    response.password = password;
    response_text = {}
    console.log(response)
    if (username === 'vivaconnect' && password == '6f786f6b350df5c1f3e61dddada99cd7') {

        response_text.token = getToken(response);
        logger.info(response)
        new __res.ACCEPTED(JSON.stringify(response_text)).send(res);
    } else {
        new __res.AUTH_FAILED("Unauthorized access not allowed").send(res);

    }

});




function getToken(user_data) {
    console.log(process.secret_key)
    var token = jwt.sign(user_data, process.secret_key, {
        expiresIn: 600000
    });
    return token;
}
module.exports = router;