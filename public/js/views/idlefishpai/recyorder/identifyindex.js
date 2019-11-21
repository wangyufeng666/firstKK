var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"订单编号", dataIndex:'ORDERNO', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a class="a_link" title="'+value+'" href="javascript:recyOrderInfo(\''+value+'\')">'+value+'</a>';
				}
			}
			,{header:"卖家信息", dataIndex:'CONTACTWAY', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['CONTACTS']+')';
				}
			}
			,{header:"鉴定报告", dataIndex:'REPORTNO', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					if(value){
						return '<a class="a_link" href="javascript:identifyReportInfo(\''+orderNo+'\',\''+value+'\')" title="'+value+'">'+value+'</a>';
					}else{
						return '暂无';
					}
				}
			}
			,{header:"商品名称", dataIndex:'MERNAME', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+value;
				}
			}
			,{header:"订单金额", dataIndex:'ORDERPRICE', width:'90px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var text = value;
					if(data['INSPECTIONPRICE'] != null){
						text += '<span class="green">('+data['INSPECTIONPRICE']+')</span>';
					}
					return text;
				}
			}
			,{header:"订单类型", dataIndex:'ORDERTYPE', width:'70px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == '1'){
						return '拍卖';
					}else{
						return '一口价';
					}
				}
			}
			,{header:"检测时间", dataIndex:'INSPECTIONDATE', width:'80px',sortable:false}
			,{header:"保底金额", dataIndex:'MINPRICE', width:'65px',sortable:false}
			,{header:"预拍金额", dataIndex:'AUCTIONPRICE', width:'65px',sortable:false}
			,{header:"成交金额", dataIndex:'SETTLEPRICE', width:'65px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'65px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ORDERSTATUS'] == '7'){//上架中|拍卖中
						if(data['ORDERTYPE'] == '1'){//拍卖
							return '拍卖中';
						}else{//一口价
							return '上架中';
						}
					}else if(data['ORDERSTATUS'] == '6'){//待拍卖|待上架
						if(data['ORDERTYPE'] == '1'){//拍卖
							return '待拍卖';
						}else{//一口价
							return '待上架';
						}
					}else{
						return value;
					}
				}
			}
			,{header:"操作", dataIndex:'ORDERNO',width:'130px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderStatus = data['ORDERSTATUS'];
					var returnText ='<a class="a_link" href="javascript:orderInfo(\''+value+'\')" title="'+value+'">详情</a>';
					if(orderStatus == '6'){//待拍卖|待上架
						if(data['ORDERTYPE'] == '1'){//拍卖
							returnText += ' | <a class="a_link" href="javascript:orderAuction(\''+value+'\')" title="拍卖">拍卖</a>';
						}else{//一口价
							returnText += ' | <a class="a_link" href="javascript:orderAuction(\''+value+'\')" title="上架">上架</a>';
						}
					}else if(orderStatus == '7'){//上架中|拍卖中
						if(data['ORDERTYPE'] == '2'){//一口价
							returnText += ' | <a class="a_link" href="javascript:auctionFinish(\''+value+'\')">完成</a>';
						}
					}else if(orderStatus == '8'){//待支付
						returnText += ' | <a class="a_link" href="javascript:confirmPay(\''+value+'\')" title="确认支付">确认支付</a>';
					}else if(orderStatus == '20'){//支付
						returnText += ' | <a class="a_link" href="javascript:orderPay(\''+value+'\')" title="支付">支付</a>';
					}
					var statusList = ['9','10','11','12','66','88'];
					if($.inArray(orderStatus, statusList) < 0){
						returnText += ' | <a class="a_link" href="javascript:orderCancel(\''+value+'\')" title="'+value+'">终止</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/idlefishpai/recyorder/identifylist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
	});
	
	//日期验证
	$('#startDate').click(function(){
		WdatePicker({
			onpicked:function(){$('#endDate').trigger('click');},
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			endDate:'%y-{%M-1}-%d'
		});
	});
});
function initParams(){
	var params = getParams();
	return params;
}

/**
 * 订单确认
 */
function orderAuction(orderNo){
	layer.open({
		type:2,
		title:['上架拍卖', 'text-align:center;'],
		shadeClose:false,
		shade:0.8,
		content:'/idlefishpai/recyorder/auctionpage?orderNo='+orderNo,
		area:['500px','500px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 未到货订单取消
 */
function orderCancel(orderNo){
	if(confirm('是否确定取消订单?')){
		$.post('/idlefishpai/recyorder/ordercancel', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert('订单取消失败：'+data);
			}
		});
	}
}

/**
 * 鉴定报告
 * @param callId
 * @returns
 */
function identifyReportInfo(orderNo,reportNo){
	layer.open({
		type:2,
		title:'鉴定报告',
		shadeClose:false,
		shade:0.8,
		content:'/idlefishpai/recyorder/reportpage?orderNo='+orderNo+'&reportNo='+reportNo,
		area:['640px','98%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 订单详情页面 
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/idlefishpai/recyorder/taborderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 回收订单信息
 * @param orderNo
 * @returns
 */
function recyOrderInfo(orderNo){
	layer.open({
		type:2,
		title:'回收订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/order/order/orderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 拍卖完成
 */
function auctionFinish(orderNo){
	if(confirm('是否确认商品已销售成功？')){
		$.post('/idlefishpai/recyorder/auctionfinish',{orderNo:orderNo},function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert(data);
			}
		});
	}
}

//确认交易
function confirmPay(orderNo){
	if(confirm('是否确认交易？')){
		$.post('/idlefishpai/recyorder/confirmpay',{orderNo:orderNo},function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert(data);
			}
		});
	}
}

//支付打款
function orderPay(orderNo){
	layer.open({
		type:2,
		title:'支付打款',
		shadeClose:true,
		content:'/caiwu/payment/topayment?orderNo='+orderNo,
		area:['600px','450px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function goBack(){
	window.history.go(-1);
}

function closeLayer(){
	layer.closeAll('iframe');
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function getParams(){
	return {
		orderNo:$('#orderNo').val(), 
		merName:$('#merName').val(),
		orderStatus:$('#orderStatus').val(),
		contactWay:$('#contactWay').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		merType:$('#merType').val()
	};
}
function doSearch(){
	grid.query(getParams());
}

function downloadOrder(){
	var param = '';
	param += '&orderNo=' + $('#orderNo').val();
	param += '&merName=' + $('#merName').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&merType=' + $('#merType').val();
	window.location.href = '/idlefishpai/recyorder/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}
