function login(){
		var username = $("#username").val();
		var password = $("#password").val();
		var remeberFlag = $("input[type='checkbox']").is(':checked');
		if(username){
			if(password){
				$.ajax({
					type:'POST'//请求方式
					,url:"/zzy/store/login"  //请求路径
					,data:{username:username, password:password, remeberFlag:remeberFlag}//发送到服务器的数据
					,cache:false
					,async:false
					,timeout:6000
					,dataType:'json'
					,success:function(data){
						if(data == 'Y'){
							showTips('登录成功');
							window.location.href = "/zzy/store/center";
						}else if(data == 'A'){
							showTips('您的申请，我们正在审核');
						}else{
							showTips("账号或密码错误，请从新输入");
						}
					}
				});
			}else{
				showTips("请输入密码");
			}
		}else{
			showTips("请输入手机号码/用户名");
	}
}

function zhaohui(){
	window.location.href="/zzy/system/index"
}

function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:5});
}