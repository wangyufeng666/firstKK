
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'40PX',sortable:false}
			,{header: "时间", dataIndex: 'STIME', width:'150px',sortable:false}
            ,{header: "商品品类", dataIndex: 'MERTYPE', width:'100px',sortable:false}
            ,{header: "检测量", dataIndex: 'INSPECTION_SUM', width:'100px',sortable:false}
            ,{header: "成交量", dataIndex: 'TRADE_SUM', width:'100px',sortable:false}
            ,{header: "议价数", dataIndex: 'BARGAIN_SUM', width:'100px',sortable:false}
            ,{header: "推送量", dataIndex: 'PUSH_SUM', width:'100px',sortable:false}
            ,{header: "推送议价量", dataIndex: 'PUSH_BARGAIN_SUM', width:'100px',sortable:false}
            ,{header: "议价率", dataIndex: 'BARGAIN_RATE', width:'100px',sortable:false}
            ,{header: "推送议价率", dataIndex: 'PUSH_BARGAIN_RATE', width:'100px',sortable:false}
		]
		,url : '/analyze/analyze/bargainpagelist'
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
		merType:$('#merType').val(),
		partnerCode:$('#partnerCode').val(),
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
	var merType = $('#merType').val();
	var partnerCode = $('#partnerCode').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var param = '?merType='+merType+'&partnerCode='+partnerCode+'&startDate='+startDate+'&endDate='+endDate;
	window.location.href = '/analyze/analyze/bargainexportlist'+param;
});
