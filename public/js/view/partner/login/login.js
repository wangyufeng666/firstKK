function partnerlogin(){
		var username = $("#username").val();
		var password = $("#password").val();
		var remeberFlag = $("input[type='checkbox']").is(':checked');
		
		if(username){
			if(password){
				$.ajax({
					type:'POST'//请求方式
					,url:"/partner/login/login"  //请求路径
					,data:{username:username, password:password, remeberFlag:remeberFlag}//发送到服务器的数据
					,cache:false
					,async:false
					,timeout:6000
					,dataType:'json'
					,success:function(data){
						if(data == 'Y'){
							showTips('登录成功');
							window.location.href = "/partner/center";
						}else if(data == 'A'){
							showTips('您的申请，我们正在审核');
							window.location.href = "/partner/regist/noappproval";
						}else{
							showTips("账号或密码错误，请从新输入");
						}
					}
				});
			}else{
				showTips("密码不能为空");
			}
		}else{
			showTips("账号或者手机号码不能为空");
	}
}

function zhaohui(){
	window.location.href="/system/index/index"
}

function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:5});
}