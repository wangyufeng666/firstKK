<?php 

class SecUtility {
    
    /** <summary>
     * 检测输入参数
     * </summary>
     * <param name="param">参数值</param>
     * <param name="checkForNull">检测NULL</param>
     * <param name="checkIfEmpty">检测空值</param>
     * <param name="checkForCommas">检测逗号</param>
     * <param name="maxSize">参数长度</param>
     * <returns></returns>
     */
    public static function ValidateParameter($param, $checkForNull, $checkIfEmpty, $checkForCommas, $maxSize){
        if($param == null){
            return !$checkForNull;
        }
        
        $param = trim($param);
        if (($checkIfEmpty && strlen($param) < 1) ||
             ($maxSize > 0 && strlen($param) > $maxSize) ||
             ($checkForCommas && strpos($param,","))) {
            return false;
        }
        return true;
    }

    // We don't trim the param before checking with password parameters
    public static function CheckPasswordParameter($param, $maxSize, $paramName) {
        if ($param == null) {
            throw new Exception($paramName.'不可为空');
        }
        if (strlen($param) < 1) {
            throw new Exception($paramName.'不可为空');
        }
        if ($maxSize > 0 && strlen($param) > $maxSize) {
            throw new Exception('"'.$paramName.'"'.'超过额定长度"'.$maxSize.'"');
        }
    }
    
    /** <summary>
     *  检查输入参数int,DateTime,GUID等(checkForNull:是否进行Null检测;checkIfEmpty:是否进行空值检测;checkForCommas:是否检测英文逗号;paramName:参数名称)
     * </summary>
     * <param name="param">参数变量</param>
     * <param name="checkForNull">是否进行Null检测</param>
     * <param name="checkIfEmpty">是否进行空值检测</param>
     * <param name="checkForCommas">是否检测英文逗号</param>
     * <param name="paramName">参数名称</param>
     */
    public static function CheckParameter($param, $checkForNull, $checkIfEmpty, $checkForCommas, $paramName){
        if($param == null){
            if ($checkForNull){
                throw new Exception($paramName.'不可为空');
            }
            return;
        }
        
        $strparam = trim($param);
        if($checkIfEmpty && strlen($param) < 1){
            throw new Exception($paramName.'不可为空');
        }
        
        if($checkForCommas && count(explode(",",$strparam))>1){
            throw new Exception($paramName.'不可包含有","');
        }
    }

    /* <summary>
     * 检查输入参数(checkForNull:是否进行Null检测;checkIfEmpty:是否进行空值检测;checkForCommas:是否检测英文逗号;maxSize:参数最大长度;paramName:参数名称)
     * </summary>
     * <param name="param">参数变量</param>
     * <param name="checkForNull">是否进行Null检测</param>
     * <param name="checkIfEmpty">是否进行空值检测</param>
     * <param name="checkForCommas">是否检测英文逗号</param>
     * <param name="maxSize">参数最大长度</param>
     * <param name="paramName">参数名称</param>
     */
    public static function  CheckParameterStr($param, $checkForNull, $checkIfEmpty, $checkForCommas, $maxSize, $paramName) {
        if(null == $param ) {
            if($checkForNull) {
                throw new Exception($paramName.'不可为空');
            }
            return;
        }
        $param = trim($param);
        if($checkIfEmpty && strlen($param) < 1) {
            throw new Exception($paramName.'不可为空');
        }
        if($maxSize > 0 && strlen($param) > $maxSize) {
            throw new Exception('"'.$paramName.'"'.'超过额定长度"'.$maxSize.'"');
        }
        if($checkForCommas && count(explode(",",$param))>1) {
            throw new Exception($paramName.'不可包含有","');
        }
    }
}
?>