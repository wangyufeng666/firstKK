var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"订单编号", dataIndex:'ORDERNO', width:'120px',sortable:false}
			,{header:"品类", dataIndex:'MERTYPE', width:'80px',sortable:false}
			,{header:"商品型号", dataIndex:'MERNAME', sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"付款/发券日期", dataIndex:'PAYDATE', width:'130px',sortable:false}
			,{header:"联系方式", dataIndex:'LIANXIREN', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"联系地址", dataIndex:'DIZHI', width:'160px',sortable:false}
			,{header:"支付类型", dataIndex:'ORDER_TYPE', width:'80px',sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '2' ? '先行支付' : '普通回收';
				}
			}
			,{header:"订单状态", dataIndex:'ORDERSTATUS', width:'80px',sortable:false}
			,{header:"付款方式", dataIndex:'PAYTYPE', width:'80px',sortable:false}
			,{header:"支付类型", dataIndex:'PAYTYPE1', width:'80px',sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '3' ? '券' : '现金转账';
				}
			}
		]
		,url:'/idlefish/orderreport/orderpagelist'
		,baseParams:{isAll:'all'}
	});
});

function getParams(){
	return {
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		startDate:$('#startCreateDate').val(),
		endDate:$('#endCreateDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		isAll:'all'
	};
}

function doSearch(){
	grid.query(getParams());
}

function exportReport(){
	var category = $('#category').val();
	var merType = $('#merType').val();
	var startDate = $('#startCreateDate').val();
	var endDate = $('#endCreateDate').val();
	
	var params = '?cateogry='+category+'&merType='+merType+'&startDate'+startDate+'&endDate='+endDate;
	window.location.href = '/idlefish/orderreport/exporttradereport'+params;
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area : ['280px','auto'],
		dialog : {msg:msg, type:8}
	});
}