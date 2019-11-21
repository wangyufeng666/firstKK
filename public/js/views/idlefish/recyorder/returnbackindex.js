var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'5%',sortable:false}
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'7%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					return '<span ondblclick="showRemark(\''+orderNo+'\')">'+data['STRORDERDATE']+'</span>';
				}
			}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'8%',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
        		}
			} 
			,{header:"支付状态", dataIndex:'ZM_ORDER_STATUSNAME', width:'5%',sortable:false}
			,{header:"订单类型", dataIndex:'ZMTYPENAME', width:'5%',sortable:false}
			,{header:"未参与原因", dataIndex:'ZM_ORDER_TYPENAME', width:'5%',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'5%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
        		}
			}
			,{header:"活动来源", dataIndex:'FROMCODE', width:'5%',sortable:false}
			,{header:"退回状态", dataIndex:'BACKSTATUSNAME', width:'5%',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'5%',sortable:false}
			,{header:"操作", dataIndex:'', width:'17%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					var status = data['ORDERSTATUS'];
					var orderType = data['ORDERTYPE'];
					var overtimeFlag = data['OVERTIMEFLAG'];
					var dissent_reason = data['DISSENT_REASON'];
					var expressstatus = data['EXPRESSSTATUS'];
					var statusArr = ["94","95","96","97","98","99"];
					if(expressstatus == '2' || expressstatus == '3'){
						if($.inArray(status, statusArr) < '0'){
						returnText+=' | <a href="javascript:void(0);" onclick="returnBackYse(\''+orderNo+'\')" class="a_link">确认退回</a>';
						returnText+=' | <a href="javascript:void(0);" onclick="toPay(\''+orderNo+'\')" class="a_link">结算</a>';
						}
					}
					return returnText;
				}
			}
		]
		,url:'/idlefish/recyorder/returnbacklist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[15,20,30,50]
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
	window.location.href = "/idlefish/recyorder/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
	//window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

/**
 * 支付
 * @param orderNo
 */
function toPay(orderNo){
	window.location.href = "/idlefish/recyorder/topay?orderNo="+orderNo+"&backUrl="+backUrl;
}

function getParams(){
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
		isFromCode:$('#isFromCode').val(),
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
	param += '&isFromCode=' + $('#isFromCode').val();
	param += '&zm_Order_Status=' + $('#zm_Order_Status').val();
	param += '&zm_Order_Type=' + $('#zm_Order_Type').val();
	param += '&chuliren1=' + '98';
	window.location.href = '/idlefish/recyorder/zhimaexport?'+param;
	return false; //截取返回false就不会保存网页了
}

/**
 * 支付
 * @param orderNo
 */
function toPay(orderNo){
	window.location.href = "/idlefish/recyorder/topay?orderNo="+orderNo+"&backUrl="+backUrl;
}

/**
 * 确认退回
 * @param orderNo
 */
function returnBackYse(orderNo){
	url = '/idlefish/recyorder/tostoporder?orderNo='+orderNo;
	title = '闲鱼信用回收订单终止';
    layer.open({
      type: 2,
      title: title,
      shadeClose: true,
      shade: 0.8,
      //maxmin: true, //开启最大化最小化按钮
      area: ['500px', '360px'],
      content: url
    });
}

function doSearch(){
	grid.query(getParams());
}
