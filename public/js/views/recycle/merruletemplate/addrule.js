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
			,profit:{//利润率
				required:"请输入利润率",
				max:"你输入的利润率太大",
				min:"你输入的利润率太小"
			}
		}
	});
});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
        var params = {};
		params.ruleName = $("#ruleName").val();
		params.merType = $("#merType").val();
		params.profit = $("#profit").val();
		params.sysFlag = $(":radio[name='sysFlag']:checked").val();
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merruletemplate/saverule"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(confirm("是否继续添加")){
						$('#merType').val('');
						$('#ruleName').val('');
						$('#profit').val('0');
						$('#saveButton').bind('click', function(){save();});
					}else{
						goBack();
					}
				}
			}
		});
	}else{
		$('#saveButton').bind('click', function(){save();});
	}
}

function goBack(){
	parent.location.href = "/recycle/merruletemplate/index?v=1&backFlag=Y";
}