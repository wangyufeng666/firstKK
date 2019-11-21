var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'45PX',sortable:false}
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "所属商户", dataIndex: 'PARTNERNAME', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME', width:'100px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "联系方式", dataIndex: '', width:'135px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"支付状态", dataIndex:'ZM_ORDER_STATUSNAME', width:'90px',sortable:false}
            ,{header:"询价来源", dataIndex:'CHANNELNAME', width:'80px',sortable:false}
			,{header:"订单类型", dataIndex:'ZMTYPENAME', width:'80px',sortable:false}
			,{header:"未参与原因", dataIndex:'ZM_ORDER_TYPENAME', width:'80px',sortable:false}
            ,{header: "支付方式", dataIndex: 'PAYTYPE_NAME', width:'100px',sortable:false}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
            ,{header: "先行支付", dataIndex: '', width:'70px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText = data['ADVANCEPAYMENT'];
                    var paytype = data['PAY_TYPE'];
                    if((paytype == 1 || paytype == 2) && returnText != 0){
                        returnText += '(券)';
                    }
                    return returnText;
                }
			}
            ,{header: "过程支付", dataIndex: '', width:'70px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText = data['PROCESSPAY'];
                    var paytype = data['PAY_TYPE'];
                    if((paytype == 1 || paytype == 4) && returnText != 0){
                        returnText += '(券)';
                    }
                    return returnText;
                }
            }
            ,{header: "尾款结算", dataIndex: '', width:'70px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText = data['TAILPAYMENT'];
                    var paytype = data['PAY_TYPE'];
                    if((paytype == 1 || paytype == 4) && returnText != 0){
                        returnText += '(券)';
                    }
                    return returnText;
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
			,{header: "订单状态", dataIndex: '', width:'70px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText = data['STATUSNAME'];
                    var status = data['ORDERSTATUS']+'';
                    var paytype = data['PAY_TYPE'];
                    if(status == '8' && (paytype == 1 || paytype == 4)){
                        returnText = '待发券';
                    }
                    if(status == '8' && (paytype == 2 || paytype == 3 || paytype == 6 )){
                        returnText = '待付款';
                    }
                    return returnText;
                }
            }
			,{header: "是否取货", dataIndex: 'FLAGNAME', width:'70px',sortable:false}
			,{header: "操作", dataIndex: '', width:'130px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					var status = data['ORDERSTATUS'];
					var orderType = data['ORDERTYPE'];
                    var tailpayment = data['TAILPAYMENT'];
                    var paytype = data['PAY_TYPE'];
                    var sourceCode = data['SOURCECODE'];
                    var merType = data['MERTYPE'];
                    var techSupport = data['TECHSUPPORT'];
                    var overtimeFlag = data['OVERTIMEFLAG'];
                    var cashPrice =data['cashPrice'];
                    var hbPrice =data['hbPrice'];
                    var zm_order_type =data['ZM_ORDER_TYPE'];
					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
					//待发券或者代付款
                    if(status == '4' || status == '8' || status == '20'){
                    	if(paytype == 1 || paytype == 4){
                    		returnText += ' | <a href="javascript:void(0);" onclick="sendCoupon(\''+orderNo+'\','+tailpayment+')" class="a_link">发券</a>';
                    	}else if(paytype == 2 || paytype == 3){
                    		returnText += ' | <a href="javascript:void(0);" onclick="sendCash(\''+orderNo+'\','+tailpayment+')" class="a_link">打款</a>';
                    	}else if(paytype == 6 && zm_order_type != '2'){
                            returnText += ' | <a href="javascript:void(0);" onclick="sendCashHB(\''+orderNo+'\','+tailpayment+','+cashPrice+','+hbPrice+')" class="a_link">发现金+红包</a>'
						}else if(paytype == 6 && zm_order_type == '2'){
                            returnText += ' | <a href="javascript:void(0);" onclick="sendHB(\''+orderNo+'\','+tailpayment+')" class="a_link">发红包</a>'
                        }
                    }
					var orderTypes = ['8','10','21','22','25','26','138','143','43','44','45','51','52','61','193','194','300'];
					//待检测
					if(status == '3' && ( $.inArray(orderType, orderTypes) > -1 || techSupport != '1')){
						if(data['INSPECTIONBILLID'] != null){
							returnText += ' | <a href="javascript:orderInspection(\''+orderNo+'\', \''+merType+'\')" class="a_link">复检</a>';
						}else{
							returnText += ' | <a href="javascript:orderInspection(\''+orderNo+'\', \''+merType+'\')" class="a_link">检测</a>';
						}
					}
                    
					//终止操作 94:退券终止；95:转现终止；96:自动终止；97:当地回收；98:终止退回；99:终止
					var stopStatuss = ['20','5','66','94','95','96','97','98','99'];
					if(overtimeFlag){
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+orderNo+'\',\''+sourceCode+'\')" class="a_link">超时终止</a>';
					}else if($.inArray(status, stopStatuss) < 0){
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+orderNo+'\',\''+sourceCode+'\')" class="a_link">终止</a>';
					}
					return returnText;
				}
			}
		]
		,url : '/order/device/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

/**
 * 检测操作
 * @param orderId
 * @return
 */
function orderInspection(orderNo, merType){
	window.location.href = "/order/order/orderinspection?orderNo="+orderNo;
}

/**
 * 发券操作
 * @param orderId
 * @return
 */
function sendCoupon(orderNo,tailpayment){
	if(!isNumber(tailpayment)) {
        layer.alert('发券金额错误', {icon: 5});
	}
    //发券
    if(tailpayment >= 0){
        if(confirm('是否确认发放'+tailpayment+'元尾款现金代金券？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("发券成功");
                    setTimeout(function(){
                        window.location.href = window.location.href;
                    },3000);
                }else{
                    layer.alert('发券失败：'+data, {icon: 5});
                }
            });
        }
    }else if(tailpayment < 0){
        if(confirm('是否确认销毁先行支付优惠券，发放'+Math.abs(tailpayment)+'元尾款现金代金券？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("发券成功");
                    setTimeout(function(){
                        window.location.href = window.location.href;
                    },3000);
                }else{
                    layer.alert('发券失败：'+data, {icon: 5});
                }
            });
        }
    }
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		tradeType:$('#tradeType').val(),
		contactWay:$('#contactWay').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		address:$('#address').val(),
		zm_Order_Status:$('#zm_Order_Status').val(),
		zm_Order_Type:$('#zm_Order_Type').val(),
		qrcode:$('#qrcode').val(),
		noDeliveryDay:$('#noDeliveryDay').val(),
		pickUp:$('#pickUp').val(),
		deviceId:$('#deviceId').val(),
		partnerName:$('#partnerName').val(),
        channel:$('#channel').val()
	};
}

function doSearch(){
	grid.paras.start = '1';
	grid.query(getParams());
}

function exportDeviceOrder(){
	var param = '';
	param += '&tradeType=' + $('#tradeType').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&zm_Order_Status=' + $('#zm_Order_Status').val();
	param += '&zm_Order_Type=' + $('#zm_Order_Type').val();
	param += '&pickUp=' + $('#pickUp').val();
	param += '&deviceId=' + $('#deviceId').val();
	param += '&partnerName=' + $('#partnerName').val();
	window.location.href = '/order/device/exportdeviceorder?'+param;
	return false; //截取返回false就不会保存网页了
}
//现金转账
function sendCash(orderNo,tailpayment) {
    if(!isNumber(tailpayment)) {
        layer.alert('金额错误', {icon: 5});
    }
    if(tailpayment >= 0){
		if(confirm('是否确认支付'+tailpayment+'元尾款现金？')){
			$.post('/order/device/pay', {orderNo:orderNo}, function(data){
				if(data == 'Y'){
					successBox("支付成功");
                    setTimeout(function(){
                        window.location.href = window.location.href;
                    },3000);
				}else{
					layer.alert('支付失败：'+data, {icon: 5});
				}
			});
		}
    }else if(tailpayment < 0){
        if(confirm('是否扣除'+Math.abs(tailpayment)+'元先行支付现金？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("扣款成功");
                    setTimeout(function(){
                        window.location.href = window.location.href;
                    },3000);
                }else{
                    layer.alert('扣款失败：'+data, {icon: 5});
                }
            });
        }
    }
}

//现金转账+红包
function sendCashHB(orderNo,tailpayment,cashPrice,hbPrice) {
    if(!isNumber(tailpayment)) {
        layer.alert('金额错误', {icon: 5});
    }

    if(!isNumber(cashPrice)) {
        layer.alert('金额错误', {icon: 5});
    }
    if(!isNumber(hbPrice)) {
        layer.alert('金额错误', {icon: 5});
    }
    if(tailpayment >= 0){
        if(confirm('是否确认支付'+cashPrice+'尾款现金和'+hbPrice+'元尾款红包？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("支付成功");
                    setTimeout(function(){
                        window.location.href = window.location.href;
                    },3000);
                }else{
                    layer.alert('支付失败：'+data, {icon: 5});
                }
            });
        }
    }else if(tailpayment < 0){
        if(confirm('是否扣除'+Math.abs(tailpayment)+'元先行支付现金？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("扣款成功");
                    setTimeout(function(){
                        window.location.href = window.location.href;
                    },3000);
                }else{
                    layer.alert('扣款失败：'+data, {icon: 5});
                }
            });
        }
    }
}

//现金红包
function sendHB(orderNo,tailpayment) {
    if(!isNumber(tailpayment)) {
        layer.alert('金额错误', {icon: 5});
    }
    if(tailpayment >= 0){
        if(confirm('是否确认支付'+tailpayment+'元尾款红包？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("支付成功");
                    setTimeout(function(){
                        window.location.href = window.location.href;
                    },3000);
                }else{
                    layer.alert('支付失败：'+data, {icon: 5});
                }
            });
        }
    }else if(tailpayment < 0){
        if(confirm('是否扣除'+Math.abs(tailpayment)+'元先行支付现金？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("扣款成功");
                    setTimeout(function(){
                        window.location.href = window.location.href;
                    },3000);
                }else{
                    layer.alert('扣款失败：'+data, {icon: 5});
                }
            });
        }
    }
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(orderNo, sourceCode){
    url = '/order/device/tostoporder?orderNo='+orderNo;
    title = '设备回收订单终止';
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

// 验证金额合法性
function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}