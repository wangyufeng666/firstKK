<?php

class YdmAutoloader{
    
    /**
     * 类库自动加载，写死路径，确保不加载其他文件。
     * @param string $class 对象类名
     * @return void
     */
    public static function autoload($class){
        $name = $class;
        if(false !== strpos($name,'\\')){
            $name = strstr($class, '\\', true);
        }
        
        $filename = YDM_AUTOLOADER_PATH."/base/".$name.".php";
        if(is_file($filename)) {
            include_once $filename;
            return;
        }
        
        $filename = YDM_AUTOLOADER_PATH."/const/".$name.".php";
        if(is_file($filename)) {
            include_once $filename;
            return;
        }
        
        $filename = YDM_AUTOLOADER_PATH."/utils/".$name.".php";
        if(is_file($filename)) {
            include_once $filename;
            return;
        }
        
        $filename = YDM_AUTOLOADER_PATH."/redis/".$name.".php";
        if(is_file($filename)) {
            include_once $filename;
            return;
        }
        
        $filename = YDM_AUTOLOADER_PATH."/seaslog/".$name.".php";
        if(is_file($filename)) {
            include_once $filename;
            return;
        }
    }
}
spl_autoload_register('YdmAutoloader::autoload');
?>