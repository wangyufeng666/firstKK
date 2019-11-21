<?php
/**
 * 工具类
 *
 * @uses       *_Model_*
 * @package    base
 * @subpackage base
 * @module     系统框架平台
 * @createdate 2009-11-02
 * @version    V1.0.0.1
 * @copyright  Copyright(c) 2009, 翼思科技版权所有
 */
class HKUtils{
    /**
     * UTF8编码转GBK，此函数用于从Excel中读取数据后，需将数据进行转化，以解决中文乱码问题
     */
    public static function HKUTF8ToGBK($strparam){
        return mb_convert_encoding($strparam,"GBK","UTF-8");
    }

    /**
     * UTF8编码转GB18030，此函数用于从Excel中读取数据后，需将数据进行转化，以解决中文乱码问题
     */
    public static function HKUTF8ToGB18030($strparam){
        return iconv('utf-8','GB2312//IGNORE',$strparam);
    }

    /**
     * GBK编码转UTF8，此函数用于写于Excel时候，需将数据进行转化,以解决中文乱码问题
     */
    public static function HKGBKToUTF8($strparam){
        return iconv('gbk','utf-8',$strparam);
    }

    /**
     * 校验字符串为：数字+字符类   通过返回0，否则返回1
     * @param $str
     * @return unknown_type
     */
    public static function checkType($str){
        $str = str_replace(',','',$str);
        $str = str_replace('.','',$str);
        return preg_match( '|^[0-9a-zA-Z]+$|', $str);
    }

    /**
     * 数字格式化金额类输出
     * @param $str
     * @return unknown_type
     */
    public static function numberFormat($str){
        if($str != '' ){
            $str =  str_replace(',','',$str);
            return number_format($str,2);
        }
    }

    /**
     * 页面提示信息函数
     *
     */
    public static function ShowMessage($strparam){
        $result = '';
        if(null!=$strparam){
            $result = 'alert(\''.addslashes($strparam).'\');';
        }
        return $result;
    }

    /**
     * 对CSV进行处理
     * @param resource handle
     * @param int length
     * @param string delimiter
     * @param string enclosure
     * @return 文件内容或FALSE。
     */

    public static function fgetcsv(&$handle, $length = null, $d = ',', $e = '"'){
        $d = preg_quote($d);
        $e = preg_quote($e);
        $_line = "";
        $eof=false;
        while($eof != true) {
            $_line .=(empty($length) ? fgets($handle) : fgets($handle, $length));
            $itemcnt = preg_match_all('/'.$e.'/', $_line, $dummy);
            if($itemcnt % 2 == 0){
                $eof = true;
            }
        }
        $_csv_line = preg_replace('/(?: |[ ])?$/', $d, trim($_line));
        $_csv_pattern = '/('.$e.'[^'.$e.']*(?:'.$e.$e.'[^'.$e.']*)*'.$e.'|[^'.$d.']*)'.$d.'/';
        preg_match_all($_csv_pattern, $_csv_line, $_csv_matches);
        $_csv_data = $_csv_matches[1];
        for($_csv_i = 0;$_csv_i < count($_csv_data);$_csv_i++) {
            $_csv_data[$_csv_i] = preg_replace('/^'.$e.'(.*)'.$e.'$/s', '$1', $_csv_data[$_csv_i]);
            $_csv_data[$_csv_i] = str_replace($e.$e, $e, $_csv_data[$_csv_i]);
        }
        return empty($_line) ? false : $_csv_data;
    }

    /* 输出标准ansi格式文档*/
    public static function outputcvs($content){
        $tmpfilename = '';
        if(strtoupper(substr(PHP_OS,0,3))=='WIN'){
            $tmpfilename = 'c:/'.md5(microtime(1).rand());
        }else{
            $tmpfilename = '/tmp/'.md5(microtime(1).rand());
        }
        file_put_contents($tmpfilename,$content);
        $speed = 85;// 85 kb/s download rate limit
        if(file_exists($tmpfilename) && is_file($tmpfilename)){
            $fd = fopen($tmpfilename, "r");
            while(!feof($fd)) {
                echo fread($fd, round($speed*1024));
            }
            fclose($fd);
        }
    }
}