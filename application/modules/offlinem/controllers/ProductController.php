<?php


class Offlinem_ProductController extends Zend_Controller_Action {


    public function indexAction(){

    }



public function orderAction(){
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
            echo '上传失败';

        }
        $filed = '/' . date('Y-m-d') . "/" . $file_name;

        $this->view->image=$filed;
            echo '上传成功';

        }

    }

public function ordersAction(){
    $id=$this->getRequest()->getParam('id','');
    $pinpai=$this->getRequest()->getParam('pinpai','');
    $pinlei=$this->getRequest()->getParam('pinlei','');
    $yanse=$this->getRequest()->getParam('yanse','');
    $neicun=$this->getRequest()->getParam('neicun','');
    $image=$this->getRequest()->getParam('image','');
    $jiage=$this->getRequest()->getParam('jiage','');
    $params=array('id'=>$id,'pinlei'=>$pinlei,'pinpai'=>$pinpai,'yanse'=>$yanse,'neicun'=>$neicun,'image'=>$image,'jiage'=>$jiage,'putway'=>'no');
$obj=new Offlinem_Model_ProductObject();
$list=$obj->addCommodity($params);
    if($list){
        $this->_helper->getHelper('Json')->sendJson('Y');
    }else{
        $this->_helper->getHelper('Json')->sendJson('失败');
    }
}

public function xiangqingAction(){
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->lists();
$this->view->list=$list;
}
public function deleteAction(){
    $id=$this->getRequest()->getParam('id','');
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->deleteCommodity($id);
    if($list){
        $this->_helper->getHelper('Json')->sendJson('Y');
    }else{
        $this->_helper->getHelper('Json')->sendJson('失败');
    }
}
public function shangjiaAction(){
    $id=$this->getRequest()->getParam('id','');
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->shangjia($id);
    if($list){
        $this->_helper->getHelper('Json')->sendJson('Y');
    }

}

    public function xiajiaAction(){
        $id=$this->getRequest()->getParam('id','');
        $obj=new Offlinem_Model_ProductObject();
        $list=$obj->xiajia($id);
        if($list){
            $this->_helper->getHelper('Json')->sendJson('Y');
        }

    }
public function xiugaisAction(){
    $id=$this->getRequest()->getParam('id','');
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->xiugais($id);
    $this->view->list=$list;

}
public function xiugaiAction(){

    $id=$this->getRequest()->getParam('id','');
    $pinpai=$this->getRequest()->getParam('pinpai','');
    $pinlei=$this->getRequest()->getParam('pinlei','');
    $yanse=$this->getRequest()->getParam('yanse','');
    $neicun=$this->getRequest()->getParam('neicun','');
    $jiage=$this->getRequest()->getParam('jiage','');
    $params=array('id'=>$id,'pinlei'=>$pinlei,'pinpai'=>$pinpai,'yanse'=>$yanse,'neicun'=>$neicun,'jiage'=>$jiage);
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->xiugai($params);
    if($list){
        $this->_helper->getHelper('Json')->sendJson('Y');
    }else{
        $this->_helper->getHelper('Json')->sendJson('失败');
    }

}
public function buyAction(){
    $id=$this->getRequest()->getParam('id','');
    $mertype=$this->getRequest()->getParam('mertype','');
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->xiugais($id);
    $this->view->list=$list;
    $this->view->mertype=$mertype;

}

public function shoujiAction(){
    $mertype=$this->getRequest()->getParam('mertype','');
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->buyshouji($mertype);
    $this->view->mertype=$mertype;
    $this->view->list=$list;
}


public function dizhiAction(){
    $id=$this->getRequest()->getParam('ids','');
    $obj=new Offlinem_Model_FenxiangObject();
    $list=$obj->lists();
    $this->view->list=$list['result'];
    $this->view->idname=$id;

}
public function buysAction(){
    $id=$this->getRequest()->getParam('id','');
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->seeordersAction($id);
    foreach ($list as $k=>$v){
        $jiages=$v['JIAGE'];
    }
    $this->view->jiage=$jiages;
    $this->view->ids=$id;
}
public function buybaocunAction(){

    $jiage=$this->getRequest()->getParam('jiage','');
    $contacts=$this->getRequest()->getParam('contacts','');
    $contactWay=$this->getRequest()->getParam('contactWay','');
    $detailaddress=$this->getRequest()->getParam('detailaddress','');
    $ids=$this->getRequest()->getParam('ids','');
    $params=array('jiage'=>$jiage,'contacts'=>$contacts,'contactWay'=>$contactWay,'detailaddress'=>$detailaddress,'ids'=>$ids,'state'=>'已购买');
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->buybaocun($params);//保存订单
    $lists=$obj->buybaocuns($ids);
}
public function seeorderAction(){
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->seeorder();
    $this->view->list=$list;
}


public function seeordersAction(){
    $id=$this->getRequest()->getParam('id','');
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->seeordersAction($id);
    $this->view->list=$list;
}
public function ordercancelAction(){
    $id=$this->getRequest()->getParam('id','');
    $this->view->id=$id;
}
public function ordercancelsAction(){
    $id=$this->getRequest()->getParam('orderNo','');
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->shanchuorder($id);
    $lists=$obj->shangjia($id);
    if($list){
        $this->_helper->getHelper('Json')->sendJson('Y');
    }else{
        $this->_helper->getHelper('Json')->sendJson('失败');
    }
}
public function xiangqingsAction(){
    $id=$this->getRequest()->getParam('id','');loger($id);
    $obj=new Offlinem_Model_ProductObject();
    $list=$obj->seeordersAction($id);
    $this->view->list=$list;

}


    }

