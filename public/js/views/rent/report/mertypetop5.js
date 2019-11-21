
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "品类", dataIndex: 'PRODUCT_TYPE_NAME', width:'10%',sortable:false}
            ,{header: "品牌", dataIndex: 'BRAND_NAME', width:'10%',sortable:false}
            ,{header: "商品名称", dataIndex: 'PRODUCT_NAME', width:'10%',sortable:false}
            ,{header: "商品配置", dataIndex: 'MODEL_NAME', width:'10%',sortable:false}
            ,{header: "采购价格", dataIndex: 'PURCHASE_PRICE', width:'10%',sortable:false}
            ,{header: "租金", dataIndex: 'RENTMINPRICE', width:'10%',sortable:false}
            ,{header: "订单量", dataIndex: 'ORDERCOUNT', width:'5%',sortable:false}
            
		]
		,url : '/rent/report/mertypetop5page'
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
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
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
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var param = '?startDate='+startDate+'&endDate='+endDate;
	window.location.href = '/rent/report/mertypetop5export'+param;
});

