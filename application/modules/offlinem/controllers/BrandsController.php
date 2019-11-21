<?php

class Offlinem_BrandsController extends Zend_Controller_Action{



public function indexAction(){
    $sslxId=$this->getRequest()->getParam('sslxId','');;
    if(isset($sslxId)){
    $obj=new Offlinem_Model_BrandsObject();
    $guizea=$obj-> getGuizeBySslxIds($sslxId);
    $merTypes = EnumType::$merTypes;
$pinlei=array('J'=>'手机','K'=>'电脑');
$this->view->pinlei=$pinlei;
    $this->view->sslxId=$sslxId;

if(isset($sslxId)) {
    $obj = new Offlinem_Model_BrandsObject();
    $guizeList = $obj->getGuizeBySslxId($sslxId);

    $this->view->sslxId = $sslxId;
    $this->view->guizeList = $guizeList;
    $this->view->guizea = $guizea;
}
}
    }



public function indexsAction(){
    $multiple=$this->getRequest()->getParam('provinceid','');
   $obj=new Offlinem_Model_BrandsObject();
    $phones=$obj->phones($multiple);
  $this->_helper->getHelper('Json')->sendJson($phones);

}

public function indexssAction(){
    $province=$this->getRequest()->getParam('province','');
    $multiple=$this->getRequest()->getParam('provinceid','');
 $merTypes = EnumType::$merTypes;
   $multiple = $merTypes[$multiple];
    $obj=new Offlinem_Model_BrandsObject();
    $phone=$obj->phone($province,$multiple);
   $this->_helper->getHelper('Json')->sendJson($phone);
}

public function indesAction(){
    $sslxId=$this->getRequest()->getParam('sslxId','');
    $obj=new Offlinem_Model_BrandsObject();
   $guize=$obj-> getGuizeBySslxIds($sslxId);
    $guizexias=$obj->guizexias($sslxId);
$this->view->target=$guizexias;
    $this->view->guizess=$guize;


}

public function indessAction(){
    $sslxId=$this->getRequest()->getParam('sslxId','');
    $obj=new Offlinem_Model_BrandsObject();
    $merId=$obj->getMerId($sslxId);
    foreach ($merId as $k=>$v){
$spId=$v;

    }
//    $guizexias=$obj->guizexias($sslxId);
//    if(isset($guizexias)){
//        $this->view->spId = $spId;
//    $this->view->sslxId = $sslxId;
//    $this->view->guizeList = $guizexias;
//    }
//    $spId = $this->getRequest()->getParam('sslxId', '');
    $typeId = $this->getRequest()->getParam('typeId', '');//笔记本标记
    $merInfo = $this->getMerInfoByRedis($spId);
    if($merInfo){
        $merType = $merInfo['MERTYPE'];
//        $sslxId = $merInfo['SSLXID'];

        if($merType == 'L'){
            if(isset($merInfo['NEWRULEID'])){
                $sslxId = $merInfo['NEWRULEID'];
            }elseif(empty($typeId)){
                $redirectUrl = '/offlinem/inquiry/nbinit?spid='.$spId;
                $this->getResponse()->setRedirect($redirectUrl);
                return;
            }
        }

        $productObj = new Common_Model_ProductObject();
        $guizeList = $productObj->getRuleBySslxId($sslxId);

        $this->view->spId = $spId;
        $this->view->typeId = $typeId;
        $this->view->sslxId = $sslxId;
        $this->view->merInfo = $merInfo;
loger($guizeList);
        $this->view->guizeList = $guizeList;


}

}
    private function getMerInfoByRedis($merId){
        $productObj = new Common_Model_ProductObject();
        $merInfo = $productObj->getSimpleMerInfo($merId);

        if($merInfo && $merInfo['ENABLED'] == 'Y'){
            return $merInfo;
        }else{
            return null;
        }
    }
public function getMerIdsAction(){
    $obj=new Offlinem_Model_BrandsObject();
    $merId=$obj->getMerIds();
    $this->_helper->getHelper('Json')->sendJson($merId);
}
public function tabindexsAction(){
    $tabindex=$this->getRequest()->getParam('tabindex','');


    $tabindexs=array('0'=>'<img class="mer_img" src="https://images.youdemai.com/nwimages/images/thumbs//mobilephone/apple/iphone6_g/front.jpg" />',
        '1'=>'iPhone 6',
        '2'=>'<img class="mer_img" src="https://images.youdemai.com/nwimages/images/thumbs//mobilephone/apple/iphone7/front.jpg" />',
        '3'=>'iPhone 7',
        '4'=>'<img class="mer_img" src="https://images.youdemai.com/nwimages/images/thumbs//mobilephone/apple/iphone7plus/front.jpg" />',
        '5'=>'iPhone 8',
        );



}
public function indexcAction(){
    $names=$this->getRequest()->getParam('names','');
    $password=$this->getRequest()->getParam('password','');
    $obj=new Offlinem_Model_BrandsObject();
    $lists=$obj->chazhao($names,$password);
//    $obj=new Offlinem_Model_FenxiangObject();
//    $list=$obj->chazhaoname($names);
    if($lists) {
        $this->_helper->getHelper('Json')->sendJson('Y');
        $this->getResponse()->setRedirect('/offlinem/brands/indexw?names=' . $names);

    }
    else{
        $this->_helper->getHelper('Json')->sendJson('N');
    }
}
public function indexwAction(){

    $names=$this->getRequest()->getParam('names','王禹枫');
    $objs=new Offlinem_Model_BrandsObject();
    $lists=$objs->chazhaoname($names);
    foreach ($lists as $k=>$value){
        $image=$value['IMGS'];
        $contactWays=$value['CONTACTWAY'];
    }
    $obj=new Offlinem_Model_FenxiangObject();
    $list=$obj->chazhaoname($names);



    foreach ($list as $k=>$v)
    {
        $contactWay=$v['TELNUMBER'];

    }
    $this->view->contactWay=$contactWays;
$this->view->image=$image;
$this->view->namess=$names;

}

public function personAction()
{
    $names = $this->getRequest()->getParam('names');
    $obj = new Offlinem_Model_FenxiangObject();
    $list = $obj->chazhaoname($names);
    $objs = new Offlinem_Model_BrandsObject();
    $lists = $objs->chazhaoname($names);
    foreach ($lists as $k => $value) {
        $image = $value['IMGS'];

    }


    $this->view->image = $image;
    $this->view->list = $list;
    $file = new Zend_File_Transfer_Adapter_Http();
    if ($file->isUploaded()) { //是否有文件上传
        $path = date('Y-m-d') . '/'; //保存路径
        $save_dir = $path;
        $folder = new Zend_Search_Lucene_Storage_Directory_Filesystem($save_dir); //如果文件夹不存在，则创建
        $file_name = $file->getFileName(null, false); //获取上传文件名

        $file->addFilter('Rename', array('target' => $save_dir . $file_name)); //重新命名
        $file->setDestination($save_dir); //保存路径
        $file->addValidator('Extension', FALSE, array('jpg', 'gif', 'png', 'jpeg')); //扩展名验证
        if (!$file->receive()) { //执行上传
            echo 'upload file error';

        }

        $filed = '/' . date('Y-m-d') . "/" . $file_name;
        if ($objs->jiancha($filed)) {
            echo '图片重复';
        } else {

            $img = $objs->changimage($filed, $names);
            echo '修改成功';
        }
    }
}

}