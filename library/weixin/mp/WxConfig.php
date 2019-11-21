<?php

/**
 * 功能描述:微信公众平台配置文件
 * 
 * @package    
 * @module   
 * @createdate   2016-6-11
 * @version   V1.0.0.1
 * @copyright  2013 上海翼思信息科技有限公司 版权所有
 */
class WxConfig{

    public static $token_url = 'https://api.weixin.qq.com/cgi-bin/token';
    
    public static $refresh_token_url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token';
    
    public static $ticket_url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket';
    
    public static $authorize_url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    
    public static $access_token_url = 'https://api.weixin.qq.com/sns/oauth2/access_token';

    public static $weixin_userinfo_uri = 'https://api.weixin.qq.com/sns/userinfo'; 
    //联想门店服务回调地址
    public static $weixin_store_login_uri = 'http://weixin.youdemai.com/wxstore/trade';
    
    
    /**正式环境**/
    public static $appId = 'wx7ca44b6356d8412b';
    public static $appSecret = 'c519f4349edb50b044a9c6431dee6007';
    //商家用户入口页面回调地址
    public static $partner_login_redirectUrl = 'http://offline.youdemai.com/weixin/partner/login';
    
    //地推用户入口页面回调地址
    public static $promoter_login_redirectUrl = 'http://offline.youdemai.com/weixin/promoter/login';
    
    //页面回调地址
    public static $promoter_qrcode_redirectUrl = 'http://offline.youdemai.com/offlinem/lottery/activeindex';
    
    //分享页IP
    public static $share_IP ='http://offline.youdemai.com';
    
    //租着用门店登录回调地址
    public static $zzy_storelogin_redirectUrl = 'http://offline.youdemai.com/zzy/store';
    
    //租着用店员登录回调地址
    public static $zzy_storeuserlogin_redirectUrl = 'http://offline.youdemai.com/zzy/storeuser';
    
    //租着用用户登录回调地址
    public static $zzy_userlogin_redirectUrl = 'http://offline.youdemai.com/zzy/user';
    
    /**/
	
    /**测试环境**|/
    //testqj
    public static $appId = 'wx43c5b1819a30ad77';
    public static $appSecret = 'e1f7fc8a7344e9d01be15ae85c6de970';
    
    //商家用户入口页面回调地址（废弃）
    public static $weixin_login_uri = 'http://192.168.1.150/weixin/partner/login';
    
    //商家用户入口页面回调地址
    public static $partner_login_redirectUrl = 'http://192.168.1.150/weixin/partner/login';
    
    //地推用户入口页面回调地址
    public static $promoter_login_redirectUrl = 'http://192.168.1.150/weixin/promoter/login';
    
    //分享页IP
    public static $share_IP ='http://weixin.youdemai.com';
    
    //租着用门店登录回调地址
    public static $zzy_storelogin_redirectUrl = 'http://120.27.147.62:8082/zzy/store';
    
    //租着用店员登录回调地址
    public static $zzy_storeuserlogin_redirectUrl = 'http://120.27.147.62:8082/zzy/storeuser';
    
    //租着用用户登录回调地址
    public static $zzy_userlogin_redirectUrl = 'http://120.27.147.62:8082/zzy/user';
    
    /**/
}