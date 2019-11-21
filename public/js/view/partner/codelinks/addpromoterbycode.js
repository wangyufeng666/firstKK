var loginFlag = 'ATMLG';
var time = 30;
var countdown = 30;

$().ready(function(){
	$('#submit').bind('click', function(){save();});
});


$("#smsCodeBtn").click(function(){
	var name = $('#name').val();
	var mobile = $('#mobile').val();
	if($(this).hasClass('disabled')){
		return;
	}else{
		$(this).addClass('disabled');
		if($.trim(name)){
			if($.trim(mobile)){
				if(checkphone()){
					$.ajax({
						type:'POST'//请求方式
						,url:"/partner/codelinks/checkpromotermobile"  //请求路径
						,data:{mobile:mobile}//发送到服务器的数据
						,cache:false
						,async:false
						,timeout:6000
						,dataType:'json'
						,success:function(data){
							if(data != 'Y'){
								sendSmsCode()
							}else{
								showTips("该手机号已经是推广人，无法再申请");
								$('#smsCodeBtn').removeClass('disabled');
							}
						}
						});
				}else{
					showTips("手机号码格式不正确");
					$('#smsCodeBtn').removeClass('disabled');
				}
			}else{
				showTips("手机号码不能为空");
				$('#smsCodeBtn').removeClass('disabled');
			}
		}else{
			showTips("姓名不能为空");
			$('#smsCodeBtn').removeClass('disabled');
		}
	}
});

function checkphone(){
	var val = $("#mobile").val();
	var mobile = /^1[23456789]\d{9}$/;//手机号验证
	return new RegExp(mobile).test(val);
}


function sendSmsCode(){
	if(checkphone()){
		var mobile = $('#mobile').val();
		$.ajax({
			type:'POST'//请求方式
		    ,url:"/security/smscode/send"  //请求路径
		    ,data:{num:mobile, flag:loginFlag}//发送到服务器的数据
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


//保存新增地推人员xinxi
function save(){
	var name = $('#name').val();
	var mobile = $('#mobile').val();
	var smsCode = $('#smsCode').val();
	var partnerCode = $('#partnerCode').val();
	if(name){
		if(mobile){
			if(checkphone()){
				if(smsCode){
					$.ajax({
						type:'POST'//请求方式
							,url:"/partner/codelinks/savepromoter"  //请求路径
								,data:{name:name, mobile:mobile, partnerCode:partnerCode, smsCode:smsCode}//发送到服务器的数据
					,cache:false
					,async:false
					,timeout:6000
					,dataType:'json'
						,success:function(data){
							if(data == 'Y'){
								showTips('添加成功');
								window.location.href = "/partner/codelinks/addpromoterbycodesucc";
							}else{
								showTips(data);
								$('#submit').bind('click', function(){save();});
							}
						}
					});
				}else{
					showTips("请输入短信验证码");
				}
			}else{
				showTips("手机号格式不正确");
			}
		}else{
			showTips("手机号不能为空");
		}
	}else{
		showTips("姓名不能为空");
	}
}

function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}
