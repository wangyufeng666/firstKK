var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
        		}
			} 
			,{header: "订单地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
			,{header: "订单来源", dataIndex: 'ORDERTYPENAME', width:'80px',sortable:false}
			,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
        		}
			}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
			,{header: "操作", dataIndex: 'ORDERNO', width:'130px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
					var status = data['ORDERSTATUS']+'';
					//4:待付款；20:付款中
					//待发券
					// if(status == '20'){
					// 	returnText += ' | <a href="javascript:orderPayment(\''+value+'\')" class="a_link">确认付款</a>';
					// }
					return returnText;
				}
			}
		]
		,url : '/order/bierengleweixin/pagelist'
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
	window.location.href = "/order/bierengleweixin/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}


/**
 * 发券操作
 * @param orderId
 * @return
 */
function orderPayment(orderNo) {
	if (confirm('确认支付吗？')){
		$.post('/order/bierengleweixin/paypage', {orderNo: orderNo}, function (data) {
			if (data == 'Y') {
				grid.reload();
			} else {
				alert('支付失败');
			}
		})
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
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function downloadOrder(){
	var param = '';
	param += 'partnerCode=10000234&orderType=265';
	param += '&contactWay=' + $('#contactWay').val();
	param += '&tradeType=' + $('#tradeType').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startCreateDate=' + $('#startDate').val();
	param += '&endCreateDate=' + $('#endDate').val();
	param += '&address=' + $('#address').val();
	window.location.href = '/report/report/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}
