$().ready(function(){
	$('.saveRuleBtn').bind('click', function(){saveRuleInfo($(this).attr('id'));});

	//表单验证
	$('#addForm').validate({
		rules:{
			merType:{required:true}//商品类型
			,ruleName:{required:true,maxlength:30}//规则名称
			,modelFlag:{required:true}//规则模板
		}
		,messages:{
			merType:{required:"请选择商品类型"}//商品类型
			,ruleName:{
				required:"请输入规则名称",
				maxlength:"最多不超过30个字符串"
			}//规则名称
			,modelFlag:{required:"请选择规则模板"}//规则模板
		}
	});
});

function saveRuleInfo(thisAttrId){
	$('.saveRuleBtn').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		var questions = [];

		params.ruleName = $("#ruleName").val();
		params.merType = $("#merType").val();
		params.modelFlag = $("#modelFlag").val();

		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/saverule" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(thisAttrId == 'saveAndNewBtn'){
						$("#ruleName").val('');
						$("#modelFlag").val('');
						$('.saveRuleBtn').bind('click', function(){saveRuleInfo($(this).attr('id'));});
					}else{
						parent.reload();
					}
				}
			}
		});
	}else{
		$('.saveRuleBtn').bind('click', function(){saveRuleInfo($(this).attr('id'));});
	}
}

function goBack(){
	parent.closeLayer();
}