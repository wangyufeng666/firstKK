var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250,
		cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"订单号", dataIndex:'ORDERNO', width:'80px',sortable:false}
			,{header:"订单时间", dataIndex:'ORDERDATE', width:'100px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'80px',sortable:false}
			,{header:"门店名称", dataIndex:'SHOPNAME', width:'80px',sortable:false}
			,{header:"门店类型", dataIndex:'TYPENAME', width:'80px',sortable:false}
			,{header:"金额总计", dataIndex:'TOTALPRICE', width:'80px',sortable:false}
			,{header:"数量总计", dataIndex:'AMOUNT', width:'80px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var amount = data['AMOUNT'];
					return '<a href="javascript:saleOrderInfo(\''+orderNo+'\')" class="a_link" title="'+orderNo+'">'+amount+'</a>';
				}
			}
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
					if(status != '99'){//取消
						if(status == '1'){//待确认的才能打印
							returnText +=' | <a href="javascript:printOrder(\''+batchCode+'\',2)" class="a_link">打印发货单</a>';
						}else if(status == '4'){//已发货的状态-》才能申请退货和交易完成
							returnText +=' | <a href="javascript:updateOrderStatus(\''+batchCode+'\', 6)" class="a_link">申请退货</a>';
							returnText +=' | <a href="javascript:updateOrderStatus(\''+batchCode+'\', 66)" class="a_link">交易完成</a>';
						}else if(status == '71'){//检测完成-》才能确认收货
							returnText +=' | <a href="javascript:updateOrderStatus(\''+batchCode+'\', 7)" class="a_link">同意退货</a>';
							returnText +=' | <a href="javascript:updateOrderStatus(\''+batchCode+'\', 8)" class="a_link">退货驳回</a>';
						}else if(status == '7'){
							returnText +=' | <a href="javascript:updateOrderStatus(\''+batchCode+'\',777)" class="a_link">打印退货单</a>';
						}else if(status == '8'){
							returnText +=' | <a href="javascript:updateOrderStatus(\''+batchCode+'\',888)" class="a_link">打印二次发货单</a>';
							returnText +=' | <a href="javascript:updateOrderStatus(\''+batchCode+'\', 66)" class="a_link">交易完成</a>';
						}
					}
					if(status == '1' || status == '2' || status == '3'){
						returnText +=' | <a href="javascript:cancleOrder(\''+batchCode+'\',65)" class="a_link">取消</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/sale/saleproductv2/pagelist'
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
 * 销售子订单明细
 * @param orderNo
 * @returns
 */
function saleOrderInfo(orderNo){
	layer.open({
		type:2,
		title:'销售子订单明细',
		shadeClose:false,
		shade:0.8,
		content:'/sale/saledetail/index?saleNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});	
}

/**
 * 选择发货单页面
 * @param orderNo
 * @returns
 */
function printOrder(batchCode, status){
	layer.open({
		type:2,
		title:'选择发货单页面',
		shadeClose:false,
		shade:0.8,
		content:'/sale/saleproductv2/invoice?batchCode='+batchCode+'&thisStatus='+status,
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
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		orderNo:$('#orderNo').val(),
		contacts:$('#contacts').val(),
	};
}

/**
 * 创建订单
 * @returns
 */
function importOrder(){
	layer.open({
		type:2,
		title:'创建订单',
		shadeClose:false,
		shade:0.8,
		content:'/sale/saleproductv2/importorder',
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

/**
 * 取消订单
 * @returns
 */
function cancleOrder(batchCode, status){
	layer.open({
		type:2,
		title:'取消订单',
		shadeClose:false,
		shade:0.8,
		content:'/sale/saleproductv2/invoice?batchCode='+batchCode+'&thisStatus='+status,
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

/**
 * 导出销售订单
 */
function exprotOrder(){
	var param = '';
	param += 'sources=' + $('#sources').val();
	param += '&storeType=' + $('#storeType').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&contacts=' + $('#contacts').val();
	window.location.href = '/sale/saleproductv2/exportorder?'+param;
	return false; //截取返回false就不会保存网页了
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}