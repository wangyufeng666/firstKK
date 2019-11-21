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
			,{header:"器材名称", dataIndex:'MERNAME',width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
        		}
			}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<span >戴尔门店信用回收</span>';
        		}
			}
			,{header:"订单类型", dataIndex:'ZMTYPENAME', width:'80px',sortable:false}
			,{header:"支付状态", dataIndex:'ZM_ORDER_STATUSNAME', width:'90px',sortable:false}
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
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'ORDERNO', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var status = data['ORDERSTATUS'];
					var returnText = '<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
					if(status == '4' || status =='8' || status =='20'){
						returnText += ' | <a href="javascript:payment(\''+value+'\')" class="a_link">打款</a>';
					}
                    //终止操作 94:退券终止；95:转现终止；96:自动终止；97:当地回收；98:终止退回；99:终止
                    var stopStatuss = ['20','5','66','94','95','96','97','98','99'];
                    if($.inArray(status, stopStatuss) < 0){
                        returnText+=' | <a href="javascript:stopOrder(\''+value+'\')" class="a_link">终止</a>';
                    }
                    return returnText;
					return returnText;
				}
			}
		]
		,url:'/creditrecy/order/pagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[15,20,30,50]
	});
});


/**
 * 付款
 * @param orderNo
 */
function payment(orderNo){
	layer.open({
		type:2,
		title:'尾款支付',
		shadeClose:false,
		shade:0.8,
		content:'/creditrecy/order/topay?orderNo='+orderNo,
		area:['600px','450px'],
		close:function(index){
			layer.close(index);
		}
   });
}

function initParams(){
	var params = {};
	params = getParams();
	params['start'] = start;
	params['limit'] = limit;
	params['partnerCode'] = $('#partnerCode').val();
	return params;
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo){
	layer.close(layerIndex);
	$.post('/recycle/order/jsonremark',{orderNo:orderNo}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', '400px'],
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
		shade:0.8,
		content:'/creditrecy/order/orderinfo?orderNo='+orderNo,
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
		content:'/creditrecy/order/tostoporder?overtimeFlag=Y&orderNo='+orderNo,
		area:['500px','350px'],
		close:function(index){
			layer.close(index);
		}
	});
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
		partnerCode:$('#partnerCode').val()
	};
}

function downloadOrderExport(){
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
	param += '&partnerCode=' + $('#partnerCode').val();
	param += '&zm_Order_Status=' + $('#zm_Order_Status').val();
	param += '&zm_Order_Type=' + $('#zm_Order_Type').val();
	window.location.href = '/creditrecy/order/recyorderexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}
