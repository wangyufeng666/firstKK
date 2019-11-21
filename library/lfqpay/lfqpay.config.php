<?php

/**
 * 功能描述: 乐百分系统配置
 * 
 * @package    
 * @subpackage 
 * @module   
 * @createdate   2013-4-25 
 * @version   V1.0.0.1 
 * @author   weimingze 
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有 
 */
class LqfpayConfig {
    
    public static $VERSION = '1.0.0';//版本号
    public static $ENCODING = 'utf-8';//编码格式
    
    /*****测试环境****|/
    public static $MERID = 'SH-YDM';//商户代码
    public static $MERNAME = '有得卖';//商户名称
    public static $MERABBR = '有得卖';//商户简称
    public static $MERPWD = 'WE2CRAZl';//商户密码
    public static $merType = '1'; //交易类型 0：购买类型（默认） 1：租用
    public static $SIGNCERTPWD = 'fnsaee';//数字证书验证密码
    
    //-----front trans
    //121.199.15.13  openapi 测试环境
    //121.199.15.13:8015  移动端 测试环境
    public static $YDM_FRONTTRANS_FRONTURL = 'http://120.27.147.62:8082/zzy/lfqpay/frontback';//前台通知地址
    public static $YDM_FRONTTRANS_BACKURL = 'http://121.199.15.13/lfqpay/trans/callback';//后台通知地址
    public static $LQF_FRONTTRANS_REQUEST = 'https://tt.lfqpay.com:343/lfq-pay/gateway/api/frontTransRequest.do';
    
    //---back cancel
    public static $LQF_BACKCANCEL_REQUEST = 'https://tt.lfqpay.com:343/lfq-pay/gateway/api/backCancelRequest.do';
    public static $YDM_BACKCANCEL_BACKURL = 'http://121.199.15.13/lfqpay/backcancel/callback';//后台通知地址
    /**/
    /******正式环境********/
    public static $MERID = 'SH-YJKJ-001000-0494-0000';//商户代码
    public static $MERNAME = '上海晨骏网络科技有限公司';//商户名称
    public static $MERABBR = '有得卖';//商户简称
    public static $MERPWD = 'ue3h1kU0';//商户密码
    public static $merType = '1'; //交易类型 0：购买类型（默认） 1：租用
    public static $SIGNCERTPWD = 'fnsaee';//数字证书验证密码
    
    //-----front trans
    public static $YDM_FRONTTRANS_FRONTURL = 'http://offlin.youdemai.com/zzy/lfqpay/frontback';//前台通知地址
    public static $YDM_FRONTTRANS_BACKURL = 'http://openapi.youdemai.com/lfqpay/trans/callback';//后台通知地址
    public static $LQF_FRONTTRANS_REQUEST = 'https://interface.lfqpay.com/lfq-pay/gateway/api/frontTransRequest.do';
    
    //---back cancel
    public static $LQF_BACKCANCEL_REQUEST = 'https://interface.lfqpay.com/lfq-pay/gateway/api/backCancelRequest.do';
    public static $YDM_BACKCANCEL_BACKURL = 'http://openapi.youdemai.com/lfqpay/backcancel/callback';
    /**/
}
?>