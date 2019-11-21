var grid;
var layerIndex = 0;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			 {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "门店名称", dataIndex: 'PARTNERNAME', width:'80px',sortable:false}
			,{header: "门店负责人", dataIndex: '', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTS']+'( '+data['CONTACTWAY']+')';
				}
			}
			,{header: "门店地址", dataIndex: 'ADDRESS', width:'150px',sortable:false}
			,{header: "库存量", dataIndex: 'MERCOUNTS', width:'80px',sortable:false}
			,{header: "库存总金额", dataIndex: 'ALLPRICE', width:'80px',sortable:false}
			,{header: "操作", dataIndex: '', width:'200px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var partnerCode = data['PARTNERCODE'];
					var inventoryStatus = data['INVENTORYSTATUS'];
					var returnText ='<a title="'+partnerCode+'" href="javascript:merInfo(\''+partnerCode+'\')" class="a_link">查看</a>';
					returnText +=' | <a title="'+partnerCode+'" href="javascript:assign(\''+partnerCode+'\')" class="a_link">派单</a>';
					return returnText;
				}
			}
		]
		,url:'/order/gomestore/inwarepagelist'
		,baseParams:initParams()
		,afterRender:function(){
			layer.close(layerIndex);
		}
		,pageSizeList:[15,30,50]
	});
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
				$("#city").html("<option value=''>请选择城市</option>");
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
				$("#inspector").html("<option value=''>请选择检测人员</option>");
				for(i in data){
					$("#inspector").append("<option value='"+data[i]['JOBNUM']+"'>"+data[i]['NAME']+"</option>");
				}
			}
		});
	});
	
	$('#appointmenttime').click(function(){
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
 * 省份初始化
 * @return
 */
function initProvinces(){
	$.ajax({type:'POST', dataType:'jsonp', jsonp:'jsonp_callback',
		url:openApiDomain+'/recycle/area/provinces',
		success:function(data){
			var optionsText = "<option value=''>请选择省份</option>";
			for(i in data){
				optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
			}
			$('#provinceId').html(optionsText);
		}
	});
}

/**
 * 省份change
 */
$("#provinceId").change(function(){
	var provinceId = $('#provinceId').val();
	var optionsText = "<option value=''>请选择城市</option>";
	if(provinceId != ""){
		$.ajax({type:'GET', dataType:'jsonp', jsonp:'jsonp_callback',
			data:{pid:provinceId},
			url:openApiDomain+'/recycle/area/citys',
			success:function(data){
				for(i in data){
					optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
				}
				$('#cityId').html(optionsText);
			}
		});
	}else{
		$('#cityId').html(optionsText);
	}
});

function assign(partnerCode){
	$("#assign_div").show();
	$("#fade").show();
	$("#assignPartnerCode").val(partnerCode);
}

function cancel(){
	$("#assign_div").hide();
	$("#fade").hide();
}

function assignOrder(){
	var partnerCode = $("#assignPartnerCode").val();
	if($("#inspector").val() != "" && partnerCode != "" && $("#appointmenttime").val() != ""){
		$.ajax({
			type : 'POST'//请求方式
			,url : "/order/gomestore/assignorder"  //请求路径
			,data : {partnerCode:partnerCode,inspectorId:$("#inspector").val(),appointmenttime:$("#appointmenttime").val()}  //发送到服务器的数据
			,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async : false //同步请求
			,timeout :60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success : function(data){
				if(data == "Y"){
					$("#assignPartnerCode").val("");
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
 * 商品详情
 * @param orderNo
 * @return
 */
function merInfo(partnerCode){
	layer.open({
		type:2,
		title:'查看门店在库商品',
		content:"/order/gomestore/orderstorage?partnerCode="+partnerCode+"&inventoryStatus=3&visitFlag=1",
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		contactWay:$('#contactWay').val(),
		partnerCode:$('#partnerCode').val(),
		address:$('#address').val(),
		partnerName:$('#partnerName').val(),
		inventoryStatus:'3',
		visitFlag:'1',
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}
