<?php
require_once 'base/HKBaseMapper.php';

/**
 * 功能描述:暴风TV以旧换新帮助说明
 * @package
 * @subpackage
 * @module
 * @createdate   2013-6-4
 * @version   V1.0.0.1
 * @copyright  2013 上海翼思信息科技有限公司 版权所有
 */
class Common_Model_HelpMapper extends HKBaseMapper{

    /**
     * 功能描述：获取地铁交易路线
     */
    public function getSubway($cityId){
        $sql = "select * from
             (select l.linename, s.stationname, a.area_name, to_number(s.stationid) stationid from ydm_property_subwaystation s left
             join ydm_property_subwayline l on l.lineid = s.lineid left join ydm_property_areas a on s.cityid = a.area_id
            where s.cityid = :cityId and s.isenable = 'Y' and l.isenable = 'Y') order by stationid";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('cityId', $cityId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

}