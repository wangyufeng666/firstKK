
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "违约期数", dataIndex: 'BREACH_COUNT', width:'10%',sortable:false}
            ,{header: "违约库客户数", dataIndex: 'BREACH_USER', width:'10%',sortable:false}
            ,{header: "新机价格", dataIndex: 'NEW_PRICE', width:'10%',sortable:false}
            ,{header: "采购价格", dataIndex: 'PURCHASE_PRICE', width:'10%',sortable:false}
            ,{header: "租金", dataIndex: 'FREEZE_PRICE', width:'10%',sortable:false}
            ,{header: "已支付金额", dataIndex: 'PAY_PRICE', width:'10%',sortable:false}
		]
		,url : '/rent/report/breachusercountpage'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		var params = [];
		return params;
	}
}

function getParams(){
	return {

	};
}


function doSearch(){
	layer.msg('加载中', {icon:16,shade:0.1});
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

$('#exportlist').on('click',function(){
	window.location.href = '/rent/report/breachusercountexport';
});

