$('#saveButton').bind('click', function(){save();});
//表单验证
$('#addForm').validate({
	rules:{
		partnerName:{required:true}//渠道商名称
		,qu:{required:true}
		,auditStatus:{required:true}//审批状态
		,partnerStatus:{required:true}//渠道商合作状态
		,payType:{required:true}//结算方式
		,contacts:{required:true}//联系人
		,contactWay:{required:true,phoneOrMobile:true}//联系电话
		,address:{required:true}//地址
		,remarks:{maxlength:200}//备注
		,person:{required:true}//公司法人
		,personmobile:{required:true,phoneOrMobile:true}//法人电话
		,username:{required:true}//用户名
		,password:{required:true}//密码
		,addType:{required:true}//添加的类型
		,registType:{required:true}//注册类型
	}
	,messages:{
		partnerName:{required:"请输入渠道商名称"}//渠道商名称
		,qu:{required:"请选择地区"}//地区
		,auditStatus:{required:"请选择审批状态"}//审批状态
		,partnerStatus:{required:"请选择渠道商合作状态"}//渠道商合作状态
		,payType:{required:"请选择结算方式"}//结算方式
		,contacts:{required:"请填写联系人"}//联系人
		,contactWay:{required:"请填写来联系电话",phoneOrMobile:"联系电话格式不正确"}//联系电话
		,address:{required:"请填写地址"}//地址
		,remarks:{maxlength:"备注内容最多200字符"}//备注
		,addType:{required:"请选择添加的类型"}//添加的类型
		,person:{required:"请输入法人名称"}//公司法人
		,personmobile:{required:"请输入法人电话",phoneOrMobile:"联系电话格式不正确"}//法人电话
		,username:{required:"请输入法人用户名"}//用户名
		,password:{required:"请输入法人密码"}//密码
		,registType:{required:"请选择注册的类型"}//添加的类型
	}
});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var userName = $('#username').val();
		var contactWay = $('#contactWay').val();
		$.post('/tmall/distributors/checknewpartner', {userName:userName,contactWay:contactWay}, function(data){
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

function goBack(){
	window.location.href = "/tmall/distributors/index";
}

$("#addType").change(function(){
	if($("#addType option:selected").val()=='2'){
		$(".registHide").show();
		$("#auditStatus").val(0);
		$("#auditStatus").attr("disabled", true);
		$("#payType").val(1);
		$("#payType").attr("disabled", true);
	}else{
		$("#auditStatus").val(null);
		$("#auditStatus").attr("disabled", false);
		$("#payType").val(null);
		$("#payType").attr("disabled", false);
		$(".registHide").hide();
	}
})

$("#registType").change(function(){
	if($("#registType option:selected").val()=='1'){
		$("#hezuoshang").show();
		$("#shenfenzheng").hide();
		$("#zhanghu").show();
	}else if($("#registType option:selected").val()=='2'){
		$("#hezuoshang").hide();
		$("#shenfenzheng").show();
		$("#zhanghu").show();
	}else{
		$("#shenfenzheng").hide();
		$("#hezuoshang").hide();
		$("#zhanghu").hide();
	}
})

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
