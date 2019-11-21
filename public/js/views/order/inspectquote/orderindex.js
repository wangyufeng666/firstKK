var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header: "No.", dataIndex: 'R', width:'30PX',sortable:false}
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'60px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					return '<span title="'+orderNo+'" ondblclick="showRemark(\''+orderNo+'\')">'+data['STRORDERDATE']+'</span>';
				}
			}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'40px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['CHANNEL'] == 'tmall-service'){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['PARTNERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}
				}
			}
			,{header: "二次报价金额", dataIndex: 'SETTLEPRICES', width:'70px',sortable:false}
			,{header: "联系方式", dataIndex: '', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header: "联系地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
			,{header: "订单来源", dataIndex: '', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var channel ='';
					if(data['ORDERTYPE']=='71' || data['ORDERTYPE']=='73'){
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
						return data['SOURCENAME']+'('+channel+')';
					}else{
						return data['SOURCENAME'];
					}
				}
			}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'50px',sortable:false}
			,{header: "操作", dataIndex: '', width:'130px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderId = data['ORDERID'];
					var orderNo = data['ORDERNO'];
					var status = data['ORDERSTATUS']+'';
					var quotations = data['SETTLEPRICES'];
					var settlePrice = data['SETTLEPRICE'];
					var returnText = '';
					if(data['STATUS'] == 'N'){
						returnText +='<a title="'+orderNo+'" href="javascript:testQuotation(\''+orderNo+'\',\'N\')" class="a_link">报价</a>';
						if(quotations == null || quotations == 0 || quotations == '0'){
							returnText +=' | <a title="'+orderNo+'" href="javascript:quickQuotation(\''+orderNo+'\',\''+settlePrice+'\')" class="a_link">确认检测价</a>';
						}
					}else{
						returnText +='<a title="'+orderNo+'" href="javascript:testQuotation(\''+orderNo+'\',\'Y\')" class="a_link">查看</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/order/inspectquote/pagelist'
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[15,30,50]
	});
	
	//日期验证
	$('#startDate').click(function(){
		WdatePicker({
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
			startDate:'%y-{%M-1}-%d'
		});
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
		content:"/order/order/orderinfo?orderNo="+orderNo,
		shadeClose:false,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 二次报价
 * @param orderNo
 * @return
 */
function testQuotation(orderNo,flag){
	layer.open({
		type:2,
		title:'品类二次报价',
		content:'/order/inspectquote/quotation?orderNo='+orderNo+'&flag='+flag,
		shadeClose:false,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 一键报价
 * @param orderNo
 * @return
 */
function quickQuotation(orderNo,settlePrice){
	if(confirm("是否报价？")){
		$.post('/order/inspectquote/quickquotation', {orderNo:orderNo,settlePrice:settlePrice}, function(data){
			if(data == "Y"){
				grid.reload();
			}else{
				alert(data);
			}
		}, 'json');
	}
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		tradeType:$('#tradeType').val(),
		contactWay:$('#contactWay').val(),
		//partnerCode:$('#partnerCode').val(),
		//orderSource:$('#orderSource').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		expressNum:$('#expressNum').val(),
		//idleFishChannel:$('#idleFishChannel').val(),
		address:$('#address').val()
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	grid.query(getParams());
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
 * 重新加载
 * @returns
 */
function reload(){
	layer.closeAll();
	grid.reload();
}