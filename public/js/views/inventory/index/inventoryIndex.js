var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15
		,height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"订单编码", dataIndex:'ORDERNO', width:'170px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:orderInfo(\''+value+'\')" title="'+value+'" class="a_link">'+value+'</a>';
				}
			}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+"  "+value;
				}
			}
			,{header:"订单价格", dataIndex:'DINGDANPRICE', width:'70px',sortable:false}
			,{header:"成交价格", dataIndex:'SETTLEPRICE', width:'70px',sortable:false}
			,{header:"入库日期", dataIndex:'STRINWAREDATE', width:'100px',sortable:false}
			,{header:"出库日期", dataIndex:'STROUTWAREDATE', width:'100px',sortable:false}
			,{header:"订单来源", dataIndex:'ORDERTYPE', width:'100px',sortable:false}
//			,{header:"结算方式", dataIndex:'EVENTNAME', width:'100px',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'80px',sortable:false}
			,{header:"库存状态", dataIndex:'', width:'130px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var status = data['INVENTORYSTATUS']; 
					var applySourceName = data['APPLYSOURCENAME']; 
					var sourceNameText = data['INVENTORYSTATUSNAME'];
					if(applySourceName){
						sourceNameText += '('+applySourceName+')';
					}
					return sourceNameText;
				}
			}
			,{header:"操作", dataIndex:'ORDERNO', width:'80px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
				}
			}
		]
		,url:'/inventory/order/wareorderlist'
		,pageSizeList:[15, 30, 50]
	});
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		content:'/order/order/orderinfo?orderNo='+orderNo,
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
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
	grid.query(getParams());
}

function downloadOrder(){
	var param = '';
	param += 'orderNo=' + $('#orderNo').val();
	param += '&category=' + $('#category').val();
	param += '&startCreateDate=' + $('#startCreateDate').val();
	param += '&endCreateDate=' + $('#endCreateDate').val();
	param += '&outStartDate=' + $('#outStartDate').val();
	param += '&outEndDate=' + $('#outEndDate').val();
	param += '&inventoryStatus=' + $('#inventoryStatus').val();
	window.location.href = '/inventory/order/wareorderexport?'+param;
	return false; //截取返回false就不会保存网页了
}

//监听回车键
$('html').keydown(function(e){
	if(e.which == '13'){
		doSearch();
	}
});
