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

    //商户代码
    public static function MERID(){
        $value = 'SH-YDM';
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            $value = 'SH-YJKJ-001000-0494-0000';
        }
        return $value;
    }

    //商户名称
    public static function MERNAME(){
        $value = '有得卖';
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            $value = '上海晨骏网络科技有限公司';
        }
        return $value;
    }

    //商户简称
    public static function MERABBR(){
        $value = '有得卖';
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            $value = '有得卖';
        }
        return $value;
    }

    //商户密码
    public static function MERPWD(){
        $value = 'WE2CRAZl';
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            $value = 'ue3h1kU0';
        }
        return $value;
    }

    //交易类型 0：购买类型（默认） 1：租用
    public static function MERTYPE(){
        $value = '1';
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            $value = '1';
        }
        return $value;
    }

    //数字证书验证密码
    public static function SIGNCERTPWD(){
        $value = 'fnsaee';
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            $value = 'fnsaee';
        }
        return $value;
    }

    //有得卖前台通知地址
    public static function ydmFrontTransFrontUrl(){
        $value = 'http://120.27.147.62:8082/zzy/lfqpay/frontback';
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            $value = 'http://offline.youdemai.com/zzy/lfqpay/frontback';
        }
        return $value;
    }

    //后台通知地址
    public static function ydmFrontTransBackUrl(){
        $value = 'http://121.199.15.13/lfqpay/trans/callback';
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            $value = 'http://openapi.youdemai.com/lfqpay/trans/callback';
        }
        return $value;
    }

    //乐百分前端交易请求地址
    public static function lqfFrontTransRequestUrl(){
        $value = 'https://tt.lfqpay.com:343/lfq-pay/gateway/api/frontTransRequest.do';
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            $value = 'https://interface.lfqpay.com/lfq-pay/gateway/api/frontTransRequest.do';
        }
        return $value;
    }

    //乐百分后台终止请求地址
    public static function lqfBackCancelRequestUrl(){
        $value = 'https://tt.lfqpay.com:343/lfq-pay/gateway/api/backCancelRequest.do';;
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            $value = 'https://interface.lfqpay.com/lfq-pay/gateway/api/backCancelRequest.do';
        }
        return $value;
    }

    //乐百分后台终止请求地址
    public static function ydmBackCancelBackUrl(){
        $value = 'http://121.199.15.13/lfqpay/backcancel/callback';
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            $value = 'http://openapi.youdemai.com/lfqpay/backcancel/callback';
        }
        return $value;
    }
}
?>