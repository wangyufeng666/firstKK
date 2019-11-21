$().ready(function(){
	$('#saveLabelBtn').bind('click', function(){saveLabel();});
});

function saveLabel(){
	
	var labelName = $('#labelName').val();
	var merType = $('#merType').val();
	var answerId = $('#answerId').val();
	
	if(labelName == ''){
		alert('标签名称不能为空');
		return;
	}
	
	$('#saveLabelBtn').unbind('click');
	$.ajax({
		type:'POST'//请求方式
		,url:"/recycle/inspection/savelabel" //请求路径
		,data:{labelName:labelName, merType:merType, answerId:answerId} //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:10000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			if(data.result == "Y"){
				var labelCode = data.labelCode;
				parent.saveLabelSuccess(labelCode, labelName);
			}else{
				alert(data.msg);
				$('#saveLabelBtn').bind('click', function(){saveLabel();});
			}
		}
	});
}

function goBack(){
	parent.closeLayer();
}