var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "客户姓名", dataIndex: 'USERNAME', width:'40px',sortable:false}
			,{header: "联系方式", dataIndex: 'CONTACTWAY', width:'60px',sortable:false}
			,{header: "订单编号", dataIndex: 'ORDERNO', width:'90px',sortable:false}
			,{header: "订单来源", dataIndex: 'SOURCENAME', width:'80px',sortable:false}
			,{header: "来电类型", dataIndex: 'CALLTYPENAME', width:'60px',sortable:false}
			,{header: "来电内容", dataIndex: 'CONTENTNAME', width:'100px',sortable:false}
			,{header: "客服", dataIndex: 'KEFUNAME', width:'100px',sortable:false}
			,{header: "投诉单", dataIndex: 'CALLCOMPLAINID', width:'80px',sortable:false}
			,{header: "来电时间", dataIndex: 'CREATEDATE', width:'80px',sortable:false}
			,{header: "业务", dataIndex: 'CALLSOURCENAME', width:'80px',sortable:false}
			,{header: "来电详情", dataIndex: 'CALLINDETAIL', width:'80px',sortable:false}
		]
		,url : '/call/record/callindexpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,20,30,50]
 	});
});

function initParams(){
	var params = getParams();
	params['start'] = start;
	params['limit'] = limit;
	return params;
}


function getParams(){
	return {
		orderNo:$('#orderNo').val(),
		username:$('#username').val(),
		contactWay:$('#contactWay').val(),
		callType:$('#callType').val(),
		callSource:$('#callSource').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

function doSearch(){
	var orderNo = $('#orderNo').val();
	var contactWay = $('#contactWay').val();
	if(contactWay != '' && contactWay.length< 11){
		messagesBox('手机号必须填写11位');
	}else if(orderNo != '' && orderNo.length< 3){
		messagesBox('订单编号最少填3位');
	}else{
		layer.load('数据加载中...', 1);
		grid.query(getParams());
	}
}

function messagesBox(msg){
	$.layer({
		title:'提示',
		area : ['280px','auto'],
		dialog : {msg:msg, type:8}
	});
}

/**
 * 导出
 */
function callInExport(){
	var params = {};
	params.startDate = $('#startDate').val();
	params.endDate = $('#endDate').val();
	params.orderNo = $('#orderNo').val();
	params.username = $('#username').val();
	params.contactWay = $('#contactWay').val();
	params.callType = $('#callType').val();
	params.callSource = $('#callSource').val();
	window.location.href='/call/record/callindexexport?startDate='+params.startDate+'&endDate='+params.endDate+'&orderNo='+params.orderNo
		+'&username='+params.username+'&contactWay='+params.contactWay+'&callType='+params.callType+'&callSource='+params.callSource;

}