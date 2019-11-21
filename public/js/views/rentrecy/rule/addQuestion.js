$().ready(function(){
	$('.saveQuestionBtn').bind('click', function(){saveQuestion($(this).attr('id'));});
	//表单验证
	$('#addForm').validate({
		rules:{
			questionName:{required:true}//规则类型
			,questionDesc:{maxlength:100}//规则备注
		}
		,messages:{
			questionName:{required:"请输入规则类型"}//规则类型
			,questionDesc:{maxlength:"规则备注不能超过100字符"}//规则备注
		}
	});
});

/**
 * @param operFlag 	保存并新增标记
 * @returns
 */
function saveQuestion(thisAttrId){
	$('.saveQuestionBtn').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		params.ruleId = $("#ruleId").val();
		params.questionName = $("#questionName").val();
		params.typeCode = $(":radio[name='typeCode']:checked").val();
		params.status = $(":radio[name='status']:checked").val();
		params.viewSeq = $("#viewSeq").val();
        params.questionDesc = $("#questionDesc").val();
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/rentrecy/rule/savequestion"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(thisAttrId == 'saveAndAddBtn'){
						$('#questionName').val('');
						$(":radio[name='typeCode'][value='1']").attr('checked', 'checked');
						$('#viewSeq').val(parseInt(params.viewSeq)+1);
                        $('#questionDesc').val('');
						$('.saveQuestionBtn').bind('click', function(){saveQuestion($(this).attr('id'));});
					}else{
						parent.reload();
					}
				}
			}
		});
	}else{
		$('.saveQuestionBtn').bind('click', function(){saveQuestion($(this).attr('id'));});
	}
}

function goBack(){
	parent.reload();
}