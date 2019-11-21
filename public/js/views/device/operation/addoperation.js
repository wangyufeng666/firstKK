$('#saveButton').bind('click', function(){save();});
//表单验证
$('#addForm').validate({
	rules:{
		pname:{required:true}
		,phone:{required:true, phoneOrMobile:true}
		,jobnum:{required:true}
		,qu:{required:true}
		,address:{required:true}
	}
	,messages:{

		pname:{required:"请输入运维人员姓名"}
		,phone:{required:"请输入手机号",phoneOrMobile:"手机号格式不对"}
		,jobnum:{required:"请输入工号"}
		,qu:{required:"请选择所在地区"}
		,address:{required:"请输入详细地址"}
	}
});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var pname = $('#pname').val();
		var phone = $('#phone').val();
		$.post('/device/operation/checkman', {pname:pname,phone:phone}, function(data){
			if(data == 'Y'){
				$('#addForm').submit();
			}else{
				alert('登录名或手机号已存在，请重新输入');
				$('#saveButton').bind('click', function(){save();});
			}
		});
	}else{
		$('#saveButton').bind('click', function(){save();});
	}
}




function goBack(){
	window.location.href = backUrl+'?backFlag=Y';
}

initProvince();
//省份初始化
function initProvince(){
	$("#sheng").html("<option value=''>请选择省份</option>");
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,url:openapiUrl+'/util/util/getprovince',
		success:function(data){
			var optionHtml = "", name = "";
			for(i in data){
				name = data[i]['NAME'];
				optionHtml += "<option value='"+data[i]['ID']+"' title='"+name+"'>"+name+"</option>";
			}
			$("#sheng").append(optionHtml);
		}
	});
}

//省动态改变
$('#sheng').change(function(){
	$("#shi").html("<option value='' flag='N'>请选择城市</option>");
	$("#qu").html("<option value='' flag='N'>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$('#shengName').val($(this).find("option:selected").text());
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,data:{provinceId:thisVal},url:openapiUrl+'/util/util/getcity',
			success:function(data){
				var optionHtml = '', id = '', name = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#shi").append(optionHtml);
			}
		});
	}
});

//市动态改变
$('#shi').change(function(){
	$("#qu").html("<option flag='' value=''>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$('#shiName').val($(this).find("option:selected").text());
		$.ajax({type:'GET',dataType:'jsonp',cache:false,jsonp:'jsonp_callback',data:{cityId:thisVal},url:openapiUrl+'/util/util/getdistrict',
			success:function(data){
				var optionHtml = '',id = '',name = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#qu").append(optionHtml);
			}
		});
	}
});

//市动态改变
$('#shi').change(function(){
	$('#quName').val($(this).find("option:selected").text());
});
