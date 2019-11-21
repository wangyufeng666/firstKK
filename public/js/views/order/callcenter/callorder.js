var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:5,
		height:125
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'60px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"品类报价", dataIndex:'QUOTE', width:'60px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ORDERTYPE']=='71' || data['ORDERTYPE'] == '288'){
						if(value > 0){
							return '<font color="green">已报价</font>';
						}else{
							return '<font color="red">未报价</font>';
						}
					}
				}
			}
			,{header:"联系方式", dataIndex:'', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"联系地址", dataIndex:'DIZHI', width:'140px',sortable:false}
			,{header:"订单来源", dataIndex:'', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var channel ='';
					if(data['ORDERTYPE']=='71' || data['ORDERTYPE']=='73'){
						if(data['CHANNEL']=='idle'){
							channel = '闲鱼';
						}else if(data['CHANNEL']=='tmall'){
							channel = '天猫';
						}else if(data['CHANNEL']=='alipay'){
							channel = '支付宝';
						}else if(data['CHANNEL']=='taobao'){
							channel = '淘宝';
						}else if(data['CHANNEL']=='tmall-service'){
							channel = '天猫以旧换新';
						}
					}
					if(channel){
						return data['SOURCENAME']+'('+channel+')';
					}else{
						return data['SOURCENAME'];
					}
				}
			}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header:"结算类型", dataIndex:'EVENTNAME', width:'80px',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'', width:'130px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a title="'+data['ORDERNO']+''+data['ORDERREMARKS']+'" href="javascript:orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
					var status = data['ORDERSTATUS']+'';
					var orderType = data['ORDERTYPE']+'';
					var orderId = data['ORDERID'];
					var orderNo = data['ORDERNO'];
					var yhdBillId = data['YHDBILLID'];
					var sourceCode = data['SOURCECODE'];
					var zhimaPayFlag = data['ZHIMAPAYINFOFLAG'];
					var creditCouponFlag = data['CREDITCOUPONFLAG'];
					var mobile = data['LIANXIDH'];
					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
					
					if(status == '1'){//待审核
						returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">确认</a>';
					}else if(status == '2'){//待上门
						returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">上门</a>';
					}else if(status == '6'){//待用户发货
						returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">发货</a>';
					}else if(status == '7'){//待收货
						returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">收货</a>';
					}else if(status == '8' || status == '4'){//确认支付
						returnText+='| <a href="javascript:void(0);" onclick="confirmPay(\''+orderNo+'\')" class="a_link">确认支付</a>';
					}
					
					//终止操作
					if(status != '99' && status != '98' && status != '66' && status != '5'){
						returnText+=' | <a href="javascript:stopOrder(\''+orderNo+'\',\''+sourceCode+'\',\''+zhimaPayFlag+'\',\''+creditCouponFlag+'\')" class="a_link">终止</a>';
					}
					
					return returnText;
				}
			}
		]
		,url:'/order/order/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
 	});
});

function initParams(){
	var params = getParams();
	params['contactWay'] = contactWay;
	params['start'] = start;
	params['limit'] = limit;
	return params;
}

/**
 * 确认支付
 */
function confirmPay(orderNo){
	if(confirm('是否确认支付')){
		$.post('/order/callcenter/confirmpay', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert(data);
			}
		});
	}
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	$('#orderinfo').load("/order/callcenter/orderinfo?orderNo="+orderNo);
}

/**
 * 订单电话确认/上门/发货/收货/
 * @param orderNo
 * @return
 */
function orderOperation(orderNo){
	layer.open({
		type:2,
		title:'订单状态修改',
		shadeClose:false,
		shade:0.8,
		content:'/order/order/operation?orderNo='+orderNo,
		area:['500px' , '500px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(orderNo, sourceCode, zhimaPayFlag, creditCouponFlag){
	var url = '/order/order/tostoporder?orderNo='+orderNo;
	var title = '订单终止';
	// 根据订单来源查询合作商businesscode，如果是11 则为设备回收机回收
	var businesscode = getBusinesscodeBySource(sourceCode);
	if(sourceCode == '66'){//信用回收订单
		url = '/zhima/recyorder/tostoporder?orderNo='+orderNo;
		title = '芝麻信用回收订单终止';
	}else if(sourceCode == '92'){//信用回收订单
		url = '/zhima/baichuanorder/tostoporder?orderNo='+orderNo;
		title = '百川信用回收订单终止';
	}else if(sourceCode == '70'){	//闲鱼信用回收
		url = '/idlefish/recyorder/tostoporder?orderNo='+orderNo;
		title = '闲鱼信用回收订单终止';
	}else if(sourceCode == '71'){	//闲鱼信用回收
		url = '/idlefishv2/recyorder/tostoporder?orderNo='+orderNo;
		title = '闲鱼二期信用回收订单终止';
	}else if(sourceCode == '73'){	//闲鱼信用回收
		url = '/idlefishv3/recyorder/tostoporder?orderNo='+orderNo;
		title = '闲鱼三期信用回收订单终止';
	}else if(creditCouponFlag == 'Y'){//支付宝天猫店
		url = '/zhima/offlinemall/tostoporder?orderNo='+orderNo;
		title = '天猫店信用回收订单终止';
	}else if(sourceCode == '175' && zhimaPayFlag == 'Y'){
		url = '/zhima/recyorder/tostoporder?orderNo='+orderNo;
		title = '线下信用回收订单终止';
	}else if(sourceCode == '74'){	//闲鱼信用回收
		url = '/zhimaapp/recyorder/tostoporder?orderNo='+orderNo;
		title = '芝麻小程序信用回收订单终止';
	}else if(businesscode == '11'){//设备回收
		url = '/order/device/tostoporder?orderNo='+orderNo;
		title = '设备回收订单终止';
	}
	layer.open({
		type:2,
		title:title,
		shadeClose:false,
		shade:0.8,
		content:url,
		area:['500px', '350px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getBusinesscodeBySource(source) {
	var businesscode = "";
	$.ajax({
		type:"post",
		url:"/order/order/getbusinesscodebysource",
		data:{source:source},
		async:false,
		success:function(result){
			businesscode = result.BUSINESSCODE
		}
	});
	return businesscode;
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		contactWay:$('#contactWay').val(),
		startDate:'2015-01-01'
	};
}

function doSearch(){
	var merName = $('#merName').val();
	var orderNo = $('#orderNo').val();
	var contactWay = $('#contactWay').val();
	if(contactWay != '' && contactWay.length< 11){
		messagesBox('手机号必须填写11位');
	}else if(orderNo != '' && orderNo.length< 3){
		messagesBox('订单编号最少填3位');
	}else if(merName != '' && merName.length< 3){
		messagesBox('器材名称最少填3个字符');
	}else if(merName =='' && orderNo =='' && contactWay ==''){
		messagesBox('搜索条件不能为空');
	}else{
		layerIndex = layer.load('数据加载中...', 1);
		grid.query(getParams());
	}
}

function messagesBox(msg){
	layer.msg(msg);
}

/**
 * 客户来电
 */
function noOrderUserCallIn(){
	layer.open({
		type:2,
		title:'客户来电',
		shadeClose:false,
		shade:0.8,
		content:'/call/record/noordercallin?callSource=1&contactWay='+contactWay,
		area:['550px', '550px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function reload(){
	layer.closeAll();
	grid.reload();
}