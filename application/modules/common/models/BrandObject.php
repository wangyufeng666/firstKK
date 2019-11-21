<?php
require_once 'base/HKBaseObject.php';  

/**
 * 功能描述: 品牌管理
 * 
 * @package    
 * @subpackage 
 * @module   
 * @createdate   2013-6-4
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class Common_Model_BrandObject extends HKBaseObject{
    
    /**
     * 根据品牌ID，获取品牌信息
     */
    public function getBrandInfoByCode($brandCode){
        return $this->getMapper()->getBrandInfoByCode($brandCode);
    }
    
    public function getBrands($merType){
        return $this->getMapper()->getBrands($merType);
    }
    
    public function getMapper(){
        if (null === $this->_mapper){
            $this->setMapper(new Common_Model_BrandMapper());
        }
        return $this->_mapper;
    }
}