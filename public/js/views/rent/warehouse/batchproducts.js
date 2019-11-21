var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'3%',sortable:false} 
			,{header: "商品名称", dataIndex: 'STOCKNAME', width:'150px',sortable:false}
			,{header: "商品颜色", dataIndex: 'STOCKCOLOR', width:'90px',sortable:false}
			,{header: "入库时间", dataIndex: 'INTIME', width:'100px',sortable:false}
			,{header: "入库操作人", dataIndex: 'INUSERID', width:'160px',sortable:false}
			,{header: "采购商", dataIndex: 'PURCHASERS', width:'65px',sortable:false}
			,{header: "采购金额", dataIndex: 'AMOUNT', width:'65px',sortable:false}
			,{header: "机器码", dataIndex: 'MECHINENO', width:'100px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUS', width:'65px',sortable:false}
    ]
    ,url : '/rent/warehouse/productslist?batchNo='+$('#thisbatcNo').val()
  });
});

/**
 * 跳转到新增租赁库存界面
 */
function addWarehouseRecord(){
	layer.open({
		type:2,
		title:'新增租赁库存',
		shadeClose:false,
		shade:0.8,
		content:'/rent/warehouse/addproducts',
		area:['600px','300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 租赁详情
 * @param orderNo
 * @return
 */
function rentInfo(cartNo){
	window.location.href = "/rent/rent/rentinfo?cartNo="+cartNo;
}

function getParams(){
	return {
		stockName:$('#stockName').val(),
		status:$('#status').val(),
		batcNo:$('#thisbatcNo').val(),
	};
}

function doSearch(){
	var index = layer.load('数据加载中...',1);
	grid.query(getParams());
	layer.close(index);
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area : ['280px','auto'],
		dialog : {msg:msg, type:8}
	});
}

function showbatchproducts(batchNo){
	layer.open({
		type:2,
		title:'批次商品列表',
		content:'/rent/warehouse/batchproducts?batchNo='+batchNo,
		area:['90%', '90%']
	});
}