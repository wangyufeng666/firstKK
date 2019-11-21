$().ready(function(){
	$('#btn_save').bind('click', function(){save('N');});
	$('#btn_saveAndAdd').bind('click', function(){save('Y');});
	//表单验证
	$('#addForm').validate({
		rules:{
			detailName:{required:true}//规则明细
			,countVal:{
				required:true,
				number:true,
				max:function(){ if($(':radio[name="countMode"]:checked').val() == '百分比'){return 99;}else{return 9999;}},
				min:function(){ if($(':radio[name="countMode"]:checked').val() == '百分比'){return -99;}else{return -9999;}}
			}
      	}
		,messages:{
			detailName:{required:"请输入规则明细"}
			,countVal:{required:"请输入计算值"}
		}
	});
});

$('#hardWare').click(function(){
	var hardWareValue = $("#hardWare option:checked").text();
	if($("#hardWare").val()){
		hardWareValue = hardWareValue.split('|');
		$('#detailName').val(hardWareValue[0]);
	}else{
		$('#detailName').val('');
	}
})

/**
 * @param operFlag 是否继续操作标记
 * @returns
 */
function save(operFlag){
	$('#btn_save, #btn_saveAndAdd').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		params.ruleId = $("#ruleId").val();
		params.ruleTypeId = $("#ruleTypeId").val();
		params.detailName = $("#detailName").val();
		params.countMode = $(":radio[name='countMode']:checked").val();
		params.countVal = $("#countVal").val();
		params.viewSeq = $("#viewSeq").val();
		params.choiceMode = $('#choiceMode').val();
		params.hardWare = $('#hardWare').val();
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merrule/saveruledetail"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(operFlag == 'Y'){
						$('#detailName').val('');
						$(":radio[name='countMode'][value='百分比']").attr('checked', 'checked');
						$('#countVal').val('');
						var viewSeqVal = parseInt(params.viewSeq, 10)+1;
						$('#viewSeq').val(viewSeqVal);
						$('#hardWare').val('');
						$('#btn_save').bind('click', function(){save('N');});
						$('#btn_saveAndAdd').bind('click', function(){save('Y');});
					}else{
						if(confirm("是否继续添加")){
							$('#detailName').val('');
							$(":radio[name='countMode'][value='百分比']").attr('checked', 'checked');
							$('#countVal').val('');
							var viewSeqVal = parseInt(params.viewSeq, 10)+1;
							$('#viewSeq').val(viewSeqVal);
							$('#hardWare').val('');
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