var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"品类", dataIndex:'MERTYPE', width:'80px',sortable:false}
			,{header:"品牌", dataIndex:'PNAME', width:'80px',sortable:false}
			,{header:"商品型号", dataIndex:'MERNAME', sortable:false}
			,{header:"付款/发券日期", dataIndex:'PAYDATE', width:'130px',sortable:false}
			,{header:"联系人", dataIndex:'LIANXIREN', width:'70px',sortable:false}
			,{header:"联系电话", dataIndex:'LIANXIDH', width:'80px',sortable:false}
			,{header:"地区", dataIndex:'DISTRICT', width:'80px',sortable:false}
			,{header:"订单来源", dataIndex:'ORDERSOURCE', width:'100px',sortable:false}
			,{header:"订单状态", dataIndex:'ORDERSTATUS', width:'80px',sortable:false}
			,{header:"付款方式", dataIndex:'PAYTYPE', width:'100px',sortable:false}
			,{header:"支付类型", dataIndex:'PAYTYPE1', width:'100px',sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '3' ? '券' : '现金转账';
				}
			}
		]
		,url:'/offline/report/tradereportpagelist'
		,baseParams:{isAll:'all'}
	});
});


function getParams(){
	return {
		contacts:$('#contacts').val(),
		merName:$('#merName').val(),
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		tradeType:$('#tradeType').val(),
		startDate:$('#startCreateDate').val(),
		endDate:$('#endCreateDate').val(),
		orderStatus:$('#orderStatus').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		address:$('#address').val(),
		isAll:'all'
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area : ['280px','auto'],
		dialog : {msg:msg, type:8}
	});
}

function exportOrder(){
	var param = '';
	param += '&category=' + $('#category').val();
	param += '&orderType='+$('#orderSource').val();
	param += '&startCreateDate='+ $('#startCreateDate').val();
	param += '&endCreateDate='+ $('#endCreateDate').val();
	param += '&orderStatus='+ $('#orderStatus').val();
	window.location.href = '/offline/report/exporttradereport?'+param;
	return false; //截取返回false就不会保存网页了
}