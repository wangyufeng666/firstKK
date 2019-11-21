var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"支付生成日期", dataIndex:'CREATEDATE', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var array = [];
					array.push("支付交易流水号："+data['BIZ_TRADE_NO']);
					array.push("支付宝交易流水号："+data['PAY_TRADE_NO']);
					array.push("付款人ID："+data['BUYER_ID']);
					array.push("付款人账号："+data['BUYER_LOGON_ID']);
					return '<span title="'+array.join("\n")+'" ondblclick="showRemark(\''+array.join('<br/>')+'\')">'+value+'</span>';
				}
			}
			,{header:"支付状态", dataIndex:'PAYSTATUSNAME', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a class="a_link" href="javascript:orderPayInfo(\''+data['PAYPKID']+'\')">('+value+')</span>';
				}
			}
			,{header:"支付金额", dataIndex:'TOTAL_AMOUNT', width:'80px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = value+'<span class="green">('+data['RECEIPT_AMOUNT']+')</span>';
					return returnText;
				}
			}
			,{header:"支付日期", dataIndex:'PAY_DATE', width:'100px',sortable:false}
			,{header:"租赁归还单号", dataIndex:'ORDERNO', width:'160px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var array = [];
					array.push("下单时间："+data['ORDERDATE']);
					array.push("订单编号："+value);
					if(data['SOURCES'] == '1011'){
						array.push("门店编码："+data['PARTNERCODE']);
						array.push("门店名称："+data['PARTNERNAME']);
						array.push("店长信息："+data['P_CONTACTS']+'（ '+data['P_MOBILE']+' ）');
						array.push('上门标记：'+(data['VISITFLAG'] == '1' ? '上门' : '快递'));
						if(data['SOURCES'] == '1011'){
							array.push('租赁模式：'+(data['FROMCODE'] == 'ZZY' ? '有抵押模式' : '无抵押模式'));
						}
					}
					array.push("商品串码："+data['IMEICODE']);
					array.push("归还码："+data['IDENTIFYNO']);
					array.push("回收单号："+data['RECYORDERNO']);
					array.push("租赁单号："+data['RENTORDERNO']);
					return '<span title="'+array.join("\n")+'" ondblclick="showRemark(\''+array.join('<br/>')+'\')">'+value+'</span>';
				}
			}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SOURCES'] == '1011'){
						return value+'('+(data['FROMCODE'] == 'ZZY' ? '有抵押模式' : '无抵押模式')+')';
					}else{
						return value;
					}
				}
			}
			,{header:"商品名称", dataIndex:'PRODUCT_NAME', sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['BRAND_NAME']+' '+value;
				}
			}
			,{header:"联系方式", dataIndex:'CONTACTS', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = value+'('+data['CONTACTWAY']+')';
					return returnText;
				}
			}
			,{header:"回收单", dataIndex:'RECYORDERNO', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value){
						return '<a href="javascript:recyOrderInfo(\''+value+'\')" class="a_link" title="'+value+'">'+value+'</a>';
					}
				}
			}
			,{header:"操作", dataIndex:'ORDERNO', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
					returnText += ' | <a href="javascript:orderImgs(\''+value+'\')" class="a_link">照片</a>';
					return returnText;
				}
			}
		]
		,url:'/rentrecy/orderpay/pagelist'
		,baseParams:getParams()
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
			startDate:'%y-{%M-1}-%d'
		});
	});
});

/**
 * 回收订单详情
 * @param recyOrderNo
 * @returns
 */
function recyOrderInfo(recyOrderNo){
    layer.open({
		type:2,
		title:'回收订单详情',
		shadeClose:false,
		shade:0.8,
        content:'/order/order/orderinfo?orderNo='+recyOrderNo+'&layer=Y',
        area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
    });
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(data){
	layer.close(layerIndex);
	layerIndex = layer.open({
		type:1, shade:false, title:false, area:['650px', 'auto'],
		content:'<div class="layer_notice">'+data+'</div>'
	});
}

/**
 * 订单详情
 * @return
 */
function orderInfo(orderNo){
    layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
        content:'/rentrecy/order/orderinfo?orderNo='+orderNo,
        area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
    });
}

/**
 * 订单详情
 * @return
 */
function orderImgs(orderNo){
    layer.open({
		type:2,
		title:'订单拍照留档',
		shadeClose:false,
		shade:0.8,
        content:'/rentrecy/order/orderimgs?orderNo='+orderNo,
        area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
    });
}


/**
 * 订单详情
 * @return
 */
function orderPayInfo(payId){
    layer.open({
		type:2,
		title:'订单支付信息',
		shadeClose:false,
		shade:0.8,
        content:'/rentrecy/orderpay/payinfo?payId='+payId,
        area:['700px', '400px'],
		close:function(index){
			layer.close(index);
		}
    });
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(),
    	identifyNo:$('#identifyNo').val(),
    	recyOrderNo:$('#recyOrderNo').val(),
        orderStatus:$('#orderStatus').val(),
        fromCode:$('#fromCode').val(),
        orderSource:$('#orderSource').val(),
        startDate:$('#startDate').val(),
        imeiCode:$('#imeiCode').val(),
        contactWay:$('#contactWay').val(),
        endDate:$('#endDate').val()
    };
}

function doSearch(){
    grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

$('#exportBtn').click(function(){
	var orderNo = $('#orderNo').val();
	var identifyNo = $('#identifyNo').val();
	var orderStatus = $('#orderStatus').val();
	var fromCode = $('#fromCode').val();
	var orderSource = $('#orderSource').val();
	var startDate = $('#startDate').val();
	var imeiCode = $('#imeiCode').val();
	var contactWay = $('#contactWay').val();
	var endDate = $('#endDate').val();
	var param = 'orderNo='+orderNo+'&identifyNo='+identifyNo+'&orderStatus='+orderStatus;
	param += '&fromCode='+fromCode+'&contactWay='+contactWay+'&orderSource='+orderSource;
	param += '&startDate='+startDate+'&imeiCode='+imeiCode+'&endDate='+endDate;
	window.location.href = '/rentrecy/orderpay/orderpayexport?'+param;
	return false;
});
