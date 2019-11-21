<?php
/**
 * 功能描述: Short Messaging Service
 * @package
 * @subpackage
 * @module
 * @createdate   2013-6-19
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class SmsUtils{

    public static $order_success_door_msg = '【有得卖网】您的回收订单提交成功，我们会尽快联系您确认上门时间，随后安排检测工程师上门回收您的器材，请保持电话畅通，服务热线：4006-502-518';
    public static $order_success_express_msg = '【有得卖网】您的回收订单提交成功，请在24小时内拨打顺丰电话：95338上门取件，快递费到付，收货地址：上海市杨浦区平凉路2716号8号楼南门有得卖检测中心 （王先生 收） 服务热线：4006-502-518。器材寄出前请务必清除手机密码，并请在回收单中心填入快递单号。 废弃手机5元一部，有需要请一起打包';

    /**
     * 功能描述：短信发送
     */
    public static function sendShortMessage($numbers, $msg){
        $ip = SmsCheckUtils::getVisitIP();
        //保存短信日志信息

        $ipCheckFlag = SmsCheckUtils::checkIpLast5minSendCount($ip);
        $mobileCheckFlag = SmsCheckUtils::checkMobileLast5minSendCount($mobile);

        $smsDataId = '';
        $insertLogFlag = SmsCheckUtils::getLast5minSmsLogs($mobile);
        if($insertLogFlag){
            $smsDataId = SmsCheckUtils::saveSmsLog($mobile, $message, $ip);
        }

        $userid ='wodexiangji';
        $password = MD5('inspire1234zxcv');
        $sendtime = null;
        $info = null;
        if($userid && $password && $numbers && $msg){
            $url = "http://api.smsu.cn/sms?u=".$userid."&p=".$password."&m=".$numbers."&c=".urlencode($msg);
            $urlRs = curl_init();
            curl_setopt($urlRs, CURLOPT_URL, $url);
            curl_setopt($urlRs, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($urlRs, CURLOPT_HEADER, 0);
            $response = curl_exec($urlRs);
            $loger = '--【/utils/smsutils/sendShortMessage】--短信发送，【'.$numbers.'】【'.$msg.'】 result：';
            loger($loger);
            if($response){
                $returnCode = isset($response['http_code']) ? $response['http_code'] : '';
                $loger = $loger.$returnCode;
                $list = explode("\n", $response);
                if($list && sizeof($list) > 1){
                    return $list[0] == '0';
                }
            }else{
                $loger = $loger.'失败';
            }

            if($smsDataId){
                SmsCheckUtils::setSmsLogSuccess($smsDataId);
            }
            return false;
        }
    }

    /**
     * 功能描述：昊博短信发送
     */
    public static function sendHaoboMessage($mobile, $message){
        loger('发送短信。。。。。。。');
/*         return SmsUtils::sendShortMessage($mobile, $message); */
        $url = 'http://101.227.68.49:7891/mt?';
        $userName = '10690154';
        $pwd = 'YOUde517';
        $post_data = array('un'=>$userName, 'pw'=>$pwd, 'da'=>$mobile, 'sm'=>bin2hex(iconv("UTf-8", "GB2312", $message)), 'dc'=>15, 'rd'=>0);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, 1);
        if(is_array($post_data)){
            $post_data = http_build_query($post_data);
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        curl_setopt($ch, CURLOPT_HEADER, true);

        $response = curl_exec($ch);
        $curl_errno = (int)curl_errno($ch);
        if($curl_errno !== 0){
            $response = $curl_errno;
        }else{
            $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            $header_map = Array();
            foreach(explode("\r\n", substr($response, 0, $header_size)) as $header_line){
                $header_info = explode(': ', $header_line, 2);
                if(count($header_info) === 2){
                    $header_map[$header_info[0]][] = $header_info[1];
                }
            }
            $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $response = array_merge(Array('http_code'=>$httpCode, 'header'=>$header_map), strlen($response) > $header_size ? Array('body'=>substr($response, $header_size)):array());
        }
        curl_close($ch);
        loger('--【/utils/smsutils/sendHaoboMessage】--昊博短信发送：'.$mobile.'__'.$message);
        return $response;
    }
}