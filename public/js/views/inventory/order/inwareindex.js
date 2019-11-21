var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'35px',sortable:false} 
			,{header:"订单编码", dataIndex:'ORDERNO', width:'170px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:orderInfo(\''+value+'\')" title="'+value+'" class="a_link">'+value+'</a>';
				}
			}
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'65px',sortable:false}
			,{header:"成交价格", dataIndex:'SETTLEPRICE', width:'65px',sortable:false}
			,{header:"订单地址", dataIndex:'DIZHI', width:'140px',sortable:false}
			,{header:"订单来源", dataIndex:'ORDERTYPENAME', width:'80px',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'', width:'60px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var appmerType = ['P','Q','R','S'];
					if($.inArray(data['MERTYPE'], appmerType) < 0){
						var returnText ='<a class="a_link" href="javascript:inWarehouse(\''+data['ORDERNO']+'\', \''+data['MERID']+'\')">入库</a>';
					}else{
						var returnText ='<a class="a_link" href="javascript:finishAppliance(\''+data['ORDERNO']+'\')">完成</a>';
					}
					return returnText;
				}
			}
			]
		,url:'/inventory/order/inwareorderlist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(){
			layer.close(layerIndex);
		}
	});
	
	//日期验证
	$('#startCreateDate').click(function(){
		WdatePicker({
			onpicked:function(){$('#endCreateDate').trigger('click');},
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endCreateDate').click(function(){
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
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
		content:"/inventory/order/orderinfo?orderNo="+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
   });
}

/**
 * 3C入库操作（废弃）
 */
//function inWarehouse(orderNo, spId){
//	if(confirm('是否确认入库？')){
//		$.post('/inventory/order/inwarehouse', {orderNo:orderNo, spId:spId}, function(data){
//			if(data == 'Y'){
//				grid.reload();
//			}else{
//				errorBox('订单状态修改错误');
//			}
//		});
//	}
//}

/**
 * 3C入库操作（新）
 */
function inWarehouse(orderNo, spId){
	if(confirm('是否确认入库？')){
		if(orderNo){
			layer.open({
				type:2,
				title:'移动库位',
				content:'/warehouse/warehousebox/warehouse?orderNo='+orderNo,
				area : ['100%', '100%'],
				close : function(index){
					layer.close(index);
				},
				end : function(index){
					window.location.reload();
				}
			});
		}
	}
}

/**
 * 3C批量入库操作
 */
function inWarehouses(){
	layer.open({
		type:2,
		title:'3C批量入库',
		shadeClose:false,
		shade:0.8,
		content:'/inventory/inventoryv2/inwarehousesindex',
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
   });
}

/**
 * 废旧批量入库操作
 */
function wasteInwares(){
	layer.open({
		type:2,
		title:'废旧批量入库',
		content:'/inventory/order/wasteinwaresindex',
		area:['500px', '360px'],
		close:function(index){
			layer.close(index);
		},
		end:function(index){
			grid.reload();//刷新
		}
	});
}

/**
 * 大家电一键完成
 */
function finishAppliance(orderNo){
	if(confirm('是否完成？')){
		$.post('/inventory/order/finishappliance', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				errorBox('订单状态修改错误');
			}
		});
	}
}

/**
 * 大家电批量一键完成
 */
function finishAppliances(){
	if(confirm('大家电是否归一键完成？')){
		$.post('/inventory/order/finishappliances',function(data){
			if(data == 'Y'){
				grid.reload();
			}
		});
	}
}

function scan(){
	var orderStr = $('#orderNo').val();
	var pos;
	if( (pos = orderStr.indexOf('≌'))>0){
		var orderNo=orderStr.substr(0,pos);
		layer.load('订单编号：'+orderNo, 1);
		grid.query({orderNo:orderNo,orderStatus:5});
		$('#orderNo').val('');
	}
}

function initParams(){
	return getParams();
}

function getParams(){
	return {
		orderStatus:'5',
		orderNo:$('#orderNo').val(),
		merName:$('#merName').val(), 
		contacts:$('#contacts').val(),
		orderType:$('#orderType').val(),
		tradeType:$('#tradeType').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

function downloadOrder(){
	var param = '';
	param += 'orderStatus=5&contactWay=' + $('#contacts').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&orderType=' + $('#orderType').val();
	param += '&tradeType=' + $('#tradeType').val();
	param += '&startCreateDate=' + $('#startCreateDate').val();
	param += '&endCreateDate=' + $('#endCreateDate').val();
	param += '&merName=' + $('#merName').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	window.location.href = '/report/report/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}
