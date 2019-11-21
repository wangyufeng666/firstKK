var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "所属合作商", dataIndex: 'HNAME', width:'80px',sortable:false}
			,{header: "地推人员", dataIndex: 'NAME', width:'80px',sortable:false}
			,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header: "联系地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
			,{header: "订单来源", dataIndex: 'SOURCENAME', width:'100px',sortable:false}
			,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
			,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderId = data['ORDERID'];
					var orderNo = data['ORDERNO'];
					var status = data['ORDERSTATUS']+'';
					var orderType = data['ORDERTYPE']+'';
					var yhdBillId = data['YHDBILLID'];
					var techSupport = data['TECHSUPPORT'];
					var merType = data['MERTYPE'];
					var sourceCode = data['SOURCECODE'];
					var zm_order_type = data['ZM_ORDER_TYPE'];
					var zm_order_status = data['ZM_ORDER_STATUS'];
					var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					
					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
					if(status == '1'){//待审核
						returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">确认</a>';
					}else if(status == '2'){//待上门
						returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">上门</a>';
					}else if(status == '6'){//待用户发货
						returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">发货</a>';
					}else if(status == '7'){//待收货
						returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">收货</a>';
					}
					var orderTypes = ['8','10','21','22','25','26','138','143','43','44','45','51','52','61'];
					
					//待检测
					if(status == '3' && ( $.inArray(orderType, orderTypes) > -1 || techSupport != '1')){
						if(data['INSPECTIONBILLID'] != null){
							if(orderType == '61'){
								returnText += ' | <a href="javascript:void(0);" onclick="jdOrderInspection(\''+orderNo+'\')" class="a_link">复检</a>';
							}else{
								returnText += ' | <a href="javascript:void(0);" onclick="orderInspection(\''+orderNo+'\', \''+merType+'\')" class="a_link">复检</a>';
							}
						}else{
							if(orderType == '61'){
								returnText += ' | <a href="javascript:void(0);" onclick="jdOrderInspection(\''+orderNo+'\')" class="a_link">检测</a>';
							}else{
								returnText += ' | <a href="javascript:void(0);" onclick="orderInspection(\''+orderNo+'\', \''+merType+'\')" class="a_link">检测</a>';
							}
						}
					}
					
					//终止操作 94:退券终止；95:转现终止；96:自动终止；97:当地回收；98:终止退回；99:终止
					var stopStatuss = ['20','5','66','94','95','96','97','98','99'];
					if($.inArray(status, stopStatuss) < 0){
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+orderNo+'\', \''+zm_order_type+'\', \''+zm_order_status+'\')" class="a_link">终止</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/order/offline/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(){
			layer.close(layerIndex);
		}
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params.start = start;
		params.limit = limit;
		return params;
	}else{
		return {};
	}
}

function reload(){
	layer.closeAll();
	grid.reload();
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
		content:"/order/offline/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});

	//window.location.href = "/order/offline/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
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
		content:'/order/offline/operation?orderNo='+orderNo,
		area:['500px' , '320px'],
		close:function(index){
			layer.close(index);
		},
		end:function(index){
			grid.reload();//刷新
		}
	});

	/*$.layer({
		type:2,
		title:'订单状态修改',
		iframe:{src:'/order/offline/operation?orderNo='+orderNo},
		area:['500' , '320'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});*/
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
		shadeClose:false,
		shade:0.8,
		content:"/order/offline/orderinspection?orderNo="+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
	//window.location.href = "/order/offline/orderinspection?orderNo="+orderNo;
}

/**
 * 京东订单检测
 */
function jdOrderInspection(orderNo){
	layer.open({
		type:2,
		title:'京东订单检测',
		shadeClose:false,
		shade:0.8,
		content:"/order/offline/orderinspection?orderNo="+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
	//window.location.href = "/order/offline/orderinspection?orderNo="+orderNo;
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(orderNo,zm_order_type,zm_order_status){
	var url = '/order/offline/tostoporder?orderNo='+orderNo;
	var title = '订单终止';
	if(zm_order_type == '2'&& zm_order_status=='3'){//线下信用回收先行支付订单
		url = '/offline/creditorder/tostoporder?orderNo='+orderNo;
		title = '线下信用回收先行支付订单终止';
	}


	layer.open({
		type:2,
		title:title,
		content:url,
		area:['500px' , '320px'],
		close:function(index){
			layer.close(index);
		},
		end:function(index){
			grid.reload();//刷新
		}
	});

	/*$.layer({
		type:2,
		title:title,
		iframe:{src:url},
		area:['500', '350'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});*/
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		orderSource:$('#orderSource').val(),
		tradeType:$('#tradeType').val(),
		contactWay:$('#contactWay').val(),
		partnerCode:$('#partnerCode').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		address:$('#address').val(),
		partnerName:$('#partnerName').val(),
		typeCode:$('#typeCode').val(),
	};
}

function doSearch(){
	//layer.load('数据加载中...', 1);
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}
	});
}

function exprotOfflineOrder(){
	var param = '';
	param += '&merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&address=' + $('#address').val();
	param += '&partnerCode=' + $('#partnerCode').val();
	param += '&orderSource=' + $('#orderSource').val();
	param += '&partnerName=' + $('#partnerName').val();
	param += '&typeCode=' + $('#typeCode').val();
	window.location.href = '/order/offline/exprotoffline?'+param;
	return false; //截取返回false就不会保存网页了
}
