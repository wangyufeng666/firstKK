<?php

/**
 *
 * 功能描述：短信验证、图片验证 验证码控制器
 *
 * @package
 * @subpackage
 * @module
 * @createdate   2013-5-13
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class Common_SecuritycodeController extends Zend_Controller_Action {

    /**
     * 功能描述：
     */
    public function indexAction() {

    }

    /**
     * 功能列表：短信发送接口
     */
    public function sendverifycodeAction(){
        $this->_helper->viewRenderer->setNoRender(true);
        $messageSource = $this->getRequest()->getParam("messageSource", "");
        $messageType = $this->getRequest()->getParam("messageType", "");
        $flag = $this->getRequest()->getParam("flag", "");
        $source = $this->getRequest()->getParam("source", "");
        if($messageType == "phone"){
            if($this->sendVerifyShortMassage($messageSource, $flag, $source))
                $this->_helper->getHelper('Json')->sendJson("Y");
            else{
                $this->_helper->getHelper('Json')->sendJson("N");
            }
        }
    }

     /**
     * 功能列表：短信校验接口
     */
    public function checkverifycodeAction(){
        $this->_helper->viewRenderer->setNoRender(true);
        $verifyCode = $this->getRequest()->getParam("verifyCode", "");
        $messageType = $this->getRequest()->getParam("messageType", "");
        $type = $this->getRequest()->getParam("type", "");
        $authcodeSession = new Zend_Session_Namespace('authcodeSession');
        $reflag = false;
        if($type == 'pwd'){
            if($messageType != "email"){
                if($verifyCode == $authcodeSession->pwdVerifyMessage['code'])
                    $reflag = true;
            }else{
                if($verifyCode == $authcodeSession->pwdVerifyEmail['code'])
                    $reflag = true;
            }
        }else if($type == 'phone'){
            if($messageType != "email"){
                if($verifyCode == $authcodeSession->phoneVerifyMessage['code'])
                    $reflag = true;
            }else{
                if($verifyCode == $authcodeSession->phoneVerifyEmail['code'])
                    $reflag = true;
            }
        }else if($type == 'newEmail'){
            if($verifyCode == $authcodeSession->newEmailVerifyEmail['code'])
                $reflag = true;
        }else if($type == 'newPhone'){
            if($verifyCode == $authcodeSession->newPhoneVerifyMessage['code'])
                    $reflag = true;
        }else if($type == 'email'){
            if($messageType != "email"){
                if($verifyCode == $authcodeSession->emailVerifyMessage['code'])
                    $reflag = true;
            }else{
                if($verifyCode == $authcodeSession->emailVerifyEmail['code'])
                    $reflag = true;
            }
        }else if($type == 'reg'){
            if($verifyCode == $authcodeSession->regVerifyMessage['code'])
                $reflag = true;
        }else if($type == 'findPasswd'){
            if($messageType != "email"){
                if($verifyCode == $authcodeSession->findPasswdVerifyMessage['code'])
                    $reflag = true;
            }else{
                if($verifyCode == $authcodeSession->findPasswdVerifyEmail['code'])
                    $reflag = true;
            }
        }else if($type == 'order'){
            if($verifyCode == $authcodeSession->orderVerifyMessage['code'])
                $reflag = true;
        }
        $this->_helper->getHelper('Json')->sendJson($reflag);
    }

    /**
     * 功能描述：图片验证码
     */
    public function verifyimgAction(){

        header("Content-type:image/png");
        //生成4位随机字符串
        $authcodeSession = new Zend_Session_Namespace('authcodeSession');
        //先定义图片的长、宽
        $flag = $this->getRequest()->getParam('flag');
        $img_width = $this->getRequest()->getParam('h');
        $img_height = $this->getRequest()->getParam('w');
        $nmsg = CommonUtils::rand_string(4, 1);

        if($flag == 'ATLG'){//普通登录 auto login page
            $authcodeSession->at_login_imgCode = $nmsg;
        }

        $aimg = imagecreate($img_height, $img_width);//生成图片
        imagecolorallocate($aimg, 255, 255, 255);//图片底色，imagecolorallocate第1次定义颜色php就认为是底色了

        //生成雪花背景
        for($i = 1; $i <= 200; $i++){//先用200个做测试
            imagestring($aimg, 0, mt_rand(1,$img_height), mt_rand(1,$img_width), "*-|",
              imagecolorallocate($aimg, mt_rand(150,255), mt_rand(150,255), mt_rand(150,255)));
            //其实也不是雪花，就是生成＊号而已。为了使它们看起来"杂乱无章、5颜6色"，
            //就得在1个1个生成它们的时候，让它们的位置、颜色，甚至大小都用随机数，rand()或mt_rand都可以完成。
        }
        //生成随机数显示到图片。随机数1个1个地放，同时让他们的位置、大小、颜色都用成随机数
        //为了区别于背景，这里的颜色不超过200，上面的不小于200
        for($i = 0; $i < strlen($nmsg); $i++){
            imagestring($aimg, mt_rand(20,50),
              $i*$img_height/4+mt_rand(1,5),
              mt_rand(1,$img_width/2),
              $nmsg[$i],
              imagecolorallocate($aimg,mt_rand(0,100), mt_rand(0,150), mt_rand(0,150)));
        }
        imagepng($aimg);//生成png格式
        imagedestroy($aimg);//销毁图片
        die();
    }

    /**
     *功能描述：发送短信验证码
     */
    function sendVerifyShortMassage($phoneNum, $flag, $source){

        $code = '123456';
        if(SMSFLAG){
            $code = CommonUtils::rand_string(6, 1);
        }

        $authcodeSession = new Zend_Session_Namespace('authcodeSession');
        $phoneArray = Array("source"=>$phoneNum, "code"=>$code);
        switch($flag){
            case 'atlg'://默认登录
                $authcodeSession->smscode_at_login = $phoneArray;
                $authcodeSession->setExpirationSeconds(300, 'smscode_at_login');
                break;
            default:
                return false;
        }
        if(SMSFLAG){
            $partnerNmae = isset(EnumType::$orderPartners[$source]) ? EnumType::$orderPartners[$source] : '有得卖';
            $mes = "【".$partnerNmae."】 ".$code." (动态验证码)。请勿向任何人泄露（五分钟内有效）。欢迎使用有得卖服务";
            $response = SmsUtils::sendShortMessage($phoneNum, $mes);
            return true;
        }
        return true;
    }
}