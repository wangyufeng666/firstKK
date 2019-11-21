<?php


class Offlinem_Model_FenxiangMapper extends HKBaseMapper{

    public function getCityByProvinceID($provinceid){

        $sql="select AREA_ID from ydm_property_areas where AREA_NAME=:provinceid and  area_type='1'";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam("provinceid", $provinceid);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getId($res){
        $sql = "select * from ydm_property_areas where parentid=:id";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam("id", $res);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    public function getProvince(){
        $sql = "select area_id,area_name from ydm_property_areas where area_type='1' order by to_number(area_id)";
        $stmt = $this->_db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    public function getFrom($params){
        $sql = "insert into adressfroms (ids,name,telnumber,class,province,city )
                values ( :ids ,:nameq,:telnumber,:dizhi, :province, :city  )";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('ids',$params['ids']);
        $stmt->bindValue('nameq', $params['name']);
        $stmt->bindValue('province', $params['province']);
        $stmt->bindValue('telnumber', $params['telnumber']);
        $stmt->bindValue('city', $params['city']);
        $stmt->bindValue('dizhi',$params['dizhi']);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
    public function lists(){


        $sql = "select t1.* from(
                select rownum r, t.* from (
                select *from adressfroms)t)t1 order by ids   ";

        $stmt = $this->_db->prepare($sql);
        $stmt->execute();
        $list = $stmt->fetchAll();
        return array('totalCount'=>$this->promoterCount(), 'result'=>$list);
    }
    public function promoterCount(){
        $sql = "select count(*) counts from adressfroms";
        $stmt = $this->_db->prepare($sql);

        $stmt->execute();
        $result = $stmt->fetch();
        return sizeof($result) > 0 ? $result['COUNTS'] : 0;
    }

public  function  delete($name){

        $sql="delete from adressfroms where name=:name";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindValue('name', $name);
    $stmt->execute();
    return $stmt->rowCount() > 0;
}

public function edit($nameq){
    $sql="select * from adressfroms where name=:nameq";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindParam("nameq", $nameq);
    $stmt->execute();
    return $stmt->fetchAll();
}
public function upudit($params){

        $sql="update adressfroms set class=:dizhi,telnumber=:telnumber,province=:province,city=:city,name=:nameq where ids=:ids";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindValue('ids',$params['ids']);
    $stmt->bindValue('nameq', $params['name']);
    $stmt->bindValue('province', $params['province']);
    $stmt->bindValue('telnumber', $params['telnumber']);
    $stmt->bindValue('city', $params['city']);
    $stmt->bindValue('dizhi',$params['dizhi']);
    $stmt->execute();
    return $stmt->rowCount() > 0;
}

public function name(){
    $sql="select k.name RULEDETAILNAME,p.IMGS,p.RULEDETAILID from adressfroms k left join adressfrom p on k.ids=p.depno ";
    $stmt = $this->_db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll();

}


    public function dizhi(){
        $sql="select k.province RULEDETAILNAME,p.IMGS,p.RULEDETAILID from adressfroms k left join adressfrom p on k.ids=p.depno ";
        $stmt = $this->_db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();

    }
public function chazhaoname($names){

    $sql="select * from adressfroms where  name=:contactWay ";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindValue('contactWay',$names);
    $stmt->execute();
    return $stmt->fetchAll();
}
public function listdizhi($nameq){
    $sql="select * from adressfroms where  name=:nameq ";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindValue('nameq',$nameq);
    $stmt->execute();
    return $stmt->fetchAll();

}

}