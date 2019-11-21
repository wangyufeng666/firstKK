<?php
require_once 'base/HKBaseMapper.php';

/**
 * 功能描述:品牌Mapper
 * @package
 * @subpackage
 * @module
 * @createdate   2013-6-4
 * @version   V1.0.0.1
 * @copyright  2013 上海翼思信息科技有限公司 版权所有
 */

class Common_Model_BrandMapper extends HKBaseMapper{

    /**
     * 根据品牌ID，获取品牌信息
     */
    public function getBrandInfoByCode($brandCode){
        $sql = "select * from pinpai p where pcode!='p0273' and p.pcode = :pcode";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('pcode', $brandCode);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function getBrands($merType){
        $sql = "select * from pinpai p where pcode!='p0273' and mertype = :merType order by p.seq";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('merType', $merType);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}