function checkphone(){
	var val = $("#mobile").val();
	var mobile = /^1[23456789]\d{9}$/;//手机号验证
	return new RegExp(mobile).test(val);
}

//保存新增地推人员xinxi
function save(){
	var name = $('#name').val();
	var mobile = $('#mobile').val();
	var jobnum = $('#jobnum').val();
	if(name){
		if(mobile){
			if(checkphone()){
				if(jobnum){
					$.ajax({
						type:'POST'//请求方式
							,url:"/zzy/store/savestoreuser"//请求路径
								,data:{name:name, mobile:mobile, jobnum:jobnum}//发送到服务器的数据
					,cache:false
					,async:false
					,timeout:6000
					,dataType:'json'
						,success:function(data){
							if(data == 'C'){
								showTips('该人员已经是门店人员');
							}else{
								if(data == 'Y'){
									showTips('添加成功');
									window.location.href = "/zzy/store/storeusers";
								}else{
									showTips("添加失败");
								}
							}
						}
					});
				}else{
					showTips("请输入员工编码");
				}
			}else{
				showTips("请输入正确的手机号");
			}
		}else{
			showTips("手机号码不能为空");
		}
	}else{
		showTips("姓名不能为空");
	}
}

function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}