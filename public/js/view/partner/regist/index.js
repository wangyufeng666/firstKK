var loginFlag = 'ATMLG';
var time = 30;
var countdown = 30;

$().ready(function(){
	$("#btn_submit").bind("click", function(){submit();});
	
    $('#clauseImg, #clauseText1').click(function(){
    	if($('#clauseImg').attr('data-flag') == 'Y'){
        	$('#treaty').removeAttr("checked");
    		$('#clauseImg').attr('data-flag', 'N');
    		$('#clauseImg').attr('src', '/images/icon/unchecked1.png');
    	}else{
        	$('#treaty').attr("checked","true");
    		$('#clauseImg').attr('data-flag', 'Y');
    		$('#clauseImg').attr('src', '/images/icon/checked1.png');
    	}
    });
});

function checkphone(){
	var val = $("#contactWay").val();
	var mobile = /^1[23456789]\d{9}$/;//手机号验证
	return new RegExp(mobile).test(val);
}

$('#smsCodeBtn').click(function(){
	if(!$(this).hasClass('disabled')){
		if(checkphone()){
			$.post("/partner/regist/checkregist",{mobile:$("#contactWay").val()},function(data){
				if(data == 'Y'){
					showTips('该手机号已经注册！');
					return;
				}else{
					if($(this).hasClass('disabled')){
						return;
					}else{
						sendSmsCode();
					}
				}
			});
			
		}else{
			showTips('请输入正确手机号码');
			$("#smsCodeBtn").removeClass('disabled');
		}
		
	}else{
		return;
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
	if(checkphone()){
		if($("#treaty").attr("checked")){
			var mobile = $('#contactWay').val();
			var smsCode = $('#smsCode').val();
			$.ajax({
				type:'POST'
				,url:"/partner/regist/checkregistmobile"
				,data:{mobile:mobile, smsCode:smsCode}
				,cache:false
				,async:false
				,timeout:60000
				,dataType:'json'
				,success:function(data){
					if(data == 'Y'){
						window.location.href = "/partner/regist/regist";
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
			showTips('请阅读服务条款并同意');
		}
	}else{
		showTips('请输入正确手机号码');
	}
}
