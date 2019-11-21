var grid;
var layerIndex = 0;
$().ready(function(){

	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'160px',sortable:false}
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var merName = data['PNAME']+' '+data['MERNAME'];
					var orderPrice = data['ORDERPRICE']+'——'+data['SETTLEPRICE'];
					return '<span title="'+orderNo+'" ondblclick="showRemark(\''+orderNo+'\', \''+merName+'\', \''+orderPrice+'\')">'+data['STRORDERDATE']+'</span>';
				}
			}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系人", dataIndex:'LIANXIREN', width:'80px',sortable:false}
			,{header:"联系方式", dataIndex:'LIANXIDH', width:'130px',sortable:false}
			,{header:"联系地址", dataIndex:'DIZHI', width:'140px',sortable:false}
			,{header:"订单来源", dataIndex:'', width:'140px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var channel ='';
					if(data['ORDERTYPE']=='71'){
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
			,{header:"订单佣金", dataIndex:'PRICE', width:'80px',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'', width:'130px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderId = data['ORDERID'];
					var orderNo = data['ORDERNO'];
					var status = data['ORDERSTATUS']+'';
					var orderType = data['ORDERTYPE']+'';
					var yhdBillId = data['YHDBILLID'];
					var techSupport = data['TECHSUPPORT'];
					var merType = data['MERTYPE'];
					var sourceCode = data['SOURCECODE'];
					var creditCouponFlag = data['CREDITCOUPONFLAG'];
					var returnText ='<a title="'+orderNo+'" href="javascript:orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';

					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
					if(status == '1'){//待审核
						returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">确认</a>';
					}else if(status == '2'){//待上门
						returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">上门</a>';
					}else if(status == '6'){//待用户发货
						returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">发货</a>';
					}else if(status == '7'){//待收货
						returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">收货</a>';
					}
					var orderTypes = ['8','10','21','22','25','26','138','143','43','44','45','51','52','61','193','194','300'];
					
					//待检测
					if(status == '3' && ( $.inArray(orderType, orderTypes) > -1 || techSupport != '1')){
						if(data['INSPECTIONBILLID'] != null){
							if(orderType == '61'){
								returnText += ' | <a href="javascript:jdOrderInspection(\''+orderNo+'\')" class="a_link">复检</a>';
							}else{
								returnText += ' | <a href="javascript:orderInspection(\''+orderNo+'\', \''+merType+'\')" class="a_link">复检</a>';
							}
						}else{
							if(orderType == '61'){
								returnText += ' | <a href="javascript:jdOrderInspection(\''+orderNo+'\')" class="a_link">检测</a>';
							}else{
								returnText += ' | <a href="javascript:orderInspection(\''+orderNo+'\', \''+merType+'\')" class="a_link">检测</a>';
							}
						}
					}

					//终止操作 94:退券终止；95:转现终止；96:自动终止；97:当地回收；98:终止退回；99:终止
					var stopStatuss = ['20','5','66','94','95','96','97','98','99'];
					if($.inArray(status, stopStatuss) < 0){
						returnText+=' | <a href="javascript:stopOrder(\''+orderNo+'\',\''+sourceCode+'\',\''+creditCouponFlag+'\')" class="a_link">终止</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/youdezhuan/order/pagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[10,15,20,30,50]
	});
});

function reload(){
	layer.closeAll();
	grid.reload();
}

function initParams(){
	var params = getParams();
	return params;
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
		content:'/youdezhuan/order/orderinfo?orderNo='+orderNo+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo, merName, orderPrice){
	layer.close(layerIndex);
	$.post('/recycle/order/jsonremark',{orderNo:orderNo}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', 'auto'],
			content:'<div class="layer_notice">订单编码： '+orderNo+'<br/>商品名称：'+merName+'<br/>订单金额：'+orderPrice+'<br/>'+data+'</div>'
		});
	});
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
		content:'/order/order/operation?orderNo='+orderNo,
		shadeClose:false,
		shade:0.8,
		area:['500px' , '320px'],
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
	
	layer.open({
		type:2,
		title:'订单检测',
		content:'/order/order/orderinspection?orderNo='+orderNo+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 京东订单检测
 */
function jdOrderInspection(orderNo){
	layer.open({
		type:2,
		title:'订单检测',
		content:'/order/jdorder/orderinspection?orderNo='+orderNo+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
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
function stopOrder(orderNo, sourceCode, creditCouponFlag){
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
	}else if(sourceCode == '71'){	//闲鱼二期信用回收
        url = '/idlefishv2/recyorder/tostoporder?orderNo='+orderNo;
        title = '闲鱼信用回收订单终止';
    }else if(sourceCode == '6100' || sourceCode == '6101'){	//福建移动回收
        url = '/order/fujianmobile/tostoporder?orderNo='+orderNo;
        title = '福建移动回收订单终止';
    }else if(creditCouponFlag == 'Y'){//支付宝天猫店
		url = '/zhima/offlinemall/tostoporder?orderNo='+orderNo;
		title = '天猫店信用回收订单终止';
	}else if(sourceCode == '74'){	//芝麻小程序信用回收
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
		tradeType:$('#tradeType').val(),
		contactWay:$('#contactWay').val(),
		orderSource:$('#orderSource').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		expressNum:$('#expressNum').val(),
		address:$('#address').val(),
		imei:$('#imei').val(),
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	layerIndex = layer.load();
	grid.query(getParams());
}

//回车事件
document.onkeypress = keypress;
function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}
//下载
function doExport() {
	var merName = $('#merName').val();
	var	orderNo = $('#orderNo').val();
	var	tradeType = $('#tradeType').val();
	var	contactWay = $('#contactWay').val();
	var	orderSource = $('#orderSource').val();
	var	orderStatus = $('#orderStatus').val();
	var	startDate = $('#startDate').val();
	var	endDate = $('#endDate').val();
	var	category = $('#category').val();
	var	merType = $('#merType').val();
	var	expressNum = $('#expressNum').val();
	var	address = $('#address').val();
	var	imei = $('#imei').val();
	var url = "/youdezhuan/order/exportorder?orderNo="+orderNo+"&merName="+merName+"&tradeType="+tradeType;
		  url	+= "&contactWay="+contactWay+"&orderSource="+orderSource+"&orderStatus"+orderStatus+"&startDate="+startDate;
		url +="&endDate="+endDate+"&category="+category+"&merType="+merType+"&expressNum="+expressNum+"&address="+address+"&imei="+imei;
	 window.location.href = url;

}
