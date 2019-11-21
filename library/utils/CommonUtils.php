<?php

/**
 *
 * 功能描述: 系统共用工具类
 *
 * @package
 * @subpackage
 * @module
 * @createdate   2013-6-19
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class CommonUtils{

    /**
     * 生成6位随机数
     */
    public static function randStr($len = 6, $type = '', $addChars = ''){
        $str = '';
        switch($type){
            case 0:
                $chars = '23456789ABCDEFGHI23456789JKMNPQRSTUVWXYZ23456789abcdefghijk23456789mnpqrstuvwxyz23456789'.$addChars;
                break;
            case 1:
                $chars = str_repeat('0123456789', 3);
                break;
            case 2:
                $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.$addChars;
                break;
            case 3:
                $chars = 'abcdefghijklmnopqrstuvwxyz'.$addChars;
                break;
            default :
                $chars = 'ABCDEFGHIJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'.$addChars;
                break;
        }
        if($len > 10) {//位数过长重复字符串一定次数
            $chars = $type == 1? str_repeat($chars, $len) : str_repeat($chars, 5);
        }
        if($type != 4) {
            $chars = str_shuffle($chars);
            $str = substr($chars, 0, $len);
        }else{
            // 中文随机字
            for($i = 0; $i < $len; $i++){
                $str.= substr($chars, floor(mt_rand(0,mb_strlen($chars,'utf-8')-1)),1);
            }
        }
        return $str;
    }

    /**
     * 功能描述：获取用户请求IP
     */
    public static function getOnlineIp(){
        $onlineIp = '';
        if(getenv('HTTP_CLIENT_IP') && strcasecmp(getenv('HTTP_CLIENT_IP'), 'unknown')) {
            $onlineIp = getenv('HTTP_CLIENT_IP');
        } else if(getenv('HTTP_X_FORWARDED_FOR') && strcasecmp(getenv('HTTP_X_FORWARDED_FOR'), 'unknown')) {
            $onlineIp = getenv('HTTP_X_FORWARDED_FOR');
        } elseif(getenv('REMOTE_ADDR') && strcasecmp(getenv('REMOTE_ADDR'), 'unknown')) {
            $onlineIp = getenv('REMOTE_ADDR');
        } elseif(isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], 'unknown')) {
            $onlineIp = $_SERVER['REMOTE_ADDR'];
        }
        $address = '';
//        if($onlineIp){
//            $address = CommonUtils::getIPAddress($onlineIp);
//            $address = trim($address);
//        }
        return $onlineIp.'≌'.$address;
    }

    /**
     * 功能描述：根据IP，获取地址
     */
    public static function getIPAddress($ip){
        $url = 'http://ip.taobao.com/service/getIpInfo.php?ip='.$ip;
        $address = '';
        //发送数据
        $urlRs = curl_init();
        curl_setopt($urlRs, CURLOPT_URL, $url);
        curl_setopt($urlRs, CURLOPT_FAILONERROR, false);
        curl_setopt($urlRs, CURLOPT_RETURNTRANSFER, true);

        //判断是否是HTTPS请求
        if(strlen($url) > 5 && strtolower(substr($url, 0, 5)) == "https"){
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        }
        //发送消息，获取响应
        $response = curl_exec($urlRs);

        if(curl_errno($urlRs)){
            $address = '';
        }else{
            //获取传输返回码
            $httpStatusCode = curl_getinfo($urlRs, CURLINFO_HTTP_CODE);
            if(200 == $httpStatusCode){
                $resObj = json_decode($response);
                if(null !== $resObj){
                    if($resObj->code == '0'){
                        $data = $resObj->data;
                        $address = $data->region.' '.$data->city;
                    }
                }
            }
        }
        //关闭连接
        curl_close($urlRs);
        return $address;
    }

    /**
     * 获取cookie
     */
    public static function getCookie(){
        if(!isset($_COOKIE['COOKIEID'])){
            $data = sha1($_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR'].time() . rand());
            setcookie('COOKIEID', $data, time()+315360000, '/');
            return $data;
        }else{
            return $_COOKIE['COOKIEID'];
        }
    }

    /**
     * 功能描述：预约上门时间
     */
    public static function getServerDates(){
        //时间预约，未来3天，不带今天
        $serverDates = array();
        $week = array('0'=>'星期日', '1'=>'星期一', '2'=>'星期二', '3'=>'星期三', '4'=>'星期四', '5'=>'星期五', '6'=>'星期六');
        $currentHour = date("H");
        $start = 1;
        $end = 4;
        if($currentHour >= 17){
            $start = 2;
            $end = 5;
        }

        for($i = $start; $i < $end; $i++){
            $date = date("Y年m月d日",strtotime("+$i day"));
            $w = date("w",strtotime("+$i day"));
            array_push($serverDates, array('date'=>$date, 'name'=>$week[$w]));
        }
        return $serverDates;
    }

    /**
     * 私有方法：将对象转为数组
     */
    public static function object_to_array($obj){
        $_arr = is_object($obj)? get_object_vars($obj) :$obj;
        $arr = array();
        if($_arr && sizeof($_arr) > 0){
            foreach ($_arr as $key => $val){
                $val=(is_array($val)) || is_object($val) ? $this->object_to_array($val) :$val;
                $arr[$key] = $val;
            }
        }
        return $arr;
    }

    public static function utfSubstr($str){
        $len = mb_strlen($str,'utf-8');
        if($len > 1){
            $c = floor($len/3);
            $leftStr = '';
            $rightStr = '';
            if($c > 0){
                $leftStr = mb_substr($str, 0, $c, 'utf-8');
                $rightStr = mb_substr($str, $len-$c, $c, 'utf-8');
            }else{
                $leftStr = mb_substr($str, 0, 1, 'utf-8');
                $rightStr = '';
            }
            return $leftStr.'***'.$rightStr;
        }else{
            return $str.'*';
        }
    }

    /**
     * 功能描述：判断浏览信息
     */
    public static function recognizeUserAgentInfo(){
        $mySession = new Zend_Session_Namespace('my_session');
        if(!isset($mySession->userAgentInfo) || empty($mySession->userAgentInfo)){
            $userAgent = CommonUtils::getUserAgent();

            //判断访问设备类型
            $regex_match="/(nokia|iphone|android|motorola|^mot\-|softbank|foma|docomo|kddi|up\.browser|up\.link|KFAPWI|mobile|";
            $regex_match.="htc|dopod|ipad|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|";
            $regex_match.="blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam\-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|";
            $regex_match.="symbian|smartphone|midp|wap|phone|windows ce|Windows Phone|iemobile|^spice|^bird|^zte\-|longcos|pantech|gionee|^sie\-|portalmmm|";
            $regex_match.="jig\s browser|hiptop|^ucweb|^benq|haier|^lct|opera\s*mobi|opera\*mini|320x320|240x320|176x220";
            $regex_match.=")/i";
            $device = "PC";
            if(isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE']) or preg_match($regex_match, strtolower($userAgent))){
                $device = 'M';
            }
            //判断访问系统
            $system = "unknown";
            $ios_regex="/(iPhone OS|iPad)/i";
            if(false !== stripos($userAgent, 'Android')){
                $system = "Android";
            }else if(false !== stripos($userAgent, 'Windows Phone')){
                $system = "Windows Phone";
            }else if(false !== stripos($userAgent, 'Windows NT')){
                $system = "Windows";
            }else if(preg_match($ios_regex, $userAgent)){
                $system = "IOS";
            }else if(false !== stripos($userAgent, 'Mac')){
                $system = "MacOS";
            }else if(false !== stripos($userAgent, 'Linux')){
                $system = "Linux";
            }else if(false !== stripos($userAgent, 'Unix')){
                $system = "Unix";
            }

            //判断访问客户端
            $client = "unknown";
            $ie_regex="/(MSIE|Trident)/i";
            if(stripos($userAgent, 'MicroMessenger')){
                $client = "WeiXin";
            }else if(stripos($userAgent, 'weibo')){
                $client = "WeiBo";
            }else if(stripos($userAgent, 'UCBrowser')){
                $client = "UC";
            }else if(stripos($userAgent, 'MQQBrowser')){
                $client = "QQ";
            }else if(stripos($userAgent, 'Chrome')){
                $client = "Chrome";
            }else if(stripos($userAgent, 'Firefox')){
                $client = "Firefox";
            }else if(stripos($userAgent, 'Safari')){
                $client = "Safari";
            }else if(preg_match($ie_regex, $userAgent)){
                $client = "IE";
            }
            $mySession->userAgentInfo = Array('device'=>$device, 'system'=>$system, 'client'=>$client);
        }
        return $mySession->userAgentInfo;
    }

    /**
     * 功能描述：获取user-agent
     */
    public static function getUserAgent(){
        $mySession = new Zend_Session_Namespace('my_session');
        if(isset($mySession->userAgent)){
            return $mySession->userAgent;
        }else{
            $mySession->userAgent = empty($_SERVER['HTTP_USER_AGENT']) ? 'null' : $_SERVER['HTTP_USER_AGENT'];
            return $mySession->userAgent;
        }
    }
    /**
     * 功能描述：carryOverRound进一法进位
     * @param  $num 进位原数字
     * @param  $prec 保留位数
     * @return Ambigous <>|boolean
     */
    public static function carryOverRound($num, $prec){
        do{

            if(!is_numeric($num)){
                break;
            }

            $num = explode('.', $num);

            if(empty($num)){
                break;
            }

            $prec = intval($prec);

            if($prec < 0 ){
                break;
            }

            $tmpStr = "";


            if(!empty($num['1'])){

                $tmpStr = substr($num['1'], 0, $prec);
                $num['1'] = substr($num['1'], $prec)/(pow(10, $prec+1));

                if($num['1'] > 0){
                    if( $prec >0){
                        $tmpStr = strval($tmpStr+1);
                    }elseif ($prec == 0){
                        $num['0'] += 1;
                    }
                }
            }
            $nullNum = $prec - strlen($tmpStr);

            for($i = $nullNum; $i > 0; $i --){
                $tmpStr .= '0';
            }
            if($tmpStr){
                $num['0'] .= '.'.$tmpStr;
            }
            return $num['0'];

        }while(0);

        return false;
    }

    /**
     * 功能描述：查验是否是支付宝浏览器
     * added by 刘露
     * added date 2017-7-4
     */
    public static function checkAlipayClient(){
        $userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
        $result = false;
        if(strpos($userAgent, 'AlipayClient') !== false){
            $result = true;
        }
        return $result;
    }
}