<?php 
//晒单分享朋友圈签名算法实现
class JSSDK {
    private $appId;
    private $appSecret;
    public function __construct($appId, $appSecret) {
        $this->appId = $appId;
        $this->appSecret = $appSecret;
    }
    
    public function getSignPackage() {
        $jsapiTicket = $this->getJsApiTicket();
        // 注意 URL 一定要动态获取，不能 hardcode.
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $url = $protocol.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        
        $timestamp = time();
        $nonceStr = $this->createNonceStr();
        // 这里参数的顺序要按照 key 值 ASCII 码升序排序
        $string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";
        $signature = sha1($string);
        $signPackage = array("appId"=>$this->appId,"nonceStr"=>$nonceStr,"timestamp"=>$timestamp,
                             "url"=>$url,"signature"=>$signature,"rawString"=>$string);
        return $signPackage;
    }
    
    private function createNonceStr($length = 16) {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
          $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }
    
    private function getJsApiTicket(){
        // jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
        $redis = new YDMRedis();
        $domain = RedisConstant::$K_OFFLINE;
        $key = RedisConstant::$SK_OFFLINE_WX_JSAPI_TICKET;
        $jsApiTicketInfo = $redis->getHArray($domain, $key);
        $expire_time = '0';
        $jsapi_ticket = '';
        if($jsApiTicketInfo){
            $expire_time = $jsApiTicketInfo['expire_time'];
            $jsapi_ticket = $jsApiTicketInfo['jsapi_ticket'];
        }
        
        if($expire_time < time()){
            $accessToken = $this->getAccessToken();
            //获取 ticket
            $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=".$accessToken;
            $response = $this->httpGet($url);
            $res = json_decode($response);
            $jsapi_ticket = $res->ticket;
            if ($jsapi_ticket){
                $time = time() + 7000;
                $newJSApiTicket = array('expire_time'=>$time, 'jsapi_ticket'=>$jsapi_ticket);
                $redis->saveHArray($domain, $key, $newJSApiTicket);
                //设置过期时间 access_token 120分钟过期，这里在redis设置110分钟
                $expireTime = RedisConstant::getExpireTime(1, 50);
                $redis->setExpire($domain, $key, $expireTime);
            }
        }
        return $jsapi_ticket;
    }
    
    /**
     * 功能描述：获取accessToken
     * added by weimingze
     * added date 2017年5月9日
     */
    private function getAccessToken(){
        // access_token 应该全局存储与更新
        $redis = new YDMRedis();
        $domain = RedisConstant::$K_OFFLINE;
        $key = RedisConstant::$SK_OFFLINE_WX_ACCESS_TOKEN;
        
        $accessTokenInfo = $redis->getHArray($domain, $key);
        $expire_time = '0';
        $access_token = '';
        if($accessTokenInfo){
            $expire_time = $accessTokenInfo['expire_time'];
            $access_token = $accessTokenInfo['access_token'];
        }
        if($expire_time < time()){
            //获取access_token
            $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$this->appId."&secret=".$this->appSecret;
            $res = json_decode($this->httpGet($url));
            $access_token = $res->access_token;
            if($access_token){
                $time = time() + 7000;
                $newAccessToken = array('expire_time'=>$time, 'access_token'=>$access_token);
                $redis->saveHArray($domain, $key, $newAccessToken);
                //设置过期时间 access_token 120分钟过期，这里在redis设置110分钟
                $expireTime = RedisConstant::getExpireTime(1, 50);
                $redis->setExpire($domain, $key, $expireTime);
            }
        }
        return $access_token;
    }
    
    /**
     * 功能描述：get请求
     * added by weimingze
     * added date 2017年5月9日
     */
    private function httpGet($url) {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_TIMEOUT, 500);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_URL, $url);
        $res = curl_exec($curl);
        curl_close($curl);
        return $res;
    }
}
