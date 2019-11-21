var loginFlag = 'ATMLG';
var time = 30;
var countdown = 30;

$().ready(function(){
	$("#btn_submit").bind("click", function(){submit();});
	
	$('#verifyCode').click(function(){
		var width = $('#verifyCodeBtn').width();
		var height = $('#verifyCodeBtn').height();
		var timestamp = new Date().getTime();
		$('#verifyCode').attr('src', '/security/imgcode/create?h='+height+'&w='+width+'&flag='+loginFlag+'&d='+timestamp);
	});
	$('#verifyCode').trigger('click');
});

function checkphone(){
	var val = $("#contactWay").val();
	var mobile = /^1[23456789]\d{9}$/;//手机号验证
	return new RegExp(mobile).test(val);
}

$('#smsCodeBtn').click(function(){
	if($(this).hasClass('disabled')){
		return;
	}else{
		$(this).addClass('disabled');
		if(checkphone()){
			if(checkImgVerifyCode()){
				sendSmsCode();
			}else{
				$('#smsCodeBtn').removeClass('disabled');
			}
		}else{
			showTips('请输入正确手机号码');
			$('#smsCodeBtn').removeClass('disabled');
		}
	}
});

function checkImgVerifyCode(){
	var imgCode = $('#imgCode').val();
	var phoneNum = $("#contactWay").val();
	var render = false;
	if($.trim(imgCode) == ''){
		showTips('请输入图片验证码');
	}else{
		$.ajax({
			type:'POST'
			,url:"/security/imgcode/verify"
			,data:{code:imgCode, flag:loginFlag}
			,cache:false
			,async:false
			,timeout:30000
			,dataType:'json'
			,success:function(data){
				if(data == 'Y'){
					render = true;
				}else{
					showTips(data);
					$('#verifyCode').trigger('click');
				}
			}
		});
	}
	return render;
}

function sendSmsCode(){
	if(checkphone()){
		var contactWay = $("#contactWay").val();
		$.ajax({
			type:'POST'//请求方式
			,url:"/security/smscode/send"  //请求路径
			,data:{num:contactWay, flag:loginFlag}//发送到服务器的数据
			,cache:false
			,async:false
			,timeout:6000
			,dataType:'json'
			,success:function(data){
				if(data == 'Y'){
					setSmsCodeTimeOut();
					showTips('验证码已发送');
				}else{
					showTips("向该手机号发送短信过于频繁，请稍后再试");
				}
			}
		});
	}
}

function setSmsCodeTimeOut(){
	if(countdown > 1){
		countdown--;
		$("#smsCodeBtn").html("获取验证码 ("+countdown+")");
		setTimeout('setSmsCodeTimeOut()',1000);
	}else{
		countdown = 30;
		$("#smsCodeBtn").removeClass("disabled");
		$("#smsCodeBtn").html("获取验证码");
	}
}

function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}

function submit(){
	$("#btn_submit").unbind("click");
	if(checkphone()){
		if(checkImgVerifyCode()){
			var mobile = $('#contactWay').val();
			var imgCode = $('#imgCode').val();
			var smsCode = $('#smsCode').val();
			$.ajax({
				type:'POST'
				,url:"/offlinem/invitee/userlogin"
				,data:{num:mobile, code:smsCode, flag:loginFlag}
				,cache:false
				,async:false
				,timeout:60000
				,dataType:'json'
				,success:function(data){
					if(data == 'Y'){
						window.location.href = "/offlinem/invitee/center";
					}else{
						$("#btn_submit").bind("click", function(){submit();});
						showTips(data);
					}
				}
			});
		}else{
			$("#btn_submit").bind("click", function(){submit();});
		}
	}else{
		$("#btn_submit").bind("click", function(){submit();});
		showTips('请输入正确手机号码');
	}
}
