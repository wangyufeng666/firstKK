var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "订单编号", dataIndex: 'ORDERNO', width:'10%',sortable:false}
			,{header: "代扣日期", dataIndex: 'WITHHOLD_DATE', width:'10%',sortable:false}
			,{header: "违约日期", dataIndex: 'BREACH_DATE', width:'10%',sortable:false}
			,{header: "代扣金额", dataIndex: 'WITHHOLD_PRICE', width:'5%',sortable:false}
			,{header:"联系电话", dataIndex:'', width:'10%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['MOBILE']+"("+data['UNAME']+")";
				}
			}
			,{header: "来源", dataIndex: 'SOURCENAME', width:'5%',sortable:false}
			,{header: "商品品类", dataIndex: 'CATEGORY', width:'5%',sortable:false}
			,{header: "品牌", dataIndex: 'PNAME', width:'5%',sortable:false}
			,{header: "商品名称", dataIndex: 'MERNAME', width:'10%',sortable:false}
			,{header: "订单金额", dataIndex: 'ORDERPRICE', width:'5%',sortable:false}
			,{header: "订单", dataIndex: 'STATUSNAME', width:'5%',sortable:false}
		]
		,url : '/report/report/withholdfailorderpage'
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
		params['status'] = $('#status').val();
		return params;
	}else{
		var params = [];
		params['status'] = $('#status').val();
		return params;
	}
}

function getParams(){
	return {
		orderNo:$('#orderNo').val(),
		mobile:$('#mobile').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		sourceCode:$('#sourceCode').val()
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
	var orderNo = $('#orderNo').val();
	var mobile = $('#mobile').val();
	var sourceCode = $('#sourceCode').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var param = '?orderNo='+orderNo+'&mobile='+mobile+'&sourceCode='+sourceCode+'&startDate='+startDate+'&endDate='+endDate;
	window.location.href = '/report/report/exportrecywithholdfail'+param;
});
