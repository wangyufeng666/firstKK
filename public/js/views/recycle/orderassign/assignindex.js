var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20
		,height:500
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false}
			,{header:"生成日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'70px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
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
			,{header:"联系方式", dataIndex:'', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"订单地址", dataIndex:'DIZHI', width:'120px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'70px',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"派单者", dataIndex:'ASSIGNERNAME', width:'70px',sortable:false}
			,{header:"检测员", dataIndex:'INSPECTORNAME', width:'70px',sortable:false}
			,{header:"预约时间", dataIndex:'CHULIBEIZHU', width:'100px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'65px',sortable:false}
			,{header:"操作", dataIndex:'', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var title = data['ORDERREMARKS'];
					var returnText='<a class="a_link" href="javascript:void(0);" title="'+title+'" onclick="orderInfo(\''+data['ORDERNO']+'\')">详情</a>';
					if(data['ASSIGNERID'] == null && (data['ORDERSTATUS']==2 || data['ORDERSTATUS']==3)){
						returnText += '<a class="a_link" href="javascript:void(0);" onclick="assign(\''+data['ORDERNO']+'\')"> | 派单</a>';
					}else if(data['INSPECTORID'] !== null && (data['ORDERSTATUS'] == 2 || data['ORDERSTATUS'] == 3)){
						returnText += '<a class="a_link" href="javascript:void(0);" onclick="changeAssign(\''+data['ORDERNO']+'\')"> | 改派</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/recycle/orderassign/pagelist'
		,baseParams:initParams()
	});
	
	$("#province").val("");
	
	$("#province").change(function(){
		$.ajax({
			type:'POST'//请求方式
			,url:"/system/inspector/getcitybyprovinceid"//请求路径
			,data:{provinceid:$('#province').val()}//发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:true //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				$("#city").html("<option value=''>-请选择城市-</option>");
				for(i in data){
					$("#city").append("<option value='"+data[i]['AREA_ID']+"'>"+data[i]['AREA_NAME']+"</option>");
				}
			}
		});
	}); 
	
	$("#city").change(function(){
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/orderassign/getinspector"//请求路径
			,data:{areaId:$('#city').val()}//发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:true //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
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
			type:'POST'//请求方式
			,url:"/recycle/orderassign/assignorder"//请求路径
			,data:{orderNo:$("#assign_orderNo").val(),inspectorId:$("#inspector").val(),appointmenttime:$("#appointmenttime").val()}//发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					$("#assign_orderNo").val("");
					$("#assign_div").hide();
					//$("#appointmenttime").hide();
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
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/recycle/orderassign/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

function initParams(){
	var params = getParams();
	params['start'] = start;
	return params;
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		orderType:$('#orderType').val(),
		tradeType:$('#tradeType').val(),
		contactWay:$('#contactWay').val(),
		assignType:$("#assignType").val(),
		orderStatus:$('#orderStatus').val(),
		inspectorId:$('#inspectorId').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		address:$('#address').val(),
		appointmenttime:$('#appointmenttime').val()
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