var grid, logGrid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"初检日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var merName = data['PNAME']+' '+data['MERNAME'];
					var orderPrice = data['ORDERPRICE']+'——'+data['SETTLEPRICE'];
					return '<span title="'+orderNo+'" ondblclick="showRemark(\''+orderNo+'\', \''+merName+'\', \''+orderPrice+'\')">'+data['STRORDERDATE']+'</span>';
				}
			}
			,{header:"操作人", dataIndex:'USERNAME', width:'80px',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'160px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"联系地址", dataIndex:'DIZHI', width:'100px',sortable:false}
			,{header:"订单来源", dataIndex:'', width:'100px',sortable:false
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
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
		]
		,url:'/order/initialcheck/pagelisttrack'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});

	logGrid = $('#logGrid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"初检日期", dataIndex:'CREATEDATE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var merName = data['PNAME']+' '+data['MERNAME'];
					var orderPrice = data['ORDERPRICE']+'——'+data['SETTLEPRICE'];
					return '<span title="'+orderNo+'" ondblclick="showRemark(\''+orderNo+'\', \''+merName+'\', \''+orderPrice+'\')">'+data['CREATEDATE']+'</span>';
				}
			}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'80px',sortable:false}
			,{header:"联系方式", dataIndex:'', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"联系地址", dataIndex:'DIZHI', width:'160px',sortable:false}
			,{header:"运单号", dataIndex:'EXPRESSNUM',width:'80px',sortable:false}
			,{header:"库编号", dataIndex:'MERBOXID', width:'130px',width:'80px',sortable:false}
			,{header:"操作人", dataIndex:'USERNAME', width:'80px',sortable:false}
		]
		,url:'/order/initialcheck/pagelistlog'
		,baseParams:logInitParams()
		,afterRender:function(e, daily){
			layer.close(layerIndex);
		}
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
	
	
	//日期验证
	$('#logStartDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#logEndDate').click(function(){
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

function logInitParams(){
	return getLogParams();
}

function getParams(){
	return {
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		userName:$('#userName').val()
	};
}

function getLogParams(){
	return {
		startDate:$('#logStartDate').val(),
		endDate:$('#logEndDate').val()
	};
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


function Export(){
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var userName = $('#userName').val();
	window.location.href='/order/initialcheck/export?startDate='+startDate+'&endDate='+endDate+'&userName='+userName;
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
	logGrid.query(getLogParams());
}


/**
 * 导出初检日志
 * @param orderNo
 */
function exportLog(){
	var startDate = $("#logStartDate").val();
	var endDate = $("#logEndDate").val();
	if(startDate == ''){
		alert('请选择开始日期');
		return false;
	}
	if(endDate == ''){
		alert('请选择结束日期');
		return false;
	}
	window.location.href='/order/initialcheck/exportlog?endDate='+endDate+'&startDate='+startDate;
}

/**
 * 清空本次初检日志
 * @param orderNo
 */
function emptyLog(){
	var startDate = $("#logStartDate").val();
	var endDate = $("#logEndDate").val();
	if(startDate == ''){
		alert('请选择开始日期');
		return false;
	}
	if(endDate == ''){
		alert('请选择结束日期');
		return false;
	}
	if(confirm('请先导出日志，清空后不能导出日志，确认清空吗？')){
		$.post('/order/initialcheck/emptylog',{startDate:startDate,endDate:endDate}, function(data){
			if(data == 'Y'){
				logGrid.reload();
			}else{
				alert('清空失败');
			}
        });
	}
}


