$().ready(function(){
	$('.saveCategoryBtn').bind('click', function(){saveCategoryInfo($(this).attr('id'));});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			categoryName:{
				required:true
				,remote:{
					type:"post",
					url:"/recycle/category/validcategoryname",
					data:{categoryName:function(){return $("#categoryName").val();}}
				}
				,maxlength:20
			}
		}
		,messages:{
			categoryName:{
				required:"请填写品类名称"
				,remote:"该品类名称已存在"
				,maxlength:"名称最多20个字符"
			}
		}
	});
});

function saveCategoryInfo(thisAttrId){
	$('.saveCategoryBtn').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		params.viewSeq = $('#viewSeq').val();
		params.categoryName = $("#categoryName").val();
		params.enableFlag = $("input[name='enableFlag']:checked").val();
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/category/savecategory" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:20000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(thisAttrId == 'saveAndNewBtn'){
						$('#categoryName').val('');
						$('#viewSeq').val(parseInt(params.viewSeq)+10);
						$('.saveCategoryBtn').bind('click', function(){saveCategoryInfo($(this).attr('id'));});
					}else{
						parent.reload();
					}
				}
			}
			,error:function(){
				alert('保存出错了，请重试');
				$('.saveCategoryBtn').bind('click', function(){saveCategoryInfo($(this).attr('id'));});
			}
		});
	}else{
		$('.saveCategoryBtn').bind('click', function(){saveCategoryInfo($(this).attr('id'));});
	}
}

function goBack(){
	parent.reload();
}