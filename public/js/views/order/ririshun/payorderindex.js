var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"订单日期", dataIndex:'ORDERDATE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var merName = data['PNAME']+' '+data['MERNAME'];
					var orderPrice = data['ORDERPRICE']+'——'+data['SETTLEPRICE'];
					return '<span title="'+orderNo+'" ondblclick="showRemark(\''+orderNo+'\', \''+merName+'\', \''+orderPrice+'\')">'+value+'</span>';
				}
			}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"门店名称", dataIndex:'PARTNERNAME', width:'120px',sortable:false}
			,{header:"服务兵", dataIndex:'MOBILE', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['NAME']+')';
				}
			}
			,{header:"服务兵垫付", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var str = '否';
					if(data['INSPECTIONERFLAG'] == 'N' && data['PAYTYPE'] == '1'){
						str = '是';
					}
					return str;
				}
			}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'LIANXIDH', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"联系地址", dataIndex:'DIZHI', width:'140px',sortable:false}
			,{header:"结算类型", dataIndex:'EVENTNAME', width:'80px',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'ORDERNO', width:'130px', sortable:false, 
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
					
					//终止操作 94:退券终止；95:转现终止；96:自动终止；97:当地回收；98:终止退回；99:终止
					var stopStatuss = ['4','8','20'];
					if($.inArray(status, stopStatuss) > -1){
						returnText+=' | <a href="javascript:orderPayment(\''+orderNo+'\')" class="a_link">现金付款</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/order/ririshun/paypagelist'
		,pageSizeList:[15,30,50]
	});
});

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		content:'/order/order/orderinfo?orderNo='+orderNo+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 订单付款
 * @param orderNo
 * @return
 */
function orderPayment(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		content:'/order/ririshun/topayment?orderNo='+orderNo,
		shadeClose:false,
		shade:0.8,
		area:['550px', '400px'],
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
			type:1,
			shade:false,
			title:false,
			area:['650px', 'auto'],
			content:'<div class="layer_notice">订单编码： '+orderNo+'<br/>商品名称：'+merName+'<br/>订单金额：'+orderPrice+'<br/>'+data+'</div>'
		});
	});
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
		expressNum:$('#expressNum').val(),
		address:$('#address').val(),
		imei:$('#imei').val()
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
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

function reload(){
	layer.closeAll();
	grid.reload();
}
