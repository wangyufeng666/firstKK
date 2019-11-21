$().ready(function(){
	$('#saveButton').bind('click', function(){save();});
	//表单验证
	$('#addForm').validate({
		rules:{
			suningQuestionCode:{
				maxlength:20
        	}
			,suningAnswerCode:{
				maxlength:20
			}
		}
		,messages:{
			typeName:{//规则类型
				required:"请输苏宁问题编码，不能超过20字符"
			}
			,guide:{//规则备注
				maxlength:"请输苏宁答案编码，不能超过20字符"
			}
		}
	});
});

function save(){
	$('#saveButton').html('保存中...');
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		params.ruleId = $("#ruleId").val();
		params.ruleTypeId = $("#ruleTypeId").val();
		params.detailId = $("#detailId").val(); 
		params.suningQuestionCode = $("#suningQuestionCode").val();
		params.suningAnswerCode = $("#suningAnswerCode").val();
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merrule/updatesuningruletype"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					goBack();
				}
			}
		});
	}else{
		$('#saveButton').html('保存');
		$('#saveButton').bind('click', function(){save();});
	}
}

function goBack(){
	var ruleId = $('#ruleId').val();
	parent.location.href = "/recycle/merrule/suningruleinfo?ruleId="+ruleId;
}