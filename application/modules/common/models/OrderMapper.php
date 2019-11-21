<?php
require_once 'base/HKBaseMapper.php';

/**
 * 功能描述:订单管理Mapper
 *
 * @package
 * @subpackage
 * @module
 * @createdate   2013-6-4
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyright  2013 上海翼思信息科技有限公司 版权所有
 */

class Common_Model_OrderMapper extends HKBaseMapper{

    /**
     * 更改询价单活动码
     */
    public function updateInquiryEventCode($inquiryId, $eventCode){
        $sql = "update inquirybill set activecode=:eventCode where inquiryid=:inquiryId";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('eventCode', $eventCode);
        $stmt->bindParam('inquiryId', $inquiryId);
        $stmt->execute();
    }

    /**
     * 保存询价单信息
     */
    public function saveInquiry($merInfo){
        $inquiryId = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
        $sql = 'begin :inquiryId := pkg_ydm_order.saveInquiryBill(
                  :userId, :partnerUserId, :cookieId, :pinpai, :merId, :merName, :merImgUrl,
                  :fenlei, :radioIds, :multiIds, :ip, :attrsDesc, :sources, :sslxId); end;';

        $merName = $merInfo['PINPAI'].' '.$merInfo['SPNAME'];
        $typeId = $merInfo['NOTEBOOKTYPEID'];

        $stmt = $this->_db->prepare($sql);

        $partnerCode = isset($merInfo['PARTNERCODE']) ? $merInfo['PARTNERCODE'] : '';
        $promoCode = isset($merInfo['PROMOCODE']) ? $merInfo['PROMOCODE'] : '';

        $stmt->bindValue('userId', $promoCode);
        $stmt->bindValue('partnerUserId', $partnerCode);
        $stmt->bindParam('cookieId', $merInfo['COOKIEID']);
        $stmt->bindParam('pinpai', $merInfo['PINPAI']);
        $stmt->bindParam('merId', $merInfo['SPID']);
        $stmt->bindParam('merName', $merName);
        $stmt->bindParam('merImgUrl', $merInfo['MERIMG']);
        $stmt->bindParam('fenlei', $merInfo['MERTYPE']);
        $stmt->bindParam('radioIds', $merInfo['RADIOIDS']);
        $stmt->bindParam('multiIds', $merInfo['MULTIIDS']);
        $stmt->bindParam('ip', $merInfo['IP']);
        $stmt->bindParam('attrsDesc', $merInfo['ATTRSDESC']);
        $stmt->bindParam('sources', $merInfo['SOURCE']);
        $stmt->bindParam('sslxId', $merInfo['SSLXID']);
        $stmt->bindParam('inquiryId', $inquiryId);
        $stmt->execute();
        $this->updateInquiryInfo($inquiryId, $typeId);
        return $inquiryId;
    }

    /**
     * 修改询价单信息
     */
    private function updateInquiryInfo($inquiryId, $typeId){
        $sql = "update inquirybill set ext2 = :typeId where inquiryid = :inquiryId";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('inquiryId', $inquiryId);
        $stmt->bindParam('typeId', $typeId);
        $stmt->execute();
    }

    /**
     * 功能描述：根据询价单Id，获取询价单信息
     */
    public function getInquiryById($inquiryId){
        $sql = "select i.*, to_char(createdate, 'yyyy-mm-dd hh24:mi:ss') as inquirydate from inquirybill i ";
        $sql .= "where i.inquiryid=:inquiryId";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('inquiryId', $inquiryId);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 根据询价单ID，修改询价单价格
     */
    public function updateInquiryPrice($inquiryId, $providerId, $providerPrice, $orderPrice, $merPrice, $activeCode, $strategyCode){

        $sql = "update inquirybill set providerid=:providerId,providerprice=:providerPrice,merprice=:merPrice,activecode=:activeCode,";
        $sql .= " settleprice=:settlePrice,activeprice=:settlePrice,strategycode=:strategyCode where inquiryid=:inquiryId";

        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('providerId', $providerId);
        $stmt->bindParam('providerPrice', $providerPrice);
        $stmt->bindParam('merPrice', $merPrice);
        $stmt->bindParam('settlePrice', $orderPrice);
        $stmt->bindParam('activeCode', $activeCode);
        $stmt->bindParam('inquiryId', $inquiryId);
        $stmt->bindParam('strategyCode', $strategyCode);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    /**
     * 根据询价单ID，修改询价单价格佣金code
     */
    public function updatebrokerageCode($inquiryId, $brokerageCode){

        $sql = "update inquirybill set brokeragecode=:brokerageCode where inquiryid=:inquiryId";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('inquiryId', $inquiryId);
        $stmt->bindParam('brokerageCode', $brokerageCode);
        $stmt->execute();
    }

    /**
     * 根据询价单ID，修改询价单价格分成code
     */
    public function updatedividedCode($inquiryId, $dividedCode){

        $sql = "update inquirybill set dividedcode=:dividedCode where inquiryid=:inquiryId";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('inquiryId', $inquiryId);
        $stmt->bindParam('dividedCode', $dividedCode);
        $stmt->execute();
    }

    /**
     * 功能描述：获取商品报价
     */
    public function getNotebookQuotes($inquiryId){
        $sql ='select * from table(pkg_ydm_order.getNotebooksPrices(:inquiryId))';
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('inquiryId', $inquiryId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：获取笔记本型号差价
     * merId：商品ID
     * typeId：笔记本型号ID
     */
    public function getNotebookTypeSpread($merId, $typeId){
        $result = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ';
        $sql ='begin :result := pkg_ydm_order.getNotebookTypeSpread(:merId, :typeId); end; ';
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('merId', $merId);
        $stmt->bindParam('typeId', $typeId);
        $stmt->bindParam('result', $result);
        $stmt->execute();
        return $result;
    }

    /**
     * 功能描述：获取商品的最低报价
     */
    public function getMinMerQuotes($spId, $sslxId){
        $sql ='select * from table(pkg_ydm_order.getMinQuotes(:spId, :sslxId))';
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('spId', $spId);
        $stmt->bindParam('sslxId', $sslxId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述
     */
    public function saveOrder($orderParams){
        if($orderParams){
            $mobile = $orderParams['contactWay'];
            $userLoginId = $this->memberRegister($mobile);
            $result = HKConstant::$PKGDEFAULTRETURNRESULT;
            $sql = 'begin pkg_ydm_order.saveOrder(:spId, :userLoginId, :providerId, :providerPrice,
                      :orderPrice, :contacts, :contactWay, :contactAddress, :merType,
                      :orderType, :tradeType, :payType, :openBank, :accountName, :bankNumber, :inquiryBillNo, :result);
                    end;';
            $stmt = $this->_db->prepare($sql);
            $stmt->bindValue('spId', $orderParams['spId']);
            $stmt->bindValue('userLoginId', $userLoginId);
            $stmt->bindValue('providerId', $orderParams['providerId']);
            $stmt->bindValue('providerPrice', $orderParams['providerPrice']);
            $stmt->bindValue('orderPrice', $orderParams['orderPrice']);
            $stmt->bindValue('contacts', $orderParams['contacts']);
            $stmt->bindValue('contactWay', $mobile);
            $stmt->bindValue('contactAddress', $orderParams['contactAddress']);
            $stmt->bindValue('merType', $orderParams['merType']);
            $stmt->bindValue('orderType', $orderParams['orderType']);
            $stmt->bindValue('tradeType', $orderParams['tradeType']);
            $stmt->bindValue('payType', $orderParams['payType']);
            $stmt->bindValue('openBank', '');
            $stmt->bindValue('bankNumber', '');
            $stmt->bindValue('accountName', '');
            $stmt->bindValue('inquiryBillNo', $orderParams['inquiryBillNo']);
            $stmt->bindParam('result', $result);
            $stmt->execute();
            $notebookTypeId = $orderParams['notebookTypeId'];
            $IMEI = $orderParams['imei'];
            $results = explode('-', $result);

            if(sizeof($results) > 0){
                if($results[0] == 'OK'){
                    $orderNo = $results[1];
                    if($notebookTypeId){//如果是笔记本，则保存笔记本型号信息
                        $this->saveNotebookOrder($orderNo, $notebookTypeId);
                    }

                    //判断是手机，则保存IMEI号
                    if($orderParams['merType'] == 'J' && $IMEI){
                        $this->savePhoneIMEI($orderNo, $IMEI);
                    }

                    //判断是否为地推人人下单，如果是不发短息
                    $orderRemark = "";
                    if($orderParams['orderType'] != '175'){
                        //发送通知短信
                        if(SMSFLAG){
                            $msgRst = $this->yonghuSendMessage($orderParams['contactWay'], $orderParams['tradeType'], $orderParams['orderType']);
                            if($msgRst){
                                $orderRemark = "\n[".date('Y-m-d H:i:s')."]【短信通知】 订单提交提示短信发送成功";
                            }else{
                                $orderRemark = "\n[".date('Y-m-d H:i:s')."]【短信通知】 订单提交提示短信发送失败";
                            }
                        }
                    }
                    $this->addOrderRemark($orderNo, $orderRemark);//添加订单备注
                    //添加订单状态记录
                    $thisStatus = '';
                    $nextStatus = '1';
                    $remark = '用户提交订单';
                    $this->addOrderOperLog($orderNo, $thisStatus, $nextStatus, $remark);
                }
            }
            return $results;
        }
    }

    /**
     * 功能描述：添加订单操作记录
     */
    public function addOrderOperLog($orderNo, $thisStatus, $nextStatus, $remark){
        //删除已有相同的操作记录
        $this->deleteOrderOperLog($orderNo, $nextStatus);
        $sql = "insert into ydm_order_operationlog (operatorid, orderno, currentstatus, nextstatus, remark, createdate, loglevel)
                values ('user', :orderNo, :thisStatus, :nextStatus, :remark, sysdate, '1')";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('remark',$remark);
        $stmt->bindParam('orderNo',$orderNo);
        $stmt->bindParam('thisStatus',$thisStatus);
        $stmt->bindParam('nextStatus',$nextStatus);
        $stmt->execute();
    }

    /**
     * 功能描述：删除已有相同的操作记录
     */
    private function deleteOrderOperLog($orderNo, $nextStatus){
        $sql = "delete from ydm_order_operationlog where orderNo=:orderNo and nextstatus=:nextStatus";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('orderNo',$orderNo);
        $stmt->bindParam('nextStatus',$nextStatus);
        $stmt->execute();
    }

    /**
     * 功能描述：添加订单备注
     */
    public function addOrderRemark($orderNo, $orderRemark){
        $sql = "update kehudingdan set orderremarks = orderremarks||:orderRemark where dingdanno=:orderNo";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('orderRemark',$orderRemark);
        $stmt->bindParam('orderNo',$orderNo);
        $stmt->execute();
    }

    /**
     * 客户短信通知
     */
    private function yonghuSendMessage($phone, $tradeType, $orderType){
        $msg = '';
        if($tradeType == '1' || $tradeType == '5'){//上门
            $msg = SmsUtils::$order_success_door_msg;
        }else{//快递
            $msg = SmsUtils::$order_success_express_msg;
        }
        if($msg){
            return SmsUtils::sendHaoboMessage($phone, $msg);
        }
    }

    /**
     * 功能描述：根据订单ID获取订单详情
     */
    public function getOrderInfoByNo($orderNo){
        $sql = "select k.kehudingdanid orderid,k.inquirybillid,k.inspectionbillid,k.dingdanprice orderprice,k.chuliren1 pageorderstatus,k.ext2 sourcecode,
                  k.dingdanno orderno,k.chulitype tradetype,k.settleprice,k.dingdanstatus orderstatus,k.shangpingid merid,k.ext3 expressNum,m.pname,m.mername,
                  k.lianxiren contactname,k.lianxidh mobile,to_char(k.dingdanshij,'yyyy-mm-dd hh24:mi:ss') as strorderdate,chulibeizhu,
                m.mertype,m.mertypename,m.sslxid,k.dizhi address,k.chulibeizhu tradedate from kehudingdan k left join ydm_view_allrecycmers m on m.merid=k.shangpingid
                where k.ext2 in (51,52) and k.chuliren3 is null and k.dingdanno=:orderNo";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('orderNo', $orderNo);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 功能描述：根据询价单ID获取询价单信息
     */
    public function getInquiryBillByNo($inquiryBillNo){
        $sql = "select to_char(createdate, 'yyyy-mm-dd hh24:mi:ss') as strcreatedate, spname, yhduserid, merimg,
                   fenlei, attributedesc, merprice, providerprice, activecode, activeprice, settleprice, spname
                 from inquirybill where yhdinquiryid = :inquiryBillNo";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('inquiryBillNo', $inquiryBillNo);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 功能描述：根据询价单ID获取询价单信息
     */
    public function getInspectionBillByNo($inspectionBillNo){

        $sql = "select to_char(ib.createdate, 'yyyy-mm-dd hh24:mi:ss') as strcreatedate, attributedesc, merprice, providerprice, workername,
                  activecode, activeprice, settleprice, yhdinspectionid
                from inspectionbill ib where yhdinspectionId = :inspectionBillNo ";

        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('inspectionBillNo', $inspectionBillNo);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 功能描述：保存笔记本订单相关信息
     */
    private function saveNotebookOrder($orderNo, $notebookTypeId){
        $attrs = $this->getNotebookAttrs($notebookTypeId);
        $typeDesc = '';
        $typePrice = 0;
        foreach($attrs as $attr){
            $typeDesc .= $attr['ATTRID'].'@_@'.$attr['ATTRNAME'].'@_@'.$attr['PRICE'].';';
            $typePrice += $attr['PRICE'];
        }
        $sql = 'insert into order_notebooks_types (type_id, typedesc, typeprice, orderno) values(:typeId, :typeDesc, :typePrice, :orderNo)';
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('typeId', $notebookTypeId);
        $stmt->bindValue('typeDesc', $typeDesc);
        $stmt->bindValue('typePrice', $typePrice);
        $stmt->bindValue('orderNo', $orderNo);
        $stmt->execute();
    }

    /**
     * 功能描述：笔记本电脑订单价格验证
     */
    public function checkNotebookOrderPrice($inquiryId, $providerId){
        $sql ='select * from table(pkg_ydm_order.checkNotebookOrderPrice(:inquiryId, :providerId))';
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('inquiryId', $inquiryId);
        $stmt->bindParam('providerId', $providerId);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 功能描述：会员注册信息
     */
    private function memberRegister($contactWay){
        $loginId = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
        $sql =' begin :loginId := pkg_ydm_member.memberRegisterByOrder(:contactWay); end; ';
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('contactWay', $contactWay);
        $stmt->bindParam('loginId', $loginId);
        $stmt->execute();
        return $loginId;
    }

    /**
     * 功能描述：根据笔记本型号，获取笔记本配置信息
     */
    public function getNotebookAttrs($typeId){
        $sql = "select t1.*, nag.groupname, nag.price from (
                  select nta.type_id, nta.attrid, na.attrname, na.attrtype, na.quotegroupid
                  from notebooks_types_attrs nta left join notebooks_types nt on nta.type_id = nt.type_id
                  left join notebooks_attrs na on nta.attrid = na.attrid where nta.type_id = :typeId and na.usable = 'Y'
                ) t1 left join notebooks_attrsquote_group nag on t1.quotegroupid = nag.groupid order by t1.attrtype";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('typeId', $typeId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：订单总数
     */
    private function totalCount($userId){
        $sql = "select count(inquirybillid) counts from (select inquirybillid from kehudingdan where ext2 in (51,52) and chuliren3 is null ) t1,
                inquirybill t2 where t2.yhduserid = :userId and t1.inquirybillid = t2.yhdinquiryid ";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('userId', $userId);
        $stmt->execute();
        $result = $stmt->fetch();
        return sizeof($result) > 0 ? $result['COUNTS'] : 0;
    }

    /**
     * 获取规则计算值
     */
    public function getRuleDetailVals($sslxId, $detailIds){
        $detailIds = str_replace("#", "','", $detailIds);
        $sql = "select jisuanlx countmode, stype choicemode, sum(jisuanzhi) val from (
                  select t1.guizelx, t1.jisuanzhi, t1.jisuanlx, t2.stype from (
                    select guizelx, jisuanzhi, jisuanlx from jisuangz where suoshulx = :sslxId and jisuangzid in ('".$detailIds."')
                  ) t1 left join guizelx t2 on t1.guizelx = t2.guizelxid ) tt group by tt.jisuanlx, stype";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('sslxId', $sslxId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：根据商品ID，获取回收商报价
     */
    public function getProviderPrices($merId){
        $sql = "select providerid, zuigaoprice maxprice, zuidiprice minprice from huishouprice where shangpingid =:merId and shenpistatus = 'Y'
                order by zuigaoprice, zuidiprice, huishouid";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('merId', $merId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：根据所属规则ID获取所属规则信息
     */
    public function findRuleById($ruleId){
        $sql = "select suoshulxid, suxingname, suxingcode, profit from suoshulx where suoshulxid =:ruleId";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('ruleId', $ruleId);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 功能描述：获取商品价格波动曲线
     */
    public function getMerPirceCurve($inquiryId){
        $sql ='select * from table(pkg_ydm_order.getMerPirceCurve(:inquiryId))';
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('inquiryId', $inquiryId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：检测订单活动是否有效
     */
    public function checkInfo($eventCode){
        $sql = 'select * from ydm_order_eventsdetail where eventcode=:eventcode';
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('eventcode',$eventCode);
        $stmt->execute();
        return sizeof($stmt->fetchAll()) > 0;
    }

    /**
     * 功能描述：
     * added by wise wei
     * added at 2017年4月28日 下午2:37:58
     */
    public function orderSuccess($orderNo){
        $sql = "update kehudingdan set dingdanstatus = '5',chuliren1='66' where dingdanno=:orderNo";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('orderNo', $orderNo);
        $stmt->execute();
    }

    /**
     * 查找地推人员的佣金策略
     */
    public function getPromoterBrokerage($merPrice,$partnerCode){
        $sql = "select s.strategyname,s.strategycode,s.strategystatus, d.detailcode,d.precentval,d.absoluteval
                from sys_brokerage_strategies s left join sys_brokerage_strategy_details d on s.strategycode = d.strategycode where
                minprice <=:merPrice and maxprice >:merPrice and s.startdate <= sysdate and s.enddate>=sysdate and
                 s.partnercode =:partnerCode  and s.isvalid='Y' and s.strategystatus='2'";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('merPrice',$merPrice);
        $stmt->bindParam('partnerCode',$partnerCode);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 查找该门店的分成策略
     */
    public function getPartnersDivided($orderPrice,$partnerCode){
        $sql = "select s.strategyname,s.strategycode,s.strategystatus, d.detailcode,d.precentval,d.absoluteval
                from sys_divided_strategies s left join sys_divided_strategy_details d on s.strategycode = d.strategycode where
                minprice <= :merPrice and maxprice > :merPrice and s.startdate <= sysdate and s.enddate>=sysdate and
                 s.partnercode =:partnerCode  and s.isvalid='Y' and s.strategystatus='2'";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('merPrice',$orderPrice);
        $stmt->bindParam('partnerCode',$partnerCode);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 保存手机IMEI号
     */
    public function savePhoneIMEI($orderNo, $IMEI){
        $sql = "update kehudingdan set ext4=:IMEI where dingdanno=:orderNo";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('IMEI',$IMEI);
        $stmt->bindParam('orderNo',$orderNo);
        $stmt->execute();
    }

    /**
     * 查找询价信息，根据询价单ID
     */
    public function getInquiryInfo($inquiryId){
        $sql = "select spid,providerid,providerprice,strategycode,merprice from inquirybill where inquiryid =:inquiryId";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('inquiryId',$inquiryId);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 查找活动信息
     */
    public function getEventOrderInfo($eventCode, $price){
        $sql = "select o.precentval,o.absoluteval,e.codepoint,o.strategycode from ydm_order_event_pricestrategy o  left join ydm_order_eventsdetail e on o.eventcode = e.eventcode
            where o.eventcode =:eventCode and o.minprice <=:price and o.maxprice >:price order by o.createdate desc";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('eventCode',$eventCode);
        $stmt->bindParam('price',$price);
        $stmt->execute();
        return $stmt->fetch();
    }
}
