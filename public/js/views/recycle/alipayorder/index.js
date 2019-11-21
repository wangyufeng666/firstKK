var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'3%',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'10%',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'10%',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',width:'17%',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "联系方式", dataIndex: '', width:'10%',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
        		}
			} 
			,{header: "支付状态", dataIndex: 'ZM_ORDER_STATUSNAME', width:'10%',sortable:false}
			,{header: "订单类型", dataIndex: 'ZM_ORDER_TYPENAME', width:'10%',sortable:false}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'10%',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
        		}
			}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'10%',sortable:false}
			,{header: "操作", dataIndex: '', width:'10%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					var status = data['ORDERSTATUS'];
					var orderType = data['ORDERTYPE'];
					var overtimeFlag = data['OVERTIMEFLAG'];
					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
					//待发券
					if(orderType == '66'){
						if(status == '4'){
							returnText += ' | <a href="javascript:void(0);" onclick="toPay(\''+orderNo+'\')" class="a_link">结算</a>';
						}else if(status == '20'){
							returnText += ' | <a href="javascript:void(0);" onclick="toPay(\''+orderNo+'\')" class="a_link">确认支付</a>';
						}
						if(overtimeFlag){
							returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+orderNo+'\')" class="a_link">超时终止</a>';
						}
					}
					return returnText;
				}
			}
		]
		,url : '/recycle/alipayorder/pagelist'
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
	window.location.href = "/recycle/alipayorder/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

/**
 * （支付、扣款）交易详情
 * @param orderNo
 * @return
 */
function payExchangeInfo(orderNo){
	window.location.href = "/recycle/alipayorder/payexchangeinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(orderNo){
	$.layer({
		type:2,
		title:'订单超时终止',
		iframe:{src:'/recycle/alipayorder/tostoporder?orderNo='+orderNo},
		area:['500', '350'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 支付
 * @param orderNo
 */
function toPay(orderNo){
	window.location.href = "/recycle/alipayorder/topay?orderNo="+orderNo+"&backUrl="+backUrl;
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		zm_Order_Status:$('#zm_Order_Status').val(),
		zm_Order_Type:$('#zm_Order_Type').val(),
		contactWay:$('#contactWay').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		noDeliveryDay:$('#noDeliveryDay').val()
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

function downloadZhiMaExport(){
	var param = '';
	param += '&merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&orderType=' + $('#orderType').val();	
	param += '&contactWay=' + $('#contactWay').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&zm_Order_Status=' + $('#zm_Order_Status').val();
	param += '&zm_Order_Type=' + $('#zm_Order_Type').val();
	window.location.href = '/recycle/alipayorder/zhimaexport?'+param;
	return false; //截取返回false就不会保存网页了
}
