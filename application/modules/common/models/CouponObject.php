<?php
require_once 'base/HKBaseObject.php';  

/**
 * 功能描述: 品牌管理
 * 
 * @package    
 * @subpackage 
 * @module   
 * @createdate   2013-6-4
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class Common_Model_CouponObject extends HKBaseObject{
    
    /**
     * 功能描述：获取订单渠道商下的所有参与的活动信息
     */
    public function getOrderEvents($partnerCode, $eventCode){
        return $this->getMapper()->getOrderEvents($partnerCode, $eventCode);
    }
    
    /**
     * 根据活动码，获取订单渠道商下的活动信息
     */
    public function getOrderEventByCode($eventCode, $partnerCode){
        return $this->getMapper()->getOrderEventByCode($eventCode, $partnerCode);
    }
    
    /**
     * 功能描述：根据订单渠道商，获取当前渠道商下的所有券类型
     */
    public function getCouponTypes(){
        return $this->getMapper()->getCouponTypes();
    }
    
    /**
     * 功能描述：获取渠道商下符合条件的有效活动
     */
    public function getValidOrderEvents($partnerCode, $eventCode){
        return $this->getMapper()->getValidOrderEvents($partnerCode, $eventCode);
    }
    
    /**
     * 功能描述：获取渠道商下所有的活动信息
     */
    public function getAllOrderEvents($partnerCode, $eventCode){
        return $this->getMapper()->getAllOrderEvents($partnerCode, $eventCode);
    }
    
    /**
     * 功能描述：根据订单渠道商，获取当前渠道商下的所有券类型
     */
    public function getValidCouponTypes($partnerCode, $eventCode){
        return $this->getMapper()->getValidCouponTypes($partnerCode, $eventCode);
    }
    
    /**
     * 功能描述：券加现金模式下，根据活动码获取该活动码下所有金额的券信息
     * CC  CouponCash
     */
    public function getCCValidOrderEvents($partnerCode, $eventCode){
        $orderEvents = $this->getValidOrderEvents($partnerCode, $eventCode);
        $couponTypes = $this->getValidCouponTypes($partnerCode, $eventCode);
        for($i = 0; $i < sizeof($orderEvents); $i++){
            for($j = 0; $j < sizeof($couponTypes); $j++){
                $prices = array();
                if($orderEvents[$i]['EVENTCODE'] == $couponTypes[$j]['EVENTCODE']){
                    if(isset($orderEvents[$i]['PRICES'])){
                        $prices = $orderEvents[$i]['PRICES'];
                    }
                    array_push($prices, $couponTypes[$j]['PRICES']);
                    rsort($prices);
                    $orderEvents[$i]['PRICES'] = $prices;
                }
            }
        }
        return $orderEvents;
    }
    
    /**
     * getMapper()
     */
    public function getMapper(){
        if (null === $this->_mapper){
            $this->setMapper(new Common_Model_CouponMapper());
        }
        return $this->_mapper;
    }
}