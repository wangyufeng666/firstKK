<?php
/**
 * 功能描述:顺丰快递（丰桥系统）
 *
 * @package
 * @module
 * @createdate   2018-05-25
 * @version   V1.0.0.1
 * @author   qiujian
 */
class FengqiaoExpress{

    private $checkword = "HvJ5neJUS7Hj8pcrG4ZC6uhBokyNR3Dz";//丰桥平台获取的校验码
    private $timeout = 10;
    //连接超时时间
    private $connectTimeout = 10;
    /**
     * 功能描述:订单下单接口
     * added by qiujian
     * added at 2018年05月25日
     */
    public function OrderService($params){
        $checkword = $this->checkword;
        $custId ='7551234567';
        if(OFFWEB_ENV == 'PROD'){//生产环境
            $custId ='0210600453';
        }
        $xmlContent = '<Request service="OrderService" lang="zh-CN">
                         <Head>SHCJWLKJ</Head>
                         <Body>
                        	<Order
                	          orderid="'.$params['orderid'].'"
                    	          express_type="'.$params['express_type'].'"
                                  j_province="'.$params['province'].'"
                                  j_city="'.$params['city'].'"
                                  j_county="'.$params['county'].'"
                                  j_company=""
                                  j_contact="'.$params['contact'].'"
                                  j_tel="'.$params['mobile'].'"
                                  j_address="'.$params['address'].'"
                                  d_province="上海"
                	              d_city="上海市"
                		          d_county=""
                                  d_company="上海晨骏网络科技有限公司"
                	              d_contact="朱生"
                		          d_tel="4006-502-518"
                	              d_address="上海市杨浦区平凉路2716号8号楼南门有得卖检测中心"
                                  parcel_quantity="1"
                                  pay_method="2"
                                  custid ="'.$custId.'"
                                  customs_batchs=""
                                  sendstarttime="'.$params['sendstarttime'].'"
                                  is_docall="1"
                                  remark="'.$params['remark'].'"
                                  cargo="'.$params['mername'].'" >
                            <AddedService name="MSG" value="'.$params['mobile'].'"/></Order>
                         </Body>
                       </Request>';
        $verifyCode = base64_encode(md5(($xmlContent . $checkword), TRUE));//请求报文拼接顾客编码MD5加密再base64加密
        //发送参数
        $post_data = array('xml' => $xmlContent,'verifyCode' => $verifyCode);
        $result = $this->send_post($post_data);
        $mailno = '';
        $OrderServiceResponse = $this->xmlToArray($result);
        if(isset($OrderServiceResponse['Head']) && $OrderServiceResponse['Head'] && $OrderServiceResponse['Head']=='OK'){
            $OrderServiceBody = isset($OrderServiceResponse['Body']['OrderResponse']['@attributes'])? $OrderServiceResponse['Body']['OrderResponse']['@attributes']:'';
            if($OrderServiceBody){
                $mailno = $OrderServiceBody['mailno'];
            }
        }
        return $mailno;
    }

    /**
     * 功能描述:订单取消接口
     * added by qiujian
     * added at 2018年05月25日
     */
    public function OrderConfirmService($params){
        $backFlag ='N';
        if(OFFWEB_ENV != 'PROD'){//生产环境
            return $backFlag;
        }
        $checkword = $this->checkword;
        $xmlContent='<Request service="OrderConfirmService" lang="zh-CN">
                    <Head>SHCJWLKJ</Head>
                    <Body><OrderConfirm orderid="'.$params['orderid'].'" dealtype="2"></OrderConfirm></Body>
                    </Request>';
        $verifyCode = base64_encode(md5(($xmlContent . $checkword), TRUE));//请求报文拼接顾客编码MD5加密再base64加密
        //发送参数
        $post_data = array('xml' => $xmlContent,'verifyCode' => $verifyCode);
        $result = $this->send_post($post_data);
        $result = $this->xmlToArray($result);
        if($result && isset($result['Head']) && $result['Head']=='OK'){
            $OrderConfirmResponse = isset($result['Body']['OrderConfirmResponse']['@attributes'])? $result['Body']['OrderConfirmResponse']['@attributes']:'';
            if($OrderConfirmResponse){
                $res_status = $OrderConfirmResponse['res_status'];
                if($res_status=='2'){
                    $backFlag ='Y';
                }
            }

        }
        return $backFlag;
    }

    /**
     * 功能描述:路由查询接口
     * added by qiujian
     * added at 2018年07月06日
     */
    public function RouteService($params){
        $checkword = $this->checkword;
        $OrderRouteResponse ='没有查询到任何信息';
        $xmlContent='<Request service="RouteService" lang="zh-CN">
                        <Head>SHCJWLKJ</Head>
                        <Body>
                        <RouteRequest tracking_type="1" method_type="1" tracking_number="'.$params['mailno'].'"/>
                        </Body>
                        </Request>';
        $verifyCode = base64_encode(md5(($xmlContent . $checkword), TRUE));//请求报文拼接顾客编码MD5加密再base64加密
        //发送参数
        $post_data = array('xml' => $xmlContent,'verifyCode' => $verifyCode);
        $result = $this->send_post($post_data);
        $result = $this->xmlToArray($result);
        if($result && isset($result['Head']) && $result['Head']=='OK'){
            $RouteResponse  = isset($result['Body']['RouteResponse']['Route'])? $result['Body']['RouteResponse']['Route']:'';
            if($RouteResponse){
                $OrderRouteResponse = $RouteResponse;
            }
        }
        return $OrderRouteResponse;
    }

    /**
     * 功能描述:xml转数组
     * added by qiujian
     * added at 2018年05月25日
     */
    function xmlToArray($xml){

        //禁止引用外部xml实体
        libxml_disable_entity_loader(true);
        $xmlstring = simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA);
        $val = json_decode(json_encode($xmlstring),true);
        return $val;
    }

    /**
     * 发送post请求
     * @param string $url 请求地址
     * @param array $post_data post键值对数据
     * @return string
     * added by qiujian
     * added at 2018年05月25日
     */

    function send_post($post_data){
        $url = 'http://bsp-oisp.sf-express.com/bsp-oisp/sfexpressService';
        $result = $this->sendByPost($url,$post_data);
        return $result;
    }

    /**
     * 输入参数：
     * $url：服务端URL；
     * $paramsArray：应用参数
     * 返回值：返回响应信息
     */
    public function sendByPost($url, $params){

        //参数拼接
        $postdata = http_build_query($params);
        //发送数据
        $urlRs = curl_init();
        curl_setopt($urlRs, CURLOPT_URL, $url);
        curl_setopt($urlRs, CURLOPT_FAILONERROR, false);
        curl_setopt($urlRs, CURLOPT_RETURNTRANSFER, true);

        if ($this->timeout){
            curl_setopt($urlRs, CURLOPT_TIMEOUT, $this->timeout);
        }

        if ($this->connectTimeout){
            curl_setopt($urlRs, CURLOPT_CONNECTTIMEOUT, $this->connectTimeout);
        }

        //判断是否是HTTPS请求
        if(strlen($url) > 5 && strtolower(substr($url, 0, 5)) == "https" ){
            curl_setopt($urlRs, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($urlRs, CURLOPT_SSL_VERIFYHOST, 0);
        }

        curl_setopt($urlRs, CURLOPT_POST, true);
        curl_setopt($urlRs, CURLOPT_POSTFIELDS, $postdata);

        //发送消息，获取响应
        $response = curl_exec($urlRs);

        if(curl_errno($urlRs)){
            throw new Exception(curl_error($urlRs), 0);
        }else{
            //获取传输返回码
            $httpStatusCode = curl_getinfo($urlRs, CURLINFO_HTTP_CODE);
            if (200 !== $httpStatusCode){
                throw new Exception($response, $httpStatusCode);
            }
        }
        //关闭连接
        curl_close($urlRs);
        return $response;
    }
}
?>