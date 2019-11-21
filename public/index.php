<?php
// Define path to application directory
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__).'/../application'));

// Define application environment
defined('APPLICATION_ENV') || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(realpath(APPLICATION_PATH.'/../library'), get_include_path(),)));

/** Zend_Application */
require_once 'Zend/Application.php';

// Create application, bootstrap, and run
$application = new Zend_Application(APPLICATION_ENV, APPLICATION_PATH.'/configs/application.ini');
//注册插件
include 'base/waf.php';
include 'log/log.php';
include 'autoload/YdmSDK.php';

// defined('OFFWEB_ENV') || define('OFFWEB_ENV', 'PROD');//1:生产环境
// defined('OFFWEB_ENV') || define('OFFWEB_ENV', 'PREPROD');//2:预生产环境
// defined('OFFWEB_ENV') || define('OFFWEB_ENV', 'OUTTEST');//3:外网测试环境
// defined('OFFWEB_ENV') || define('OFFWEB_ENV', 'UATTEST');//4:内网测试环境
defined('OFFWEB_ENV') || define('OFFWEB_ENV', 'LOCALTEST');//5:本地测试环境

defined('IMG01_DOMAIN') || define('IMG01_DOMAIN', 'https://img01.youdemai.com');//4:图片服务器-01
defined('IMG_DOMAIN') || define('IMG_DOMAIN', 'https://images.youdemai.com');//4:图片服务器-01


$smsFlag = false;//短信开关
if(OFFWEB_ENV == 'PROD' || OFFWEB_ENV == 'PREPROD'){
    $smsFlag = true;
}

$version = '190901';
$webUrl = 'http://offline.youdemai.com';
if(OFFWEB_ENV == 'LOCALTEST'){//本地环境
    $version = time();
    $webUrl = 'http://offline.ydm.com';
}elseif(OFFWEB_ENV == 'UATTEST'){//内网测试环境
    $version = time();
    $webUrl = 'http://uat.offline.ydm.com';
}elseif(OFFWEB_ENV == 'UATTEST'){//外网测试环境
    $version = time();
    $webUrl = 'http://test.offline.ydm.com';
}elseif(OFFWEB_ENV == 'PREPROD'){//预生产环境
    $webUrl = 'http://pre.offline.youdemai.net';
}
defined('SMSFLAG') || define('SMSFLAG', $smsFlag);//短信开关
defined('WEBURL') || define('WEBURL', $webUrl);//网站地址
defined('v_js') || define('v_js', $version);
defined('v_css') || define('v_css', $version);

//虚拟静态重定向
//当前参数路径是否包换
//1、/detail-xxx.html /product/product/detail?id=xxx
//2、/acinit-xxx.html /products/product/acinit?id=xxx
//3、/nbinit-xxx.html /products/product/nbinit?id=xxx
//4、/nbdetail-xxx.html /products/product/nbdetail?id=xxx
$request_uri = $_SERVER['REQUEST_URI'];
$matchLinks = array('a'=>'detail', 'b'=>'acinit', 'c'=>'init', 'e'=>'nbinit', 'f'=>'nbdetail');
foreach($matchLinks as $k=>$v){
    $preg = '/^\/'.$v.'-(.*?)\.html/';
    preg_match($preg, $request_uri, $matched);//商品明细
    if(sizeof($matched) > 0){
        $_SERVER['REQUEST_URI'] = '/product/product/'.$v.'?id='.$matched[1];
        $_GET['id'] = $matched[1];
        break;
    }
}

//注册数据库连接
$resources = $application->getOption('resources');
defined('YDM_DBCONFIG') || define('YDM_DBCONFIG', json_encode($resources['db']));
$application->bootstrap()->run();