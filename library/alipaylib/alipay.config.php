<?php
require_once 'const/SystemConstant.php';
/**
 * 功能描述：花呗系统配置
 * 
 * @package    
 * @module   
 * @createdate   2017-3-28 下午05:43:22
 * @version   V1.0.1
 * @author   刘露
 * @copyright  2017 上海晨骏网络科技有限公司 版权所有
 */
class AlipayConfig {
    
    /**
     * 初始化阿里支付基础配置
     */
    public static function initAlipayConf(){
        $alipay_config = Array();
        //合作身份者id，以2088开头的16位纯数字
        $alipay_config['partner'] = SystemConstant::$partner;
        
        //收款支付宝账号，以2088开头由16位纯数字组成的字符串，一般情况下收款账号就是签约账号
        $alipay_config['seller_id']	= $alipay_config['partner'];
        
        //安全检验码，以数字和字母组成的32位字符
        $alipay_config['key'] = SystemConstant::$ali_key;
    
    
        //↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    
    
        //签名方式 不需修改
        $alipay_config['sign_type'] = strtoupper(SystemConstant::$sign_type);
    
        //字符编码格式 目前支持 gbk 或 utf-8
        $alipay_config['input_charset'] = strtolower(SystemConstant::$input_charset);
    
        //ca证书路径地址，用于curl中ssl校验
        //请保证cacert.pem文件在当前文件夹目录中
        $alipay_config['cacert'] = dirname(__FILE__)."/cacert.pem";
        
        //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
        $alipay_config['transport'] = SystemConstant::$transport;

        return $alipay_config;
    }
    
    public static $product_code = 'FUND_PRE_AUTH';//业务产品码
    public static $scene_code = 'PUBLIC_RENTAL';//业务场景码
    
    public static $alipay_gateway_new = 'https://mapi.alipay.com/gateway.do';//阿里接口地址

    /****************************
     * 测试环境配置
     ****************************|/
    //121.199.15.13  openapi 测试环境
    //121.199.15.13:8015  移动端 测试环境
    //花呗冻结回调地址
    public static $huabei_freeze_notify_url = "http://121.199.15.13/installment/huabeinotify/gethuabeinotify";//花呗冻结异步通知地址
    public static $huabei_freeze_return_url = "http://120.27.147.62:8082/zzy/pay/freezereturn";//花呗冻结同步通知地址
    
    //阿里支付回调地址
    public static $alipay_notify_url = "http://121.199.15.13/installment/paynotify/getalinotify";//阿里支付通知地址
    public static $alipay_return_url = "http://120.27.147.62:8082/zzy/pay/alipayturn";//阿里支付同步通知地址
    
    /**测试环境    结束**/
    
    
    /******正式环境********/
    //花呗冻结回调地址
    public static $huabei_freeze_notify_url = "http://openapi.youdemai.com/installment/huabeinotify/gethuabeinotify";//花呗冻结异步通知地址
    public static $huabei_freeze_return_url = "http://offline.youdemai.com/zzy/pay/freezereturn";//花呗冻结同步通知地址
    
    //阿里支付回调地址
    public static $alipay_notify_url = "http://openapi.youdemai.com/installment/paynotify/getalinotify";//阿里支付通知地址
    public static $alipay_return_url = "http://offline.youdemai.com/zzy/pay/alipayturn";//阿里支付同步通知地址
    /**/
}
?>