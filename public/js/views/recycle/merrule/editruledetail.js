$().ready(function(){
	$('#saveButton').bind('click', function(){save();});
	//表单验证
	$('#addForm').validate({
		rules:{
			detailName:{required:true}//规则明细
			,countVal:{
				required:true,
				number:true,
				max:function(){ if($(':radio[name="countMode"]:checked').val() == '百分比'){return 99;}else{return 9999;}},
				min:function(){ if($(':radio[name="countMode"]:checked').val() == '百分比'){return -99;}else{return -9999;}}
			}//计算值
		}
		,messages:{
			detailName:{required:"请输入规则明细"}//规则明细
			,countVal:{required:"请输入计算值"}//计算值
		}
	});
});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		
		var params = {};
		params.ruleId = $("#ruleId").val();
		params.detailId = $("#detailId").val();
		params.detailName = $("#detailName").val();
		params.choiceMode = $('#choiceMode').val();
		params.countMode = $(":radio[name='countMode']:checked").val();
		params.countVal = $("#countVal").val();
		params.viewSeq = $("#viewSeq").val();   
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merrule/updateruledetail"  //请求路径
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
		$('#saveButton').bind('click', function(){save();});
	}
}

function goBack(){
	var ruleId = $('#ruleId').val();
	parent.location.href = "/recycle/merrule/ruleinfo?ruleId="+ruleId;
}