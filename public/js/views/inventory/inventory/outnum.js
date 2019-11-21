var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm :[
			{header:"NO.",dataIndex:'R',width:'50px',sortable:false}
			,{header:"出库时间",dataIndex:'OUTWAREDATE',width:'150px',sortable:false}	
			,{header:"库存ID",dataIndex:'INVENTORYID',width:'150px',sortable:false}
			,{header:"订单编号",dataIndex:'ORDERNO',width:'150px',sortable:false}	
			,{header:"商品ID",dataIndex:'SPID',width:'150px',sortable:false}		
		]
		,url:'/inventory/inventory/outnumlist'
		,baseParams : initParams()
		,pageSizeList : [10,20,200]
	});
});

function initParams(){
	var params = getParams();
	params.start = start;
	params.limit = limit;
	return params;
}
function getParams(){
	return{
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
	}
}
function doSearch(){
	grid.query(getParams());
}

function doExport(){
	var param = '';
	param += '&startDate=' +$('#startDate').val();
	param += '&endDate=' + $('#endDate').val();		
	window.location.href = "/inventory/inventory/outnumexecl?"+encodeURI(param);
}