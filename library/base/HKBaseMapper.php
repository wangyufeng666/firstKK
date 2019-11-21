<?php
/**
 * 功能描述:数据映射基类
 * @package    
 * @subpackage 
 * @module   
 * @createdate   2015-1-29
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyright  2013 上海翼思信息科技有限公司 版权所有
 */
class HKBaseMapper{
    protected $_dbTable;
    protected $_db;
    
    public function __construct(){
        $this->_db  = DBUtils::getDb();
    }
    
    /**
     * 获取实体对象唯一主键，为insert做准备,从oracle数据库的序列中获取
     * 返回唯一主键
     * @return String
     */
    public function GetPrimaryKeyValue($TableName){ 
        //从表的第一个字符开始截取三个字符作为PK键值的启示字符
        $sql = 'Select \''.strtoupper(substr($TableName,0,3)).'\'||lpad(seq_'.$TableName.'.nextval,13,\'0\') as PKID From dual' ;
        $result = $this->_db->query($sql);
        $rows = $result->fetch();
        return $rows['PKID'];
    }
    
    /**
     * 获取sequence序列自增值
     * 返回唯一主键
     * @return String
     */
    public function GetPrimaryKey($TableName){
        $sql = 'select seq_'.$TableName.'.nextval from dual';
        $result = $this->_db->query($sql);
        $rows = $result->fetch();
        return $rows;
    }
    
    function BindPDOArray(&$pdoStatement,&$paArray){
        foreach ($paArray as $k=>$v){
            @$pdoStatement->bindValue($k,$v);
        }
    }
}
