<?php 
/**
 * 功能描述: 默认入口页面
 * 
 * @module   
 * @createdate   2013-8-27
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class IndexController extends Zend_Controller_Action{
    
    /**
     * 功能描述：入口页面
     */
    public function indexAction(){
        $companySession = new Zend_Session_Namespace('companySession');
        $companySession->companyCode = '';
    }
}