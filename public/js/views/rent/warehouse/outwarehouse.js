
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "采购时间", dataIndex: 'PURCHASETIMEM', width:'10%',sortable:false}
			,{header: "采购单号", dataIndex: 'BATCHNO', width:'10%',sortable:false}
			,{header: "商品类型", dataIndex: 'TYPENAME', width:'5%',sortable:false}
			,{header: "商品名称", dataIndex: 'STOCKNAME', width:'10%',sortable:false}
			,{header: "机器码", dataIndex: 'MECHINENO', width:'10%',sortable:false}
            ,{header: "采购商", dataIndex: 'PARTNERNAME', width:'10%',sortable:false}
            ,{header: "采购金额", dataIndex: 'AMOUNT', width:'5%',sortable:false}
            ,{header: "入库时间", dataIndex: 'INTIME', width:'10%',sortable:false}
            ,{header: "入库人", dataIndex: 'INUSERNAME', width:'5%',sortable:false}
            ,{header: "出库时间", dataIndex: 'OUTTIME', width:'10%',sortable:false}
            ,{header: "出库人", dataIndex: 'OUTUSERNAME', width:'5%',sortable:false}
            ,{header: "状态", dataIndex: 'STATUSTXT', width:'5%',sortable:false}
            ,{header: "入库类型", dataIndex: 'TYPESTXT', width:'5%',sortable:false}
		]
		,url : '/rent/warehouse/warehousepage'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		},
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		params['status'] = 2;
		return params;
	}else{
		var params = [];
		params['status'] = 2;
		return params;
	}
}

function getParams(){
	return {
		puCode:$('#puCode').val(),
		bizCode:$('#bizCode').val(),
		imei:$('#imei').val(),
		merName:$('#merName').val()
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
	var puCode = $('#puCode').val();
	var bizCode = $('#bizCode').val();
	var imei = $('#imei').val();
	var merName = $('#merName').val();
	var param = '?puCode='+puCode+'&bizCode='+bizCode+'&imei='+imei+'&merName='+merName+'&status=2';
	window.location.href = '/rent/warehouse/exportwarehouse'+param;
});
