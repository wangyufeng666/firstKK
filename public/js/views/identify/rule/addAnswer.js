$().ready(function(){
	$('.saveAnswerBtn').bind('click', function(){saveAnswer($(this).attr('id'));});
	//表单验证
	$('#addForm').validate({
		rules:{
			answerName:{required:true, maxlength:30}//规则明细
			,answerLevel:{required:true}//规则明细
			,answerDesc:{maxlength:100}
		}
		,messages:{
			answerName:{required:"请输入规则明细"}
			,answerLevel:{required:"请选择答案级别"}
			,answerDesc:{required:"答案备注超过100个字符"}
		}
	});
});

/**
 * @param operFlag 是否继续操作标记
 * @returns
 */
function saveAnswer(thisAttrId){
	$('.saveAnswerBtn').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		params.ruleId = $("#ruleId").val();
		params.questionId = $("#questionId").val();
		params.answerName = $("#answerName").val();
		params.answerLevel = $("#answerLevel").val();
		params.viewSeq = $("#viewSeq").val();
		params.exceptionFlag = $(":radio[name='exceptionFlag']:checked").val();
		params.textFlag = $(":radio[name='textFlag']:checked").val();
		params.imgFlag = $(":radio[name='imgFlag']:checked").val();
		params.answerDesc = $("#answerDesc").val();
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/saveanswer"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(thisAttrId == 'saveAndAddBtn'){
						$('#answerName').val('');
						
						$(":radio[name='exceptionFlag'][value='N']").attr('checked','checked');
						$(":radio[name='textFlag'][value='N']").attr('checked','checked');
						$(":radio[name='imgFlag'][value='N']").attr('checked','checked');
						
						$('#viewSeq').val(parseInt(params.viewSeq, 10)+1);
						$('.saveAnswerBtn').bind('click', function(){saveAnswer($(this).attr('id'));});
					}else{
						parent.reload();
					}
				}else{
					alert(data);
					$('.saveAnswerBtn').bind('click', function(){saveAnswer($(this).attr('id'));});
				}
			}
		});
	}else{
		$('.saveAnswerBtn').bind('click', function(){saveAnswer($(this).attr('id'));});
	}
}

function goBack(){
	parent.reload();
}