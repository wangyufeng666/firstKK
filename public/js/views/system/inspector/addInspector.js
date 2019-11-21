$().ready(function(){
	$(".saveBtn").bind("click", function(){saveInspector($(this).attr('id'));});
	
	initProvinces();
	
	$("#addForm").validate({
		rules:{
			name:{required:true, maxlength:30},
			phone:{required:true, maxlength:30},
			jobnum:{required:true, maxlength:20},
			city:{required:true},
			weixinid:{maxlength:50},
			password:{maxlength:30}
		}
	});
	
	$("#province").change(function(){
		var provinceId = $(this).val();
		if(provinceId){
			$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
				data:{pid:provinceId},
				url:openApiDomain+'/recycle/area/citys',
				success:function(data){
					var optionHtml = '<option value="">请选择城市</option>', name="";
					
					if(data.length == 1){
						optionHtml += '<option value="'+data[0]['ID']+'" selected>'+data[0]['NAME']+'</option>';
					}else{
						for(i in data){
							name = data[i]['NAME'];
							optionHtml += '<option value="'+data[i]['ID']+'" title="'+name+'">'+name+'</option>';
						}
					}
					$('#city').empty().append(optionHtml);
				}
			});
		}else{
			var optionHtml = '<option value="">请选择城市</option>';
			$('#city').html(optionHtml);
		}
	});
});

function initProvinces(){
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
		url:openApiDomain+'/recycle/area/provinces',
		success:function(data){
			var optionHtml = '<option value="">请选择省份</option>', name="";
			for(i in data){
				name = data[i]['NAME'];
				optionHtml += '<option value="'+ data[i]['ID']+'" title="'+name+'">'+name+'</option>';
			}
			$('#province').append(optionHtml);
		}
	});
}

function saveInspector(thisAttrId){
	
	if(!$("#addForm").valid()){
		return;
	}
	
	$(".saveBtn").unbind("click");
	
	var params = {
			name:$("#name").val(),
			phone:$("#phone").val(),
			jobNum:$("#jobnum").val(),
			cityId:$("#city").val(),
			weixinId:$("#weixinid").val(),
			password:$("#password").val(),
			groupCode:$('#groupCode').val()};
	
	$.ajax({
		type:'POST'//请求方式
		,url:"/system/inspector/saveinspector"  //请求路径
		,data:params  //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			if(data.result == "Y"){
				if(thisAttrId == 'saveAndNewBtn'){
					$("input").val("");
					$("select").val("");
				}else{
					parent.reload();
				}
			}else{
				alert(data.errMsg);
				$(".saveBtn").bind("click", function(){saveInspector($(this).attr('id'));});
			}
		},error:function(e){
			alert('保存失败');
			$(".saveBtn").bind("click", function(){saveInspector($(this).attr('id'));});
		}
	});
}

function goBack(){
	parent.closeLayer();
}
