<?php
require_once 'base/HKBaseMapper.php';

/**
 * 功能描述:器材信息Mapper
 * @package
 * @subpackage
 * @module
 * @createdate   2013-6-4
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyright  2013 上海翼思信息科技有限公司 版权所有
 */

class Common_Model_ProductMapper extends HKBaseMapper{

    /**
     * 根据商品分类，获取品牌列表
     */
    public function getBrandsList($merType){
        if($merType){
            $sql = "select * from pinpai p where pcode!='p0273' and p.mertype=:merType order by seq";
            $stmt = $this->_db->prepare($sql);
            $stmt->bindValue('merType', $merType);
            $stmt->execute();
            return $stmt->fetchAll();
        }
        return null;
    }

    /**
     * 功能描述：根据品牌Code，获取品牌信息
     */
    public function findBrandInfoByCode($pcode){
        $sql = "select * from pinpai where pcode!='p0273' and pcode=:pcode";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('pcode', $pcode);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 功能描述：根据商品ID，获取商品信息
     */
    public function getSimpleMerInfo($merId){
        $sql = "select * from ydm_view_recycmers t where t.merid =:merId";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('merId', $merId);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 功能描述：分页条件搜索
     */
    public function merPageList($params){
        $paramsSql = "";
        $paramsArr = array();
        //器材名称
        if(isset($params['keyword']) && $params['keyword']){
            $keywords = $params['keyword'];
            $keywordsList = array();
            if($keywords){
                $keywordsList = explode(" ", $keywords);
            }
            if($keywordsList && sizeof($keywordsList) > 0){
                for($i = 0; $i < sizeof($keywordsList); $i++){
                    $key = ":key".$i;
                    $paramsSql.=" and instr(lower(keywords), lower(".$key.")) > 0";
                    $paramsArr[$key] = $keywordsList[$i];
                }
            }
        }

        //品牌
        if(isset($params['brandCode']) && $params['brandCode']){
            $paramsSql .= " and pcode = :pcode ";
            $paramsArr['pcode'] = $params['brandCode'];
        }

        //分类
        if($params['merType']){
            $paramsSql .= " and mertype = :merType ";
            $paramsArr['merType'] = $params['merType'];
        }else{
            $category = $params['category'];
            $categorySql = $this->getCategorySql($category);
            $paramsSql .= " and mertype in (".$categorySql.") ";
        }
        $sql = "select t1.* from (
                  select rownum r, t.* from (
                    select merid, mername, mertype, pname, merimg, redu from ydm_view_recycmers
                    where pcode!='p0273' ".$paramsSql." order by redu desc
                  ) t
                ) t1 where t1.r >".$params['start']." and t1.r<=".$params['end'];

        $stmt = $this->_db->prepare($sql);
        foreach($paramsArr as $k=>$v){
            $stmt->bindValue($k, $v);
        }
        $stmt->execute();
        $list = $stmt->fetchAll();
        return array('totalCount'=>$this->totalCount($paramsSql, $paramsArr), 'result'=>$list);
    }

    /**
     * 功能描述：笔记本总数
     */
    private function totalCount($paramsSql, $paramsArr){
        $sql = " select count(merid) as counts from ydm_view_recycmers where pcode!='p0273' ".$paramsSql;
        $stmt = $this->_db->prepare($sql);
        foreach($paramsArr as $k=>$v){
            $stmt->bindValue($k, $v);
        }
        $stmt->execute();
        $result = $stmt->fetch();
        return empty($result) ? 0 : $result['COUNTS'];
    }

    /**
     * 品类SQL整理
     */
    private function getCategorySql($category){
        $merTypeSql = "";
        if($category){
            if(isset(EnumType::$categorys2MerTypes[$category])){
                $merTypes = EnumType::$categorys2MerTypes[$category];
                foreach($merTypes as $k=>$v){
                    $merTypeSql .= "'".$k."',";
                }
            }
        }
        return $merTypeSql."'0' ";
    }

    /**
     * 功能描述：品类筛选统计
     */
    public function categorySearch($keywords, $category){
        $keywordsList = array();
        if($keywords){
            $keywordsList = explode(" ", $keywords);
        }
        $categorySql = $this->getCategorySql($category);

        $paramSql = "";

        $paramsArr = array();
        if($keywordsList && sizeof($keywordsList) > 0){
            for($i = 0; $i < sizeof($keywordsList); $i++){
                $paramSql .= " and instr(lower(keywords), lower(:key".$i.")) > 0";
                $paramsArr['key'.$i] = $keywordsList[$i];
            }
        }
        $sql = "select mertype, count(mertype) as count from ydm_view_recycmers where pcode!='p0273' and mertype in ".$paramSql;
        $sqk .= " group by mertype order by mertype";
        $stmt = $this->_db->prepare($sql);
        foreach($paramsArr as $k=>$v){
            $stmt->bindValue($k, $v);
        }
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：根据计算规则IDS获取规则信息
     */
    public function getGuizeByDetailIds($detailIds){

        $ids = "";
        $paramsArr = array();
        $size = sizeof($detailIds);
        if($size > 0){
            for($i = 0; $i < $size; $i++){
                $key = 'key'.$i;
                $ids .= ":$key, ";
                $paramsArr[$key] = $detailIds[$i];
            }
        }

        $sql = "select t2.xh, t2.guizelxid, t2.guizename, t1.gzname from jisuangz t1 left join guizelx t2 on t1.guizelx = t2.guizelxid
                where t1.jisuangzid in ( ".$ids." '0') order by t2.xh, t1.xh";

        $stmt = $this->_db->prepare($sql);
        foreach($paramsArr as $k=>$v){
            $stmt->bindValue($k, $v);
        }

        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：获取笔记本电脑型号
     */
    public function notebookTypesFilter($merId, $attrIds){
        $paramsSql = "";
        $paramsArr = array();
        $size = sizeof($attrIds);
        if($attrIds && $size > 0){

            for($i = 0; $i < $size; $i++){
                $key = 'key'.$i;
                $paramsArr[$key] = $attrIds[$i];
                $paramsSql .= " and attrstext like :".$key;
            }
        }

        $sql = "select type_id as k, attrstext as v from notebooks_types ";
        $sql .= "where attrstext is not null ".$paramsSql." and merId = :seriesMerId";

        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('seriesMerId', $merId);

        foreach($paramsArr as $k=>$v){
            $stmt->bindValue($k, '%'.$v.'%');
        }

        $stmt->execute();
        $types = $stmt->fetchAll();

        $attrIds = '';
        if(sizeof($types) > 0){
            foreach($types as $pro){
                $attrIds .= $pro['V'].',';
            }
            $attrs = $this->getNotebookAttrsByIds($attrIds.'0');
            return Array('attrs'=>$attrs, 'types'=>$types);
        }
        return null;
    }

    /**
     * 功能描述：根据笔记本属性ids获取所有属性信息
     */
    private function getNotebookAttrsByIds($attrIds){

        //删除重复项
        $thisAttrIds = explode(',', $attrIds);
        $ids = array();
        //删除重复项
        foreach($thisAttrIds as $k){
            $ids[$k.'-'] = $k;
        }
        $strIds = '';
        foreach($ids as $k => $v){
            $strIds .= $v.',';
        }
        $strIds .= '0';
        $sql = "select attrid as id, attrname as name, attrtype from notebooks_attrs ";
        $sql .= "where usable = 'Y' and attrid in ($strIds) order by attrtype, attrname";
        $stmt = $this->_db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：获取笔记本型号
     */
    public function getNotebookType($merId, $typeId){
        $sql = "select t2.*, t1.type_id, t1.typename, attrstext from notebooks_types t1 left join notebooks t2 on t1.merid = t2.merid
                where t1.merid = :merId and t1.type_id = :typeId";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('merId', $merId);
        $stmt->bindValue('typeId', $typeId);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 功能描述：动态搜索框数据接口，根据热度排序
     */
    public function merSearchList($keywords, $brandCode, $merType, $category){
        $paramsArr = array();
        $keywordsList = array();
        if($keywords){
            $keywordsList = explode(" ", $keywords);
        }
        $instrSql = '';
        for($i = 0; $i < sizeof($keywordsList); $i++){
            $key = ':key'.$i;
            $instrSql.=" and instr(lower(keywords), lower($key)) > 0";
            $paramsArr[$key] = $keywordsList[$i];
        }
        if($brandCode){
            $instrSql .= " and pcode=:pcode ";
            $paramsArr['pcode'] = $brandCode;
        }

        //分类
        if($merType){
            $instrSql .= " and mertype=:merType ";
            $paramsArr['merType'] = $merType;
        }else{
            $categorySql = $this->getCategorySql($category);
            $instrSql .= " and mertype in (".$categorySql.") ";
        }
        $sql = "select t.* from (select merid, pname||' '||mername as value from ydm_view_recycmers where 1=1 ".$instrSql." order by redu desc) t where rownum <=6";

        $stmt = $this->_db->prepare($sql);
        foreach($paramsArr as $k=>$v){
            $stmt->bindValue($k, $v);
        }
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：根据线下商品ID获取线上商品ID
     * added by wangbo
     * added date 2018年1月2日
     */
    public function getOnMerId($merId){
        $sql = "select onmerid from ydm_recycle_mers where merid =:merId and mersource = '2'";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindValue('merId', $merId);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * 如果是笔记本，根据商品ID，获取闲鱼中的笔记本规则
     * @param unknown $merId
     */
    public function getNotebookRuleByMerId($merId){
        $sql = "select ruleid from ydm_recycle_mer_rule where merid=:merId";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('merId', $merId);
        $stmt->execute();
        $row = $stmt->fetch();
        if($row){
            return $row['RULEID'];
        }else{
            return null;
        }
    }

    /**
     * 根据商品id获取该商品下的规则
     */
    public function getGuizeBySslxId($sslxId){
        $sql = "select lx.guizelxid ruletypeid,lx.guizename ruletypename,lx.stype selectmode,lx.levels,gz.textdesc,
                  gz.jisuangzid ruledetailid,gz.gzname ruledetailname,gz.jisuanzhi deductval,gz.jisuanlx deducttype,gz.ext2
                from guizelx lx left join jisuangz gz on lx.guizelxid=gz.guizelx
                where lx.suoshulxid=:sslxId and lx.isdel!=1 and gz.isdel!=1 and gz.enableflag='Y'
                order by lx.levels, lx.xh, lx.typemodelid, gz.xh, gz.detailmodelid";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('sslxId', $sslxId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：根据所属规则ID，获取该规则下所有规则明细图文描述
     * added by weimingze
     * added date 2017年5月17日
     */
    public function getRuleDetailImgdesc($sslxId){
        $sql = "select jisuangz,imgpath,textdesc from recy_ruledetail_imgtext
                where suoshulx=:ruleId and enableflag='Y' order by seq";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('ruleId', $sslxId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * 功能描述：根据所属规则ID，获取该规则下所有规则图文描述
     * @auther qiujian
     * @date  2018-08-21
     */
    public function getRuleTypeImgdesc($ruleId){
        $sql = "select guizelx typeid, imgpath, textdesc from recy_ruledetail_imgtext
                where suoshulx=:ruleId and typeflag='Q' and enableflag='Y' order by seq";
        $stmt = $this->_db->prepare($sql);
        $stmt->bindParam('ruleId', $ruleId);
        $stmt->execute();
        return $stmt->fetchAll();
    }

}
