var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					return '<span ondblclick="showRemark(\''+orderNo+'\')">'+data['STRORDERDATE']+'</span>';
				}
			}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'70px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			} 
			,{header:"支付状态", dataIndex:'ZM_ORDER_STATUSNAME', width:'90px',sortable:false}
			,{header:"订单类型", dataIndex:'ZMTYPENAME', width:'80px',sortable:false}
			,{header:"未参与原因", dataIndex:'ZM_ORDER_TYPENAME', width:'80px',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header:"活动来源", dataIndex:'FROMCODE', width:'80px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					var status = data['ORDERSTATUS'];
					var orderType = data['ORDERTYPE'];
					var overtimeFlag = data['OVERTIMEFLAG'];
					var dissent_reason = data['DISSENT_REASON'];
					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
					//待发券
					if(orderType == '66'){
						if(status == '4'){
							returnText += ' | <a href="javascript:toPay(\''+orderNo+'\')" class="a_link">结算</a>';
						}else if(status == '20'){
							returnText += ' | <a href="javascript:toPay(\''+orderNo+'\')" class="a_link">确认支付</a>';
						}
						if(dissent_reason){
							returnText+=' | <a href="javascript:dissentInfo(\''+dissent_reason+'\')" class="a_link">客户异议</a>';
						}
						if(overtimeFlag){
							returnText+=' | <a href="javascript:stopOrder(\''+orderNo+'\')" class="a_link">超时终止</a>';
						}
					}
					return returnText;
				}
			}
		]
		,url:'/zhima/recyorder/pagelist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
		,afterRender:function(e, grid){
			layer.close(layerIndex);
			$("#inquiryCounts span").html(grid.data['inquiryCounts']);
		}
	});
});

function initParams(){
	return getParams();
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo){
	layer.close(layerIndex);
	$.post('/recycle/order/jsonremark',{orderNo:orderNo}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', 'auto'],
			content:'<div class="layer_notice">'+orderNo+'<br/>'+data+'</div>'
		});
	});
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
		content:"/zhima/recyorder/orderinfo?orderNo="+orderNo,
		area:['100%','100%'],
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
function stopOrder(orderNo){
	layer.open({
		type:2,
		title:'订单超时终止',
		shadeClose:false,
		shade:0.8,
		content:'/zhima/recyorder/tostoporder?overtimeFlag=Y&orderNo='+orderNo,
		area:['500px','350px'],
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
	
	layer.open({
		type:2,
		title:'订单支付',
		shadeClose:false,
		content:"/zhima/recyorder/topay?orderNo="+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}
/**
 * 异议
 * @param dissent
 */
function dissentInfo(dissent){
	layer.alert(dissent);
}
function getParams(){
	var pageNum = 1, start = 0;
	if(grid && grid.getPageNumber()){
		pageNum = grid.getPageNumber();
		start = (pageNum-1) * grid.getPageSize(); 
	}
	return {
		start:start,
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
		fromCode:$('#fromCode').val(),
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
	param += '&fromCode=' + $('#fromCode').val();
	param += '&zm_Order_Status=' + $('#zm_Order_Status').val();
	param += '&zm_Order_Type=' + $('#zm_Order_Type').val();
	window.location.href = '/zhima/recyorder/zhimaexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function doSearch(){
	layerIndex = layer.msg('加载中', {icon:16, time:10000});
	grid.query(getParams());
}

/**
 * 重新加载
 * @returns
 */
function reload(){
	layer.closeAll();
	grid.reload();
}
