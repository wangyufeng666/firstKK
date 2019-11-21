<?php

class Offlinem_FenxiangController extends Zend_Controller_Action {


    public function indexAction(){
    $obj=  new Offlinem_Model_FenxiangObject();
       $province= $obj->getProvince();
       $this->view->province=$province;
    }
    public function listsAction(){

$obj=new Offlinem_Model_FenxiangObject();
$list=$obj->lists();

$this->view->list=$list['result'];
    }


    public function listAction(){
        $telnumber=$this->getRequest()->getParam('telnumber','');
        $ids=$this->getRequest()->getParam('ids','');
        $name=$this->getRequest()->getParam('nameq','');
        $province=$this->getRequest()->getParam('province','');
        $city=$this->getRequest()->getParam('city','');
        $dizhi=$this->getRequest()->getParam('dizhi','');
        $params=array('name'=>$name,'province'=>$province,'city'=>$city,'dizhi'=>$dizhi,'telnumber'=>$telnumber,'ids'=>$ids);
        $obj = new Offlinem_Model_FenxiangObject();
        $result =  $obj->getFrom($params);
        if($result){
            $this->_helper->getHelper('Json')->sendJson('Y');
        }else{
            $this->_helper->getHelper('Json')->sendJson('保存失败');
        }
    }
    public function getcitybyprovinceidAction(){
        $provinceid = $this->getRequest()->getparam("provinceid", "");
        if(isset($provinceid) && $provinceid) {
            $obj = new Offlinem_Model_FenxiangObject();
          $res = $obj->getCityByProvinceID($provinceid);
          foreach($res as $k){
             $resq=$k['AREA_ID'];}
             $ress=$obj->getId($resq); $this->_helper->getHelper('Json')->sendJson($ress);


        }
    }

    public function deleteAction(){

        $name=$this->getRequest()->getParam('nameq','');
        $obj = new Offlinem_Model_FenxiangObject();
        $result =  $obj->delete($name);
        if($result){
            $this->_helper->getHelper('Json')->sendJson('Y');
        }else{
            $this->_helper->getHelper('Json')->sendJson('保存失败');
        }
    }
public function editAction(){
    $nameq=$this->getRequest()->getParam('nameqq','');

    $obj = new Offlinem_Model_FenxiangObject();
    $province= $obj->getProvince();
    $this->view->province=$province;
    $list =  $obj->edit($nameq);
    $this->view->list=$list;

}
public function upuditAction(){
$ids=$this->getRequest()->getParam('ids','');
    $telnumber=$this->getRequest()->getParam('telnumber','');
    $name=$this->getRequest()->getParam('nameq','');
    $province=$this->getRequest()->getParam('province','');
    $city=$this->getRequest()->getParam('city','');
    $dizhi=$this->getRequest()->getParam('dizhi','');
    $params=array('name'=>$name,'province'=>$province,'city'=>$city,'dizhi'=>$dizhi,'ids'=>$ids,'telnumber'=>$telnumber);
    $obj = new Offlinem_Model_FenxiangObject();
    $result =  $obj->upudit($params);
    if($result){
        $this->_helper->getHelper('Json')->sendJson('Y');
    }else{
        $this->_helper->getHelper('Json')->sendJson('保存失败');
    }
}
public function fenxiangsAction()
{
    $obj = new Offlinem_Model_FenxiangObject();
    $list = $obj->lists();
    $name=$obj->name();
  $dizhi=$obj->dizhi();
    $lists = $list['result'];;






        $guizeList=array(
            array(
                'RULETYPEID' => '1',
                'RULETYPENAME' => '姓名',
                'SELECTMODE' => 'R',
                'TEXTDESC' => '',
             'DETAILS' =>$name
// array(
//                    array('RULEDETAILNAME' => '1', 'RULEDETAILID' => '1', 'IMGS' => '' )
//
//                )
            ),
            array(
                'RULETYPEID' => '1',
                'RULETYPENAME' => '省份',
                'SELECTMODE' => 'R',
                'TEXTDESC' => '',
                'DETAILS' =>$dizhi
//                    array(
//
//
//                    array('RULEDETAILNAME' => '2', 'RULEDETAILID' => '1', 'IMGS' => array()),
//                )

            )

        );

        $spId = '3CC0653E9D937379E050840A65080F89';
        $typeId = '1';
        $sslxId = '1';

        $merInfo = array(
            'MERTYPE' => '11',
            'PNAME' => '12',
            'MERNAME' => '13'


        );
        $this->view->spId = $spId;
        $this->view->typeId = $typeId;
        $this->view->sslxId = $sslxId;
        $this->view->merInfo = $merInfo;
        $this->view->guizeList = $guizeList;



    }























        }