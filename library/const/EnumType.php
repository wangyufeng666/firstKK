<?php

/**
 * 功能描述: 系统共用数组类
 *
 * @package
 * @subpackage
 * @module
 * @createdate   2013-4-25
 * @version   V1.0.0.1
 * @author   weimingze
 * @copyrigh  2013 上海翼思信息科技有限公司 版权所有
 */
class EnumType {
    public static $active_partnercode = array('王菠'=>'10001820','测试'=>'10000269','浙江vivo'=>'10002798');

    public static $active_start_time = '2019-03-01';

    public static $active_end_time = '2019-03-11';

    public static $active_start0323_time = '2019-03-23';

    public static $active_end0324_time = '2019-03-25';

    public static $active_start0404_time = '2019-04-04';

    public static $active_end0404_time = '2019-04-07';

    /**
     * 产品分类
     */
    public static $merTypes = array('all'=>'全品类','A'=>'机身','B'=>'镜头','D'=>'套机','E'=>'闪光灯','SXJ'=>'摄像机',
        'F'=>'取景器','G'=>'手柄','H'=>'转换环','I'=>'三脚架','J'=>'手机','K'=>'平板','L'=>'笔记本电脑',
        'M'=>'游戏机','CM'=>'无人机','N'=>'游戏','P'=>'空调','Q'=>'冰箱','R'=>'洗衣机','S'=>'电视','YJ'=>'油烟机',
        'ZC'=>'台式机','U'=>'显示器','CPU'=>'CPU','DDR'=>'内存', 'LYX'=>'蓝牙音箱','ZBN'=>'主板',
        'SSD'=>'固态硬盘','XK'=>'显卡','DHH'=>'机械硬盘','ZA'=>'空气净化器','CA'=>'VR眼镜','CB'=>'耳机','CD'=>'智能手表',
        'CE'=>'智能手环','CF'=>'HiFi播放器','CG'=>'电子书','CH'=>'键盘','CI'=>'鼠标','CJ'=>'电视盒子',
        'BB'=>'包','SS'=>'首饰','WB'=>'腕表','XS'=>'香水',/*'ZB'=>'卡券',*/'HZ'=>'化妆品','HJ'=>'黄金','TC'=>'婴儿推车',
        'ZY'=>'安全座椅','CZ'=>'彩妆','HFP'=>'护肤品','DYJ'=>'打印机','MH'=>'墨盒','SC'=>'服务器','GZZ'=>'工作站',
        'DSB'=>'背包','SZ'=>'手杖','TD'=>'头灯','JJ'=>'办公家具','TY'=>'投影仪','DY'=>'硒鼓','YTJ'=>'一体机','BA'=>'服务器CPU');
    /**
     * 大分类
     */
    public static $enumCategorys = Array('1'=>'相机品类', '2'=>'大家电','3'=>'手机',
            '4'=>'平板', '5'=>'笔记本电脑', '6'=>'游戏品类','7'=>'电脑配件');

    /**
     * 大家电TO商品类型
     */
    public static $categorys2MerTypes = array(
        '1'=>Array('A'=>'机身', 'B'=>'镜头', 'D'=>'套机'),
        '2'=>Array('P'=>'空调', 'Q'=>'冰箱', 'R'=>'洗衣机', 'S'=>'电视'),
        '3'=>Array('J'=>'手机'), '4'=>Array('K'=>'平板'),
        '5'=>Array('L'=>'笔记本'), '6'=>Array('M'=>'游戏机', 'N'=>'游戏'));

    /**
     * 仅支持快递回收品类列表
     * @var array
     */
    public static $expressMerTypes = Array(
        'CPU'=>'CPU','SSD'=>'固态硬盘','DDR'=>'内存','XK'=>'显卡','ZC'=>'台式机',
        'CD'=>'智能手表','CB'=>'耳机','CG'=>'电子阅读器','CM'=>'智能飞行','TY'=>'投影仪','CF'=>'Ipod',
        'HFP'=>'护肤品','CZ'=>'彩妆','XS'=>'香水','ZY'=>'安全座椅','TC'=>'婴儿推车','WJ'=>'儿童玩具');

    /**
     * 仅支持上门回收品类列表
     */
    public static $visitMerTypes = Array(
        'P'=>'空调','Q'=>'冰箱','R'=>'洗衣机','S'=>'电视','O'=>'热水器','ZA'=>'空气净化器',
        'YJ'=>'油烟机','HJ'=>'黄金','JJ'=>'办公家具');

    /**
     * 翼锋网提供的回收商品类型
     */
    public static $yfmerClasss  = array('V'=>'CPU', 'W'=>'固态硬盘', 'X'=>'内存');
	/**
     * 具体分类列表
     */
	public static $typeList = Array('HOT'=>'热门回收','V'=>'电脑配件');
    /**
     * 交易类型
     */
    public static $tradeTypes = Array('1'=>'上门回收', '2'=>'快递寄运', '5'=>'地铁回收', '6'=>'门店回收', '8'=>'立即回收');

    /**
     * 地铁交易城市
     */
    public static $subWayCity = Array('37'=>'上海', '36'=>'北京', '1601'=>'广州', '1607'=>'深圳',
            '988'=>'苏州', '38'=>'天津', '39'=>'重庆', '1930'=>'成都');

    /**
     * 交易银行
     * @var unknown_type
     */
    public static $tradeBanks = array('1'=>'中国工商银行', '2'=>'中国建设银行', '3'=>'中国银行', '4'=>'中国农业银行',
                                '5'=>'中国邮政储蓄银行', '6'=>'中国交通银行', '7'=>'招商银行'/*, '99'=>'支付宝'*/);

    /**
     * 券面值标记
     * @var unknown_type
     */
    public static $couponPerValues = array('1'=>2000, '2'=>1000, '3'=>500, '4'=>200, '5'=>100, '6'=>50);

    /**
     * 乐视活动
     */
    public static $actives = array(array('code'=>'LEMALL_NO151015', 'name'=>'乐视商城现金券'));

    public static $currentEventCode = 'LEMALL_NO151015';

    /**
     * 笔记本属性
     */
    public static $notebookAttrs = Array('1'=>'CPU型号', '2'=>'内存容量', '3'=>'硬盘容量', '4'=>'显卡类型');

    /**
     * 普通订单状态(客户端状态)
     */
    public static $userOrderStatus = array('1'=>'待确认', '2'=>'待上门', '3'=>'待检测', '8'=>'待发券',
                    '6'=>'待快递', '7'=>'待收货','4'=>'待付款', '5'=>'交易完成',  '66'=>'交易完成',
                    '98'=>'终止退回', '99'=>'已取消', '94'=>'退券终止','68'=>'已支付');

    /**
     * 用户通知类型
     */
    public static $enumYHInformType = Array('1'=>'器材库不全','2'=>'器材描述有误', '3'=>'暂无商品报价', '4'=>'其他');


    /**
     * 快递公司
     */
    public static $expressPartners = array(
        "SFEXPRESS"=>"顺丰速递", "YUNDA"=>"韵达快递", "YTO"=>"圆通速递", "STO"=>"申通速递",
        "CHINAPOST"=>"邮政包裹", "TTKDEX"=>"天天快递", "ZTO"=>"中通快递", "EMS"=>"EMS",
        "ZJS"=>"宅急送", "RFD"=>"如风达", "AUTO"=>"其他快递");

    /**
     * 支付类型(租着用)
     */
    public static $paytype = Array('1'=>'信用卡', '2'=>'蚂蚁花呗', '3'=>'全额支付');

    /**
     * 分期订单状态（用户）
     */
    public static $installment_order_status_list = Array('1'=>"待支付", "2"=>"待上门", "3"=>"待发货",
            "5"=>"支付中","66"=>"交易成功","99"=>"终止","95"=>"终止",'96'=>"支付超时");


    /**
     * 分期订单状态(店铺)
     */
    public static $installment_order_storestatus_list = Array('1'=>"待支付", '3'=>"待发货",
            "5"=>"支付中","66"=>"交易成功","88"=>"待结算","99"=>"终止","95"=>"终止",'96'=>"支付超时");

    /**
     * 分期用户订单状态转换
     */
    public static $installmentStatusTransform = Array('95'=>'99','96'=>'99', '97'=>'99',
            '98'=>'99','95'=>'99','88'=>'66');

    /**
     * 功能描述：线下参与抽奖的集团
     * added by wangbo
     * added date 2018年12月21日
     */
    public static $offlineActiveCode = Array('TY00012296'=>'宁波-苏宁集团');

    /**
     * 功能描述：活动时间
     * added by wangbo
     * added date 2018年12月21日
     */
    public static $OFFLINE_ACTIVE1224_STARTDATE = '2018-12-24';
    public static $OFFLINE_ACTIVE1224_ENDDATE = '2019-1-21';

    /**
     * 分类品牌列表
     * @var array
     */
    public static $brandList = Array(
            Array('pcode' => 'J', 'headerText' => '手机', 'existFlag' => 'N',
                'item' => Array()
            ),
            Array('pcode' => 'K', 'headerText' => '平板', 'existFlag' => 'N',
                'item' => Array()
            ),
            Array('pcode' => 'L', 'headerText' => '笔记本', 'existFlag' => 'N',
                'item' => Array()
            ),
            Array('pcode' => 'A', 'headerText' => '相机', 'existFlag' => 'Y',
                'item' => Array(
                    Array('mertype' => 'A', 'name' => '机身'),
                    Array('mertype' => 'B', 'name' => '镜头'),
                    Array('mertype' => 'D', 'name' => '套机'),
                    Array('mertype' => 'SXJ', 'name' => '摄像机'),
                    Array('mertype' => 'E', 'name' => '闪光灯')
                )
            ),
            Array('pcode' => 'CD', 'headerText' => '智能数码', 'existFlag' => 'Y',
                'item' => Array(
                    Array('mertype' => 'CD', 'name' => '智能手表'),
                    Array('mertype' => 'CB', 'name' => '耳机'),
                    Array('mertype' => 'M', 'name' => '游戏机'),
                    Array('mertype' => 'CG', 'name' => '电子书'),
                    Array('mertype' => 'CM', 'name' => '无人机'),
                    Array('mertype' => 'CF', 'name' => 'HIFI播放器'),
                    Array('mertype' => 'CE', 'name' => '智能手环'),
                    Array('mertype' => 'CA', 'name' => 'VR眼镜'),
                    Array('mertype' => 'LYX', 'name' => '蓝牙音箱')
                )
            ),
            Array('pcode' => 'ZC', 'headerText' => '台式机', 'existFlag' => 'Y',
                'item' => Array(
                    Array('mertype' => 'ZC', 'name' => '台式机'),
                    Array('mertype' => 'YTJ', 'name' => '一体机')
                )
            ),
            Array('pcode' => 'CPU', 'headerText' => '电脑配件', 'existFlag' => 'Y',
                'item' => Array(
                    Array('mertype' => 'CPU', 'name' => 'CPU'),
                    Array('mertype' => 'DDR', 'name' => '内存'),
                    Array('mertype' => 'XK', 'name' => '显卡'),
                    Array('mertype' => 'SSD', 'name' => '固态硬盘'),
                    Array('mertype' => 'ZBN', 'name' => '主板'),
                    Array('mertype' => 'DHH', 'name' => '机械硬盘'),
                    Array('mertype' => 'BA', 'name' => '服务器CPU'),
                    Array('mertype' => 'U', 'name' => '显示器'),
                )
            ),
            Array('pcode' => 'DYJ', 'headerText' => '办公设备', 'existFlag' => 'Y',
                'item' => Array(
                    Array('mertype' => 'DYJ', 'name' => '打印机'),
                    Array('mertype' => 'TY', 'name' => '投影仪'),
                    Array('mertype' => 'MH', 'name' => '墨盒'),
                    Array('mertype' => 'SC', 'name' => '服务器'),
                    Array('mertype' => 'GZZ', 'name' => '工作站')
                )
            )
        );

    /**
     * 只支持立即回收父级partnerCode
     * @var array
     */
    public static $offlineRecyclePartner = Array('华硕-服务站'=>'TY00001920','联系-京津翼'=>'TY00020722');

}
?>