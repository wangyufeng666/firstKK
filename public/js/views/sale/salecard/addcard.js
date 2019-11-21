$().ready(function(){
	$('#addBtn').bind('click', function(){save('Y');});
	//表单验证
	$('#addForm').validate({
		rules:{
			num:{required:true}
			,cardType:{required:true}
		}
		,messages:{
			num:{required:"请输入生成销售卡数量,数量为1-2000"}//
			,cardType:{required:"请选择销售卡类型"}//规则备注
		}
	});
});


var index = parent.layer.getFrameIndex(window.name);
/**
 * @param operFlag 	新增
 * @returns
 */
function save(operFlag){
	$('#addBtn').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		params.num = $("#num").val();
		params.cardType = $("#cardType").val();
		params.remark = $("#remark").val();

		if (params.num < 0 || params.num > 2000 ){
			layer.msg('请输入正确的销售卡数量,数量值为1-2000');
			$('#addBtn').bind('click', function(){save();});
			return false;
		}
		$.ajax({
			type:'POST'//请求方式
			,url:"/sale/salecard/addsalecard"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if (data.code == 1000){
					layer.msg('生成成功');
					setTimeout("parent.layer.close(index);",2000);
				}else{
					layer.msg(data.msg);
					$('#addBtn').bind('click', function(){save();});
				}
			}
		});
	}else{
		$('#addBtn').bind('click', function(){save('Y');});
	}
}

