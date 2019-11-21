var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "IMEI", dataIndex: 'MERSEQUENCE', width:'120px',sortable:false}
			,{header: "所属门店", dataIndex: 'HNAME', width:'80px',sortable:false}
			,{header: "店员", dataIndex: 'NAME', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['NAME']+'('+data['MOBILE']+')';
				}
			}
			,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header: "库存状态", dataIndex: 'GOMESTORAGENAME', width:'60px',sortable:false}
			,{header: "入库日期", dataIndex: 'INWAREDATE', width:'120px',sortable:false}
			,{header: "出库日期", dataIndex: 'OUTWAREDATE', width:'120px',sortable:false}
			,{header: "订单价格", dataIndex: '', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header: "操作", dataIndex: '', width:'120px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var status = data['ORDERSTATUS'];
					var merType = data['MERTYPE'];
					var inventoryStatus = data['INVENTORYSTATUS'];
					var batchCode = data['BATCHCODE'];
					var outWareDate = data['OUTWAREDATE'];
					var inspectionbillid = data['INSPECTIONBILLID'];
					var returnText ='<a title="'+orderNo+'" href="javascript:orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					//待检测
					/*if(status == '3' && inventoryStatus == '2'){
						if(data['INSPECTIONBILLID'] != null){
							returnText += ' | <a href="javascript:orderInspection(\''+orderNo+'\', \''+merType+'\')" class="a_link">复检</a>';
						}else{
							returnText += ' | <a href="javascript:orderInspection(\''+orderNo+'\', \''+merType+'\')" class="a_link">检测</a>';
						}
					}*/
					if(outWareDate && !inspectionbillid && batchCode){
						returnText +=' | <a title="'+orderNo+'" href="javascript:collectgoods(\''+orderNo+'\',\''+batchCode+'\')" class="a_link">收货</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/order/gomestore/storagepagelist'
		,baseParams:initParams()
		,afterRender:function(){
			layer.close(layerIndex);
		}
		,pageSizeList:[10,15,20,30,50]
	});
	
	//订单日期验证
	$('#startDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	

	//入库日期验证
	$('#inwareDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endInwareDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});

	//出库日期验证
	$('#outwareDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endOutwareDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
});

function initParams(){
	return getParams();
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		content:"/order/offline/orderinfo?orderNo="+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 检测操作
 * @param orderId
 * @return
 */
function orderInspection(orderNo, merType){
	window.location.href = "/order/order/orderinspection?orderNo="+orderNo;
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		contactWay:$('#contactWay').val(),
		partnerCode:$('#partnerCode').val(),
		gomeStorageStatus:$('#gomeStorageStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		inwareDate:$('#inwareDate').val(),
		endInwareDate:$('#endInwareDate').val(),
		outwareDate:$('#outwareDate').val(),
		endOutwareDate:$('#endOutwareDate').val(),
		address:$('#address').val(),
		partnerName:$('#partnerName').val(),
		expressNum:$('#expressNum').val(),
		visitFlag:$('#visitFlag').val(),
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

/*
 * 修改状态
 */
function collectgoods(orderNo,batchCode){
	if(confirm('确认收货自动检测进入待入库？')){
		$.post('/order/gomestore/collectgoods',{orderNo:orderNo,batchCode:batchCode},function(data){
			if(data == 'Y'){
				alert('操作成功');
			}else{
				alert('操作失败');
			}
			doSearch();
		})
	}
}