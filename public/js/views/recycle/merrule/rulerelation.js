//功能描述：保存规则关联
function createRelation(ruleDetailId){
	var ruleId = $('#ruleId').val();
	if(confirm('是否提交规则关联？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merrule/createrelation" //请求路径
			,data:{ruleId:ruleId, ruleDetailId:ruleDetailId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					alert("保存成功");
				}else{
					alert("保存失败");
				}
			}
		});
	}
}
$('#itemList .selects .option').click(function(){
	var ruleId = $('#ruleId').val();
	var thisDetailId = $('#thisDetailId').val();
	var otherDetailId = $(this).attr('id');
	var text = '是否确认关联？';
	var url = '/recycle/merrule/addrelation';
	var flag = 'Y';
	if($(this).hasClass('checked')){//解绑
		text = '是否解除关联？';
		url = '/recycle/merrule/delrelation';
		flag = 'N';
	}
//	if(confirm(text)){
	$.ajax({
		type:'POST'//请求方式
		,url:url//请求路径
		,data:{thisDetailId:thisDetailId, otherDetailId:otherDetailId, ruleId:ruleId} //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			if(data == "Y"){
				if(flag == 'Y'){
					layer.msg('添加关联成功', 2, 1);
					$('#'+otherDetailId).addClass('checked');
				}else{
					layer.msg('解除关联成功', 2, 1);
					$('#'+otherDetailId).removeClass('checked');
				}
			}else{
				alert("关联失败");
			}
		}
	});
//	}
});