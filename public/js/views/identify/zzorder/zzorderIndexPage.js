var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
			,{header: "创建日期", dataIndex: 'CREATEDATE', width:'100px',sortable:false}
			,{header: "订单编号", dataIndex: 'ORDERNO', width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return '<a class="a_link" href="javascript:orderInfo(\''+value+'\')">'+value+'</a>';
				}
			}
			,{header: "商家订单号", dataIndex: 'BIZ_ORDERNO', width:'100px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'80px',sortable:false}
			,{header: "卖家信息", dataIndex: 'SELLER_MOBILE', width:'120px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['SELLER_NICK']+')';
				}
			}
			,{header: "寄入快递", dataIndex: 'IN_EXPRESSNO', width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return '<a class="a_link" href="javascript:expressInfo(\''+value+'\')" title="'+value+'">'+value+'</a>';
				}
			}
			,{header: "寄出快递", dataIndex: 'OUT_EXPRESSNO', width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					if(value){
						return '<a class="a_link" href="javascript:expressInfo(\''+value+'\')" title="'+value+'">'+value+'</a>';
					}else{
						return '暂无';
					}
				}
			}
			,{header: "鉴定报告", dataIndex: 'REPORTNO', width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					if(value){
						return '<a class="a_link" href="javascript:identifyReportInfo(\''+orderNo+'\')" title="'+value+'">'+value+'</a>';
					}else{
						return '暂无';
					}
				}
			}
			,{header: "商品名称", dataIndex: 'BIZ_MERNAME', sortable:false}
			,{header: "操作", dataIndex: 'ORDERNO',width:'160px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var orderStatus = data['ORDERSTATUS'];
					var returnText ='';
                    returnText += '<a class="a_link" href="javascript:orderInfo(\''+value+'\')">详情</a>';
					if(orderStatus == '1'){//待确认
						returnText += ' | <a class="a_link" href="javascript:callInExpress(\''+value+'\', \''+data['IN_EXPRESSNO']+'\')">叫快递</a>';
						returnText += ' | <a class="a_link" href="javascript:orderConfirm(\''+value+'\')">确认</a>';
						returnText += ' | <a class="a_link" href="javascript:orderCancel(\''+value+'\')">取消</a>';
					}else if(orderStatus == '2'){//待发货
						returnText += ' | <a class="a_link" href="javascript:orderDelivered(\''+value+'\')">用户发货</a>';
						returnText += ' | <a class="a_link" href="javascript:orderCancel(\''+value+'\')">取消</a>';
					}else if(orderStatus == '3'){//待收货
						returnText += ' | <a class="a_link" href="javascript:orderReceived(\''+value+'\')">收货</a>';
					}else if(orderStatus == '4'){//待鉴定
						returnText += ' | <a class="a_link" href="javascript:orderIndentify(\''+value+'\')">鉴定检测</a>';
					}else if(orderStatus == '5'){//已鉴定-待推送报告
						returnText += ' | <a class="a_link" href="javascript:pushOrderIndentify(\''+value+'\')">推送报告</a>';
					}else if(orderStatus == '6'){//已鉴定-已推送报告
						returnText += ' | <a class="a_link" href="javascript:userConfirm(\''+value+'\')">用户反馈</a>';
					}else if(orderStatus == '7'){
						returnText += ' | <a class="a_link" href="javascript:tradeConfirm(\''+value+'\')">用户确认</a>';
					}else if(orderStatus == '20'){//终止-待退回
                        returnText += ' | <a class="a_link" href="javascript:stopReturnConfirm(\''+value+'\')">终止确认</a>';
                    }else if(orderStatus == '21'){//终止-待发货
                        returnText += ' | <a class="a_link" href="javascript:endSend(\''+value+'\', \'发货\')">发货</a>';
                    }else if(orderStatus == '22'){//终止-待收货
                        returnText += ' | <a class="a_link" href="javascript:endCollect(\''+value+'\',\'客户已收货\')">收货</a>';
                    }else if(orderStatus == '30'){//交易-待退回
                        returnText += ' | <a class="a_link" href="javascript:tradeReturnConfirm(\''+value+'\')">交易确认</a>';
                    }else if(orderStatus == '31'){//交易-待发货
                        returnText += ' | <a class="a_link" href="javascript:tradeSend(\''+value+'\', \'发货\')">发货</a>';
                    }else if(orderStatus == '32'){//交易-待收货
                        returnText += ' | <a class="a_link" href="javascript:tradeCollect(\''+value+'\', \'客户已收货\')">收货</a>';
                    }
					return returnText;
				}
			}
		]
		,url : '/identify/zzorder/pagelist'
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
 * 跳转到新增租赁库存界面
 */
function orderUploadPage(){
	layer.open({
		type:2,
		title:'转转寄卖订单导入',
		shadeClose:false,
		shade:0.8,
		content:'/identify/zzorder/uploadpage',
		area:['600px','300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 订单确认
 */
function orderConfirm(orderNo){
	if(confirm('是否确定订单有效性?')){
		$.post('/identify/order/orderconfirm', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				grid.reload();
			}
		});
	}
}

/**
 * 取消订单
 */
function orderCancel(orderNo){
	if(confirm('是否确定取消订单?')){
		$.post('/identify/order/ordercancel', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert('订单取消失败：'+data);
			}
		});
	}
}

function endSend(orderNo,text){//终止待发货
    if(confirm('是否确定'+text+'?')){
        $.post('/identify/zzorder/updateorderstatus', {orderNo:orderNo,key:'endSend'}, function(data){
            if(data == 'Y'){
                grid.reload();
            }
        });
    }
}

function endCollect(orderNo,text){//终止待收货
    if(confirm('是否确定'+text+'?')){
        $.post('/identify/zzorder/updateorderstatus', {orderNo:orderNo,key:'endCollect'}, function(data){
            if(data == 'Y'){
                grid.reload();
            }
        });
    }
}

function tradeSend(orderNo,text){//交易待发货
    if(confirm('是否确定'+text+'?')){
        $.post('/identify/zzorder/updateorderstatus', {orderNo:orderNo,key:'tradeSend'}, function(data){
            if(data == 'Y'){
                grid.reload();
            }
        });
    }
}

function tradeCollect(orderNo,text){//交易待收货
    if(confirm('是否确定'+text+'?')){
        $.post('/identify/zzorder/updateorderstatus', {orderNo:orderNo,key:'tradeCollect'}, function(data){
            if(data == 'Y'){
                grid.reload();
            }
        });
    }
}

/**
 * 用户已发货
 */
function orderDelivered(orderNo){
	if(confirm('是否确定用户已发货?')){
		$.post('/identify/order/delivered', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert('操作失败：'+data);
			}
		});
	}
}

/**
 * 商品寄入收货
 */
function orderReceived(orderNo){
	layer.open({
		type:2,
		title:'鉴定收货',
		shadeClose:false,
		shade:0.8,
		content:'/identify/zzorder/receivepage?orderNo='+orderNo,
		area:['500px','300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 快递信息
 * @param callId
 * @returns
 */
function expressInfo(callId){
    layer.open({
    	type:2,
    	title:'代叫快递信息',
    	shadeClose:false,
    	shade:0.8,
    	content:'/identify/order/expresspage?callId='+callId,
    	area:['600px','450px'],
    	close:function(index){
    		layer.close(index);
    	}
    });
}

/**
 * 快递信息
 * @param callId
 * @returns
 */
function outexpressInfo(callId){
    layer.open({
        type:2,
        title:'代叫快递信息',
        shadeClose:false,
        shade:0.8,
        content:'/identify/order/rollback?orderNo='+orderNo+'&callId='+callId,
        area:['600px','450px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 鉴定报告
 * @param callId
 * @returns
 */
function identifyReportInfo(orderNo){
	layer.open({
		type:2,
		title:'鉴定报告',
		shadeClose:false,
		shade:0.8,
		content:'/identify/zzorder/reportpage?orderNo='+orderNo,
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
		content:'/identify/zzorder/orderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 订单待鉴定页面 
 */
function orderIndentify(orderNo){
	layer.open({
		type:2,
		title:'商品鉴定',
		shadeClose:false,
		shade:0.8,
		content:'/identify/zzorder/identifypage?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

//推送鉴定报告
function pushOrderIndentify(orderNo){
	if(confirm('是否确认平台发布竞拍消息?')){
		$.post('/identify/zzorder/pushidentifyreport', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				grid.reload();
			}
		});
	}
}

//用户反馈
function userConfirm(orderNo){
	layer.open({
		type:2,
		title:'商品鉴定-用户确认',
		shadeClose:false,
		shade:0.8,
		content:'/identify/zzorder/sendbackpage?orderNo='+orderNo,
		area:['600px','500px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 待用户叫寄出快递
 * @returns
 */
function callInExpress(orderNo, callId){
	layer.open({
		type:2,
		title:'代叫快递信息',
		shadeClose:false,
		shade:0.8,
		content:'/identify/order/inexpresspage?callId='+callId,
		area:['600px','450px'],
		close:function(index){
			layer.close(index);
		}
	});
}

//确认交易
function tradeConfirm(orderNo){
	layer.open({
		type:2,
		title:'退回待确认',
		shadeClose:true,
		content:'/identify/zzorder/sendbackpage?orderNo='+orderNo+'&operType=2',
		area:['600px','450px'],
		close:function(index){
			layer.close(index);
		}
	});
}

//确认交易退回
function tradeReturnConfirm(orderNo){
	layer.open({
		type:2,
		title:'确认交易退回',
		shadeClose:true,
		content:'/identify/zzorder/sendbackpage?orderNo='+orderNo+'&operType=2&returnFlag=TRADE',
		area:['600px','450px'],
		close:function(index){
			layer.close(index);
		}
	});
}

//确认终止退回
function stopReturnConfirm(orderNo){
	layer.open({
		type:2,
		title:'确认终止退回',
		shadeClose:true,
		content:'/identify/zzorder/sendbackpage?orderNo='+orderNo+'&operType=1&returnFlag=STOP',
		area:['600px','450px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 回退叫快递
 * @returns
 */
function rollBack(orderNo, incallId, outcallId,key){
    var callId = '';
    if(outcallId != 'null' && outcallId != ''){
      callId = outcallId;
    }
    layer.open({
        type:2,
        title:'回退叫快递信息',
        shadeClose:false,
        shade:0.8,
        content:'/identify/order/rollback?orderNo='+orderNo+'&callId='+callId+'&incallId='+incallId+'&expressType=2&key='+key,
        area:['600px','450px'],
        close:function(index){
            layer.close(index);
        }
    });
}

function downloadExport(){
	var param = '';
	param += '&startDate=' + $('#pay_date_start').val();
	param += '&endDate=' + $('#pay_date_end').val();
	window.location.href = '/idlefish/recyorder/payexport?'+param;
	return false;
}

/**
 * 详情
 */
function infos(pkid){
	window.location.href = "/idlefish/creditfinance/payinfo?pkid="+pkid+"&backUrl="+backUrl;
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
    	bizOrderNo:$('#bizOrderNo').val(),
    	orderStatus:$('#orderStatus').val(),
    	contactWay:$('#contactWay').val(),
    	startDate:$('#startDate').val(),
    	endDate:$('#endDate').val(),
    	merType:$('#merType').val(),
    	category:$('#category').val()
    };
}
function doSearch(){
    grid.query(getParams());
}

function downloadOrder(){
	var param = '';
	param += '&orderNo=' + $('#orderNo').val();
	param += '&merName=' + $('#merName').val();
	param += '&bizOrderNo=' + $('#bizOrderNo').val();	
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&merType=' + $('#merType').val();
	param += '&category=' + $('#category').val();
	window.location.href = '/identify/zzorder/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}

