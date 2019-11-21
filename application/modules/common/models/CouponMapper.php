<?php
require_once 'base/HKBaseMapper.php';

/**
 * 功能描述:品牌Mapper
 * @package
 * @subpackage
 * @module
 * @createdate   2013-6-4
 * @version   V1.0.0.1
 * @copyright  2013 上海翼思信息科技有限公司 版权所有
 */
class Common_Model_CouponMapper extends HKBaseMapper{

    /**
     * 功能描述：获取合作方下有效的活动
     * @param partnerCode  合作方code
     * @param eventcode  如果没有，获取所有活动
     */
    public function getValidOrderEvents($partnerCode, $eventCode){

        $paramSql = '';
        if($eventCode){
            $paramSql = ' and eventcode=:eventCode ';
        }

        $sql = "select eventname, eventcode, rebaterate, rebatevalue, startdate, stopdate, eventdesc, paytype
                from ydm_order_eventsdetail where partnerid = :partnerCode ".$paramSql." and isvalid='1' and isdel='0'
                and startdate < sysdate and stopdate > sysdate order by viewseq";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('partnerCode', $partnerCode);
        if($eventCode){
            $stmt->bindParam('eventCode', $eventCode);
        }
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：获取订单渠道商下的所有参与的活动信息
     */
    public function getAllOrderEvents($partnerCode, $eventCode){

        $paramSql = '';
        if($eventCode){
            $paramSql = ' and eventcode=:eventCode ';
        }

        $sql = "select eventname,eventcode,rebaterate,rebatevalue,startdate,stopdate,eventdesc from ydm_order_eventsdetail
                where partnerid=:partnerCode ".$paramSql." order by viewseq";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('partnerCode', $partnerCode);
        if($eventCode){
            $stmt->bindParam('eventCode', $eventCode);
        }
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：根据渠道商，获取当前渠道商下的所有券类型
     */
    public function getAllCouponTypes($partnerCode, $eventCode){
        $paramSql = "";
        if($eventCode){
            $paramSql = " and eventcode=:eventCode ";
        }
        $sql = "select typename,prices,eventcode from ydm_coupon_types ";
        $sql .= "where partnerid=:partnerCode ".$paramSql." order by eventcode,prices desc";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('partnerCode', $partnerCode);
        if($eventCode){
            $stmt->bindParam('eventCode', $eventCode);
        }
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 根据活动码，获取订单渠道商下的活动信息
     */
    public function getOrderEventByCode($eventCode,$partnerCode){
        $sql = "select eventType, ticketType, eventcode, rebaterate, rebatevalue, eventdesc ,eventtype, eventname ";
        $sql .= "from ydm_order_eventsdetail where partnerid=:partnerCode and isvalid='1' and isdel='0' ";
        $sql .= "and eventcode=:eventCode order by viewseq";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('eventCode', $eventCode);
        $stmt->bindParam('partnerCode', $partnerCode);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 功能描述：根据渠道商，获取当前渠道商下的所有券类型
     */
    public function getValidCouponTypes($partnerCode, $eventCode){
        $paramSql = "";
        if($eventCode){
            $paramSql = " and eventcode=:eventCode ";
        }

        $sql = "select typename, prices, eventcode from ydm_coupon_types where partnerid=:partnerCode ".$paramSql."
                 and isvalid='1' and isdel='0' order by eventcode, prices desc";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('partnerCode', $partnerCode);
        if($eventCode){
            $stmt->bindParam('eventCode', $eventCode);
        }
        $stmt->execute();
        return $stmt->fetchAll();
    }
}