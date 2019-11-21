var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'80px',sortable:false}
			,{header:"订单号", dataIndex:'ORDERNO', width:'90px',sortable:false}
			,{header:"联系人", dataIndex:'LIANXIREN', width:'90px',sortable:false}
			,{header:"联系方式", dataIndex:'LIANXIDH', width:'90px',sortable:false}
			,{header:"支付状态", dataIndex:'PAY_STATUS', width:'80px',sortable:false}
			,{header:"催缴金额", dataIndex:'AMOUNT', width:'70px',sortable:false}
			,{header:"支付时间", dataIndex:'PAY_TIME', width:'80px',sortable:false}
			,{header:"支付宝交易号", dataIndex:'ALIPAY_TRADE_NO', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}
		]
		,url:'/idlefishv3/orderrecover/pagelist'
		,baseParams:initParams()
	});
});

function initParams(){
	var params = getParams();
	if(backFlag == 'Y'){
		params['start'] = start;
		params['limit'] = limit;
	}
	return params;
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

function getParams(){
	var pageNum = 1, start = 0;
	if(grid && grid.getPageNumber()){
		pageNum = grid.getPageNumber();
		start = (pageNum-1) * grid.getPageSize(); 
	}
	return {
		start:start,
		orderNo:$('#orderNo').val(),
		payStatus:$('#payStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

function downloadZhiMaExport(){
	var param = '';
	param += '&orderNo=' + $('#orderNo').val();
	param += '&payStatus=' + $('#payStatus').val();	
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	window.location.href = '/idlefishv3/orderrecover/export?'+param;
	return false; //截取返回false就不会保存网页了
}

function doSearch(){
	grid.query(getParams());
}
