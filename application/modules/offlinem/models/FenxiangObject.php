<?php

class Offlinem_Model_FenxiangObject extends HKBaseObject {
    public function getProvince(){
        return $this->getMapper()->getProvince();
    }
public function getCityByProvinceID($provinceid){

    return $this->getMapper()->getCityByProvinceID($provinceid);
}
public function getFrom($params){

    return $this->getMapper()->getFrom($params);

}
public function delete($name){

        return $this->getMapper()->delete($name);
}


public function getId($res){

        return $this->getMapper()->getId($res);
}
public function edit($nameq){


   $result=$this->getMapper()->edit($nameq);
   return $result;
}
public function name(){
   return     $this->getMapper()->name();
}
    public function dizhi(){
        return     $this->getMapper()->dizhi();
    }
public function lists(){

    $result=$this->getMapper()->lists();
    return $result;

}
public function listdizhi($nameq){
        return $this->getMapper()->listdizhi($nameq);
}
public function chazhaoname($names){
        return $this->getMapper()->chazhaoname($names);
}

public function upudit($params){
        return $this->getMapper()->upudit($params);
}


    /**
     * @return Offlinem_Model_FenxiangMapper
     */
    public function getMapper(){
        if (null === $this->_mapper) {
            $this->setMapper(new Offlinem_Model_FenxiangMapper());
        }
        return $this->_mapper;
    }
}