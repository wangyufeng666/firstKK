var backUrl = '/rent/report/anonrepaymentinfo';
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "订单时间", dataIndex: 'CREATE_DATE', width:'10%',sortable:false}
			,{header: "订单编号", dataIndex: '', width:'15%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:orderInfo(\''+data['ORDER_NO']+'\');" class="a_link">'+data['ORDER_NO']+"</a>";
				}
			}
            ,{header: "品类", dataIndex: 'CATEGORY', width:'5%',sortable:false}
            ,{header: "品牌", dataIndex: 'BRAND', width:'5%',sortable:false}
            ,{header: "租赁人", dataIndex: 'UNAME', width:'5%',sortable:false}
            ,{header: "联系方式", dataIndex: 'MOBILE', width:'10%',sortable:false}
            ,{header: "地址", dataIndex: 'ADDRESS', width:'10%',sortable:false}
            ,{header: "应还金额", dataIndex: 'RENT_PRICE', width:'5%',sortable:false}
            ,{header: "还款期数", dataIndex: 'PERIODNAME', width:'5%',sortable:false}
		]
		,url : '/rent/report/anonrepaymentinfopage'
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
		params['start_date'] = start_date;
		return params;
	}else{
		var params = [];
		params['start_date'] = start_date;
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
	var param = '?start_date='+start_date;
	window.location.href = '/rent/report/anonrepaymentinfoexport'+param;
});

function orderInfo(orderNo){
	if(orderNo){
		backUrl = backUrl+'?start_date='+start_date;
		window.location.href='/rent/installment/orderinfo?order_no='+orderNo+'&backUrl='+backUrl;
	}else{
		alert('错误，稍后再试');
	}
}