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
class ServerDateUtils{

    /**
     * 功能描述：预约上门时间
     */
    public static function getDoorServerDates(){

        //时间预约，未来3天，不带今天
        $serverDates = array();
        $week = array('0'=>'星期日', '1'=>'星期一', '2'=>'星期二', '3'=>'星期三', '4'=>'星期四', '5'=>'星期五', '6'=>'星期六');
        $currentHour = date("H");
        $start = 1;
        $end = 6;
        if($currentHour >= 17){
            $start = 2;
            $end = 5;
        }

        for($i = $start; $i < $end; $i++){
            $date = date("Y-m-d",strtotime("+$i day"));
            $w = date("w",strtotime("+$i day"));
            array_push($serverDates, array('date'=>$date, 'name'=>$week[$w]));
        }
        return $serverDates;
    }

    /**
     * 顺丰上门预约时间在早上9点到晚上7点
     * 当前时间超过18点，预约第二天
     */
    public static function getSFServerDates(){

       $serverDates = array();
       $week = array('0'=>'周日', '1'=>'周一', '2'=>'周二', '3'=>'周三', '4'=>'周四', '5'=>'周五', '6'=>'周六');
       $thisW = date("w");
       $thisHour = date('H');
       $plusDate = 0;
        if($thisHour >= 18){
            $plusDate = 1;
        }
        $nextWeekFlag = false;
        for($i = 0; $i <= 2; $i++){
            $addDate = $i+$plusDate;
            $date = date("Y-m-d", strtotime("+$addDate day"));

            $w = date("w", strtotime("+$addDate day"));
            $name = $week[$w];
            if($nextWeekFlag){
                $name = '下'.$name;
            }else{
                if($thisW == 0){//当天是周日
                    $nextWeekFlag = true;
                    $name = '本'.$name;
                }else{
                    if($w >= $thisW || $w == 0){
                        $name = '本'.$name;
                        if($w == 0){
                            $nextWeekFlag = true;
                        }
                    }else{
                        $name = '下'.$name;
                        $nextWeekFlag = true;
                    }
                }
            }
            array_push($serverDates, array('date'=>$date, 'name'=>$name));
        }
        return $serverDates;
    }

    /**
     * 功能描述：获取顺丰服务时间
     */
    public static function getSFServerTimes($dateTime){
        $times = array();
        $thisHour = date('H');
        $date = date("Y-m-d");
        if($dateTime){
            $date = date("Y-m-d", strtotime($dateTime));
        }else{
            if($thisHour >= 18){
                $date = date("Y-m-d", strtotime("+1 day"));
            }
        }
        $today = date('Y-m-d');
        //时间预约，未来3天，今天开始
        if($date){
            for($i = 9; $i <= 18; $i++){
                if($today == $date){
                    if($i > $thisHour){
                        if($i < 10){
                            array_push($times, array('time'=>'0'.$i.':00'));
                        }else{
                            array_push($times, array('time'=>$i.':00'));
                        }
                    }
                }else{
                    if($i < 10){
                        array_push($times, array('time'=>'0'.$i.':00'));
                    }else{
                        array_push($times, array('time'=>$i.':00'));
                    }
                }
            }
        }
        return $times;
    }
}