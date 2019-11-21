<?php
require_once 'base/HKBaseObject.php';


class Offlinem_Model_ProductObject extends HKBaseObject{
    
public function addCommodity($params){
    return $this->getMapper()->addCommodity($params);
}

public function lists(){
    return $this->getMapper()->lists();
}
public function deleteCommodity($id){
    return $this->getMapper()->deleteCommodity($id);
}
public function shangjia($id){

    return $this->getMapper()->shangjia($id);
}
    public function xiajia($id){

        return $this->getMapper()->xiajia($id);
    }
public function xiugais($id){
    return $this->getMapper()->xiugais($id);
}
public function xiugai($params){
    return $this->getMapper()->xiugai($params);
}
public function buy(){

    return $this->getMapper()->buy();
}

public function buyshouji($mertype){

    return $this->getMapper()->buyshouji($mertype);
}
public function shangpinstate($id){
    return $this->getMapper()->shangpinstate($id);
}
public function buybaocun($params){
    return $this->getMapper()->buybaocun($params);
}
public function buybaocuns($ids){
    return $this->getMapper()->buybaocuns($ids);
}
public function seeorder(){
    $result=$this->getMapper()->seeorder();
    return $result;
}
public function shanchuorder($id){
    return $this->getMapper()->shanchuorder($id);
}
public function seeordersAction($id){
    return $this->getMapper()->seeordersAction($id);
}
    /**
     * @return Offlinem_Model_ProductMapper
     */
    public function getMapper(){
        if (null === $this->_mapper) {
            $this->setMapper(new Offlinem_Model_ProductMapper());
        }
        return $this->_mapper;
    }
}