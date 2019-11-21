var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'3%',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'10%',sortable:false}
			,{header: "订单来源", dataIndex: 'PARTNERNAME', width:'10%',sortable:false}
			,{header: "订单编号", dataIndex: 'ORDERNO', width:'10%',sortable:false}
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
			,{header: "订单类型", dataIndex: 'ZMTYPENAME', width:'10%',sortable:false}
			,{header: "未参与原因", dataIndex: 'ZM_ORDER_TYPENAME', width:'10%',sortable:false}
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
					var dissent_reason = data['DISSENT_REASON'];
					var zm_order_type = data['ZM_ORDER_TYPE'];
					var zm_order_status = data['ZM_ORDER_STATUS'];
					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
					//待发券
					if(orderType && zm_order_type=='2'){
						if(status == '4' && zm_order_status=='3'){
							returnText += ' | <a href="javascript:void(0);" onclick="toPay(\''+orderNo+'\')" class="a_link">结算</a>';
						}else if(status == '20' && zm_order_status=='3'){
							returnText += ' | <a href="javascript:void(0);" onclick="toPay(\''+orderNo+'\')" class="a_link">确认支付</a>';
						}
						if(dissent_reason){
							returnText+=' | <a href="javascript:void(0);" onclick="dissentInfo(\''+dissent_reason+'\')" class="a_link">客户异议</a>';
						}
						if(overtimeFlag){
							returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+orderNo+'\')" class="a_link">超时终止</a>';
						}
					}
					return returnText;
				}
			}
		]
		,url : '/offline/creditorder/pagelist'
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
	window.location.href = "/offline/creditorder/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

$("#orderSourceCompany").change(function(){
	var companyCode = $(this).val();
	$.post('/offline/creditorder/ordersourcestores', {companyCode:companyCode}, function(data){
		$("#orderSourceStores").html("<option value=''>请选择门店</option>");
		for(i in data){
			$("#orderSourceStores").append("<option value='"+data[i]['PARTNERCODE']+"'>"+data[i]['PARTNERNAME']+"</option>");
		}
	}, 'json');
});

/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(orderNo){
	$.layer({
		type:2,
		title:'订单超时终止',
		iframe:{src:'/offline/creditorder/tostoporder?overtimeFlag=Y&orderNo='+orderNo},
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
	window.location.href = "/offline/creditorder/topay?orderNo="+orderNo+"&backUrl="+backUrl;
}
/**
 * 异议
 * @param dissent
 */
function dissentInfo(dissent){
	layer.alert(dissent);
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
		companyCode:$('#orderSourceCompany').val(),
		partnerCode:$('#orderSourceStores').val(),
		noDeliveryDay:$('#noDeliveryDay').val()
	};
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
	window.location.href = '/offline/creditorder/zhimaexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function downloadPayExport(){
	var param = '';
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	window.location.href = '/zhima/recyorder/payexport?'+param;
	return false;
}

function downloadBackPayExport(){
	var param = '';
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	window.location.href = '/zhima/recyorder/backpayexport?'+param;
	return false;
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