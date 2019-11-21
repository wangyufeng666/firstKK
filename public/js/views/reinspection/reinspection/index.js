var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header: "联系地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
			,{header: "订单来源", dataIndex: 'SOURCENAME', width:'100px',sortable:false}
			,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
			,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderId = data['ORDERID'];
					var orderNo = data['ORDERNO'];
					var status = data['ORDERSTATUS']+'';
					var orderType = data['ORDERTYPE']+'';
					var yhdBillId = data['YHDBILLID'];
					var techSupport = data['TECHSUPPORT'];
					var merType = data['MERTYPE'];
					var sourceCode = data['SOURCECODE'];
					var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					
					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
					if(status == '1'){//待审核
						returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">确认</a>';
					}else if(status == '2'){//待上门
						returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">上门</a>';
					}else if(status == '6'){//待用户发货
						returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">发货</a>';
					}else if(status == '7'){//待收货
						returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">收货</a>';
					}
					var orderTypes = ['8','10','21','22','25','26','138','143','43','44','45','51','52','61','193','194','300'];
					
					//待检测
					if(status == '3' && ( $.inArray(orderType, orderTypes) > -1 || techSupport != '1')){
						if(data['INSPECTIONBILLID'] != null){
							if(orderType == '61'){
								returnText += ' | <a href="javascript:void(0);" onclick="jdOrderInspection(\''+orderNo+'\')" class="a_link">复检</a>';
							}else{
								returnText += ' | <a href="javascript:void(0);" onclick="orderInspection(\''+orderNo+'\', \''+merType+'\')" class="a_link">复检</a>';
							}
						}else{
							if(orderType == '61'){
								returnText += ' | <a href="javascript:void(0);" onclick="jdOrderInspection(\''+orderNo+'\')" class="a_link">检测</a>';
							}else{
								returnText += ' | <a href="javascript:void(0);" onclick="orderInspection(\''+orderNo+'\', \''+merType+'\')" class="a_link">检测</a>';
							}
						}
					}
					
					//终止操作 94:退券终止；95:转现终止；96:自动终止；97:当地回收；98:终止退回；99:终止
					var stopStatuss = ['20','5','66','94','95','96','97','98','99'];
					if($.inArray(status, stopStatuss) < 0){
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+orderNo+'\',\''+sourceCode+'\')" class="a_link">终止</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/order/order/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params.start = start;
		params.limit = limit;
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
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

/**
 * 订单电话确认/上门/发货/收货/
 * @param orderNo
 * @return
 */
function orderOperation(orderNo){
	$.layer({
		type:2,
		title:'订单状态修改',
		iframe:{src:'/order/order/operation?orderNo='+orderNo},
		area:['500' , '320'],
		offset:['50px',''],
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
	window.location.href = "/order/order/orderinspection?orderNo="+orderNo;
}

/**
 * 京东订单检测
 */
function jdOrderInspection(orderNo){
	window.location.href = "/order/jdorder/orderinspection?orderNo="+orderNo;
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(orderNo, sourceCode){
	var url = '/order/order/tostoporder?orderNo='+orderNo;
	var title = '订单终止';
	var array = ['5001','5002','5003','5004','5005','5006','5007','5008','5009','5100','5101','5102','5103','5104','5123'
	             ,'5105','5106','5107','5108','5109','5110','5112','5113','5114','5115','5116','5117','5118','5119','5120','5121','5122',
	             '5124','5125','5126','5127','5128','5129','5130','5131','5132','5133','5134','5135','5136','5137','5138','5139'];
	
	var offlineZhiMaPayFlag = '';
	if(sourceCode == '175'){
		$.post('/offline/creditorder/tocheckofflinepaystatus',{orderNo:orderNo},function(data){
			if(data == 'Y'){
				offlineZhiMaPayFlag = 'Y';//线下信用回收已先行支付订单
			}
		});
	}
	if(sourceCode == '66' || offlineZhiMaPayFlag == 'Y'){//信用回收订单
		url = '/zhima/recyorder/tostoporder?orderNo='+orderNo;
		title = '芝麻信用回收订单终止';
	}else if(sourceCode == '92'){//信用回收订单
        url = '/zhima/baichuanorder/tostoporder?orderNo='+orderNo;
        title = '百川信用回收订单终止';
    }else if(sourceCode == '70'){	//闲鱼信用回收
		url = '/idlefish/recyorder/tostoporder?orderNo='+orderNo;
		title = '闲鱼信用回收订单终止';
	}else if(sourceCode == '71'){	//闲鱼二期信用回收
		url = '/idlefishv2/recyorder/tostoporder?orderNo='+orderNo;
		title = '闲鱼信用回收订单终止';
	}else if(sourceCode == '73'){	//闲鱼三期信用回收
		url = '/idlefishv3/recyorder/tostoporder?orderNo='+orderNo;
		title = '闲鱼信用回收订单终止';
	}else if(array.indexOf(sourceCode) > -1){//支付宝天猫店
		url = '/zhima/offlinemall/tostoporder?orderNo='+orderNo;
		title = '天猫店信用回收订单终止';
	}else if(sourceCode == '74'){//信用回收订单
		url = '/zhimaapp/recyorder/tostoporder?orderNo='+orderNo;
		title = '芝麻小程序信用回收订单终止';
	}
	$.layer({
		type:2,
		title:title,
		iframe:{src:url},
		area:['500', '350'],
		offset:['50px', ''],
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
		address:$('#address').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}
	});
}

$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
		$("#orderSource").html("<option value=''>请选择来源</option>");
		for(i in data){
			$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
		}
	}, 'json');
});
