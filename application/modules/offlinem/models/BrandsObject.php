<?php

class Offlinem_Model_BrandsObject extends HKBaseObject{

public function phone($province,$multiple){
    $result= $this->getMapper()->phone($province,$multiple);
    return $result;
}
    public function phones($multiple){
        $result= $this->getMapper()->phones($multiple);
        return $result;
    }
    /**
     * @return Offlinem_Model_BrandsMapper
     */

    public function getMapper(){
        if (null === $this->_mapper){
            $this->setMapper(new Offlinem_Model_BrandsMapper());
        }
        return $this->_mapper;
    }

public function getGuizeBySslxIds($sslxId){

        return $this->getMapper()->getGuizeBySslxIds($sslxId);

}

public function getGuizeBySslxId($sslxId){
    $ruleDetails= $this->getMapper()->getGuizeBySslxId($sslxId);
    if($ruleDetails){
        $detailsList = array();
        foreach($ruleDetails as $detail){
            $detailsList[$detail['RULEDETAILID']] = $detail;
    } return $ruleDetails;
    }
    else{
        return null;
    }
}


    public function guizexias($sslxId){

        $guizexias= $this->getMapper()->guizexia($sslxId);

        if($guizexias){
            $ruleTypes = Array();
            foreach($guizexias as $k=>$detail) {
                $details = Array();
                $detailId = $k;
                $detailName = $detail['RULEDETAILNAME'];
                $selectModel = $detail['SELECTMODE'];

                $thisDetail = array('RULEDETAILID'=>$detailId, 'RULEDETAILNAME'=>$detailName, 'TEXTDESC'=>$detail['TEXTDESC']);
                $typeId = $detail['RULETYPEID'];
                if(isset($ruleTypes[$typeId])){
                    $details = $ruleTypes[$typeId]['DETAILS'];
                }
                array_push($details, $thisDetail);
                $ruleTypes[$typeId]['RULETYPEID'] = $typeId;
                $ruleTypes[$typeId]['SELECTMODE'] = $selectModel;
                $ruleTypes[$typeId]['RULETYPENAME'] = $detail['RULETYPENAME'];
                $ruleTypes[$typeId]['DETAILS'] = $details;
                $ruleTypes[$typeId]['TYPETEXTIMGLIST'] = '';
            }
            return $ruleTypes;
        }
    }

public function getMerId($sslxId){
    return $this->getMapper()->getMerId($sslxId);
}
    public function getMerIds(){
        return $this->getMapper()->getMerId();
    }
    public function chazhao($names,$password){
        return $this->getMapper()->chazhao($names,$password);
    }
    public function chazhaoname($names){
        return $this->getMapper()->chazhaoname($names);
    }
    public function changimage($filed,$names){
        return $this->getMapper()->changimage($filed,$names);
    }
    public function jiancha($filed) {

        return $this->getMapper()->jiancha($filed) ;
    }
}