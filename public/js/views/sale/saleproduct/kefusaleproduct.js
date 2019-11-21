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
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"订单来源", dataIndex:'SOURCESNAME', width:'80px',sortable:false}
			,{header:"门店名称", dataIndex:'STORENAME', width:'80px',sortable:false}
			,{header:"商品价格", dataIndex:'PRODUCTPRICE', width:'80px',sortable:false}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTS']+'('+data['MOBILE']+')';
				}
			}
			,{header:"联系地址", dataIndex:'ADDRESS', width:'80px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'200px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var status = data['STATUS'];
					var sendUserId = data['SENDUSERID'];
					var returnText ='<a href="javascript:orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					if(status != '99'){//取消
						if(status == '1'){//待确认的才能打印
							returnText +=' | <a href="javascript:printOrder(\''+orderNo+'\',\''+status+'\')" class="a_link">打印报告</a>';
						}
						
						if(sendUserId && sendUserId != ''){
							if(status == '3'){//待发货的状态-》才能确认发货
								returnText +=' | <a href="javascript:updateOrderStatus(\''+orderNo+'\', 4)" class="a_link">确认发货</a>';
							}else if(status == '4'|| status == '11'){//已发货的状态-》才能申请退货和交易完成
								if(status != '11'){
									returnText +=' | <a href="javascript:updateOrderStatus(\''+orderNo+'\', 6)" class="a_link">申请退货</a>';
								}
								returnText +=' | <a href="javascript:updateOrderStatus(\''+orderNo+'\', 66)" class="a_link">交易完成</a>';
							}else if(status == '6'){//退货寄回中状态-》才能确认收货
								returnText +=' | <a href="javascript:addExpressInfo(\''+orderNo+'\')" class="a_link">填写退货快递</a>';
							}else if(status == '9'){//同意退货确认中-》打印退货单和退货成功和退货失败
								returnText +=' | <a href="javascript:updateOrderStatus(\''+orderNo+'\', 7)" class="a_link">退货成功</a>';
								returnText +=' | <a href="javascript:updateOrderStatus(\''+orderNo+'\', 8)" class="a_link">退货失败</a>';
							}else if(status == '10'){//驳货退货确认中-》退货寄回和二次申请退货
								returnText +=' | <a href="javascript:updateOrderStatus(\''+orderNo+'\', 12)" class="a_link">二次申请退货</a>';
							}
						}
						
						if(status == '1' || status == '2' || status == '3'){
							returnText +=' | <a href="javascript:cancleOrder(\''+orderNo+'\')" class="a_link">取消</a>';
							if(status != '1'){
								returnText +=' | <a href="javascript:printOrder(\''+orderNo+'\',\''+status+'\')" class="a_link">打印报告</a>';
							}
						}
					}
					return returnText;
				}
			}
		]
		,url:'/sale/saleproduct/pagelist'
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
 * 订单取消
 * @param orderNo
 * @returns
 */
function cancleOrder(orderNo){
	layer.open({
		type:2,
		title:'订单取消',
		shadeClose:false,
		shade:0.8,
		content:'/sale/saleproduct/tostoporder?orderNo='+orderNo,
		area:['500px','350px'],
		close:function(index){
			layer.close(index);
  	     }
	});	
}

/**
 * 填写退货快递信息
 * @param orderNo
 * @returns
 */
function addExpressInfo(orderNo){
	layer.open({
		type:2,
		title:'填写退货快递信息',
		shadeClose:false,
		shade:0.8,
		content:'/sale/saleproduct/agreeorder?orderNo='+orderNo+'&sources=1',
		area:['500px','350px'],
		close:function(index){
			layer.close(index);
		}
	});	
}

/**
 * 打印报告
 * @param orderNo
 * @returns
 */
function printOrder(orderNo, status){
	layer.open({
		type:2,
		title:'打印报告',
		shadeClose:false,
		shade:0.8,
		content:'/sale/saleproduct/printorder?orderNo='+orderNo+'&status='+status,
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
	});	
}

/**
 * 申请退货
 */
function updateOrderStatus(orderNo, status, flag=null){
	var text = '是否确认操作？';
	if(status == '4'){
		text = '是否确认已发货？';
	}else if(status == '6'){
		text = '是否确认申请退货？';
	}else if(status == '66'){
		text = '是否确认交易完成？';
	}else if(status == '9'){
		text = '是否确认同意退货？';
	}else if(status == '12'){
		text = '是否确认二次申请退货，二次申请退货只能同意收货，无法拒绝？';
	}

	if(orderNo && status){
		if(status == '6'){
			layer.open({
				type:2,
				title:'申请退货',
				shadeClose:false,
				shade:0.8,
				content:'/sale/saleproduct/returnorder?orderNo='+orderNo+'&thisStatus=6',
				area:['500px','350px'],
				close:function(index){
					layer.close(index);
		  	     }
			});	
		}else{
			if(confirm(text)){
				$.post('/sale/saleproduct/updateorderstatus',{orderNo:orderNo,thisStatus:status},function(data){
					if(data.code == '200'){
						reload();
					}
				})
			}
		}
	}else{
		layer.msg('订单编号缺失，无法操作！');
	}
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
		shade:0.8,
		content:'/sale/saleproduct/orderinfo?orderNo='+orderNo,
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
  	     }
	});
}

function getParams(){
	return {
		category:$('#category').val(),
		merType:$('#merType').val(),
		merName:$('#merName').val(),
		sources:$('#sources').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		orderNo:$('#orderNo').val(),
		storeType:$('#storeType').val(),
		contacts:$('#contacts').val(),
		orderStatus:$('#orderStatus').val(),
		imei:$('#imei').val(),
		kefuFlag:1
	};
}

function importOrder(){
	layer.open({
		type:2,
		title:'导入订单',
		shadeClose:false,
		shade:0.8,
		content:'/sale/saleproduct/importorder',
		area:['90%','90%'],
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