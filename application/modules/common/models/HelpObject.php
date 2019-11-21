<?php
require_once 'base/HKBaseObject.php';  

/**
 * 功能描述: 暴风TV以旧换新帮助说明
 * 
 * @package    
 * @subpackage 
 * @module   
 * @createdate   2013-6-4
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class Common_Model_HelpObject extends HKBaseObject{
    
    /**
     * 功能描述：获取地铁交易路线
     */
    public function getSubway($cityId){
        $result = $this->getMapper()->getSubway($cityId);
        $subway= array();
        if(sizeof($result) > 0){
            foreach($result as $item){
                $subwayDetail = array();
                $subwayDetail['STATIONNAME'] = $item['STATIONNAME'];
                $lineName = $item['LINENAME'];
                if(isset($subway[$lineName])){
                    $items = $subway[$lineName]['STATIONNAMES'];
                }else{
                    $items = array();
                }
                array_push($items, $subwayDetail);
                $subway[$lineName]['LINENAME'] = $lineName;
                $subway[$lineName]['STATIONNAMES'] = $items;
            }
        }
        return $subway;
    }
    /**
     * getMapper()
     */
    public function getMapper(){
        if (null === $this->_mapper){
            $this->setMapper(new Common_Model_HelpMapper());
        }
        return $this->_mapper;
    }
}