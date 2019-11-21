<?php
require_once 'base/HKBaseMapper.php';



class Offlinem_Model_ProductMapper extends HKBaseMapper{

public function addCommodity($params){

    $sql="insert into adressfromsj (ID, PINPAI, PINLEI, YANSE, NEICUN, IMAGE,JIAGE,PUTWAY) values (:id,:pinpai,:pinlei,:yanse,:neicun,:image,:jiage,:putway)";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindValue('id',$params['id']);
    $stmt->bindValue('pinpai', $params['pinpai']);
    $stmt->bindValue('pinlei', $params['pinlei']);
    $stmt->bindValue('yanse', $params['yanse']);
    $stmt->bindValue('neicun', $params['neicun']);
    $stmt->bindValue('image',$params['image']);
    $stmt->bindValue('jiage',$params['jiage']);
    $stmt->bindValue('putway',$params['putway']);
    $stmt->execute();
    return $stmt->rowCount() > 0;

}
public function lists(){
    $sql="select * from adressfromsj  order by id ";
    $stmt = $this->_db->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll();

}
public function deleteCommodity($id){

    $sql="delete from adressfromsj where id=:id";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindValue('id', $id);
    $stmt->execute();
    return $stmt->rowCount() > 0;
}

public function shangjia($id){
    $sql = "update adressfromsj set PUTWAY='yes' , state='在发售' where id=:id";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindParam('id', $id);
    $stmt->execute();
    return $stmt->rowCount() > 0;

}

    public function xiajia($id){
        $sql = "update adressfromsj set PUTWAY='no'  where id=:id";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('id', $id);
        $stmt->execute();
        return $stmt->rowCount() > 0;

    }

    public function xiugais($id){

        $sql="select * from adressfromsj  where id=:id";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('id', $id);
        $stmt->execute();
        return $stmt->fetchAll();

    }
    public function xiugai($params){

$sql="update adressfromsj set  PINPAI=:pinpai, PINLEI=:pinlei, YANSE=:yanse, NEICUN=:neicun, JIAGE=:jiage where id=:id";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('id',$params['id']);
        $stmt->bindValue('pinpai', $params['pinpai']);
        $stmt->bindValue('pinlei', $params['pinlei']);
        $stmt->bindValue('yanse', $params['yanse']);
        $stmt->bindValue('neicun', $params['neicun']);
        $stmt->bindValue('jiage',$params['jiage']);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
    public function buy(){


        $sql="select * from adressfromsj  where putway='yes'";
        $stmt = $this->_db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    public function buyshouji($mertype){
        $sql="select * from adressfromsj  where pinlei=:pinlei and putway='yes' and state='在发售' order by id";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('pinlei',$mertype);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    public function shangpinstate($id){

        $sql = "update adressfromsj set STATE='已购买' where id=:id";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('id', $id);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
public function buybaocun($params){
    $sql="insert into ADRESSFROMYH (ID, JIAGE, CONTACTS, CONTACTWAY, DETAILADDRESS, STATE,SHIJIAN) values (:ids,:jiage,:contacts,:contactWay,:detailaddress,:state,sysdate)";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindValue('ids',$params['ids']);
    $stmt->bindValue('jiage', $params['jiage']);
    $stmt->bindValue('contacts', $params['contacts']);
    $stmt->bindValue('contactWay', $params['contactWay']);
    $stmt->bindValue('detailaddress', $params['detailaddress']);
    $stmt->bindValue('state',$params['state'] );
    $stmt->execute();
    return $stmt->rowCount() > 0;

}
public function buybaocuns($ids){
    $sql = "update adressfromsj set STATE='已卖出' where id=:id";
    $stmt = $this->_db->prepare($sql);
    $stmt->bindParam('id', $ids);
    $stmt->execute();
    return $stmt->rowCount() > 0;

}
public function seeorder(){

$sql="select to_char(k.shijian, 'yyyy-mm-dd hh24:mi') shijian,p.id,p.pinpai,p.image,p.jiage,k.state from adressfromsj p left join adressfromyh k  on p.id=k.id where k.state='已购买' order by p.id";
$stmt=$this->_db->prepare($sql);
$stmt->execute();
return $stmt->fetchAll();
}

public function seeordersAction($id){
    $sql="select to_char(k.shijian, 'yyyy-mm-dd hh24:mi') shijian ,p.*，k.CONTACTS,k.CONTACTWAY,k.DETAILADDRESS
          from adressfromsj p left join adressfromyh k  
          on p.id=k.id where k.state='已购买' and p.id=:id order by p.id";
    $stmt=$this->_db->prepare($sql);
    $stmt->bindParam('id', $id);
    $stmt->execute();
    return $stmt->fetchAll();

}
    public function shanchuorder($id){
    $sql="delete from adressfromyh where id=:id ";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('id', $id);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
