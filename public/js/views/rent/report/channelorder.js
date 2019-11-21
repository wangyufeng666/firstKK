
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'50px',sortable:false}
			,{header: "订单来源", dataIndex: 'SOURCENAME', width:'200px',sortable:false}
            ,{header: "子渠道", dataIndex: 'PARTNERNAME', width:'200px',sortable:false}
            ,{header: "总订单", dataIndex: 'COUNTS', width:'100px',sortable:false}
            ,{header: "有效订单", dataIndex: 'VALID', width:'100px',sortable:false}
            
		]
		,url : '/rent/report/channelorderpage'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,countfun: countfun()


	});
});
     
function countfun(){
	var startDate=$('#startDate').val();
	var endDate=$('#endDate').val();
	$.post('/rent/report/channelordercount',{startDate:startDate,endDate:endDate},function(data){
		var totalOrderCount = data.ORDERCOUNT ? data.ORDERCOUNT : '0';
		var totalValidCount = data.VALIDORDERCOUNT ? data.VALIDORDERCOUNT : '0';
		$('#totalOrderCount').text(totalOrderCount);
		$('#totalValidCount').text(totalValidCount);
	},'json')
}

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
	countfun();
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
	window.location.href = '/rent/report/channelorderexport'+param;
});
