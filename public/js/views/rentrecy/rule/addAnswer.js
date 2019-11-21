$().ready(function(){
	$('.saveAnswerBtn').bind('click', function(){saveAnswer($(this).attr('id'));});
	//表单验证
	$('#addForm').validate({
		rules:{
			answerName:{required:true, maxlength:30}//规则明细
			,answerDesc:{maxlength:100}
			,deductValue:{number:true,
				min:function(){
					var deductType = $(":radio[name='deductType']:checked").val();
					var exceptionFlag = $(":radio[name='exceptionFlag']:checked").val();
					
					if(deductType == 'P'){//百分比
						if(exceptionFlag == 'Y'){//异常项
							return -100;
						}
						return 0;
					}else{
						return -99999;
					}
				},max:function(){
					var deductType = $(":radio[name='deductType']:checked").val();
					var exceptionFlag = $(":radio[name='exceptionFlag']:checked").val();
					if(deductType == 'P'){//百分比
						if(exceptionFlag == 'N'){
							return 100;
						}
						return 0;
					}else{
						if(exceptionFlag == 'Y'){
							return 0;
						}
						return 99999;
					}
				}
			}
      	}
		,messages:{
			answerName:{required:"请输入规则明细"}
            ,answerDesc:{maxlength:"规则备注不能超过100字符"}
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
		params.viewSeq = $("#viewSeq").val();
        params.answerDesc = $("#answerDesc").val();
        params.exceptionFlag = $(":radio[name='exceptionFlag']:checked").val();
        params.status = $(":radio[name='status']:checked").val();
        params.deductType = $(":radio[name='deductType']:checked").val();
        params.deductValue = $("#deductValue").val();
		
        $.ajax({
        	type:'POST'//请求方式
       		,url:"/rentrecy/rule/saveanswer"  //请求路径
       		,data:params  //发送到服务器的数据
       		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
       		,async:false //同步请求
       		,timeout:60000//默认超时60秒
       		,dataType:'json' //预期服务器返回的数据类型
       		,success:function(data){
       			if(data == "Y"){
       				if(thisAttrId == 'saveAndAddBtn'){
       					$('#answerName').val('');
       					$('#viewSeq').val(parseInt(params.viewSeq, 10)+1);
       					$('#answerDesc').val('');
       					$('.saveAnswerBtn').bind('click', function(){saveAnswer($(this).attr('id'));});
       				}else{
       					parent.reload();
       				}
       			}else{
       				alert('保存失败：'+data);
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