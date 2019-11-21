<?php
/* *
 * 类名：LfqpayFrontTrans
 * 功能：乐百分 前台创建订单接口请求提交类
 * 详细：构造支付宝各接口表单HTML文本，获取远程HTTP数据
 * 版本：3.3
 * 日期：2012-07-23
 * 说明：
 * 以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 * 该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
 */
require_once 'LqfpayConfig.php';
require_once 'lfqpay_core.function.php';

class LfqpayBackCancel{

    /**
     * 生成要请求的参数数组，包括sign
     *
     * @return 返回组装好的参数数组
     */
    function buildRequestParams($params){

        if(!isset($params['version'])){
            $params['version'] = LqfpayConfig::$VERSION;
        }
        if(!isset($params['encoding'])){
            $params['encoding'] = LqfpayConfig::$ENCODING;
        }

        $params['txnType'] = '04';//退款业务
        $params["txnTime"] = date('YmdHis');
        $params['merId'] = LqfpayConfig::MERID();
        $params['merName'] = LqfpayConfig::MERNAME();
        $params['merAbbr'] = LqfpayConfig::MERABBR();
        $params['merPwd'] = LqfpayConfig::MERPWD();

        $orderId = isset($params['orderId']) ? $params['orderId'] : '';

        $params['backUrl'] = LqfpayConfig::ydmBackCancelBackUrl();

        $signCertPwd = LqfpayConfig::SIGNCERTPWD();
        $params['certId'] = createCertId($signCertPwd);

        $sortParams = argSort($params);

        $sign = $this->buildRequestSignature($sortParams);
        $params['signature'] = $sign;
        loger($params);
        return $params;
    }

    /**
     * 生成签名结果
     * @param $para_sort 已排序要签名的数组
     * return 签名结果字符串
     */
    function buildRequestSignature($sortParams){
        //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
        $sortStr = createLinkstring($sortParams);
        $signCertPwd = LqfpayConfig::SIGNCERTPWD();
        return createSignature($signCertPwd, $sortStr);
    }

    /**
     * 生成要请求的参数数组序列字符串
     * @param $para_temp 请求前的参数数组
     * @return 要请求的参数数组字符串
     */
    function buildRequestParamsToString($para_temp) {
        //把参数组中所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串，并对字符串做urlencode编码
        $request_data = createLinkstringUrlencode($para_temp);
        return $request_data;
    }
}
?>