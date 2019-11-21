<?php
define('OUTPUT_FILE','../log/'.date('Y').date('m').date('d').'.log'); //Output file.

/**
 * The alias of pt() method, for more readable.
 * @param string $s
 */
function vklog($s){
    pt($s);
}

/**
 * pt is short for print,this method is the main entry of the vk-log4php.
 * @param string $s
 */
function pt($s){
    pt_after_php430($s);
}

/**
 * Log the string $s. for the php version before 4.3.0
 * @param string $s
 */
function pt_before_php430($s){
    $vk_debug_level = 1; //no use now , prepare for the future version.
    if($vk_debug_level==1){
        $outputString = '['.date('Y-m-d H:i:s').']=>'.$s."\n";// "\n" 是换行符。 结合tail -f c:/vk-debug-log.txt,即可得到即时调试信息。
        vk_output($outputString);
    }
}

/**
 * Log the string $s for the php version after 4.3.0
 * @param string $s
 */
function pt_after_php430($s){
    $vk_debug_level = 1;  //no use now , prepare for the future version.
    if($vk_debug_level==1){
        $traces = debug_backtrace(); //see the php manual for the function "debug_backtrace()" detail.
        $traceTop = $traces[sizeof($traces)-1];  // get the top trace info arrary of the traces.
        extract($traceTop);        //  This function extract the arrary to vars:
        $outputString = '['.date('Y-m-d H:i:s').']=>'.$s."\n";// "\n" 是换行符。 结合tail -f c:/vk-debug-log.txt,即可得到即时调试信息。
        vk_output($outputString);
    }
}

/**
 * 默认记录登陆用户的userid
 */
function loger($s){
    $vk_debug_level = 1;
    $loglever='DEBUG';
    is_array($s) && $s = print_r($s,true); //print_r 增加 true 返回打印字符窜
    if($vk_debug_level==1){
        $traces = debug_backtrace();
        //see the php manual for the function "debug_backtrace()" detail.
        $traceTop = $traces[sizeof($traces)-1];
        // get the top trace info arrary of the traces.
        extract($traceTop);
        //  This function extract the arrary to vars:
        $outputString = '['.date('Y-m-d H:i:s').']'.'['.$loglever.']=>'.$s."\n";
        // "\n" 是换行符。 结合tail -f c:/vk-debug-log.txt,即可得到即时调试信息。
        vk_output($outputString);
    }
}

/**
 * @param $outputString
 * @return unknown_type
 */
function vk_output($outputString){
    $fp = fopen(OUTPUT_FILE,'ab');
    if(!$fp){
        ob_start();
        echo 'Can not open the log file: '.OUTPUT_FILE;
        ob_end_flush();
        exit;
    }
    fwrite($fp,$outputString);
}
?>