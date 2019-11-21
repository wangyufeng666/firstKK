var loginFlag = 'ATMLG';
var time = 30;
var countdown = 30;
function checkphone(){
	var val = $("#mobile").val();
	var mobile = /^1[23456789]\d{9}$/;//手机号验证
	return new RegExp(mobile).test(val);
}

$("#mobile1").click(function(){
	if(checkphone()){
		$.post("/partner/account/checknewmobile",{mobile:$("#mobile").val()},function(data){
			if(data == 'Y'){
				showTips('该手机号已经注册！');
				return;
			}
		})
	}else{
		showTips('请输入正确的手机号');
	}
});

$("#btn_submit").click(function(){
	var mobile = $("#mobile").val();
	var mobile1= $("#mobile1").val();
	if(mobile && mobile1){
	    if(mobile == mobile1){
	    	window.location.href="/partner/account/savenewmobile?mobile="+mobile;
	    }else{
	    	showTips('两次输入不一致');
	    }
	}else{
	    showTips('密码不能为空');
	}
})

function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}


