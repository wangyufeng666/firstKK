var grid, layerIndex = 0;
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
			,{header:"结算方式", dataIndex:'EVENTNAME', width:'100px',sortable:false}
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
			,{header:"操作", dataIndex:'', width:'130px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='';
					var orderNo = data['ORDERNO'];
					var applySource = data['APPLYSOURCE'];
					var status = data['INVENTORYSTATUS'];
					//1:已入库； 3:已出库； 4:待领用出库；5:已领用出库；
					
					if(status == '1'){//已入库
						returnText+=' <a href="javascript:apply(\''+orderNo+'\')" class="a_link">领用</a>';
						returnText+='| <a href="javascript:outWarehouse(\''+orderNo+'\')" class="a_link">出库</a>';
					}else if(status == '4'){//审批
						returnText+=' <a href="javascript:approval(\''+orderNo+'\',\''+applySource+'\')" class="a_link">审批</a>';
					}else if(status == '5'){//归还
						returnText+=' <a href="javascript:giveBack(\''+orderNo+'\',\''+applySource+'\')" class="a_link">归还</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/inventory/order/wareorderlist'
		,pageSizeList:[15, 30, 50]
		,baseParams:getParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
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
		content:"/order/order/orderinfo?orderNo="+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 领用操作
 */
function apply(orderNo){
	layer.open({
		type:2,
		title:'领取申请',
		content:'/inventory/order/applyindex?orderNo='+orderNo,
		area:['400px', '300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 审批操作
 */
function approval(orderNo, applySource){
	layer.open({
		type:2,
		title:'审批状态',
		content:'/inventory/order/approvalindex?orderNo='+orderNo+'&applySource='+applySource,
		area:['280px', '120px'],
		close:function(index){
			layer.close(index);
		},
	});
}

/**
 * 归还入库
 */
function giveBack(orderNo, applySource){
	if(confirm('是否归还入库？')){
		$.post('/inventory/order/giveback',{orderNo:orderNo,applySource:applySource},function(data){
			grid.reload();//刷新
		});
	}
}

/**
 * 批量归还入库
 */
function returnWarehouses(){
	window.location.href = '/inventory/order/returnwarehousesindex';
}

/**
 * 仓库统计
 */
function statisticsWarehouses(){
	layer.open({
		type:2,
		title:'仓库统计',
		content:'/inventory/order/statisticswarehouses',
		area:['400px', '300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 商品出库
 */
function outWarehouse(orderNo){
	layer.open({
		type:2,
		title:'商品出库',
		content:'/inventory/order/outwarehouseindex?orderNo='+orderNo,
		area:['400px', '300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 3C批量出库
 */
function outWarehouses(){
	window.location.href = '/inventory/order/outwarehousesindex?source='+$('#orderType').val();
}

/**
 * 3C批量退库
 */
function backWarehouses(){
	window.location.href = '/inventory/order/backwarehousesindex';
}

/**
 * 库存盘点
 */
function checkWarehouse(){
	window.location.href = '/inventory/order/checkwarehouseindex';
}

function scan(){
	var orderStr = $('#orderNo').val();
	var pos;
	if( (pos = orderStr.indexOf('≌'))>0){
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
		source:$('#orderType').val(),
		inventoryStatus:$('#inventoryStatus').val()//库存状态
	};
}

function doSearch(){
	layerIndex = layer.msg('正在查询，请稍后...', {icon:16, time:10000});
	var s = grid.query(getParams());
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
	param += '&source='+$('#orderType').val();
	window.location.href = '/inventory/order/wareorderexport?'+param;
	return false; //截取返回false就不会保存网页了
}

//监听回车键
$('html').keydown(function(e){
	if(e.which == '13'){
		doSearch();
	}
});