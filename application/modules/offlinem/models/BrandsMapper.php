<?php

class Offlinem_Model_BrandsMapper extends HKBaseMapper{

public function phones($multiple){
    $sql="select * from pinpai p where pcode!='p0273' and p.mertype=:multiple order by seq";

    $stmt=$this->_db->prepare($sql);
    $stmt->bindParam('multiple', $multiple);
    $stmt->execute();
    return $stmt->fetchAll();
}

public function phone($province,$multiple){

    $sql="select * from 
ydm_view_recycmers where PNAME=:province and mertypename=:multiple";

    $stmt=$this->_db->prepare($sql);
    $stmt->bindParam('province', $province);
    $stmt->bindParam('multiple',$multiple);
    $stmt->execute();
    return $stmt->fetchAll();
}



    public function getGuizeBySslxIds($sslxId){
        $sql = "select lx.guizename ruletypename from guizelx lx left join jisuangz gz on lx.guizelxid=gz.guizelx
                   
                where lx.suoshulxid=:sslxId and lx.isdel!=1 and gz.isdel!=1 and gz.enableflag='Y'
                
                 group by lx.guizename having count(*) > 1
              
                ";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('sslxId', $sslxId);
        $stmt->execute();
        return $stmt->fetchAll();
    }


    public function getGuizeBySslxId($sslxId){
        $sql = "select lx.guizelxid ruletypeid,lx.guizename ruletypename,lx.stype selectmode,lx.levels,gz.textdesc,
                  gz.jisuangzid ruledetailid,gz.gzname ruledetailname,gz.jisuanzhi deductval,gz.jisuanlx deducttype,gz.ext2
                from guizelx lx left join jisuangz gz on lx.guizelxid=gz.guizelx
                where lx.suoshulxid=:sslxId and lx.isdel!=1 and gz.isdel!=1 and gz.enableflag='Y'
                order by lx.levels, lx.xh, lx.typemodelid, gz.xh, gz.detailmodelid
              
                ";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('sslxId', $sslxId);
        $stmt->execute();
        return $stmt->fetchAll();

    }

public function guizexia($sslxId){

    $sql = " select lx.guizelxid ruletypeid,lx.guizename ruletypename,lx.stype selectmode,lx.levels,gz.textdesc,
                  gz.jisuangzid ruledetailid,gz.gzname ruledetailname,gz.jisuanzhi deductval,gz.jisuanlx deducttype,gz.ext2
                from guizelx lx left join jisuangz gz on lx.guizelxid=gz.guizelx
                where lx.suoshulxid=:sslxId and lx.isdel!=1 and gz.isdel!=1 and gz.enableflag='Y'
                order by lx.levels, lx.xh, lx.typemodelid, gz.xh, gz.detailmodelid
                ";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindParam('sslxId', $sslxId);
    $stmt->execute();
    return $stmt->fetchAll();

}
public function getMerId($sslxId){
    $sql = "select merid from ydm_view_recycmers t where t.sslxId =:sslxId";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindParam('sslxId', $sslxId);
    $stmt->execute();
    return $stmt->fetch();

}

    public function getMerIds(){
        $sql = "select * from ydm_view_recycmers t ";
        $stmt = $this->_db->prepare($sql);

        $stmt->execute();
        return $stmt->fetch();

    }
    public function chazhao($names,$password){
        $sql="select * from ADRESSFROM where  name=:names and passname =:passwords";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('names',$names);
        $stmt->bindValue('passwords',$password);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    public function chazhaoname($names){

        $sql="select * from ADRESSFROM where  name=:names ";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('names',$names);

        $stmt->execute();
        return $stmt->fetchAll();

    }
    public function changimage($filed,$names){
        $sql="update adressfrom set imgs=:ids where name=:names";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('ids',$filed);
        $stmt->bindValue('names',$names);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function jiancha($filed) {
        $sql="select * from ADRESSFROM where  imgs=:names ";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('names',$filed);

        $stmt->execute();
        return $stmt->fetchAll();

    }




}