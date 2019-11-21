var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'160px',sortable:false}
			,{header:"下单时间", dataIndex:'ORDERDATE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var merName = data['PNAME']+' '+data['MERNAME'];
					var orderPrice = data['ORDERPRICE']+'——'+data['SETTLEPRICE'];
					return '<span title="'+orderNo+'" ondblclick="showRemark(\''+orderNo+'\', \''+merName+'\', \''+orderPrice+'\')">'+value+'</span>';
				}
			}
			,{header:"预约时间", dataIndex:'APPOINTMENTDATE', width:'80px', sortable:false}
			,{header:"器材名称", dataIndex:'SPNAME',sortable:false}
			,{header:"客户信息", dataIndex:'CONTACTS', width:'140px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTWAY']+'('+data['CONTACTS']+')';
				}
			}
			,{header:"联系地址", dataIndex:'CONTACTADDRESS', width:'140px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'140px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var channel = '';
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
						}else if(data['CHANNEL']=='HSBexternal'){
							channel = '天猫CCO';
						}
					}
					if(channel){
						return value+'('+channel+')';
					}else{
						return value;
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
			,{header:"操作", dataIndex:'ORDERNO', width:'70px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a title="'+value+'" href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}
		]
		,url:'/recycle/order/failexpresspagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[15,30,50]
	});
});

function initParams(){
	return getParams();
}

//订单日期验证
$('#startOrderDate').click(function(){
	WdatePicker({
		dateFmt:'yyyy-MM-dd',
		doubleCalendar:true,
		maxDate:'%y-%M-%d',
		startDate:'%y-{%M-1}-%d'
	});
});

$('#endOrderDate').click(function(){
	WdatePicker({
		dateFmt:'yyyy-MM-dd',
		doubleCalendar:true,
		maxDate:'%y-%M-%d',
		startDate:'%y-{%M-1}-%d'
	});
});

//预约日期验证
$('#startAppointmentDate').click(function(){
	WdatePicker({
		dateFmt:'yyyy-MM-dd',
		doubleCalendar:true,
		maxDate:'%y-%M-%d',
		startDate:'%y-{%M-1}-%d'
	});
});

$('#endAppointmentDate').click(function(){
	WdatePicker({
		dateFmt:'yyyy-MM-dd',
		doubleCalendar:true,
		maxDate:'%y-%M-%d',
		startDate:'%y-{%M-1}-%d'
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
		area:['100%' , '100%'],
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
			type:1, shade:false, title:false, area:['650px', 'auto'],
			content:'<div class="layer_notice">订单编码： '+orderNo+'<br/>商品名称：'+merName+'<br/>订单金额：'+orderPrice+'<br/>'+data+'</div>'
		});
	});
}

function getBusinesscodeBySource(source) {
	var businesscode = "";
	$.ajax({
		type:"post",
		url:"/order/order/getbusinesscodebysource",
		data:{source:source},
		async:false,
		success:function(result){
			businesscode = result.BUSINESSCODE
		}
	});
	return businesscode;
}

function getParams(){
	return {
		contactWay:$('#contactWay').val(),
		//merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		orderStatus:$('#orderStatus').val(),
		startOrderDate:$('#startOrderDate').val(),
		endOrderDate:$('#endOrderDate').val(),
		startAppointmentDate:$('#startAppointmentDate').val(),
		endAppointmentDate:$('#endAppointmentDate').val(),
		address:$('#address').val(),
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}

//回车事件
document.onkeypress = keypress;
function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}

//渠道change事件
$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
		$("#orderSource").html("<option value=''>请选择来源</option>");
		for(i in data){
			$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
		}
	}, 'json');
});

function exportOrders(){
	var params = getParams();
	window.location.href = '/recycle/order/exportfailexpressorders?'+$.param(params);
}