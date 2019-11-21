var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
//                     rzy.alipay_trade_no ydmabnormal ,rza.alipay_trade_no aliabnormal,rza.ydm_trade_no,rza.orderno,rza.in_price,rza.out_price
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
		
                        ,{header:"支付宝流水号", dataIndex:'YDMABNORMAL', width:'120px',sortable:false}
			,{header:"有得卖流水号", dataIndex:'YDM_TRADE_NO', width:'120px',sortable:false}
                        ,{header:"有得卖订单号", dataIndex:'ORDERNO', width:'120px',sortable:false}
			,{header:"回款金额", dataIndex:'IN_PRICE',width:'50px',sortable:false}
                        ,{header:"支出金额", dataIndex:'OUT_PRICE',width:'50px',sortable:false}
                     
//                         ,{header:"交易描述", dataIndex:'PAY_TYPE',width:'60px',sortable:false}
//                          ,{header:"支付时间", dataIndex:'PAYDATE',width:'60px',sortable:false}
//                          ,{header:"备注", dataIndex:'REMARK',width:'200px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
//                                        var accounts = data['ACCOUNTS']; //支付宝账号
//					var returnText ='<a href="javascript:void(0);" onclick="weiWanCheng(\''+accounts+'\')" class="a_link">未完成的订单信息</a>    ';
//                                      //  returnText +='&nbsp&nbsp&nbsp<a href="javascript:void(0);" onclick="saveRemarke(\''+orderNo+'\')" class="a_link">添加备注</a>';
//					return returnText;
				}
			}
		]
		,url:'/recycle/duizhang/pagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}

/**
 * 展示备注
 * @param orderNo
 */
function isShow(orderNo) {
    $.post('/recycle/duizhang/isshow', {orderId: orderNo}, function(data) {
       
     
    }, 'json');

}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function saveRemarke(orderNo){
	window.location.href = "/recycle/duizhang/saveremarke?orderNo="+orderNo+"&backUrl="+backUrl;
}





function getParams(){
	return {
		start:start,
		orderNo:$('#orderNo').val(),
		startDate:$('#startDate').val(),
                endDate:$('#endDate').val(),
		zfbNo:$('#zfbNo').val(),
		fromCode:$('#fromCode').val(),
		
	};
}

function wanChenOrder(){
	var param = '';
	param += 'startDate=' + $('#startDate').val();
        param += '&endDate=' + $('#endDate').val();
	window.location.href = '/recycle/duizhang/wanchengexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function agoPayWanChenOrder(){
	var param = 'type=0';
	param += '&startDate=' + $('#startDate').val();
	window.location.href = '/recycle/duizhang/wanchengexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function notWanChenOrder(){
	var param = 'type=1';
	param += '&startDate=' + $('#startDate').val();
        param += '&endDate=' + $('#endDate').val();
	window.location.href = '/recycle/duizhang/noWanchengexport?'+param;
	return false; //截取返回false就不会保存网页了
}
//(以前)有流水，还没有失败
function agoPayNotOrder(){
	var param = 'type=2';
	param += '&startDate=' + $('#startDate').val();
        param += '&endDate=' + $('#endDate').val();
	window.location.href = '/recycle/duizhang/noWanchengexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function getOtherPortsData(){
	var param = '';
	param += 'startDate=' + $('#startDate').val();
        param += '&endDate=' + $('#endDate').val();
	window.location.href = '/recycle/duizhang/getotherports?'+param;
	return false; //截取返回false就不会保存网页了
}

function agoPayNotWanChenOrder(){
	var param = 'type=0';
	param += '&startDate=' + $('#startDate').val();
	window.location.href = '/recycle/duizhang/noWanchengexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function getAbnormalOrder(type){
	var param = 'type='+type;
	param += '&startDate=' + $('#startDate').val();
	window.location.href = '/recycle/duizhang/getabnormalorder?'+param;
	return false; //截取返回false就不会保存网页了
}

function puTongOrder(){
    var param = '';
	param += '&startDate=' + $('#startDate').val();
	window.location.href = '/recycle/duizhang/putongorder?'+param;
	return false; //截取返回false就不会保存网页了
}

function puTongTermination(){
    var param = '';
	param += '&startDate=' + $('#startDate').val();
	window.location.href = '/recycle/duizhang/terminationdata?'+param;
	return false; //截取返回false就不会保存网页了
}

function billOrder() {
     var param = '';
	param += '&startDate=' + $('#startDate').val();
	window.location.href = '/recycle/duizhang/getbilldata?'+param;
	return false; //截取返回false就不会保存网页了
}
function tradingFlow() {
     var param = '';
	param += '&startDate=' + $('#startDate').val();
	window.location.href = '/recycle/duizhang/gettradingflow?'+param;
	return false; //截取返回false就不会保存网页了
}


function flagException(){
      $.post('/recycle/duizhang/flagexception', {orderId: ''}, function(data) {
          if(data){
              alert('标记成功');
          }else{
              alert('标记失败');
          }
     
    }, 'json');
}

function doSearch(){
	grid.query(getParams());
}
