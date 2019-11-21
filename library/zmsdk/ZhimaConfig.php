<?php

/**
 * 功能描述：芝麻信用系统常量类
 *
 * @package
 * @module
 * @createdate   2017-4-7 下午05:07:02
 * @version   V1.0.1
 * @author   刘露
 * @copyright  2017 上海晨骏网络科技有限公司 版权所有
 */
class ZhimaConfig{

    //芝麻信用网关地址
    public static $gatewayUrl = "https://zmopenapi.zmxy.com.cn/openapi.do";

    //数据编码格式
    public static $charset = "UTF-8";

    //芝麻分配给商户的 appId(授权)
    public static $appId = "1004386";

    //合约编号(注意：产品码，芝麻分配固定值：w1010100100000000001不可改动)
    public static $product_code = "w1010100100000000001";
}
?>