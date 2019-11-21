$().ready(function(){
	$('#saveButton').bind('click', function(){saveQuestion();});
	//表单验证
	$('#addForm').validate({
		rules:{
			questionName:{required:true,maxlength:50}
			,groupId:{required:true}
			,questionDesc:{maxlength:100}
		}
		,messages:{
			questionName:{required:"请输入规则类型"}
			,groupId:{required:"请选择所属分组"}
			,questionDesc:{maxlength:"页面提示输入文字超过100个字"}
		}
	});
});

function saveQuestion(){
	$('#saveButton').html('保存中...');
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		params.ruleId = $("#ruleId").val();
		params.questionId = $("#questionId").val();
		params.groupId = $("#groupId").val();
		params.questionName = $("#questionName").val();
		params.typeCode = $(":radio[name='typeCode']:checked").val();
		params.viewSeq = $("#viewSeq").val();
		params.questionDesc = $("#questionDesc").val();
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/updatequestion"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					parent.reload();
				}else{
					$('#saveButton').html('保存');
					$('#saveButton').bind('click', function(){saveQuestion();});
				}
			}
		});
	}else{
		$('#saveButton').html('保存');
		$('#saveButton').bind('click', function(){saveQuestion();});
	}
}

function goBack(){
	parent.reload();
}