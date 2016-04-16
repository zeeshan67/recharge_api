/**
 * Created by verna on 13/4/16.
 */
var temp = { contacts: 9664384076,
    start_date: '2016-04-13',
    camp_name: '20160413202616',
    end_date: '2016-04-14',
    api_username: 'Johnson_aawaz',
    api_password: 'Johnson_aawaz',
    script_name: 'sf_otp_ivr',
    start_time: '00:00',
    camp_subscription: 'FB',
    end_time: '23:59',
    trans_type: 'trans',
    retry: '{"1":"1","2":"1"}',
    cdr_pingback: '{"url":"http://10.0.0.243:8003/sf_otp/api/cdr_pingback","params":{"request_id":"%%request_id%%","destination":"%%destination%%","hangup_cause":"%%reason%%","operator":"%%operator%%","circle_name":"%%circle%%","call_answer_time":"%%callanswer%%","call_start_time":"%%callstart%%","call_end_time":"%%callend%%","camp_name":"%%camp_name%%","dnd_status":"%%dnd_status%%","attempts_no":"%%attempts%%","duration":"%%duration%%","pulse":"%%pulse%%","call_id":"%%callid%%","script_name":"%%scriptname%%"}}' };

console.log(JSON.stringify(temp));
