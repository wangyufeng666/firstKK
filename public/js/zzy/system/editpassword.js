$("#btn_submit").click(function(){
	var password = $("#password").val();
	var password1 = $("#password1").val();
	var mobile = $("#mobile").val();
	if(password == password1){
		$.ajax({
			type:'POST'
			,url:"/zzy/system/savenewpassword"
			,data:{password:password,mobile:mobile}
			,cache:false
			,async:false
			,timeout:60000
			,dataType:'json'
			,success:function(data){
				if(data == 'Y'){
					showTips("修改成功！");
					window.location.href = "/zzy/store/center";
				}else{
					$("#btn_submit").bind("click", function(){submit();});
					showTips(data);
				}
			}
		});
	}else{
		showTips("两次密码输入不一致！");
	}
})

function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:5});
}