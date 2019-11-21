var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
		{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
		,{header:"订单编号", dataIndex:'ORDERCODE', width:'110px',sortable:false}
		,{header:"订单日期", dataIndex:'CREATEDATE', width:'80px',sortable:false}
		,{header:"订单来源", dataIndex:'ORDERTYPENAME', width:'80px',sortable:false}
		,{header:"预约时间", dataIndex:'SERVICEDATE',width:'80px',sortable:false}
		,{header:"联系人", dataIndex:'LINKMAN',width:'80px',sortable:false}
		,{header:"联系方式", dataIndex:'MOBILE',width:'80px',sortable:false}
		,{header:"工号/分机号", dataIndex:'JOBCODE',width:'90px',sortable:false}
		,{header:"公司名称", dataIndex:'COMPANYNAME',width:'100px',sortable:false}
		,{header:"所在地区", dataIndex:'COMPANYAREA', width:'100px',sortable:false}
		,{header:"订单金额", dataIndex:'PRICE',width:'80px',sortable:false}
		,{header:"订单状态", dataIndex:'STATUS', width:'80px',sortable:false,
			renderer:function(value, data, rowIndex, colIndex, metadata){
				if(data['STATUS'] == 1){
					var returnText = '待审核';
				}else if(data['STATUS'] == 2){
					var returnText = '待上门';
				}else if(data['STATUS'] == 3){
					var returnText = '已上门';
				}else if(data['STATUS'] == 4){
					var returnText = '待付款';
				}else if(data['STATUS'] == 5){
					var returnText = '待入库';
				}else if(data['STATUS'] == 66){
					var returnText = '已完成';
				}else if(data['STATUS'] == 99){
					var returnText = '终止';
				}
				return returnText;
			}
		}
		,{header:"操作", dataIndex:'', width:'140px', sortable:false,
			renderer:function(value, data, rowIndex, colIndex, metadata){
				var returnText ='<a class="a_link" href="javascript:void(0);" onclick="info(\''+data['ORDERCODE']+'\')">详情</a>';
				if(data['STATUS'] == 1){
					returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="examine(\''+data['ORDERCODE']+'\')">审核</a>';
				}else if(data['STATUS'] == 4){
					returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="complete(\''+data['ORDERCODE']+'\')">确认已打款</a>';
				}
				if(data['STATUS'] != 66 && data['STATUS'] != 99){
					returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="stopOrder(\''+data['ORDERCODE']+'\',\''+data['STATUS']+'\')">终止</a>';
				}
				if(data['JOBCODE']== null && (data['STATUS']==2 || data['STATUS']==3)){
					returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="assign(\''+data['ORDERCODE']+'\')">派单</a>';
				}else if(data['ORDERSTATUS'] == 2 || data['ORDERSTATUS'] == 3){
					returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="changeAssign(\''+data['ORDERCODE']+'\')">改派</a>';
				}
				return returnText;
			}
		}]
		,url:'/recycle/businessrecycle/pagelist'
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
	
	$("#province").val("");
	
	$("#province").change(function(){
		$.ajax({
	        type : 'POST'//请求方式
	        ,url : "/system/inspector/getcitybyprovinceid"  //请求路径
	        ,data : {provinceid:$('#province').val()}  //发送到服务器的数据
	        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async : true //同步请求
	        ,timeout :60000//默认超时60秒
	        ,dataType:'json' //预期服务器返回的数据类型
	        ,success : function(data){
	        		$("#city").html("<option value=''>-请选择城市-</option>");
	            	for(i in data){
	            		$("#city").append("<option value='"+data[i]['AREA_ID']+"'>"+data[i]['AREA_NAME']+"</option>");
	            	}
	        }
	    });
	}); 
	
	$("#city").change(function(){
		$.ajax({
	        type : 'POST'//请求方式
	        ,url : "/dingdan/inspection/getinspector"  //请求路径
	        ,data : {areaId:$('#city').val()}  //发送到服务器的数据
	        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async : true //同步请求
	        ,timeout :60000//默认超时60秒
	        ,dataType:'json' //预期服务器返回的数据类型
	        ,success : function(data){
	        		$("#inspector").html("<option value=''>-请选择检测人员-</option>");
	            	for(i in data){
	            		$("#inspector").append("<option value='"+data[i]['JOBNUM']+"'>"+data[i]['NAME']+"</option>");
	            	}
	        }
	    });
	});
});

function assign(orderNo){
	$("#assign_orderNo").val(orderNo);
	$("#assign_title").text("订单编号："+orderNo);
	$("#assign_div").show();
	$("#fade").show();
}

function changeAssign(orderNo){
	$("#assign_orderNo").val(orderNo);
	$("#assign_title").text("订单编号："+orderNo);
	$("#assign_div").show();
	$("#fade").show();
}

function cancel(){
	$("#assign_div").hide();
	$("#fade").hide();
}

function assignOrder(){
	if($("#inspector").val() != "" && $("#assign_orderNo").val() != "" && $("#appointmenttime").val() != ""){
		$.ajax({
	        type : 'POST'//请求方式
	        ,url : "/recycle/businessrecycle/assignorder"  //请求路径
	        ,data : {orderNo:$("#assign_orderNo").val(),inspectorId:$("#inspector").val(),appointmenttime:$("#appointmenttime").val()}  //发送到服务器的数据
	        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async : false //同步请求
	        ,timeout :60000//默认超时60秒
	        ,dataType:'json' //预期服务器返回的数据类型
			,success : function(data){
	    		if(data == "Y"){
	    			$("#assign_orderNo").val("");
	    			$("#assign_div").hide();
	    			$("#appointmenttime").hide();
	    			$("#fade").hide();
	    			doSearch();
	            }else{
	            	alert('派单失败');
	            }
			}
		});
	}else{
		alert('请选择检测人员和派单时间');
	}
}

/**
 * 订单详情
 */
function info(ordercode){
	window.location.href = "/recycle/businessrecycle/orderinfo/ordercode/"+ordercode;
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
	var txt = '订单确定已打款完成？';
	if(confirm(txt)){
		updateStatus(ordercode,66,4);
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
	$.post('/recycle/businessrecycle/updatestatus',{ordercode:ordercode,status:status,statusold:statusold},function(data){
		if(data == 'Y'){
			window.location.reload();
		}else{
			alter(data);
		}
	});
}

/**
 * 添加备注
 */
$("#saveRemark").on('click',function(){
	var remarks = $.trim($('#remarks').val()),ordercode = $('#ordercode').text();
	if(remarks != ''){
		$.post('/recycle/businessrecycle/insertremark',{ordercode:ordercode,remarks:remarks},function(data){
			if(data == 'Y'){
				window.location.reload();
			}else{
				alter(data);
			}
		});
	}else{
		alert('请输入备注信息');
	}
});

/**
 * 修改预约时间
 */
$("#updateServiceDate").on('click',function(){
	var servicedate = $('#servicedate').val(),ordercode = $('#ordercode').text();
	if(servicedate != ''){
		$.post('/recycle/businessrecycle/updateservicedate',{ordercode:ordercode,servicedate:servicedate},function(data){
			if(data == 'Y'){
				window.location.reload();
			}else{
				alter(data);
			}
		});
	}else{
		alert('请输入预约时间');
	}
});

/**
 * 修改订单详情
 */
$("#updateDetail").on('click',function(){
	var details = $('#details').val(),ordercode = $('#ordercode').text();
	if(details != ''){
		$.post('/recycle/businessrecycle/updatedetail',{details:details,ordercode:ordercode},function(data){
			if(data == 'Y'){
				window.location.reload();
			}else{
				alter(data);
			}
		});
	}else{
		alert('请输入订单详情');
	}
});

/**
 * 修改订单金额
 */
$("#updatePrice").on('click',function(){
	var prices = $('#prices').val(),ordercode = $('#ordercode').text();
	if(prices != ''){
		$.post('/recycle/businessrecycle/updateprice',{prices:prices,ordercode:ordercode},function(data){
			if(data == 'Y'){
				window.location.reload();
			}else{
				alter(data);
			}
		});
	}else{
		alert('请输入金额');
	}
});

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
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function getOrder(){
	var orderType = $('#orderType').val();
	window.location.href='/recycle/businessrecycle/exportinput?orderType='+orderType;
}