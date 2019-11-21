function bindblan(mobile){
	var name = $("#name").val();
	var shenfenzheng = $("#shenfenzheng").val();
	var kahao = $("#kahao").val();
	var blanName = $("#select option:selected").text();
	
	$.ajax({
		type:'POST'//请求方式
		,url:"/offlinem/partner/saveapproval"  //请求路径
		,data:{name:name, mobile:mobile, shenfenzheng:shenfenzheng, kahao:kahao, blanName:blanName}//发送到服务器的数据
		,cache:false
		,async:false
		,timeout:6000
		,dataType:'json'
		,success:function(data){
			if(data == 'Y'){
				showTips('绑定成功');
				window.location.href = "/offlinem/partner/promotermoney";
			}else{
				showTips("绑定失败");
			}
		}
	});
}

function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}