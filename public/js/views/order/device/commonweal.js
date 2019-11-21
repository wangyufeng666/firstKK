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
					return returnText;
				}
			}
		]
		,url : '/order/device/commonwealorder'
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
        errorBox('发券金额错误！');
	}
    //发券
    if(tailpayment >= 0){
        if(confirm('是否确认发放'+tailpayment+'元尾款现金代金券？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("发券成功");
                    window.location.href = window.location.href;
                }else{
                    errorBox('发券失败：'+data);
                }
            });
        }
    }else if(tailpayment < 0){
        if(confirm('是否确认销毁先行支付优惠券，发放'+Math.abs(tailpayment)+'元尾款现金代金券？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("发券成功");
                    window.location.href = window.location.href;
                }else{
                    errorBox('发券失败：'+data);
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
        errorBox('金额错误！');
    }
    if(tailpayment >= 0){
		if(confirm('是否确认支付'+tailpayment+'元尾款现金？')){
			$.post('/order/device/pay', {orderNo:orderNo}, function(data){
				if(data == 'Y'){
					successBox("支付成功");
					window.location.href = window.location.href;
				}else{
					errorBox('支付失败：'+data);
				}
			});
		}
    }else if(tailpayment < 0){
        if(confirm('是否扣除'+Math.abs(tailpayment)+'元先行支付现金？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("扣款成功");
                    window.location.href = window.location.href;
                }else{
                    errorBox('扣款失败：'+data);
                }
            });
        }
    }
}

//现金转账+红包
function sendCashHB(orderNo,tailpayment,cashPrice,hbPrice) {
    if(!isNumber(tailpayment)) {
        errorBox('金额错误！');
    }

    if(!isNumber(cashPrice)) {
        errorBox('金额错误！');
    }
    if(!isNumber(hbPrice)) {
        errorBox('金额错误！');
    }
    if(tailpayment >= 0){
        if(confirm('是否确认支付'+cashPrice+'尾款现金和'+hbPrice+'元尾款红包？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("支付成功");
                    window.location.href = window.location.href;
                }else{
                    errorBox('支付失败：'+data);
                }
            });
        }
    }else if(tailpayment < 0){
        if(confirm('是否扣除'+Math.abs(tailpayment)+'元先行支付现金？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("扣款成功");
                    window.location.href = window.location.href;
                }else{
                    errorBox('扣款失败：'+data);
                }
            });
        }
    }
}

//现金红包
function sendHB(orderNo,tailpayment) {
    if(!isNumber(tailpayment)) {
        errorBox('金额错误！');
    }
    if(tailpayment >= 0){
        if(confirm('是否确认支付'+tailpayment+'元尾款红包？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("支付成功");
                    window.location.href = window.location.href;
                }else{
                    errorBox('支付失败：'+data);
                }
            });
        }
    }else if(tailpayment < 0){
        if(confirm('是否扣除'+Math.abs(tailpayment)+'元先行支付现金？')){
            $.post('/order/device/pay', {orderNo:orderNo}, function(data){
                if(data == 'Y'){
                    successBox("扣款成功");
                    window.location.href = window.location.href;
                }else{
                    errorBox('扣款失败：'+data);
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