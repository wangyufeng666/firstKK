var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250,
		cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false}
			,{header:"电商订单号", dataIndex:'BATCHORDERNO', width:'120px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var batchCode = data['BATCHCODE'];
					var batchOrderNo = data['BATCHORDERNO'];
					return '<a href="javascript:orderInfo(\''+batchCode+'\')" class="a_link">'+batchOrderNo+'</a>';
				}
			}
			,{header:"销售单号", dataIndex:'SALENO', width:'120px',sortable:false}
			,{header:"回收单号", dataIndex:'ORDERNO', width:'130px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					return '<a href="javascript:recyOrderInfo(\''+orderNo+'\')" class="a_link">'+orderNo+'</a>';
				}
			}
			,{header:"下单时间", dataIndex:'ORDERDATE', width:'120px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'80px',sortable:false}
			,{header:"门店名称", dataIndex:'SHOPNAME', width:'80px',sortable:false}
			,{header:"门店类型", dataIndex:'TYPENAME', width:'80px',sortable:false}
			,{header:"销售金额", dataIndex:'SALEPRICE', width:'80px',sortable:false}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTS']+'('+data['MOBILE']+')';
				}
			}
			,{header:"联系地址", dataIndex:'ADDRESS', width:'80px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'200px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var batchCode = data['BATCHCODE'];
					var status = data['STATUS'];
					var returnText ='<a href="javascript:orderInfo(\''+batchCode+'\')" class="a_link">查看</a>';
					if(status == '6'){//退货寄回中状态-》才能确认收货
							returnText +=' | <a href="javascript:updateOrderStatus(\''+batchCode+'\', 70)" class="a_link">收货</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/sale/saleproductv2/receiptlist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[10,15,30,50]
	});
});

function initParams(){
	return getParams();
}

/**
 * 来源点击事件
 */
$(function(){
	$('#sources').change(function(){
		var thisId = $(this).val();
		getStoreNames(thisId);
	});
});

/**
 * 重置店铺名称
 * @param partnerType
 * @returns
 */
function getStoreNames(sourceCode){
	$('#storeType').html('<option value="">全部</option>');
	$.ajax({
		type:'GET',
		url:'/sale/saleproductv2/getstorenames?sourceCode='+sourceCode,
		async:false,//同步请求
		timeout:30000,
		success:function(data){
			if(data.length > 0){
				var optionHtml = '';
				for(i in data){
					optionHtml += '<option value="'+data[i]['SHOPCODE']+'">'+data[i]['SHOPNAME']+'</option>';
				}
			}
			$('#storeType').append(optionHtml);
		}
	});
}

/**
 * 申请退货
 */
function updateOrderStatus(batchCode, status){
	var text = '是否确认操作？',title='';
	if(batchCode == '' || batchCode == null || status == '' || status == null){
		layer.msg('订单编号缺失，无法操作！');
		return false;
	}
	
	if(status == '6'){
		text = '是否确认申请退货？';
		title = '申请退货';
	}else if(status == '7'){
		text = '是否确认同意退货？';
		title = '同意退货';
	}else if(status == '8'){
		text = '是否确认退货驳回？';
		title = '退货驳回';
	}else if(status == '66'){
		text = '是否确认交易完成？';
		title = '交易完成';
	}else if(status == '777'){
		text = '是否确认打印退货单？';
		title = '打印退货单';
	}else if(status == '888'){
		text = '是否确认打印二次发货单？';
		title = '打印二次发货单';
	}else if(status == '70'){
		//text = '是否确认打印二次发货单？';
		title = '退货寄回收货';
	}
	
	layer.open({
		type:2,
		title:title,
		shadeClose:false,
		shade:0.8,
		content:'/sale/saleproductv2/selectpage?batchCode='+batchCode+'&thisStatus='+status,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
  	     },
		cancel: function(){
			// 右上角关闭事件的逻辑
			reload();
		}
	});	
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(batchCode){
	layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/sale/saleproductv2/batchorderinfo?batchCode='+batchCode,
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
  	     },
		cancel: function(){
			// 右上角关闭事件的逻辑
			reload();
		}
	});
}

function getParams(){
	return {
		sources:$('#sources').val(),
		storeType:$('#storeType').val(),
		orderStatus:6,
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		orderNo:$('#orderNo').val(),
		contacts:$('#contacts').val(),
	};
}

/**
 * 回收订单详情
 * @param batchCode
 * @returns
 */
function recyOrderInfo(orderNo){
	layer.open({
		type:2,
		title:'回收订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/order/order/orderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}