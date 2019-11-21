$().ready(function(){
	$('#saveButton').bind('click', function(){save();});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			merType:{required:true}//商品类型
			,ruleName:{required:true}//规则名称
			,profit:{required:true,max:100,min:0}//利润率
		}
		,messages:{
			merType:{required:"请选择商品类型"}//商品类型
			,ruleName:{required:"请输入规则名称"}//规则名称
			,profit:{required:"请输入利润率",max:"你输入的太大",min:"你输入的太小"}//利润率
		}
	});
});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		
		var params = {};
		params.ruleName = $("#ruleName").val();
		params.profit = $("#profit").val();
		params.ruleId = $("#ruleId").val();
		params.merType = $("#merType").val();
		params.sysFlag = $("#sysFlag").val();
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merrule/savecopyrule"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					parent.reload();
				}else{
					alert(data);
				}
			}
		});
	}else{
		$('#saveButton').bind('click', function(){save();});
	}
}
