var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10
		,height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false}
			,{header: "生成日期", dataIndex: 'STRORDERDATE', width:'90px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'65px',sortable:false}
			,{header: "联系方式", dataIndex: '', width:'140px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header: "订单地址", dataIndex: 'DIZHI', width:'120px',sortable:false}
			,{header: "订单来源", dataIndex: 'SOURCENAME', width:'70px',sortable:false}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'65px',sortable:false}
			,{header: "操作", dataIndex: '', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText='<a class="a_link" href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')">详情</a>';
					switch(data['ORDERSTATUS']){
						case '1':
							returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')">确认</a>';
						break;
						case '6':
							returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')">发货</a>';
							break;
						case '7':
							returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')">收货</a>';
							break;
						case '3':
							if(data['INSPECTIONBILLID'] != null){
								returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="orderInspection(\''+orderNo+'\',\''+data['MERTYPE']+'\', \''+orderSource+'\')">重新检测'+'</a>';
							}else{
								returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="orderInspection(\''+orderNo+'\',\''+data['MERTYPE']+'\', \''+orderSource+'\')">检测</a>';
							}
							break;
						case '68':
							if(data['INSPECTIONBILLID'] != null){
								returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="offlineOrderInspection(\''+orderNo+'\')">重新检测'+'</a>';
							}else{
								returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="offlineOrderInspection(\''+orderNo+'\')">检测</a>';
							}
							break;
					}
					return returnText;
				}
			}
		]
		,url:'/dingdan/express/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
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
});

function getParams(){
	 return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		tradeType:$('#tradeType').val(),
		contactWay:$('#contactWay').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		address:$('#address').val(),
		qrcode:$('#qrcode').val()
	};
}

function doSearch(){
	grid.paras.start = '1';
	grid.query(getParams());
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
		content:'/order/order/orderinfo?orderNo='+orderNo+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
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
function orderInspection(orderNo, merType, orderSource){
	var winHref = "/order/order/orderinspection?orderNo="+orderNo+"&backUrl="+backUrl+"&layer=Y";
	if(orderSource == '61'){//京东手Q端
		winHref = '/order/jdorder/orderinspection?orderNo='+orderNo+"&backUrl="+backUrl+"&layer=Y";
	}
	layer.open({
		type:2,
		title:'订单检测',
		content:winHref,
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 线下检测操作
 * @param orderId
 * @return
 */
function offlineOrderInspection(orderNo){
	layer.open({
		type:2,
		title:'订单检测',
		content:"/order/offline/orderinspection?orderNo="+orderNo+"&layer=Y",
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

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

$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
		$("#orderSource").html("<option value=''>请选择来源</option>");
		for(i in data){
			$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
		}
	}, 'json');
});
