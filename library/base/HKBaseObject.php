<?php
/**
 * 对象实体基类
* @uses       *_Model_*Mapper
* @package    base
* @subpackage base
* @module     系统框架平台
* @createdate 2009-11-02
* @version    V1.0.0.1
 */
class HKBaseObject {
    
    protected $_username;
    protected $_mapper;
    
    /**
     * Constructor 对象初始化
     * @param  array|null $options （传入对象属性数组）
     * @return void
     */
    public function __construct(array $options = null){
        if(is_array($options)){
            $this->setoptions($options);
        }//这个办法初始化比较简洁，不用每个属性都去填写一遍
    }
    
    /**
     * Overloading: allow property access,此方法确保检查每个属性的set方法被实现，强制用户实现
     * @param  string $name 
     * @param  mixed $value 
     * @return void
     */
    public function __set($name, $value){
        $method = 'set'.$name; //是否相等判断常量需放在操作符的前面
        if ('mapper' == $name || !method_exists($this, $method)) {
            throw new Exception($name.'不可设置对象的非法属性');
        }
        $this->$method($value);
    }
    
    /**
     * Overloading: allow property access 此方法确保检查每个属性的get方法被实现，强制用户实现
     * 
     * @param  string $name 
     * @return mixed
     */
    public function __get($name){
        $method = 'get'.$name;
        if ('mapper' == $name || !method_exists($this, $method)) {
            throw new Exception($name.'不可非法获取对象的属性');
        }
        return $this->$method();
    }
    
    /**
     *初始化对象属性，传入数组，此处限制属性的get与set一律使用小写
     * @param  array $options 
     * @return *_Model_*
     */
    public function setoptions(array $options){
        $methods = get_class_methods($this);
        foreach($options as $key => $value){
            $method = 'set'.strtolower($key);
            if(in_array($method, $methods)){
                $this->$method($value);
            }
        }
        return $this;
    }
    
    public function setMapper($mapper){
        $this->_mapper = $mapper;
        return $this;
    }
    
    public function getMapper(){
       return $this->_mapper;
    }
}
