var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'45PX',sortable:false}
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "联系方式", dataIndex: '', width:'135px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header: "订单来源", dataIndex: 'ORDERTYPENAME', width:'120px',sortable:false}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false}
			,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'70px',sortable:false}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
            ,{header: "先行支付", dataIndex: 'ADVANCEPAYMENT', width:'70px',sortable:false}
            ,{header: "尾款结算", dataIndex: 'TAILPAYMENT', width:'70px',sortable:false}
			,{header: "订单状态", dataIndex: '', width:'70px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText = data['STATUSNAME'];
                    var status = data['ORDERSTATUS']+'';
                    var paytype = data['PAY_TYPE'];
                    if(status == '4' || status == '8'){
                        returnText = '待付款';
                    }
                    return returnText;
                }
            }
			,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					var status = data['ORDERSTATUS']+'';
                    var ordertype = data['ORDERTYPE']+'';
                    var tailpayment = data['TAILPAYMENT']+'';
					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
                    if(status == '4' || status == '8' || status == '20'){
                    	if(ordertype == '6101') {
                            returnText += ' | <a href="javascript:void(0);" onclick="payment(\''+orderNo+'\')" class="a_link">打款</a>';
						} else {
                            returnText += ' | <a href="javascript:void(0);" onclick="sendCash(\''+orderNo+'\','+tailpayment+')" class="a_link">打款</a>';
						}

                    }
					return returnText;
				}
			}
		]
		,url : '/order/fujianmobile/pagelist'
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
	window.location.href = "/order/fujianmobile/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
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
            $.post('/order/fujianmobile/pay', {orderNo:orderNo}, function(data){
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
            $.post('/order/fujianmobile/pay', {orderNo:orderNo}, function(data){
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
		orderType:$('#orderType').val(),
		tradeType:$('#tradeType').val(),
		contactWay:$('#contactWay').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		address:$('#address').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg,type:8}
	});
}

function exportCoupon(){
	var param = '';
	param += '&merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&orderType=' + $('#orderType').val();
	param += '&tradeType=' + $('#tradeType').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&address=' + $('#address').val();
	window.location.href = '/order/fujianmobile/exportcoupon?'+param;
	return false; //截取返回false就不会保存网页了
}
//现金转账
function sendCash(orderNo,tailpayment) {
    if(!isNumber(tailpayment)) {
        errorBox('金额错误！');
    }
    if(tailpayment >= 0){
		if(confirm('是否确认支付'+tailpayment+'元尾款现金？')){
			$.post('/order/fujianmobile/pay', {orderNo:orderNo}, function(data){
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
            $.post('/order/fujianmobile/pay', {orderNo:orderNo}, function(data){
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
 * 付款
 * @param orderNo
 */
function payment(orderNo){

    var src = '/order/fujianmobile/topayment?orderNo='+orderNo;
    $.layer({
        type : 2,
        title : '客户订单付款',
        iframe : {src : src},
        area : ['500px' , '420px'],
        offset : ['50px','']
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