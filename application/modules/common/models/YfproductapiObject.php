<?php
require_once 'base/HKBaseObject.php';

/**
 *
 * 功能描述: 翼锋电脑配件商品接口管理
 * @package
 * @subpackage
 * @module
 * @createdate   2016-08-10
 * @version   V1.0.0.1
 * @copyright  2013 上海翼思信息科技有限公司 版权所有
 */

class Common_Model_YfproductapiObject extends HKBaseObject{

    //连接超时时间
    public $timeout = 30;
    public $tokenid = '95923ebd-1211-4f30-b91f-e291cb22d877';
    public $detailurl = 'http://api.yifone.com.cn/api/Product/GetProductOpentions';
    public $priceurl = 'http://api.yifone.com.cn/api/OrderPermition/GetProductPrice';
    public $ruledetailurl = 'http://api.yifone.com.cn/api/OrderPermition/GetDescriptions';

    /**
     * 功能描述：获取商品描述
     */
    function getruledetail($productId){
        $tokenid = $this->tokenid;
        $postdata = $this->getTokenInfo($tokenid);
        $postdata .= '&ProductID='.$productId;
        $url = $this->detailurl;
        //发送HTTP消息
        try{
            $context = stream_context_create(array('http' => array('timeout' => $this->timeout)));
            $urlRs = $url.'?'.$postdata;
            //发送消息，获取响应
            $response = file_get_contents($urlRs, 0, $context);
            $errorFlag = false;
            if($response == false){
                $errorFlag = true;
                $response = '{"code":501,"resultMsg":"接口服务异常"}';
            }
            if($errorFlag){
                loger($urlRs);
            }
        }catch(Exception $e){
            $response = '{"code":502,"resultMsg":"接口请求自定义错误"}';
        }
        $result = json_decode($response,true);
        $ruleList = $result['data']['ProductOpention'];
        return $ruleList;
    }

    /**
     * 功能描述：获取商品报价
     */
    function getprice($productId, $radioIds, $multiIds){
        $tokenid = $this->tokenid;
        $postdata = $this->getTokenInfo($tokenid);
        if(!empty($multiIds)){
            $radioIds = $radioIds."#".$multiIds;
        }
        $detailIds = str_replace("#", ",", $radioIds);
        $postdata .= '&model_id='.$productId.'&sub_options='.$detailIds;
        $url = $this->priceurl;
        //发送HTTP消息
        try{
            $context = stream_context_create(array('http' => array('timeout' => $this->timeout)));
            $urlRs = $url.'?'.$postdata;
            //发送消息，获取响应
            $response = file_get_contents($urlRs, 0, $context);
            $errorFlag = false;
            if($response == false){
                $errorFlag = true;
                $response = '{"code":501,"resultMsg":"接口服务异常"}';
            }
            if($errorFlag){
                loger($urlRs);
            }
        }catch(Exception $e){
            $response = '{"code":502,"resultMsg":"接口请求自定义错误"}';
        }
        $result = json_decode($response,true);
        $result['PROVIDERID'] = 'FD416FCE69116CDAE040007F01003DA4';
        $result['PROVIDERNAME'] = '相机网回收';
        $result['PRICE'] = $result['data'];
        $result['HSSPRICE'] = $result['data'];
        return $result;
    }

    /**
     * 功能描述：获取商品描述
     */
   function getruledescription($radioIds, $productId){
        $tokenid = $this->tokenid;
        $postdata = $this->getTokenInfo($tokenid);
        $detailIds = str_replace("#", ",", $radioIds);
        $postdata .= '&model_id='.$productId.'&sub_options='.$detailIds;
        $url = $this->ruledetailurl;
        //发送HTTP消息
        try{
            $context = stream_context_create(array('http' => array('timeout' => $this->timeout)));
            $urlRs = $url.'?'.$postdata;
            //发送消息，获取响应
            $response = file_get_contents($urlRs, 0, $context);
            $errorFlag = false;
            if($response == false){
                $errorFlag = true;
                $response = '{"code":501,"resultMsg":"接口服务异常"}';
            }
            if($errorFlag){
                loger($urlRs);
            }
        }catch(Exception $e){
            $response = '{"code":502,"resultMsg":"接口请求自定义错误"}';
        }
        $result = json_decode($response,true);
        $attrDescs = '';
        foreach($result['data'] as $ruledetails){
            $attrDescs.=$ruledetails['FatherName'].':'.$ruledetails['DescriptionTitle'].'（'.$ruledetails['DescriptionName'].'）;';
        }
        return $attrDescs;
    }

    public function getTokenInfo($tokenid){
        $data=date("Y-m-d");
        $reurl=md5($tokenid.$data);
        $data=base64_encode($data);
        $tokenid=base64_encode($tokenid);
        $reurl=base64_encode($reurl);
        $postdata = "timestamp=".($data)."&accessToken=".($tokenid)."&sign=".($reurl)."&format=json";
        return $postdata;
    }
}