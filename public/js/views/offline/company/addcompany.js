function goBack(){
	window.location.href="/offline/company/index";
}

function saveButton(){
	var companyName = $("#companyName").val();
	if(companyName){
		$.ajax({
			type:'POST'//请求方式
				,url:"/offline/company/savecompany"  //请求路径
				,data:{companyName:companyName} //发送到服务器的数据
				,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
				,async:false //同步请求
				,timeout:60000//默认超时60秒
				,dataType:'json' //预期服务器返回的数据类型
				,success:function(data){
				if(data == "Y"){
					alert('添加成功');
					window.location.href='/offline/company/index';
				}else{
					alert('添加失败');
				}
			}
		});
	}else{
		alert('请输入公司名称');
	}
	
}