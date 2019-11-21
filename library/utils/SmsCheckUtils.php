<?php

/**
 * 功能描述: Short Messaging Service
 * @package
 * @subpackage
 * @module
 * @createdate   2013-6-19
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class SmsCheckUtils{
    /**
     * 功能描述：根据手机号码查询最近5分钟短信日志数量
     * added by weimingze
     * added date 2017年12月9日
     */
    public static function getLast5minSmsLogs($mobile){
        $db  = DBUtils::getDb();
        $sql = "select count(1) counts from ydm_sys_smslogs where mobile=:mobile and createdate >=sysdate-1/288 ";

        $stmt = $db->prepare($sql);
        $stmt->bindParam('mobile', $mobile);
        $stmt->execute();
        $result = $stmt->fetchAll();
        $count = sizeof($result) > 0 ? $result[0]['COUNTS'] : 0;

        return $count < 20;
    }

    /**
     * 功能描述：保存短信日志
     * added by weimingze
     * added date 2017年12月9日
     */
    public static function saveSmsLog($mobile, $msg, $ip){
        $db  = DBUtils::getDb();
        $sql = "insert into ydm_sys_smslogs (pkid, mobile, smscontents, ip, sysname) ";
        $sql .= " values (:pkid, :mobile, :content, :ip, :systemName)";

        $pkId = date('YmdHis').mt_rand(10000, 99999);
        $sysName = 'OfflineSystem';

        $stmt = $db->prepare($sql);
        $stmt->bindParam('pkid', $pkId);
        $stmt->bindParam('mobile', $mobile);
        $stmt->bindParam('content', $msg);
        $stmt->bindParam('ip', $ip);
        $stmt->bindParam('systemName', $sysName);
        $stmt->execute();
        return $pkId;
    }

    /**
     * 功能描述：发送成功
     * added by weimingze
     * added date 2017年12月9日
     */
    public static function setSmsLogSuccess($sysDataId){
        $db  = DBUtils::getDb();
        $sql = "update ydm_sys_smslogs set status='1' where pkid=:sysDataId ";

        $pkId = date('YmdHis').mt_rand(10000, 99999);
        $sysName = 'OfflineSystem';

        $stmt = $db->prepare($sql);
        $stmt->bindParam('sysDataId', $sysDataId);
        $stmt->execute();
    }

    /**
     * 功能描述：当前手机号码最近5分钟发送成功次数超过5个
     * added by weimingze
     * added date 2017年12月9日
     */
    public static function checkMobileLast5minSendCount($mobile){
        $db  = DBUtils::getDb();
        $sql = "select count(1) counts from ydm_sys_smslogs where mobile=:mobile and createdate >=sysdate-1/288 and status='1' ";

        $thisDate = date('Y-m-d');

        $stmt = $db->prepare($sql);
        $stmt->bindParam('mobile', $mobile);
        $stmt->execute();
        $result = $stmt->fetchAll();
        $count = sizeof($result) > 0 ? $result[0]['COUNTS'] : 0;
        return $count >= 2;
    }

    /**
     * 功能描述：当前IP当天发送超过30个
     * added by weimingze
     * added date 2017年12月9日
     */
    public static function checkIpLast5minSendCount($ip){

        $db  = DBUtils::getDb();
        $sql = "select count(1) counts from ydm_sys_smslogs where ip=:ip and createdate >=sysdate-1/288 and status='1' ";

        $thisDate = date('Y-m-d');

        $stmt = $db->prepare($sql);
        $stmt->bindParam('ip', $ip);
        $stmt->execute();
        $result = $stmt->fetchAll();
        $count = sizeof($result) > 0 ? $result[0]['COUNTS'] : 0;

        return $count >= 2;
    }

    /**
     * 功能描述：获取IP
     * added by weimingze
     * added date 2017年12月9日
     */
    public static function getVisitIP(){
        $onlineIp = '';
        if(getenv('HTTP_CLIENT_IP') && strcasecmp(getenv('HTTP_CLIENT_IP'), 'unknown')) {
            $onlineIp = getenv('HTTP_CLIENT_IP');
        } else if(getenv('HTTP_X_FORWARDED_FOR') && strcasecmp(getenv('HTTP_X_FORWARDED_FOR'), 'unknown')) {
            $onlineIp = getenv('HTTP_X_FORWARDED_FOR');
        } elseif(getenv('REMOTE_ADDR') && strcasecmp(getenv('REMOTE_ADDR'), 'unknown')) {
            $onlineIp = getenv('REMOTE_ADDR');
        } elseif(isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], 'unknown')) {
            $onlineIp = $_SERVER['REMOTE_ADDR'];
        }
        return $onlineIp;
    }
}