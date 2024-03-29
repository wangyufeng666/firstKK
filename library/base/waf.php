<?php
/**
 *云体检通用漏洞防护补丁v1.1
 *更新时间：2013-05-25
 *功能说明：防护XSS,SQL,代码执行，文件包含等多种高危漏洞
 */
$url_arr = Array(
        'xss'=>"\\=\\+\\/v(?:8|9|\\+|\\/)|\\%0acontent\\-(?:id|location|type|transfer\\-encoding)",
);

$args_arr = Array(
        'xss'=>"[\\'\\\"\\;\\*\\<\\>].*\\bon[a-zA-Z]{3,15}[\\s\\r\\n\\v\\f]*\\=|\\b(?:expression)\\(|\\<script[\\s\\\\\\/]|\\<\\!\\[cdata\\[|\\b(?:eval|alert|prompt|msgbox)\\s*\\(|url\\((?:\\#|data|javascript)",
        'sql'=>"[^\\{\\s]{1}(\\s|\\b)+(?:select\\b|update\\b|insert(?:(\\/\\*.*?\\*\\/)|(\\s)|(\\+))+into\\b).+?(?:from\\b|set\\b)|[^\\{\\s]{1}(\\s|\\b)+(?:create|delete|drop|truncate|rename|desc)(?:(\\/\\*.*?\\*\\/)|(\\s)|(\\+))+(?:table\\b|from\\b|database\\b)|into(?:(\\/\\*.*?\\*\\/)|\\s|\\+)+(?:dump|out)file\\b|\\bsleep\\([\\s]*[\\d]+[\\s]*\\)|benchmark\\(([^\\,]*)\\,([^\\,]*)\\)|(?:declare|set|select)\\b.*@|union\\b.*(?:select|all)\\b|(?:select|update|insert|create|delete|drop|grant|truncate|rename|exec|desc|from|table|database|set|where)\\b.*(charset|ascii|bin|char|uncompress|concat|concat_ws|conv|export_set|hex|instr|left|load_file|locate|mid|sub|substring|oct|reverse|right|unhex)\\(|(?:master\\.\\.sysdatabases|msysaccessobjects|msysqueries|sysmodules|mysql\\.db|sys\\.database_name|information_schema\\.|sysobjects|sp_makewebtask|xp_cmdshell|sp_oamethod|sp_addextendedproc|sp_oacreate|xp_regread|sys\\.dbms_export_extension)",
        'other'=>"\\.\\.[\\\\\\/].*\\%00([^0-9a-fA-F]|$)|%00[\\'\\\"\\.]"
);

$referer = empty($_SERVER['HTTP_REFERER']) ? array() : array($_SERVER['HTTP_REFERER']);
$query_string = empty($_SERVER["QUERY_STRING"]) ? array() : array($_SERVER["QUERY_STRING"]);

check_data($query_string, $url_arr);
check_data($_GET, $args_arr);
check_data($_POST, $args_arr);
check_data($_COOKIE, $args_arr);
check_data($referer, $args_arr);

//特殊字符处理
$_GET && SafeFilter($_GET);
$_POST && SafeFilter($_POST);

function aliyunWafLog($log){
    $logpath = $_SERVER["DOCUMENT_ROOT"]."/../log/sxxlog".strftime("%Y%m%d").".log";
    $log_f = fopen($logpath, "a+");
    fputs($log_f, $log."\r\n");
    fclose($log_f);
}

function check_data($arr, $v){
    foreach($arr as $key=>$value){
        if(!is_array($key)){
            check($key, $v);
        }else{
            check_data($key, $v);
        }
        
        if(!is_array($value)){
            check($value, $v);
        }else{
            check_data($value, $v);
        }
    }
}

function check($str, $v){
    foreach($v as $key=>$value){
        if (preg_match("/".$value."/is",$str)==1||preg_match("/".$value."/is",urlencode($str))==1){
            aliyunWafLog("{【".strftime("%Y-%m-%d %H:%M:%S")." ".$_SERVER["REQUEST_METHOD"]."】[".$_SERVER["REMOTE_ADDR"]."]，'url'：".$_SERVER["REQUEST_URI"].",k：".$str."；p:".$str."}");
            //print "您的提交带有不合法参数,谢谢合作";
            header("location:/default/error");
            exit();
        }
    }
}

function SafeFilter (&$arr){
    $ra = Array('/script/i','/javascript/i','/vbscript/i','/expression/i','/</','/>/',
            '/applet/i','/meta/i','/xml/i','/blink/i','/link/i','/style/i','/embed/i','/object/i','/frame/i','/layer/i',
            '/title/i','/bgsound/i','/base/i','/onload/i','/onunload/i','/onchange/i','/onsubmit/i','/onreset/i','/src/i',
            '/onselect/i','/onblur/i','/onfocus/i','/onabort/i','/onkeydown/i','/onkeypress/i','/onkeyup/i','/onclick/i',
            '/ondblclick/i','/onmousedown/i','/onmousemove/i','/onmouseout/i','/onmouseover/i','/onmouseup/i','/onunload/i');
    
    if(is_array($arr)){
        foreach($arr as $key => $value){
            if(!is_array($value)){
                $arr[$key] = preg_replace($ra, '', $value); //删除非打印字符，粗暴式过滤xss可疑字符串
            }else{
                SafeFilter($arr[$key]);
            }
        }
    }
}
?>