$(document).ready(function(){
	$('#saveButton').bind('click', function(){saveStore();});
	
	$("#province").change(function(){
		$("#city").html("<option value=''>城市</option>");
		var provinceId = $('#province').val();
		if(provinceId != ""){
			$.ajax({
				type:'GET'//请求方式
				,url:"/api/util/citys"  //请求路径
				,data:{provinceId:provinceId}  //发送到服务器的数据
				,timeout:30000//默认超时60秒
				,dataType:'json' //预期服务器返回的数据类型
				,success:function(data){
					for(i in data){
						$("#city").append("<option value='"+data[i]['ID']+"'>"+data[i]['NAME']+"</option>");
					}
				}
			});
		}
	});
	
	$("#city").change(function(){
		$("#district").html("<option value=''>县区</option>");
		var cityId = $('#city').val();
		if(cityId != ""){
			$.ajax({
				type:'GET'//请求方式
				,url:"/api/util/districts"  //请求路径
				,data:{cityId:cityId}  //发送到服务器的数据
				,timeout:30000//默认超时60秒
				,dataType:'json' //预期服务器返回的数据类型
				,success:function(data){
					for(i in data){
						$("#district").append("<option value='"+data[i]['ID']+"'>"+data[i]['NAME']+"</option>");
					}
				}
			});
		}
	});
});

function saveStore(){
	$('#saveButton').unbind('click');
	var storeNo = $("#storeNo").val();
	var storeName = $("#storeName").val();
	var city = $("#city").val();
	var storeAddress = $("#storeAddress").val();
	var storeType = $("#storeType").val();
	var contacts = $('#contacts').val();
	var mobile = $('#mobile').val();
	var loginName = $('#loginName').val();
	
	if(storeNo != "" && storeName != "" && city != "" && storeAddress != "" && storeType != ""){
		var params = {
				storeNo:storeNo,
				storeName:storeName,
				city:city,
				remark:$("#remark").val(),
				storeAddress:storeAddress,
				storeType:storeType,
				contacts:contacts,
				mobile:mobile,
				loginName:loginName
		};
		
		$.ajax({
			type : 'POST'//请求方式
			,url : "/system/lenovostore/savestore"  //请求路径
			,data : params  //发送到服务器的数据
			,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async : false //同步请求
			,timeout :60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success : function(data){
				if(data == "Y"){
					if(confirm("是否继续添加")){
						window.location.href = window.location.href;
					}else{
						goBack();
					}
				}
			}
		});
	}else{
		$('#saveButton').bind('click', function(){saveStore();});
		alert("必填项不能为空");
	}
}

function goBack(){
	window.location.href = "/system/lenovostore/index";
}