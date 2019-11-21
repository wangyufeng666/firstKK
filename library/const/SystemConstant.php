<?php
/**
 * 功能描述: 系统常量类
 * @package
 * @subpackage
 * @module
 * @createdate   2013-6-3
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class SystemConstant{
    //线下商品
    public static $zzy_partnercode = '20000006';

    //渠道商编号
    public static $ORDER_PARTNER_CODE = '10000146';

    //官网渠道商编号
    public static $YDM_ORDER_PARTNER_CODE = '10000001';

    //默认券活动
    public static $DEFAULT_EVENTCODE = 'LEMALL_NO151015';

    //订单来源（被邀请人端口）
    public static $ORDER_SOURCE_INVITEE = '176';

    //订单来源（线下地推人员端）
    public static $ORDER_SOURCE_M = '175';

    //租赁订单来源（线下门店）
    public static $ORDERSOURCE_OFFLINEZZY_M = '1010';

    //合作商业务类型（线下租赁业务）
    public static $OFFLINE_RENT_BUSINESSTYPE = '9';


    public static $VERSION_JS = '170216';
    public static $VERSION_CSS = '170216';

    //顺丰快递接口参数
    public static $sf_appid ='00018160';

    //大家电上门地区
    public static $appliancesArea = '北京、上海、广州、深圳、天津、南京、成都、郑州、苏州、沈阳';

    //顺电线下渠道所属集团编码
    public static $COMPANY_GROUPCODE_SUNDAN = 'TY000978';

    public static $COMPANY_INDEXURI_LIST = array('TY000978'=>'/sundian/index','TY00000867'=>'/renyi/index','TY00001046'=>'/henggeng/index',
        'TY00005132'=>'/dxt/index','TY00005962'=>'/dazhi/index', 'TY00006734'=>'/wanshun/index', 'TY00006810'=>'/huihua/index', 'TY00001152'=>'/zhixin/index');

    //仁懿线下渠道所属集团编码
    public static $COMPANY_GROUPCODE_RENYI = 'TY00000867';

    //恒耕线下渠道所属集团编码
    public static $COMPANY_GROUPCODE_HENGGENG = 'TY00001046';

    //迪信通线下渠道所属集团编码
    public static $COMPANY_GROUPCODE_DXT = 'TY00005132';

    //成都大智器线下渠道所属集团编码
    public static $COMPANY_GROUPCODE_DAZHIQI = 'TY00005962';

    //万顺门店线下渠道所属集团编码
    public static $COMPANY_GROUPCODE_WANSHUN = 'TY00006734';

    //成都惠华线下渠道所属集团编码
    public static $COMPANY_GROUPCODE_HUIHUA = 'TY00006810';

    //线下所有端口来源集团编码
    public  static $OFFLINE_COMPANY_CODE = Array('TY000978', 'TY00000867', 'TY00001046', 'TY00005132', 'TY00005962', 'TY00006734', 'TY00006810', 'TY00001152');

    //发券模式合作商登录编码
    public static $COUPON_PARTNERS = array('TM11000109','TM11000110','TM11000111','TM11000112','TM11000113','TM11000114','TM11000128','TM11000129','TM11000130'
        ,'TM99090401','TM99090402','TM99090403','TM99090404','TM99090405','TM99090406','TM99090407','TM99090408','TM99090409','TM99090410','TM99090411','TM11000132','TM11000133',
        'TM11000134','TM11000135','TM11000136','TM11000137','TM11000138','TM11000139','TM11000140','TM11000141','TM11000142','TM11000143', 'TM11000144', 'TM11000145', 'TM11000146', 'TM11000147',
        'TM11000148', 'TM11000149', 'TM11000150', 'TM11000151', 'TM11000152', 'TM11000153', 'TM11000154', 'TM11000155', 'TM11000156', 'TM11000157', 'TM11000158', 'TM11000159'
    );

    //发券模式合作商来源
    public static $COUPON_PARTNERS_SOURCES = array('TM11000109' => '5001','TM11000110' => '5003','TM11000111' => '5004','TM11000112' => '5005',
        'TM11000113' => '5002','TM11000114'=>'5006','TM11000128'=>'5007','TM11000129'=>'5008','TM11000130'=>'5009','TM99090401'=>'5100'
        ,'TM99090402'=>'5101','TM99090403'=>'5102','TM99090404'=>'5103','TM99090405'=>'5104','TM99090406'=>'5105','TM99090407'=>'5106','TM99090408'=>'5107'
        ,'TM99090409'=>'5108','TM99090410'=>'5109','TM99090411'=>'5110', 'TM11000132'=>'5112', 'TM11000133'=>'5113', 'TM11000143'=>'5123',
        'TM11000134'=>'5114','TM11000135'=>'5115','TM11000136'=>'5116','TM11000137'=>'5117','TM11000138'=>'5118','TM11000139'=>'5119','TM11000140'=>'5120','TM11000141'=>'5121','TM11000142'=>'5122',
        'TM11000144'=>'5124','TM11000145'=>'5125','TM11000146'=>'5126','TM11000147'=>'5127','TM11000148'=>'5128','TM11000149'=>'5129','TM11000150'=>'5130','TM11000151'=>'5131','TM11000152'=>'5132',
        'TM11000153'=>'5133','TM11000154'=>'5134','TM11000155'=>'5135','TM11000156'=>'5136','TM11000157'=>'5137','TM11000158'=>'5138','TM11000159'=>'5139'
    );

    //发券并且可以T+1提现的合作商
    public static $WITHDRAW_COUPON_PARTNERS = array();

    //先行支付提现标识
    public  static $CREDIT_PAY_FLAG = 999;

    //直信集团编码
    public static $COMPANY_GROUPCODE_ZHIXIN = 'TY00001152';

    /*****阿里支付公用参数*****/
    public static $partner = '2088911570970940';
    public static $seller_email = 'zfb@youdemai.com';
    public static $ali_key = 'hcokwfrj2cyfhnuvrps58n8q7rtrxd3y';
    public static $sign_type = 'MD5';
    public static $input_charset = 'utf-8';
    public static $transport = 'http';
    public static $payment_type = '1';
    public static $partner_name = '上海晨骏网络科技有限公司';

    public static $IMG_URL = 'https://images.youdemai.com';
    public static $NO_PICTURE = '/images/default/no-pic.jpg';
    public static $OPENAPI_URL = 'https://openapi.youdemai.com';

    /**
     * 功能描述：支付宝打款接口
     * @return    string     $result    返回数据
     */
    public static function getAlipayUrl(){
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            return 'http://zmxy.youdemai.com/api/rentpay/alipay';
        }else{
            return 'http://101.37.34.14:8081/api/rentpay/alipay';
        }
    }

    /**
     * 功能描述：信用回收链接
     * @return    string     $result    返回数据
     */
    public static function getCreditRecyUrl(){
        if(OFFWEB_ENV == 'PREPROD' || OFFWEB_ENV == 'PROD'){
            return 'zmxy.youdemai.com/offline/inquiry/getofflinecreditorder';
        }else{
            return '192.168.1.112:8088/offline/inquiry/getofflinecreditorder';
        }
    }
}