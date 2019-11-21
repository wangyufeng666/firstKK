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

$("#password1").change(function(){
	var password = $("#password").val();
})

//表单验证
$('#saveButton').bind('click', function(){save();});
$("#addForm").validate({
	rules:{
		partnerName:{required:true}//渠道商名称
		,qu:{required:true}
		,contacts:{required:true}//联系人
		,contactWay:{required:true,phoneOrMobile:true}//联系电话
		,email:{required:true,email:true}//邮箱
		,address:{required:true}//地址
		,licenseCode:{required:200}//备注
		,person:{required:true}
		,personmobile:{required:true,phoneOrMobile:true}
		,username:{required:true}
		,password:{required:true}
	}
	,messages:{
		partnerName:{required:"请输入渠道商名称"}//渠道商名称
		,qu:{required:"请选择地区"}//地区
		,contacts:{required:"请填写联系人"}//联系人
		,contactWay:{required:"请填写来联系电话",phoneOrMobile:"联系电话格式不正确"}//联系电话
		,email:{required:"请填写邮箱",email:"邮箱格式不正确"}//邮箱
		,address:{required:"请填写地址"}//地址
		,licenseCode:{required:"请填写营业执照"}//备注
		,person:{required:"请输入法人名称"}
		,personmobile:{required:"请输入法人电话",phoneOrMobile:"联系电话格式不正确"}
		,username:{required:"请输入法人用户名"}
		,password:{required:"请输入法人密码"}
	}
});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var userName = $('#username').val();
		var contactWay = $('#contactWay').val();
		$.post('/offlinem/user/checknewpartner', {userName:userName,contactWay:contactWay}, function(data){
			if(data == false){
				$('#addForm').submit();
			}else{
				alert('已存在的联系电话和登录名，不能保存');
				$('#saveButton').bind('click', function(){save();});
			}
		});
	}else{
		$('#saveButton').bind('click', function(){save();});
	}
}
