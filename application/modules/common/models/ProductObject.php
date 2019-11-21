<?php
require_once 'base/HKBaseObject.php';
/**
 * 功能描述: 器材Object
 * @package
 * @subpackage
 * @module
 * @createdate   2013-6-4
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class Common_Model_ProductObject extends HKBaseObject{

    /**
     * 功能描述：根据商品分类，获取品牌列表
     */
    public function getBrandsList($merType){
        return $this->getMapper()->getBrandsList($merType);
    }

    /**
     * 功能描述：根据品牌Code，获取品牌信息
     */
    public function findBrandInfoByCode($pcode){
        return $this->getMapper()->findBrandInfoByCode($pcode);
    }

    /**
     * 根据器材ID，获取器材简单信息
     */
    public function getSimpleMerInfo($merId){
        $redis = new YDMRedis();
        $domain = RedisConstant::$K_RECYCLE;
        $key = RedisConstant::$SK_RECYCLE_MER.$merId;
        $merInfo = array();
        if(RedisConstant::enable()){
            $merInfo = $redis->getArray($domain, $key);
        }
        if($merInfo && 0){
            $this->redisLog($key, '1');
        }else{
            $this->redisLog($key, '2');
            $merInfo = $this->syncMerInfo($redis, $domain, $key, $merId);
        }
        return $merInfo;
    }

    /**
     * 功能描述：同步回收商品信息到redis
     * 【REDIS同步】 MerInfo
     */
    public function syncMerInfo($redis, $domain, $key, $merId){
        $merInfo = $this->getMapper()->getSimpleMerInfo($merId);
        if($merInfo){
            $img = SystemConstant::$NO_PICTURE;
            if($merInfo['MERIMG']){
                $img = '/nwimages/images/thumbs'.$merInfo['MERIMG'];
            }
            $merInfo['MERIMG'] = SystemConstant::$IMG_URL.$img;
            $newRuleId = '';
            if($merInfo['MERTYPE'] == 'L'){
                $newRuleId = $this->getNotebookRuleByMerId($merId);
            }
            $merInfo['NEWRULEID'] = $newRuleId;

            $expireTime = RedisConstant::getExpireTime(2, 0);//过期时间2天
            $this->saveDatasToRedis($redis, $domain, $key, $merInfo,$expireTime);
        }
        return $merInfo;
    }

    /**
     * 如果是笔记本，根据商品ID，获取闲鱼中的笔记本规则
     * @param unknown $merId
     */
    public function getNotebookRuleByMerId($merId){
        return $this->getMapper()->getNotebookRuleByMerId($merId);
    }

    /**
     * 根据器材id获取该器材所属规则未分级
     */
    public function getRuleBySslxId($sslxId){
        $redis = new YDMRedis();
        $domain = RedisConstant::$K_RECYCLE;
        $key = RedisConstant::$SK_RECYCLE_MERRULE.$sslxId;
        $ruleTypes = array();
        if(RedisConstant::enable()){
            $ruleTypes = $redis->getArray($domain, $key);
        }
        if($ruleTypes){
            $this->redisLog($key, '1');
        }else{
            $this->redisLog($key, '2');
            $ruleTypes = $this->syncUNLevelRuleType($redis, $domain, $key, $sslxId);
        }
        return $ruleTypes;
    }

    /**
     * 功能描述：同步未分级的商品规则到redis
     * 1、同步详细规则信息
     * 2、同步未分级处理后的商品规则信息
     * @auther weimingze
     * @date  2017年5月17日 上午5:01:53
     */
    public function syncUNLevelRuleType($redis, $domain, $key, $sslxId){
        $ruleDetails = $this->getRuleDetails($sslxId);
        if($ruleDetails){
            $ruleTypes = Array();
            //图文展示
            $imgList = $this->getRuleDetailImgdesc($sslxId);
            $TypeTextImgList = $this->getRuleTypeImgdesc($sslxId);

            foreach($ruleDetails as $k=>$detail){
                $details = array();
                $detailId = $k;
                $detailName = $detail['RULEDETAILNAME'];
                $selectModel = $detail['SELECTMODE'];

                $thisDetail = array('RULEDETAILID'=>$detailId, 'RULEDETAILNAME'=>$detailName, 'TEXTDESC'=>$detail['TEXTDESC']);
                $thisDetail['IMGS'] = isset($imgList[$detailId]) ? $imgList[$detailId] : array();

                $typeId = $detail['RULETYPEID'];
                if(isset($ruleTypes[$typeId])){
                    $details = $ruleTypes[$typeId]['DETAILS'];
                }
                array_push($details, $thisDetail);
                $ruleTypes[$typeId]['RULETYPEID'] = $typeId;
                $ruleTypes[$typeId]['RULETYPENAME'] = $detail['RULETYPENAME'];
                $ruleTypes[$typeId]['SELECTMODE'] = $selectModel;
                $ruleTypes[$typeId]['DETAILS'] = $details;
                $ruleTypes[$typeId]['TYPETEXTIMGLIST'] = isset($TypeTextImgList[$typeId]) ? $TypeTextImgList[$typeId] :'';
            }
            //保存未分级规则信息
            $expireTime = RedisConstant::getExpireTime(1, 0);//过期时间1天
            $this->saveDatasToRedis($redis, $domain, $key, $ruleTypes, $expireTime);
            return $ruleTypes;
        }else{
            return null;
        }
    }

    /**
     * 功能描述：根据规则所属ID，获取具体规则明细
     * @auther weimingze
     * @date  2017年5月18日 上午10:09:48
     */
    public function getRuleDetails($sslxId){
        $redis = YDMRedis::getRedis();
        $domain = RedisConstant::$K_RECYCLE;
        $key = RedisConstant::$SK_RECYCLE_MERRULE_DETAIL.$sslxId;
        $ruleDetails = array();
        if(RedisConstant::enable()){
            $ruleDetails = $redis->getArray($domain, $key);
        }
        if($ruleDetails){
            $this->redisLog($key, '1');
        }else{
            $this->redisLog($key, '2');
            $ruleDetails = $this->syncRuleDetails($redis, $domain, $key, $sslxId);
        }
        return $ruleDetails;
    }

    /**
     * 功能描述：获取规则明细
     * @auther weimingze
     * @date  2017年5月18日 上午9:22:59
     */
    public function syncRuleDetails($redis, $domain, $key, $sslxId){
        $ruleDetails = $this->getMapper()->getGuizeBySslxId($sslxId);
        if($ruleDetails){
            $detailsList = array();
            foreach($ruleDetails as $detail){
                $detailsList[$detail['RULEDETAILID']] = $detail;
            }
            //保存未分级规则信息
            $expireTime = RedisConstant::getExpireTime(1, 0);//过期时间1天
            $this->saveDatasToRedis($redis, $domain, $key, $detailsList, $expireTime);
            return $detailsList;
        }else{
            return null;
        }
    }

    /**
     * 功能描述：根据所属规则ID，获取该规则下所有规则明细图文描述
     * @auther weimingze
     * @date  2017年5月17日 下午4:36:30
     */
    public function getRuleDetailImgdesc($sslxId){
        $imgdescList = $this->getMapper()->getRuleDetailImgdesc($sslxId);
        $result = array();
        if($imgdescList){
            foreach($imgdescList as $obj){
                $k = $obj['JISUANGZ'];
                $imgs = array();
                if(isset($result[$k])){
                    $imgs = $result[$k];
                }
                array_push($imgs, $obj);
                $result[$k] = $imgs;
            }
        }
        return $result;
    }

    /**
     * 功能描述：根据所属规则ID，获取该规则下所有规则图文描述
     * @auther qiujian
     * @date  2018-08-21
     */
    public function getRuleTypeImgdesc($ruleId){
        $imgdescList = $this->getMapper()->getRuleTypeImgdesc($ruleId);
        $result = array();
        if($imgdescList){
            foreach($imgdescList as $obj){
                $k = $obj['TYPEID'];
                $imgs = array();
                if(isset($result[$k])){
                    $imgs = $result[$k];
                }
                array_push($imgs, $obj);
                $result[$k] = $imgs;
            }
        }
        return $result;
    }

    /**
     * 功能描述：根据计算规则IDS获取规则信息
     */
    public function getGuizeByDetailIds($detailIds){
        return $this->getMapper()->getGuizeByDetailIds($detailIds);
    }

    /**
     * 功能描述：序列化所选器材描述
     */
    public function serializableMerAttrs($detailIds){

        $guizeList = $this->getGuizeByDetailIds($detailIds);
        $arrays = array();
        foreach ($guizeList as $gz){
            $notExist = true;
            for($i = 0; $i < sizeof($arrays); $i++ ){
                if($arrays[$i]['id'] == $gz['GUIZELXID']){
                    $notExist = false;
                    $arrays[$i]['value'] = $arrays[$i]['value'].'、'.$gz['GZNAME'];
                    break;
                }
            }
            if($notExist){
                array_push($arrays, array('id'=>$gz['GUIZELXID'], 'key'=>$gz['GUIZENAME'], 'value'=>$gz['GZNAME']));
            }
        }

        $attrDescs = '';
        foreach($arrays as $arr){
            $attrDescs.=$arr['key'].':'.$arr['value'].';';
        }
        return $attrDescs;
    }

    /**
     * 功能描述：笔记本电脑型号筛选
     */
    public function notebookTypesFilter($merId, $attrIds){
        $result = $this->getMapper()->notebookTypesFilter($merId, $attrIds);
        if($result){
            $attrs = $result['attrs'];
            if($attrs){
                $subAttrs = array('1'=>array(), '2'=>array(), '3'=>array(), '4'=>array());
                $enumAttrs = EnumType::$notebookAttrs;
                foreach($attrs as $attr){
                    $attrType = $attr['ATTRTYPE'];
                    if(isset($enumAttrs[$attrType])){
                        unset($attr['ATTRTYPE']);
                        array_push($subAttrs[$attrType], $attr);
                    }
                }
                $newAttrs = array();

                $onlyOne = true;
                foreach($enumAttrs as $k=>$v){
                    $obj = new stdClass();;
                    $obj->id = $k;
                    $obj->attrs = $subAttrs[$k];
                    $obj->count = sizeof($subAttrs[$k]);
                    array_push($newAttrs, $obj);
                    if($obj->count > 1){
                        $onlyOne = false;
                    }
                }
            }
            $result['attrs'] = $newAttrs;

            if(sizeof($attrIds) != 4){
                if($onlyOne){

                }else{
                    $result['types'] = null;
                }
            }
        }
        return $result;
    }

    /**
     * 功能描述：获取笔记本型号
     */
    public function getNotebookType($spId, $typeId){
        return $this->getMapper()->getNotebookType($spId, $typeId);
    }

    /**
     * 功能描述：分页条件搜索
     */
    public function merPageList($params){
        return $this->getMapper()->merPageList($params);
    }

    /**
     * 功能描述：动态搜索框数据接口，根据热度排序
     */
    public function merSearchList($keywords, $brandCode, $merType, $category){
        return $this->getMapper()->merSearchList($keywords, $brandCode, $merType, $category);
    }

    /**
     * 功能描述：品类筛选统计
     */
    public function categorySearch($keywords, $category){
        return $this->getMapper()->categorySearch($keywords, $category);
    }

    /**
     * 功能描述：保存数据信息到redis
     */
    private function saveDatasToRedis($redis, $domain, $key, $datas, $expireTime = 3600){
        if($datas){
            $redis->saveArray($domain, $key, $datas);
            //设置过期时间
            return $redis->setExpire($domain, $key, $expireTime);
        }
    }

    /**
     * 功能描述：redis简短日志打印
     */
    private function redisLog($key, $n){
        if(RedisConstant::$REDIS_LOGFLAG){
            if($n == '1'){
                loger('get by redis：'.$key);
            }else{
                loger('get by database：'.$key);
            }
        }
    }

    /**
     * 功能描述：根据线下商品ID获取线上商品ID
     * added by wangbo
     * added date 2018年1月2日
     */
    public function getOnMerId($merId){
        return $this->getMapper()->getOnMerId($merId);
    }

    /**
     * @return Common_Model_ProductMapper
     */
    public function getMapper(){
        if (null === $this->_mapper) {
            $this->setMapper(new Common_Model_ProductMapper());
        }
        return $this->_mapper;
    }
}