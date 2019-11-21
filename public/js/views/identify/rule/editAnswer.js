$().ready(function(){
	$('#saveButton').bind('click', function(){saveAnswer();});
	//表单验证
	$('#addForm').validate({
		rules:{
			answerName:{required:true,maxlength:30}//规则明细
			,answerLevel:{required:true}//规则明细等级
			,answerDesc:{maxlength:100}
		}
		,messages:{
			answerName:{required:"请输入规则明细"}
			,answerLevel:{required:"请选择明细等级"}
			,answerDesc:{maxlength:"输入文字不能超过100个"}
		}
	});
});

function saveAnswer(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		
		var params = {};
		params.ruleId = $("#ruleId").val();
		params.answerId = $("#answerId").val();
		params.answerName = $("#answerName").val();
		params.answerLevel = $("#answerLevel").val();
		params.answerDesc = $("#answerDesc").val();
		params.textFlag = $(":radio[name='textFlag']:checked").val();
		params.imgFlag = $(":radio[name='imgFlag']:checked").val();
		params.exceptionFlag = $(":radio[name='exceptionFlag']:checked").val();
		params.viewSeq = $("#viewSeq").val();   
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/updateanswer"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:10000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					parent.reload();
				}else{
					$('#saveButton').bind('click', function(){saveAnswer();});
				}
			}
		});
	}else{
		$('#saveButton').bind('click', function(){saveAnswer();});
	}
}

function goBack(){
	parent.reload();
}