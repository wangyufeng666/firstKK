function bindblan(mobile){
	var name = $("#name").val();
	var shenfenzheng = $("#shenfenzheng").val();
	var kahao = $("#kahao").val();
	var blanName = $("#select option:selected").val();

function checkidcard(){
	var shenfenzheng = $("#shenfenzheng").val();
	var idcard = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;//身份证验证
	return new RegExp(idcard).test(shenfenzheng);
}
	
if(name){
	if(shenfenzheng){
		if(checkidcard()){
			if(kahao){
				if(blanName !==''){
					$.ajax({
						type:'POST'//请求方式
						,url:"/offlinem/invitee/saveapproval"  //请求路径
						,data:{name:name, mobile:mobile, shenfenzheng:shenfenzheng, kahao:kahao, blanName:blanName}//发送到服务器的数据
						,cache:false
						,async:false
						,timeout:6000
						,dataType:'json'
						,success:function(data){
							if(data == 'Y'){
								showTips('绑定成功');
								window.location.href = "/offlinem/bank/banklist";
							}else{
								showTips("该银行卡号已经绑定过，无法再绑定");
							}
						}
					});
				}else{
					showTips("请选择银行");
				}
			}else{
				showTips("银行卡号不能为空");
			}
		}else{
			showTips("请输入正确的身份证号");
		}
	}else{
		showTips("身份证号不能为空");
	}
}else{
	showTips("姓名不能为空");
}
}

function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}