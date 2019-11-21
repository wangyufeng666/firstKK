var type =2;
var loginFlag = 'ATMLG';
$().ready(function(){
    $('.login_tab_nav .login_type').bind('click',function(){tabNav($(this));});
	$("#btn_submit").bind("click", function(){
	    if(type == '2'){ //快速登录
	        quickLogon();
	    }else if(type == '1'){ //账号密码登录
	        submitCode();
	    }
	});
});

function tabNav(_this){
    $('.login_tab_nav div').removeClass('selected');
    _this.addClass('selected');
    type = _this.attr('tabindex');
    $('.login_container .input_text').hide();
    $('.login_container .input_text[type="'+type+'"]').show();
}

var time = 60;
var countdown = 60;

//获取验证码
$('#smsCodeBtn').click(function(){
	if($(this).hasClass('disabled')){
		return;
	}else{
		$(this).addClass('disabled');
		if(checkphone()){
			showTips('验证码已发送成功');
			sendSmsCode();
		}else{
			showTips('请输入正确手机号码');
			$('#smsCodeBtn').removeClass('disabled');
		}
	}
});

//验证手机号
function checkphone(){
    var val = $("#contactPhone").val();
    var mobile = /^1[23456789]\d{9}$/;//手机号验证
    return new RegExp(mobile).test(val);
}

//发送验证码
function sendSmsCode(){
	if(checkphone()){
		var contactWay = $("#contactPhone").val();
		$.ajax({
			type:'POST'//请求方式
			,url:"/security/smscode/send"  //请求路径
			,data:{num:contactWay, flag:loginFlag}//发送到服务器的数据
			,cache:false
			,async:false
			,timeout:10000
			,dataType:'json'
			,success:function(data){
				if(data == 'Y'){
					change();
					showTips('验证码已发送');
				}else{
					showTips("向该手机号发送短信过于频繁，请稍后再试");
				}
			}
		});
	}
}

//倒计时
function change(){
	if(countdown > 1){
		countdown--;
		$("#smsCodeBtn").text("获取验证码 ("+countdown+")");
		setTimeout('change()',1000);
	}else{
		countdown = 30;
		$("#smsCodeBtn").removeClass("disabled");
		$("#smsCodeBtn").text("获取验证码");
	}
}

//快速验证码 提交
function quickLogon(){
	$("#btn_submit").unbind("click");
	if(checkphone()){
		var mobile = $('#contactPhone').val();
		var smsCode = $('#smsCode').val();
		
		$.ajax({
			type:'POST'
			,url:"/user/login/userlogin"
			,data:{mobile:mobile, smsCode:smsCode}
			,cache:false
			,async:false
			,timeout:60000
			,dataType:'json'
			,success:function(data){
				if(data == 'Y'){
					window.location.href = from;
				}else{
					$("#btn_submit").bind("click", function(){quickLogon();});
					showTips(data);
				}
			}
		});
	}else{
		$("#btn_submit").bind("click", function(){quickLogon();});
		showTips('请输入正确手机号码');
	}
}

//账号密码登录
function submitCode(){
    $("#btn_submit").unbind("click");
    var contactWay = $('#contactWay').val();
    var passWord = $('#passWord').val();
    
    if(checkphone()){
        $.ajax({
            type:'POST'
            ,url:"/user/login/userlogin"
            ,data:{contactWay:contactWay,passWord:passWord,}
            ,cache:false
            ,async:false
            ,timeout:60000
            ,dataType:'json'
            ,success:function(data){
                if(data == 'Y'){
                    window.location.href = from;
                }else{
                    $("#btn_submit").bind("click", function(){submitCode();});
                    showTips(data);
                }
            }
        });
    }else{
        $("#btn_submit").bind("click", function(){submitCode();});
        showTips('请输入正确手机号码');
    }
}

//layer提示
function showTips(text){
    layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}