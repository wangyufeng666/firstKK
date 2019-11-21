var grid,layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME', width:'120px',sortable:false
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
			//,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<span style="color:green;">('+data['SETTLEPRICE']+')</span>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
			,{header: "操作", dataIndex: 'ORDERNO', width:'200px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					let status = data['ORDERSTATUS'];
					let orderType = data['ORDERTYPE'];
					let zm_order_type = data['ZM_ORDER_TYPE'];
					let zm_order_status = data['ZM_ORDER_STATUS'];
					let returnText ='<a title="\'+value+\'" href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';

					if(orderType == '175' || orderType == '176'){
						if(status == '1' || status == '2' || status == '6' || status == '7'){
							returnText += ' | <a href="javascript:toPay(\''+value+'\')" class="a_link">付款</a>';
						}
						if(status == '68'){
							returnText += ' | <a href="javascript:orderInspection(\''+value+'\')" class="a_link">检测</a>';
						}
						let changeStatus = ['1','2','6','7','68'];
						if($.inArray(status, changeStatus) >= 0){
							let orderPrice = data['ORDERPRICE'];
							returnText += ' | <a href="javascript:changePrice(\''+value+'\', \''+orderPrice+'\')" class="a_link">调价</a>';
						}
					}
					
					//终止操作 94:退券终止；95:转现终止；96:自动终止；97:当地回收；98:终止退回；99:终止
					let stopStatuss = ['20','66','94','95','96','97','98','99'];
					if($.inArray(status, stopStatuss) < 0){
						returnText+=' | <a href="javascript:stopOrder(\''+value+'\')" class="a_link">终止</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/offline/common/pagelist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
		,afterRender:function(){
			layer.close(layerIndex);
		}
	});
});

function initParams(){
	return getParams();
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
		content:'/order/offline/orderinfo?orderNo='+orderNo,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 *修改订单的下单价格 
 * @param orderNo
 * @param orderPrice
 * @returns
 */
function changePrice(orderNo, orderPrice){
	let str = prompt("请输入新的订单价格");
	if(str && orderNo && orderPrice){
		let reg =  /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
		if(reg.test(str)){
			$.post('/offline/asus/changeprice',{newOrderPrice:str, orderNo:orderNo, dingdanPrice:orderPrice},function(data){
				if(data.code == '200'){
					alert(data.msg);
					grid.reload();
				}else{
					alert(data.msg);
				}
			})
		}else{
			alert("格式错误!");
		}
	}else{
		alert("单价不能为空！");
	}
}

function reload(){
	layer.closeAll();
	grid.reload();
}

/**
 * 确认支付
 * @param orderNo
 * @return
 */
function toPay(orderNo){
	layer.open({
		type:2,
		title:'确认支付页面',
		content:'/offline/asus/topay?orderNo='+orderNo,
		area:['500px' , '450px'],
		close:function(index){
			layer.close(index);
		}
	});
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
		content:'/order/offline/orderinspection?orderNo='+orderNo,
		area:['100%' , '100%'],
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
	var url = '/order/offline/tostoporder?orderNo='+orderNo;
	var title = '订单终止';
	layer.open({
		type:2,
		title:title,
		content:url,
		area:['520px', '360px'],
		close:function(index){
			layer.close(index);
		}
	});
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
		parentCode:$('#parentCode').val(),
		mailNo:$('#mailNo').val(),
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}


function exprotOfflineOrder(){
	var param = new Object();
	param.merName = $('#merName').val();
	param.orderNo = $('#orderNo').val();
	param.contactWay = $('#contactWay').val();
	param.orderStatus = $('#orderStatus').val();
	param.startDate = $('#startDate').val();
	param.endDate = $('#endDate').val();
	param.category = $('#category').val();
	param.merType = $('#merType').val();
	param.address = $('#address').val();
	param.partnerCode = $('#partnerCode').val();
	param.orderSource = $('#orderSource').val();
	param.partnerName = $('#partnerName').val();
	param.parentCode = $('#parentCode').val();
	window.location.href = '/offline/common/exprotoffline?'+$.param(param);
	return false; //截取返回false就不会保存网页了
}
