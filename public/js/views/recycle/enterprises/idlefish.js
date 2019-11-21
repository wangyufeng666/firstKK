var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
		{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
		,{header:"订单编号", dataIndex:'ORDERCODE', width:'150px',sortable:false}
		,{header:"订单日期", dataIndex:'CREATEDATE', width:'100px',sortable:false}
		,{header:"订单来源", dataIndex:'ORDERTYPENAME', width:'80px',sortable:false}
		,{header:"预约时间", dataIndex:'SERVICEDATE',width:'100px',sortable:false}
		,{header:"联系人", dataIndex:'LINKMAN',width:'80px',sortable:false}
		,{header:"联系方式", dataIndex:'MOBILE',width:'80px',sortable:false}
		,{header:"公司名称", dataIndex:'COMPANYNAME',width:'150px',sortable:false}
		,{header:"所在地区", dataIndex:'COMPANYAREA', width:'100px',sortable:false}
		,{header:"订单金额", dataIndex:'PRICE',width:'60px',sortable:false}
		,{header:"订单状态", dataIndex:'STATUS', width:'80px',sortable:false,
			renderer:function(value, data, rowIndex, colIndex, metadata){
				if(data['STATUS'] == 1){
					var returnText = '未审核';
				}else if(data['STATUS'] == 2){
					var returnText = '待上门';
				}else if(data['STATUS'] == 3){
					var returnText = '已上门';
				}else if(data['STATUS'] == 66){
					var returnText = '已完成';
				}else if(data['STATUS'] == 99){
					var returnText = '已终止';
				}
				return returnText;
			}
		}
		,{header:"操作", dataIndex:'', width:'150px', sortable:false,
			renderer:function(value, data, rowIndex, colIndex, metadata){
				var returnText ='<a class="a_link" href="javascript:void(0);" onclick="info(\''+data['ORDERCODE']+'\')">详情</a>';

				if(data['STATUS'] == 1){
					returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="examine(\''+data['ORDERCODE']+'\')">审核</a>';
				}else if(data['STATUS'] == 2){
					returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="gotodoor(\''+data['ORDERCODE']+'\')">上门</a>';
				}else if(data['STATUS'] == 3){
					returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="complete(\''+data['ORDERCODE']+'\')">完成</a>';
				}if(data['STATUS'] != 66 && data['STATUS'] != 99){
					returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="stopOrder(\''+data['ORDERCODE']+'\',\''+data['STATUS']+'\')">终止</a>';
				}
				returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="deviceInfos(\''+data['ORDERCODE']+'\')">回收设备详情</a>';
				return returnText;
			}
		}]
		,url:'/recycle/enterprises/pagelist'
		,baseParams:{
			ordercode:$('#ordercode').val(),
			mobile:$('#mobile').val(),
			createdate_start:$('#createdate_start').val(),
			createdate_end:$('#createdate_end').val(),
			servicedate_start:$('#servicedate_start').val(),
			servicedate_end:$('#servicedate_end').val(),
			companyname:$('#companyname').val(),
            orderType:$('#orderType').val(),
			status:$('#status').val()
		}
	});
});

//回收设备详情
function deviceInfos(orderNo) {
	layer.open({
		type:2,
		title:'回收设备详情',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/enterprises/deviceinfos?orderNo='+orderNo,
		area:['400px','350px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 订单详情
 */
function info(ordercode){
	layer.open({
		type:2,
		title:'回收设备详情',
		shadeClose:false,
		shade:0.8,
		content:"/recycle/enterprises/qyorderinfo?ordercode="+ordercode,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 审核
 */
function examine(ordercode){
	var txt = '确定要审核吗？';
	if(confirm(txt)){
		updateStatus(ordercode,2,1);
	}
}

/**
 * 上门
 */
function gotodoor(ordercode){
	var txt = '确定要上门吗？';
	if(confirm(txt)){
		updateStatus(ordercode,3,2);
	}
}

/**
 * 完成
 */
function complete(ordercode){
	var txt = '订单确定已完成？';
	if(confirm(txt)){
		updateStatus(ordercode,66,3);
	}
}

/**
 * 关闭
 */
function stopOrder(ordercode,statusold){
	var txt = '确定关闭订单吗？';
	if(confirm(txt)){
		updateStatus(ordercode,99,statusold);
	}
}

function updateStatus(ordercode,status,statusold){
	$.post('/recycle/enterprises/updatestatus',{ordercode:ordercode,status:status,statusold:statusold},function(data){
		if(data == 'Y'){
			window.location.reload();
		}else{
			alter(data);
		}
	});
}

function getParams(){
	return {
		ordercode:$('#ordercode').val(),
		mobile:$('#mobile').val(),
		createdate_start:$('#createdate_start').val(),
		createdate_end:$('#createdate_end').val(),
		servicedate_start:$('#servicedate_start').val(),
		servicedate_end:$('#servicedate_end').val(),
		companyname:$('#companyname').val(),
		status:$('#status').val(),
		orderType:$('#orderType').val()
	};
}

function doSearch(){
	layer.msg('数据加载中...');
	grid.query(getParams());
}

//导出
function getOrder(){
	var orderType = $('#orderType').val();
	var ordercode = $('#ordercode').val();
	var mobile = $('#mobile').val();
	var createdate_start = $('#createdate_start').val();
	var createdate_end = $('#createdate_end').val();
	var servicedate_start = $('#servicedate_start').val();
	var servicedate_end = $('#servicedate_end').val();
	var companyname = $('#companyname').val();
	var status = $('#status').val();
	window.location.href='/recycle/enterprises/exportorders?orderType='+orderType+'&ordercode='+ordercode+'&mobile='+mobile
		+'&createdate_start='+createdate_start+'&createdate_end='+createdate_end+'&servicedate_start='+servicedate_start
		+'&servicedate_end='+servicedate_end+'&servicedate_end='+companyname+'&status='+status;
}