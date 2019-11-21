$().ready(function(){
	$('.saveRecyBtn').bind('click', function(){saveRecyMer($(this).attr('id'));});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			expressCompnay:{//快递公司
				required:true
			}
			,expressNumber:{//快递单号
				required:true
			}
			,source:{//快递来源
				required:true
			}
			,inputRemarks:{//快递录入备足信息
				required:true
				,maxlength:128
			}
		}
		,messages:{
			expressCompnay:{
				required:"请输入快递名称"
			}
			,expressNumber:{
				required:"请输入快递单号"
			}
			,source:{
				required:"请输入快递来源"
			}
			,inputRemarks:{
				required:"请输入录入备注信息"
			}
		}
	});
});

function saveRecyMer(thisAttrId){
	
	$('.saveRecyBtn').unbind('click');
	
	if($("#addForm").valid()){
		var params = {
				expressCompany:$('#expressCompany').val(),
			expressNumber:$('#expressNumber').val(),
				source:$('#source').val(),
				inputRemarks:$('#inputRemarks').val(),
		};
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/express/express/savemer" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(thisAttrId == 'saveAndNewBtn'){
						$('#expressCompany').val('');
						$('#expressNumber').val('');
						$('#source').val('');
						$('#inputRemarks').val('');
						$('.saveRecyBtn').bind('click', function(){saveRecyMer($(this).attr('id'));});
					}else{
						parent.reload();
					}
				}
			}
		});
	}else{
		$('.saveRecyBtn').bind('click', function(){saveRecyMer($(this).attr('id'));});
	}
}

function goBack(){
	parent.closeLayer();
}