<?php

class DBUtils{

    public static $db = null;

    public static function getDb(){
        if(empty(self::$db)){
            $dbParams = json_decode(YDM_DBCONFIG, true);
            $db = Zend_Db::factory($dbParams['adapter'], $dbParams['params']);

            Zend_Registry::set('db', $db);
            Zend_Db_Table_Abstract::setDefaultAdapter($db);
            self::$db = $db;
        }
        return self::$db;
    }
}
