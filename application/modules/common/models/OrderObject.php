<?php
require_once 'base/HKBaseObject.php';

/**
 * 功能描述: 器材Object
 * @package
 * @subpackage
 * @module
 * @createdate   2013-6-4
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class Common_Model_OrderObject extends HKBaseObject{

    /**
     * 保存询价单信息
     */
    public function saveInquiry($merInfo){
        //获取单选复选
        $radioIds = $merInfo['RADIOIDS'];
        $merType = $merInfo['MERTYPE'];
        if(!empty($merInfo['MULTIIDS'])){
            $radioIds = $radioIds."#".$merInfo['MULTIIDS'];
        }
        if(isset(EnumType::$yfmerClasss[$merType])){
            $commonObj = new Common_Model_YfproductapiObject;
            $merInfo['ATTRSDESC'] = $commonObj->getruledescription($radioIds, $merInfo['SSLXID']);//获取商品规则描述（通过翼锋网接口获取）
        }else{
            $ids = explode("#", $radioIds);
            $productObj = new Common_Model_ProductObject();
            $merInfo['ATTRSDESC'] = $productObj->serializableMerAttrs($ids);
        }
            return $this->getMapper()->saveInquiry($merInfo);
    }

    /**
     * 根据询价单ID获取询价单详情
     */
    public function getInquiryById($inquiryId){
        return $this->getMapper()->getInquiryById($inquiryId);
    }

    /**
     * 根据询价单ID，修改询价单价格
     */
    public function updateInquiryPrice($inquiryId, $providerId, $providerPrice, $orderPrice, $merPrice, $activeCode, $strategyCode){
        return $this->getMapper()->updateInquiryPrice($inquiryId, $providerId, $providerPrice, $orderPrice, $merPrice, $activeCode, $strategyCode);
    }

    /**
     * 根据询价单ID，修改询价单佣金code
     */
    public function updatebrokerageCode($inquiryId, $brokerageCode){
        return $this->getMapper()->updatebrokerageCode($inquiryId, $brokerageCode);
    }

    /**
     * 根据询价单ID，修改询价单分成code
     */
    public function updatedividedCode($inquiryId, $dividedCode){
        return $this->getMapper()->updatedividedCode($inquiryId, $dividedCode);
    }

    /**
     * 功能描述：获取商品的最低报价
     */
    public function getMinMerQuotes($spId, $sslxId){
        $merQuotes = $this->getMapper()->getMinMerQuotes($spId, $sslxId);
        return $this->resetQuotes($merQuotes);
    }

    /**
     * 功能描述：空调最低报价
     */
    public function checkACMinQuotes($spId, $sslxId, $providerId){
        $quotes = $this->getMinMerQuotes($spId, $sslxId);
        foreach($quotes as $quote){
            if($quote['PROVIDERID'] == $providerId){
                return $quote;
            }
        }
        return null;
    }

    /**
     * 功能描述：回收商品价格校验
     */
    public function checkInquiryQuotes($inquiryBill, $providerId){
        $quotes = $this->getMerInquiryQuotes($inquiryBill);
        foreach($quotes as $quote){
            if($quote['PROVIDERID'] == $providerId){
                return $quote;
            }
        }
        return null;
    }

    /**
     * 功能描述：获取笔记本型号差价
     * merId：商品ID
     * typeId：笔记本型号ID
     */
    public function getNotebookTypeSpread($merId, $typeId){
        $spreadPrice = $this->getMapper()->getNotebookTypeSpread($merId, $typeId);
        return $spreadPrice;
    }

    /**
     * 获取商品报价
     */
    public function getMerInquiryQuotes($inquiryBill){
        $InquiryBillId = $inquiryBill['INQUIRYID'];
        $merId = $inquiryBill['SPID'];
        $sslxId = $inquiryBill['EXT1'];
        $radioIds = $inquiryBill['REDIOIDS'];
        $multiIds = $inquiryBill['MULTISELECTIDS'];
        $merType = $inquiryBill['FENLEI'];
        $nbTypeId = $inquiryBill['EXT2'];
        $spreadPrice = 0;
        if($merType == 'L'){
            //非新笔记本规则标记
            if(0){
                if($nbTypeId){
                    //获取笔记本配置差价
                    $productObj = new Common_Model_ProductObject();
                    //根据线下商品ID获取线上商品ID  暂时取消线下商品和线下报价
                    $onMerId = $productObj->getOnMerId($merId);
                    $spreadPrice = $this->getNotebookTypeSpread($merId, $nbTypeId);
                }else{
                    return null;
                }
            }
        }

        //所选明细扣点
        $ruleDetailVals = $this->getRuleDetailVals($sslxId, $radioIds, $multiIds);
        //获取回收商报价
        $providerPrices = $this->getMapper()->getProviderPrices($merId);
        $merQuotes = array();
        $percentValue = $ruleDetailVals['percentValue'];
        $absoluteValue = $ruleDetailVals['absoluteValue'];
        //获取规则利润点
        $ruldInfo = $this->getMapper()->findRuleById($sslxId);
        $profit = 0;
        if($ruldInfo){
            $profit = $ruldInfo['PROFIT'];
        }

        foreach($providerPrices as $price){
            $maxPrice = $price['MAXPRICE'];
            $minPrice = $price['MINPRICE'];
            //笔记本型号报价：回收商最高报价-差价
            if($spreadPrice < 0){
                $merPrice = $minPrice;
            }else{
                $maxPrice = $maxPrice-$spreadPrice;
                if($maxPrice < 0){
                    $merPrice = $minPrice;
                }else{
                    $merPrice = $maxPrice * (100 - $percentValue) / 100 + $absoluteValue;
                    $merPrice = $minPrice > $merPrice ? $minPrice : $merPrice;
                    $merPrice = $merPrice > $maxPrice ? $maxPrice : $merPrice;
                }
            }
            $merQuote['PROVIDERID'] = $price['PROVIDERID'];
            $merQuote['HSSPRICE'] = round($merPrice);

            $merQuote['PRICE'] = $this->roundPrice($merPrice * (100-$profit) /100);
            array_push($merQuotes, $merQuote);
        }
        return $this->resetQuotes($merQuotes);
    }

    /**
     * 价格重置
     */
    private function roundPrice($price){
        $price = floor($price);
        $lastVal = intval(substr($price, -1));
        $lastVal = $lastVal < 5 ? $lastVal : ($lastVal-5);
        return $price-$lastVal;
    }

    /**
     * 功能描述：保存订单
     */
    public function saveOrder($orderParams){
        return $this->getMapper()->saveOrder($orderParams);
    }

    /**
     * 【☆】功能描述：根据回收单号获取回收单详情
     */
    public function getOrderInfoByNo($orderNo){
        //获取订单信息
        $orderInfo = $this->getMapper()->getOrderInfoByNo($orderNo);
        if($orderInfo){
            $inquiryBillNo = $orderInfo['INQUIRYBILLID'];
            $inspectionBillNo = $orderInfo['INSPECTIONBILLID'];
            $orderStatus = $orderInfo['PAGEORDERSTATUS'];
            if(isset(EnumType::$userOrderStatus[$orderStatus])){
                $orderInfo['ORDERSTATUSNAME'] = EnumType::$userOrderStatus[$orderStatus];
            }else{
                $orderInfo['ORDERSTATUSNAME'] = $orderStatus;
            }
            $orderInfo['INQUIRYINFO'] = $this->getInquiryBillByNo($inquiryBillNo);
            $orderInfo['INSPECTIONINFO'] = $this->getInspectionBillByNo($inspectionBillNo);
        }
        return $orderInfo;
    }

    /**
     * 功能描述：根据询价单ID获取询价单详情
     */
    public function getInquiryBillByNo($inquiryBillNO){
        return $this->getMapper()->getInquiryBillByNo($inquiryBillNO);
    }

    /**
     * 功能描述：根据检测单ID获取检测单详情
     */
    public function getInspectionBillByNo($inspectionBillNo){
        return $this->getMapper()->getInspectionBillByNo($inspectionBillNo);
    }

    /**
     * 报价重组
     */
    private function resetQuotes($merQuotes){
        $realCounts = sizeof($merQuotes);
        if($realCounts > 0){
            //按照报价高低排序
            $prices = array();
            foreach($merQuotes as $key => $value){
                $prices[$key] = $value['PRICE'];
            }
            array_multisort($prices, SORT_DESC, $merQuotes);
        }
        return $merQuotes;
    }

    /**
     * 获取规则计算值
     */
    public function getRuleDetailVals($sslxId, $radioIds, $multiIds){
        $detailIds = $radioIds;
        if($multiIds){
            $detailIds = $detailIds.'#'.$multiIds;
        }
        $list = $this->getMapper()->getRuleDetailVals($sslxId, $detailIds);
        $absoluteValue = 0;//绝对值
        $percentValue = 0;//百分比
        foreach($list as $item){
            if($item['CHOICEMODE'] == 'R'){//单选
                if($item['COUNTMODE'] == '百分比'){
                    $percentValue = $percentValue + $item['VAL'];
                }elseif($item['COUNTMODE'] == '绝对值'){
                    $absoluteValue = $absoluteValue + $item['VAL'];
                }
            }elseif($item['CHOICEMODE'] == 'C'){//多选
                if($item['COUNTMODE'] == '百分比'){
                    $percentValue = $percentValue - $item['VAL'];
                }elseif($item['COUNTMODE'] == '绝对值'){
                    $absoluteValue = $absoluteValue + $item['VAL'];
                }
            }
        }
        return array('percentValue'=>$percentValue, 'absoluteValue'=>$absoluteValue);
    }

    /**
     * 功能描述：获取商品价格波动曲线
     */
    public function getMerPirceCurve($inquiryId){
        return $this->getMapper()->getMerPirceCurve($inquiryId);
    }

    /**
     * 商品报价下跌预报
     */
    public function getPriceTrend($merId, $price){
        $seed = hexdec(substr($merId, 5,5));
        //历史报价
        $prices = array();
        $thisDate = date('Y-m',time()) . '-01 00:00:01';
        $thisTime = strtotime($thisDate);
        $diffPrice = 0;
        $merPice = $price;
        for($i=0; $i<3; $i++){
            $month = date("m月",strtotime("-".$i." month",$thisTime));
            $prices[$month]['merPrice'] = $merPice;
            srand($seed+$i);
            $rate = rand(10,15)/100;
            $diffPrice = floor($merPice*$rate);
            $merPice = $merPice + $diffPrice;
            $prices[$month]['diffPrice'] = $diffPrice;
        }
        srand($seed+12344);
        $rate = rand(10,15)/100;
        $nextDiffPrice = $diffPrice = floor($price*$rate);
        $prices = array_reverse($prices);
        return Array("prices"=>$prices, "nextDiffPrice"=>$nextDiffPrice);
    }

    /**
     * 更改询价单活动码
     */
    public function updateInquiryEventCode($inquiryId, $eventCode){
        $this->getMapper()->updateInquiryEventCode($inquiryId, $eventCode);
    }

    /**
     * 功能描述：
     * added by wise wei
     * added at 2017年4月28日 下午2:37:58
     */
    public function orderSuccess($orderNo){
        $this->getMapper()->orderSuccess($orderNo);
    }

    /**
     * 查看订单活动是否有效
     */
    public function checkInfo($eventCode){
        return $this->getMapper()->checkInfo($eventCode);
    }

    /**
     * 查找地推人员的佣金策略
     */
    public function getPromoterBrokerage($merPrice,$partnerCode){
        return $this->getMapper()->getPromoterBrokerage($merPrice,$partnerCode);
    }

    /**
     * 查找门店的分成策略
     */
    public function getPartnersDivided($orderPrice,$partnerCode){
        return $this->getMapper()->getPartnersDivided($orderPrice,$partnerCode);
    }

    /**
     * 查找询价信息，根据询价单ID
     */
    public function getInquiryInfo($inquiryId){
        return $this->getMapper()->getInquiryInfo($inquiryId);
    }

    /**
     * 查找活动信息
     */
    public function getEventOrderInfo($eventCode, $price){
        return $this->getMapper()->getEventOrderInfo($eventCode, $price);
    }

    /**
     * @return Common_Model_OrderMapper
     */
    public function getMapper(){
        if (null === $this->_mapper) {
            $this->setMapper(new Common_Model_OrderMapper());
        }
        return $this->_mapper;
    }
}