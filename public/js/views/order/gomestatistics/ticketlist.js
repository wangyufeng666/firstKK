var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
	     	{checkbox:true}
			,{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单编号", dataIndex: 'ORDERNO', width:'80px',sortable:false}
			,{header: "劵码", dataIndex: 'COUPONCODE', width:'130px',sortable:false}
			,{header: "券码金额", dataIndex: 'PRICE', width:'80px',sortable:false}
			,{header: "发券时间", dataIndex: 'CREATEDATE', width:'150px',sortable:false}
			,{header: "使用状态", dataIndex: 'COUPONSTATUS', width:'80px',sortable:false}
			,
		]
		,url:'/order/gomestatistics/ticketpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	var params = getParams();
	params.start = start;
	params.limit = limit;
	return params;
}



function getParams(){
	return {
		startDate:startDate,
		endDate:endDate,
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
		dialog:{msg:msg, type:8}
	});
}