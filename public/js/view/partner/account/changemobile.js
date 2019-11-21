var loginFlag = 'ATMLG';
var time = 30;
var countdown = 30;

$().ready(function(){
	$("#btn_submit").bind("click", function(){submit();});
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
			sendSmsCode();
		}else{
			showTips('请输入正确手机号码');
			$('#smsCodeBtn').removeClass('disabled');
		}
	}
});

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
					$("#smsCodeBtn").addClass("disabled");
					
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
		$("#smsCodeBtn").html("验证码（"+countdown+"）");
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
		var mobile = $('#contactWay').val();
		var smsCode = $('#smsCode').val();
		$.ajax({
			type:'POST'
			,url:"/partner/account/checkmobile"
			,data:{mobile:mobile,smsCode:smsCode}
			,cache:false
			,async:false
			,timeout:60000
			,dataType:'json'
			,success:function(data){
				if(data == 'Y'){
					window.location.href = "/partner/account/newmobile";
				}else{
					$("#btn_submit").bind("click", function(){submit();});
					showTips(data);
				}
			}
			,error:function(){
				showTips('网络异常！');
			}
		});
	}else{
		$("#btn_submit").bind("click", function(){submit();});
		showTips('请输入正确手机号码');
	}
}
