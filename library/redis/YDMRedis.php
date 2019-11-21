<?php
/**
* redis功能扩展类
* @uses       wyh
* @createdate 2016-06-03
* @version    V1.0.0
*/
class YDMRedis extends redis{

    protected $_timeout = 1;//超时时间,如果redis服务未正常工作，或网络有问题，连接 $_timeout 秒后停止连接，连接失败，$_connectFlag 为false
    protected $_db = "0";//redis默认数据库
    protected $_decollator = "_#%$#_";//redis key分割符
    protected $_error = "";//错误信息
    protected $_connectFlag = false;

    private static $instance;

    /**
     * 保存数组到Hash，若数组value为数组将转化为json格式
     * @param $domain 域，用于归类数据方便数据管理
     * @param $key 键 $key
     * @param $array 需保存的数组 $array
     * @param $mode 模式，1：对value不做json_encode处理，如果为数组，则保存'Array'字符串，2：对value进行json_encode处理，如果为数组，则保存 json
     */
    function saveHArray($domain, $key, $array, $mode = 1){
        if($this->_connectFlag){
            $res = $this->deleteKey($domain, $key);
            $key = $this->__getRealKey($domain, $key);
            do{
                if(!empty($array)){
                    if($mode == 2){
                        foreach ($array as $k => $v){
                            $array[$k] = json_encode($v);
                        }
                    }else if($mode != 1){
                        $this->_error = 'mode error';
                        break;
                    }
                    $res = $this->hMSet($key, $array);
                    if(!$res){
                        $this->_error = 'saveHArray hMSet failed';
                        break;
                    }
                }
                return $res;
            }while(0);
        }
        return false;
    }

    /**
     * 获取Hash中数组
     * @param $domain 域
     * @param $key 键
     * @param $mode 模式，1：对value不做json_decode处理，2：对value进行json_decode处理，如果未json格式，转换为数组 ，必须与saveArray时采用一样的模式否则数据肯可能有误
     */
    function getHArray($domain, $key, $mode = 1){
        if($this->_connectFlag){
            $key = $this->__getRealKey($domain, $key);
            $res = $this->hGetAll($key);
            do{
                if($res){
                    if($mode == 2){
                        foreach ($res as $k => $v){
                            $res[$k] = json_decode($v, true);
                        }
                    }else if($mode != 1){
                        $this->_error = 'getArray mode error';
                        break;
                    }
                }else{
                    $this->_error = 'getHArray hGetAll failed';
                    break;
                }
                return $res;
            }while(0);
        }
        return false;
    }

    /**
     * 将数组保存为json字符串
     * @param $domain 域
     * @param $key 键
     * @param $array 要保存的数组
     */
    function saveArray($domain, $key, $array){
        if($this->_connectFlag){
            $key = $this->__getRealKey($domain, $key);
            if(!$this->set($key, json_encode($array))){
                $this->_error = 'saveArray set failed';
                return false;
            }else{
                return true;
            }
        }else{
            return false;
        }
    }

    /**
     * 将json字符串返回数组
     * @param $domain 域
     * @param $key 键
     */
    function getArray($domain, $key){
        if($this->_connectFlag){
            $key = $this->__getRealKey($domain, $key);
            $res = $this->get($key);
            if(!$res){
                $this->_error = 'getArray get failed';
                return false;
            }
            return json_decode($res, true);
        }
    }

    /**
     * 保存字符串
     * @param $domain 域
     * @param $key 键
     * @param $string 要保存的字符串
     */
    function saveString($domain, $key, $string){
        if($this->_connectFlag){
            $key = $this->__getRealKey($domain, $key);
            if(!$this->set($key, $string)){
                $this->_error = 'saveString set failed';
                return false;
            }
            return true;
        }
        return false;
    }

    /**
     * 返回json格式数据
     * @param $domain 域
     * @param $key 键
     */
    function getJson($domain, $key){
        if($this->_connectFlag){
            $key = $this->__getRealKey($domain, $key);
            $res = $this->get($key);
            if(!$res){
                $this->_error = 'getJson get failed';
                return false;
            }
            return $res;
        }
    }

    /**
     * 判断是否存在
     * @param $domain 域
     * @param $key 键
     */
    function isExists($domain, $key){
        if($this->_connectFlag){
            $key = $this->__getRealKey($domain, $key);
            return $this->exists($key);
        }
        return false;
    }

    /**
     * 删除KEY
     * @param $domain 域
     * @param $key 键
     */
    function deleteKey($domain, $key){
        if($this->_connectFlag){
            $key = $this->__getRealKey($domain, $key);
            return $this->del($key);
        }
        return false;
    }

    /**
     * 设置过期时间
     * @param $domain 域
     * @param $key 键
     */
    function setExpire($domain, $key, $second){
        if($this->_connectFlag){
            $key = $this->__getRealKey($domain, $key);
            return $this->expire($key, $second);
        }
    }

    function getError(){
        return $this->_error;
    }

    protected function __getRealKey($domain, $key){
        return $domain.$this->_decollator.$key;
    }

    public static function getRedis(){
        if (!self::$instance instanceof self) {
            self::$instance = new YDMRedis();
        }
        return self::$instance;
    }

    function __construct(){
        parent::__construct();

        $host = "17afccfe735a4766.m.cnhza.kvstore.aliyuncs.com";//redis服务器host
        $port = "6379";//redis服务器port
        $password = "YOUdemai1234zxcv";//密码

        if(OFFWEB_ENV == 'LOCALTEST' || OFFWEB_ENV == 'UATTEST'){//本地测试环境和内网测试
            $host = "172.16.5.152";//redis服务器host
            $port = "6379";//redis服务器port
            $password = "test";//密码
        }elseif(OFFWEB_ENV == 'OUTTEST'){//外网测试
            $host = "10.29.116.76";//redis服务器host-当当内网IP
            $port = "63789";//redis服务器port
            $password = "YOUdemai1234zxcv";//密码
        }

        try{
            $this->connect($host, $port, $this->_timeout);
            //$this->select($this->_db);
            if(!empty($password)){
                //授权
                $this->auth($password);
            }
            $this->_connectFlag = true;
        }catch (Exception $e){
            $this->_error = $e->getMessage();
        }
    }
}