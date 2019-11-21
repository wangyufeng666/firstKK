var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :15,
		height:375
		,cm : [
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品品类", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "商品名称", dataIndex: 'MERNAME',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "用户名", dataIndex: 'USERNAME', width:'120px',sortable:false}
			,{header: "订单来源", dataIndex: 'STORENAME', width:'120px',sortable:false}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'65px',sortable:false}
			,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'65px',sortable:false}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'65px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'65px',sortable:false}
			,{header: "操作", dataIndex: '', width:'60px', sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}
		]
		,url : '/sony/storeorder/pagelist'
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});
	
	//日期验证
	$('#startCreateDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endCreateDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
});

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'回收订单详情',
		shadeClose:false,
		content:'/sony/storeorder/orderinfo?orderNo='+orderNo,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		orderType:$('#orderType').val(),
		tradeType:$('#tradeType').val(),
		contactWay:$('#contactWay').val(),
		orderStatus:$('#orderStatus').val(),
		startCreateDate:$('#startCreateDate').val(),
		endCreateDate:$('#endCreateDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		address:$('#address').val()
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

function downloadOrder(){
	var param = {};
	param.orderType = '17';
	param.tradeType = $('#tradeType').val();
	param.category = $('#category').val();
	param.merType = $('#merType').val();
	param.merName = $('#merName').val();
	param.orderNo = $('#orderNo').val();
	param.orderStatus = $('#orderStatus').val();
	param.startCreateDate = $('#startCreateDate').val();
	param.endCreateDate = $('#endCreateDate').val();
	param.address = $('#address').val();
	window.location.href = '/sony/storeorder/orderexport?'+$.param(param);
	return false; //截取返回false就不会保存网页了
}