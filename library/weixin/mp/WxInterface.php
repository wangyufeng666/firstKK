<?php 
require_once 'weixin/mp/WxConfig.php';

/**
 * 功能描述:微信公众平台接口
 * 
 * @package    
 * @module   
 * @createdate   2016-6-11
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyright  2013 上海翼思信息科技有限公司 版权所有
 */

class WxInterface{
    /**
     * 功能描述：获取微信Token
     * Enter description here ...
     */
    public function refreshToken($url){
        $url = WxConfig::$authorize_url."?appid=".WxConfig::$appId."&redirect_uri=".$url."&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        header("Location:".$url);
        exit;
    }
    
    /**
     * 功能描述：获取微信Token
     * Enter description here ...
     */
    public function getToken(){
        $url = WxConfig::$token_url."?grant_type=client_credential&appid=".WxConfig::$appId."&secret=".WxConfig::$appSecret."";
        header("Location:".$url);
        exit;
    }
    
    /** 获取用户OpenID
     * Enter description here ...
     * @param unknown_type $code
     */
    public function getOpenId($code){
        $url= WxConfig::$access_token_url."?appid=".WxConfig::$appId."&secret=".WxConfig::$appSecret."&code=".$code."&grant_type=authorization_code";
        $res = json_decode($this->httpGet($url), true);
        $openid = '';
        if($res && isset($res["openid"]) && $res["openid"]){
            setcookie("openid", $res["openid"], time()+30*24*3600, '/');
            return $res['openid'];
        }else{
            return '';
        }
    }
    
    /**
     * 获取用户OpenID,access_token
     * Enter description here ...
     * @param unknown_type $code
     */
    public function getweixinInfo($code){
        $url= WxConfig::$access_token_url."?appid=".WxConfig::$appId."&secret=".WxConfig::$appSecret."&code=".$code."&grant_type=authorization_code";
        $res = json_decode($this->httpGet($url), true);
        if($res && !isset($res["errcode"])){
            return $res;
        }else{
            return '';
        }
    }
    /**
     * 获取微信朋友圈头像、昵称
     * Enter description here ...
     * @param unknown_type $code
     */  
    public function getuserInfo($accesstoken,$openid){
        $url= WxConfig::$weixin_userinfo_uri."?access_token=".$accesstoken."&openid=".$openid."&lang=zh_CN";
        $res = json_decode($this->httpGet($url), true);
        if($res && !isset($res["errcode"])){
            setcookie("nickname", $res["nickname"], time()+30*24*3600, '/');
            setcookie("headimgurl", $res["headimgurl"], time()+30*24*3600, '/');
            return $res;
        }else{
            return '';
        }
    }
    /**
     * 获取微信朋友圈头像、昵称
     * Enter description here ...
     * @param unknown_type $code
     */  
    public function getWeixinUserInfo($accesstoken, $openid){
        $url= WxConfig::$weixin_userinfo_uri."?access_token=".$accesstoken."&openid=".$openid."&lang=zh_CN";
        $res = json_decode($this->httpGet($url), true);
        if($res && !isset($res["errcode"])){
            setcookie("nickname", $res["nickname"], time()+30*24*3600, '/');
            setcookie("headimgurl", $res["headimgurl"], time()+30*24*3600, '/');
            return $res;
        }else{
            return '';
        }
    }
    
    /**
     * GET请求
     * Enter description here ...
     * @param unknown_type $url
     */
    function httpGet($url) {
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
?>