var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10
		,height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'40px',sortable:false}
			,{header: "订单编码", dataIndex: 'ORDERNO', width:'170px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "商品名称", dataIndex: 'MERNAME', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+"  "+value;
				}
			}
			,{header: "订单价格", dataIndex: 'DINGDANPRICE', width:'70px',sortable:false}
			,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'70px',sortable:false}
			,{header: "入库日期", dataIndex: 'STRINWAREDATE', width:'100px',sortable:false}
			,{header: "出库日期", dataIndex: 'STROUTWAREDATE', width:'100px',sortable:false}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'80px',sortable:false}
			,{header: "库存状态", dataIndex: '', width:'130px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var status = data['INVENTORYSTATUS']; 
					var applySourceName = data['APPLYSOURCENAME']; 
					var sourceNameText = data['INVENTORYSTATUSNAME'];
					if(applySourceName){
						sourceNameText += '('+applySourceName+')';
					}
					return sourceNameText;
				}
			}
			,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='';
					var orderNo = data['ORDERNO'];
					
					returnText+=' <a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}
		]
		,url : '/inventory/order1/wareorderlist'
		,pageSizeList:[10, 15, 20, 30, 50]
		,afterRender:function(e, grid){
			$("#totalPrice span").html(grid.data['totalPrice']);
		}
	});
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/order2/orderinfo?orderNo="+orderNo+"&backUrl=/inventory/order/warehouseindex";
}

function scan(){
	var orderStr = $('#orderNo').val();
	var pos;
	if((pos = orderStr.indexOf('≌'))>0){
		var orderNo=orderStr.substr(0,pos);
		layer.load('订单编号：'+orderNo, 1);
		grid.query({orderNo:orderNo,orderStatus:5});
		$('#orderNo').val('');
	}
}

function getParams(){
	return {
		orderNo:$('#orderNo').val(), //商品名称
		category:$('#category').val(),//品类
		startCreateDate:$('#startCreateDate').val(),
		endCreateDate:$('#endCreateDate').val(),
		outStartDate:$('#outStartDate').val(),
		outEndDate:$('#outEndDate').val(),
		inventoryStatus:$('#inventoryStatus').val()//库存状态
	};
}

function doSearch(){
	layer.msg('正在查询，请稍后...', 2, 16);
	var s = grid.query(getParams());
}

//监听回车键
$('html').keydown(function(e){
	if(e.which == '13'){
		doSearch();
	}
});

/**
 * 导出销售订单
 */
function downOrder(){
	var param = '';
	param += 'orderNo=' + $('#orderNo').val();
	param += '&inventoryStatus=' + $('#inventoryStatus').val();
	param += '&startCreateDate=' + $('#startCreateDate').val();
	param += '&endCreateDate=' + $('#endCreateDate').val();
	param += '&outStartDate=' + $('#outStartDate').val();
	param += '&outEndDate=' + $('#outEndDate').val();
	window.location.href = '/inventory/order1/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}