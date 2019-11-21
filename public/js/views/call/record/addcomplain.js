$().ready(function(){
	$('#addBtn').bind('click', function(){save('Y');});
	//表单验证
	$('#addForm').validate({
		rules:{
			username:{required:true}
			,contactWay:{required:true}
			,guide:{maxlength:100}
		}
		,messages:{
			typeName:{required:"请输入规则类型"}//规则类型
			,guide:{maxlength:"规则备注不能超过100字符"}//规则备注
		}
	});
});


var index = parent.layer.getFrameIndex(window.name);
/**
 * @param operFlag 	新增
 * @returns
 */
function save(operFlag){
	$('#btn_save,#addBtn').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		params.pkId = pkId;
		params.complainid = complainid;
		params.username = $("#username").val();
		params.contactWay = $("#contactWay").val();
		params.startDate = $("#startDate").val();
		params.orderNo = orderNo;

		params.complainType = $("#complainType").val();
		params.complainLevel = $("#complainLevel").val();
		params.contentType = $("#contentType").val();
		params.contentRemark = $("#contentRemark").val();

		params.dealPlanType = $("#dealPlanType").val();
		params.dealPlanRemark = $("#dealPlanRemark").val();
		params.complainMoney = $("#complainMoney").val();
		params.dealResultType = $("#dealResultType").val();
		params.liablePerson = $("#liablePerson").val();
		params.dealPerson = $("#dealPerson").val();

		$.ajax({
			type:'POST'//请求方式
			,url:"/call/record/newusercomplain"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if (data.code == 1000){
					layer.msg('提交成功');
					setTimeout("parent.layer.close(index);",2000);
				}else{
					layer.msg(data.data);
					$('#btn_save,#addBtn').bind('click', function(){save();});
				}
			}
		});
	}else{
		$('#addBtn').bind('click', function(){save('Y');});
	}
}

