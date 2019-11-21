$().ready(function(){
	$('#saveButton').bind('click', function(){save();});
	//表单验证
	$('#addForm').validate({
		rules:{
			merType:{required:true}//商品类型
			,ruleName:{required:true}//规则名称
			,merType:{required:true}//规则名称
		}
		,messages:{
			merType:{required:"请选择商品类型"}//商品类型
			,ruleName:{required:"请输入规则名称"}//规则名称
			,merType:{required:"请输入规则名称"}//规则名称
		}
	});
});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		params.ruleId = $("#ruleId").val();
		params.ruleName = $("#ruleName").val();
		params.merType = $("#merType").val();
        params.sources = $(":radio[name='sources']:checked").val();
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/rentrecy/rule/updaterule"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
                    reload();
				}else{
					alert('保存失败：'+data);
					$('#saveButton').bind('click', function(){save();});
				}
			}
		});
	}else{
		$('#saveButton').bind('click', function(){save();});
	}
}

function goBack(){
    parent.closeLayer();
}

function reload() {
    parent.reload();
}