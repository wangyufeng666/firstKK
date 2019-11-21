var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'CREATEDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'TYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "品牌名称", dataIndex: 'PNAME', width:'140px',sortable:false}
			,{header: "询价金额", dataIndex: 'MERPRICE', width:'70px',sortable:false}

		]
		,url : '/order/suning/pageinquirylist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
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
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/suning/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}


/**
 * 发券操作
 * @param orderId
 * @return
 */
function sendCoupon(orderNo){
	window.location.href = "/order/suning/sendcouponpage?orderNo="+orderNo+"&backUrl="+backUrl;
}

function getParams(){
	return {
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()

	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg,type:8}
	});
}

function downloadSuningExport(){
	var param = '';
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	window.location.href = '/order/suning/suninginquiryexport?'+param;
	return false; //截取返回false就不会保存网页了
}
