function checkphone(){
	var val = $("#mobile").val();
	var mobile = /^1[23456789]\d{9}$/;//手机号验证
	return new RegExp(mobile).test(val);
}

//保存新增地推人员xinxi
function save(){
	var name = $('#name').val();
	var mobile = $('#mobile').val();
	if(name){
		if(mobile){
			if(checkphone()){
				$.ajax({
				type:'POST'//请求方式
				,url:"/partner/promoter/savepromoter"//请求路径
				,data:{name:name, mobile:mobile}//发送到服务器的数据
				,cache:false
				,async:false
				,timeout:6000
				,dataType:'json'
				,success:function(data){
					if(data == 'C'){
						showTips('该人员已经是地推人员');
					}else{
						if(data == 'Y'){
							showTips('添加成功');
							window.location.href = "/partner/promoter/promoters";
						}else{
							showTips("添加失败");
						}
					}
				}
				});
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

//保存并审核店铺地推人员
function saveproval(){
	var name = $('#name').val();
	var mobile = $('#mobile').val();
	var flag = 'Y';
	if(name){
		if(mobile){
			if(checkphone()){
				$.ajax({
					type:'POST'//请求方式
						,url:"/partner/promoter/savepromoter"//请求路径
							,data:{name:name, mobile:mobile, flag:'Y'}//发送到服务器的数据
				,cache:false
				,async:false
				,timeout:6000
				,dataType:'json'
					,success:function(data){
						if(data == 'C'){
							showTips('该人员已经是地推人员');
						}else{
							if(data == 'Y'){
								showTips('添加成功');
								window.location.href = "/partner/promoter/promoters";
							}else{
								showTips("添加失败");
							}
						}
					}
				});
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