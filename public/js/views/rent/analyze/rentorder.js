
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'5%',sortable:false}
			,{header: "来源", dataIndex: 'SOURCENAME', width:'20%',sortable:false}
            ,{header: "下单量", dataIndex: 'ORDERCOUNT', width:'10%',sortable:false}
            ,{header: "有效订单量", dataIndex: 'VALIDORDER', width:'10%',sortable:false}
            ,{header: "交易成功量", dataIndex: 'RENTCOUNT', width:'10%',sortable:false}
            ,{header: "违约用户数", dataIndex: 'NOCOUNT', width:'10%',sortable:false}
            ,{header: "租赁总台数", dataIndex: 'TOTALCOUNT', width:'10%',sortable:false}
		]
		,url : '/rent/analyze/rentorderpage'
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
		sourceCode:$('#sourceCode').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
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
	var sourceCode = $('#sourceCode').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var param = '?sourceCode='+sourceCode+'&startDate='+startDate+'&endDate='+endDate;
	window.location.href = '/rent/analyze/exportorder'+param;
});

