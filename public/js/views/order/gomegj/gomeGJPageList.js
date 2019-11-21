var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"订单日期", dataIndex:'ORDERTIME', width:'80px',sortable:false}
			,{header:"付款时间", dataIndex:'PAYTIME', width:'80px',sortable:false}
			,{header:"渠道名称[类型]", dataIndex:'CHANNELTYPE', width:'80px',sortable:false}
			,{header:"服务商名称", dataIndex:'SERVICENAME', width:'80px',sortable:false}
			,{header:"工程师名称", dataIndex:'ENGINEERNAME', width:'80px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'80px',sortable:false}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTWAY']+'('+data['USERNAME']+')';
				}
			} 
			,{header:"订单地址", dataIndex:'ORDERADRESS', width:'140px',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'70px',sortable:false}
			,{header:"订单状态", dataIndex:'ORDERSTATUS', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'ORDERID', width:'130px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
				}
			}
		]
		,url:'/order/gomegj/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(){
			layer.close(layerIndex);
		}
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

function initParams(){
	return getParams();
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){

	var orderType = $('#orderType').val();
	layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
		content:"/order/gomegj/orderinfo?orderNo="+orderNo+"&orderType="+orderType,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		orderType:$('#orderType').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		engineerName:$('#engineerName').val(),
		merType:$('#merType').val(),
		orderStatus:$('#orderStatus').val()		
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, shade:0.2, time:20000});
	grid.query(getParams());
}

function downloadExport(){
	var param = '';
	param += '&orderType=' + $('#orderType').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&engineerName=' + $('#engineerName').val();
	param += '&merType=' + $('#merType').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	window.location.href = '/order/gomegj/gomegjexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function anycajax(type){
	var layerIndex = layer.msg('同步中...',{icon:16,shade:0.2,time:10000});
	$.post('/order/gomegj/syncguomeidata', {orderType:type}, function(data){
		layer.close(layerIndex);
		if(data == 'Y'){
			alert('同步成功');
		}else{
			alert('同步失败');
		}
	});
}
