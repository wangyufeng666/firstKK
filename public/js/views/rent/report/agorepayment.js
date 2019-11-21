
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "还款日", dataIndex: 'START_DATE', width:'10%',sortable:false}
            ,{header: "应还订单数", dataIndex: 'ORDER_COUNT', width:'5%',sortable:false}
            ,{header: "已还订单数", dataIndex: 'END_COUNT', width:'5%',sortable:false}
            ,{header: "应收账款", dataIndex: 'RENT_PRICE', width:'5%',sortable:false}
            ,{header: "已收账款", dataIndex: 'END_PRICE', width:'5%',sortable:false}
            ,{header: "订单还款完成度", dataIndex: 'PROCE_PRICE', width:'7%',sortable:false}
            ,{header: "还款完成度", dataIndex: 'PROCE_END', width:'5%',sortable:false}
            ,{header:"操作", dataIndex:'', width:'10%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var start_date = data['START_DATE'];
					var html = "<a class='a_link' href='javaScript:infos(\""+start_date+"\")'>详情</a>";
				    return html;
				}
			}
		]
		,url : '/rent/report/agorepaymentpage'
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
		days:$('#days').val()
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
	var days = $('#days').val();
	var param = '?days='+days;
	window.location.href = '/rent/report/agorepaymentexport'+param;
});

function infos(start_date){
	if(start_date){
		window.location.href='/rent/report/agorepaymentinfo?start_date='+start_date;
	}else{
		alert('错误，稍后再试');
	}
}