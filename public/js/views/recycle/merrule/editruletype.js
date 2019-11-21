$().ready(function(){
	$('#saveButton').bind('click', function(){save();});
	//表单验证
	$('#addForm').validate({
		rules:{
			typeName:{//规则类型
				required:true
        	}
			,guide:{//规则备注
				maxlength:100
			}
		}
		,messages:{
			typeName:{//规则类型
				required:"请输入规则类型"
			}
			,guide:{//规则备注
				maxlength:"规则备注不能超过100字符"
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
		params.typeName = $("#typeName").val();
		params.choiceMode = $(":radio[name='choiceMode']:checked").val();
		params.guide = $("#guide").val();
		params.viewSeq = $("#viewSeq").val();
		params.levels = $(":radio[name='levels']:checked").val();
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merrule/updateruletype"  //请求路径
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
	parent.location.href = "/recycle/merrule/ruleinfo?ruleId="+ruleId;
}