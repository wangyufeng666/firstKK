<?php
/**
* redis系统常量，一旦确认请勿修改
* @uses       wyh
* @createdate 2016-06-03
* @version    V1.0.0
*/
class RedisConstant{

    /**
     * $K   $key
     * $SK  $subkey
     */
    public static $REDIS_LOGFLAG = false;

    /**
     * 功能描述：缓存开关
     * @param     string    $param    参数名
     * @return    string     $result    返回数据
     * @author    weimingze    2019-08-21 14:45
     */
    public static function enable(){
        return true;
    }

    /**
     * 商品列表默认过期时间
     */
    public static $EXPIRE_ONE_DAY = 86400;//一天

    public static $EXPIRE_TWO_DAY = 172800; //两天 单位秒

    public static $EXPIRE_ONE_HOUR = 3600;//一个小时

    //回收业务
    public static $K_RECYCLE = 'Recycle';//回收业务
    public static $SK_RECYCLE_MERRULE = 'MerRule_';//单个商品规则
    public static $SK_RECYCLE_MER = 'Merchandise_';//单个回收商品信息
    public static $SK_RECYCLE_MERBRANDS = 'MerBrands_';//分类品牌信息
    public static $SK_RECYCLE_MERLIST = 'MerList_';//商品列表缓存
    public static $SK_RECYCLE_MERRULE_DETAIL = 'MerRule_DETAIL_';//单个商品规则具体明细

    //线下业务
    public static $K_OFFLINE = 'Offline_Recycle';
    public static $SK_OFFLINE_WX_ACCESS_TOKEN = 'wx_access_token';
    public static $SK_OFFLINE_WX_JSAPI_TICKET = 'wx_jsapi_ticket';

    //顺丰白名单
    public static $SK_SF_WHITE_LIST = 'SF_WHITELIST';

    /**
     * 无关键词条件下，品类数量统计
     * 主要缓存对象：电脑配件、大家电、相机数量统计
     * CategoryStats_1  相机品类
     * CategoryStats_2  家电品类
     * CategoryStats_7  电脑配件
     * @var unknown_type
     */
    public static $SK_RECYCLE_CATEGORY_STATS = 'CategoryStats_';

    /**
     * 获取过期时间
     * @param day 天数
     * @param hour 小时
     * @return 过期时间，单位：秒
     */
    public static function getExpireTime($day = 0, $hour = 0){
        return ($day*24+$hour)*3600;
    }
}
