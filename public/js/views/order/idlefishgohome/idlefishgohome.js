var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var remarks = data['ORDERREMARKS'];
					var orderNo = data['ORDERNO']+'\n'+remarks;
					var text = '';
					if(remarks){
						try{
        					remarks = remarks.replace(/\r\n/g, "<br>");
							remarks = remarks.replace(/\n/g, "<br>");
						}catch(e){
							
						}
					}
					text = data['ORDERNO']+'<br/>'+remarks;
					return '<span title="'+orderNo+'" ondblclick="showRemark(\''+text+'\')">'+data['STRORDERDATE']+'</span>';
				}
			}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'60px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"地址", dataIndex:'DIZHI',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'65px',sortable:false}
			,{header:"联系方式", dataIndex:'', width:'140px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"订单来源", dataIndex:'', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var channel ='';
					if(data['ORDERTYPE']=='71'){
						if(data['CHANNEL']=='idle'){
							channel = '闲鱼';
						}else if(data['CHANNEL']=='tmall'){
							channel = '天猫';
						}else if(data['CHANNEL']=='alipay'){
							channel = '支付宝';
						}else if(data['CHANNEL']=='taobao'){
							channel = '淘宝';
						}else if(data['CHANNEL']=='tmall-service'){
							channel = '天猫以旧换新';
						}
					}
					if(channel){
						return data['ORDERTYPENAME']+'('+channel+')';
					}else{
						return data['ORDERTYPENAME'];
					}
				}
			}
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
			,{header:"操作人", dataIndex:'USERNAME', width:'70px',sortable:false}
			,{header:"操作时间", dataIndex:'OPERDATE', width:'90px',sortable:false}
			,{header:"操作", dataIndex:'ORDERNO', width:'250px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a href="javascript:orderInfo(\''+value+'\')" class="a_link">详情</a>';
					var status = data['ORDERSTATUS']+'';
					var orderType = data['ORDERTYPE']+'';
					var orderId = data['ORDERID'];
					var orderNo = data['ORDERNO'];
					var creditCouponFlag = data['CREDITCOUPONFLAG'];
					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
					
					if(status == '1'){//待审核
						returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">确认</a>';
						returnText+=' | <a href="javascript:Idlefishgohome(\''+orderNo+'\',\''+data['LIANXIDH']+'\')" class="a_link">切换上门</a>';
					}
					//终止操作 94:退券终止；95:转现终止；96:自动终止；97:当地回收；98:终止退回；99:终止
					var stopStatuss = ['20','66','94','95','96','97','98','99'];
					if($.inArray(status, stopStatuss) < 0){
						returnText+='| <a href="javascript:stopOrder(\''+orderNo+'\', \''+orderType+'\', \''+data['CREDITORDERFLAG']+'\',\''+creditCouponFlag+'\')" class="a_link">终止</a>';
					}
					
					returnText+='| <a href="javascript:call(\''+data['LIANXIDH']+'\')" class="a_link">外呼</a>';
					return returnText;
				}
			}
		]
		,url:'/order/idlefishgohome/pagelist'
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
 * 订单电话确认/上门/发货/收货/
 * @param orderNo
 * @return
 */
function Idlefishgohome(orderNo, mobile){
	layer.open({
	    type:2,
	    title:'订单状态修改',
	    content:'/order/idlefishgohome/switchgohome?orderNo='+orderNo+'&mobile='+mobile,
		shadeClose:false,
		shade:0.8,
	    area:['480px' , '330px'],
	    close:function(index){
			layer.close(index);
		}
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
		content:'/order/order/orderinfo?orderNo='+orderNo+'&layer=Y&backUrl='+backUrl,
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
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
	    content:'/order/order/operation?orderNo='+orderNo,
		shadeClose:false,
		shade:0.8,
	    area:['500px' , '320px'],
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
function stopOrder(orderNo, orderType, zmOrderFlag, creditCouponFlag){
	var url = '/order/order/tostoporder?orderNo='+orderNo;
	var title = '订单终止';
	
	if(orderType == '70'){//闲鱼信用回收
		url = '/idlefish/recyorder/tostoporder?orderNo='+orderNo;
		title = '闲鱼信用回收订单终止';
	}if(orderType == '71'){//闲鱼二期信用回收
		url = '/idlefishv2/recyorder/tostoporder?orderNo='+orderNo;
		title = '闲鱼信用回收订单终止';
	}else if(orderType == '66'){//信用回收订单
		url = '/zhima/recyorder/tostoporder?orderNo='+orderNo;
		title = '芝麻信用回收订单终止';
	}else if(orderType == '92'){//信用回收订单
        url = '/zhima/baichuanorder/tostoporder?orderNo='+orderNo;
        title = '百川信用回收订单终止';
    }else if(creditCouponFlag == 'Y'){//支付宝天猫店
		url = '/zhima/offlinemall/tostoporder?orderNo='+orderNo;
		title = '天猫店信用回收订单终止';
	}else if(orderType == '175' && zmOrderFlag == 'Y'){
		url = '/zhima/recyorder/tostoporder?orderNo='+orderNo;
		title = '线下信用回收订单终止';
	}else if(orderType == '74'){//信用回收订单
		url = '/zhimaapp/recyorder/tostoporder?orderNo='+orderNo;
		title = '芝麻小程序信用回收订单终止';
	}
	layer.open({
	    type:2,
	    title:title,
	    content:url,
	    area:['500px' , '350px'],
	    close:function(index){
			layer.close(index);
		}
	});
}

function call(customerNumber){
	$.get(url,{enterpriseId:enterpriseId, cno:cno, pwd:pwd, customerNumber:customerNumber}, function(data){
		alert(data);
	});
}

/**
 * 确认支付
 */
function confirmPay(orderNo){
	if(confirm('是否确认支付')){
		$.post('/order/callcenter/confirmpay', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				doSearch();
			}
		});
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
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        category:$('#category').val(),
        merType:$('#merType').val(),
        address:$('#address').val()
    };
}

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

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo){
	layer.close(layerIndex);
	layerIndex = layer.open({
		type:1,
		shade:false,
		title:false,
		area:['650px', 'auto'],
		content:'<div class="layer_notice">'+orderNo+'</div>'
	});
}

function orderSourceSearch(){
	layer.open({
	    type:2,
	    title:'订单状态修改',
	    content:'/order/order/operation?orderNo='+orderNo,
		shadeClose:false,
		shade:0.8,
	    area:['500px' , '320px'],
	    close:function(index){
			layer.close(index);
		}
	});
}
