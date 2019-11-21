function checkphone(){
	var val = $("#mobile").val();
	var mobile = /^1[23456789]\d{9}$/;//手机号验证
	return new RegExp(mobile).test(val);
}

function goBack(){
	window.location.href= backUrl;
}

function saveButton(){
	var name = $("#name").val();
	var mobile = $('#mobile').val();
	var partnerCode = $('#partnerCode').val();
	var zhifubao = $('#zhifubao').val();
	var realName = $('#realName').val();
	var deviceId = $('#deviceId').val();
	if(name && checkphone() && zhifubao && realName && deviceId){
		$.ajax({
			type:'POST'//请求方式
				,url:"/device/promoter/savepromoter"  //请求路径
				,data:{name:name,mobile:mobile,partnerCode:partnerCode,zhifubao:zhifubao,realName:realName,deviceId:deviceId} //发送到服务器的数据
				,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
				,async:false //同步请求
				,timeout:60000//默认超时60秒
				,dataType:'json' //预期服务器返回的数据类型
				,success:function(data){
				if(data == "Y"){
					alert('添加成功');
					window.location.href='/device/business/index';
				}else{
					alert('该手机已经存在');
				}
			}
		});
	}else{
		alert('请填写所需信息');
	}
}