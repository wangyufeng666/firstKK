$().ready(function(){
	$('#saveButton').bind('click', function(){saveMerInfo();});
    //表单验证
    $('#editForm').validate({
    	rules:{
    		processremarks:{//处理备注
    			required:true
    		}
    	}
    	,messages:{
			processremarks:{//处理备注
    			required:"请输入备注信息"
    		}
    	}
    });
});

function saveMerInfo(){
	$('#saveButton').unbind('click');
	if($("#editForm").valid()){
		var params = {
			recordid:$('#recordid').val(),
			processremarks:$('#processremarks').val(),
		};
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/express/express/updateexpress2" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					parent.reload();
				}else{
					alert('修改失败：'+data);
					$('#saveButton').bind('click', function(){saveMerInfo();});
				}
			}
		});
	}else{
		$('#saveButton').bind('click', function(){saveMerInfo();});
	}
}
function goBack(){
	parent.reload();
}