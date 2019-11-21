$().ready(function(){
	$('#btn_save').bind('click', function(){save('N');});
	$('#btn_saveAndAdd').bind('click', function(){save('Y');});
	//表单验证
	$('#addForm').validate({
		rules:{
			typeName:{required:true}//规则类型
			,guide:{maxlength:100}//规则备注
		}
		,messages:{
			typeName:{required:"请输入规则类型"}//规则类型
			,guide:{maxlength:"规则备注不能超过100字符"}//规则备注
		}
	});
});

/**
 * @param operFlag 	保存并新增标记
 * @returns
 */
function save(operFlag){
	$('#btn_save,#btn_saveAndAdd').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		params.ruleId = $("#ruleId").val();
		params.typeName = $("#typeName").val();
		params.choiceMode = $(":radio[name='choiceMode']:checked").val();
		params.levels = $(":radio[name='levels']:checked").val();
		params.guide = $("#guide").val();
		params.viewSeq = $("#viewSeq").val();
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merrule/saveruletype"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					
					if(operFlag == 'Y'){
						$('#typeName').val('');
						$(":radio[name='choiceMode'][value='R']").attr('checked', 'checked');
						$(":radio[name='levels'][value='1']").attr('checked', 'checked');
						$('#guide').val('');
						$('#viewSeq').val(parseInt(params.viewSeq)+1);
						$('#btn_save').bind('click', function(){save('N');});
						$('#btn_saveAndAdd').bind('click', function(){save('Y');});
					}else{
						if(confirm("是否继续添加")){
							$('#typeName').val('');
							$(":radio[name='choiceMode'][value='R']").attr('checked', 'checked');
							$(":radio[name='levels'][value='1']").attr('checked', 'checked');
							$('#guide').val('');
							$('#viewSeq').val(parseInt(params.viewSeq)+1);
							
							$('#btn_save').bind('click', function(){save('N');});
							$('#btn_saveAndAdd').bind('click', function(){save('Y');});
						}else{
							goBack();
						}
					}
				}
			}
		});
	}else{
		$('#btn_save').bind('click', function(){save('N');});
		$('#btn_saveAndAdd').bind('click', function(){save('Y');});
	}
}

function goBack(){
	var ruleId = $('#ruleId').val();
	parent.location.href = "/recycle/merrule/ruleinfo?ruleId="+ruleId;
}