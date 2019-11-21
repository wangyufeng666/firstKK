$().ready(function(){
	$('.saveTipBtn').bind('click', function(){saveAnswerTip($(this).attr('id'));});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			labelCode:{//标签
				required:true
			}
			,questionName:{//问题名称
				required:true
				,maxlength:50
			}
			,description:{//关键词
				maxlength:200
			}
		}
		,messages:{
			labelCode:{//标签
				required:"请选择标签"
			}
			,questionName:{//问题名称
				required:"请输入问题名称",
				maxlength:"问题名称最多50字符"
			}
			,description:{//问题描述
				required:"请输入问题描述",
				maxlength:"问题描述最多200字符"
			}
		}
	});
	
	$('#btnAddLabel').click(function(){
		layer.open({
			type:2,
			title:'添加标签项',
			shadeClose:true,
			content:'/recycle/inspection/addlabel?merType='+merType+'&answerId='+answerId,
			area:['450px','250px'],
			close:function(index){
				layer.close(index);
			}
		});
	});
});

function saveAnswerTip(thisAttrId){
	
	if(!$("#addForm").valid()){
		return;
	}
	$('.saveTipBtn').unbind('click');
	var params = {
			labelCode:$('#labelCode').val(),
			title:$('#title').val(),
			description:$('#description').val()
	};
	
	$.ajax({
		type:'POST'//请求方式
		,url:"/recycle/inspection/saveanswertip" //请求路径
		,data:params //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:10000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			if(data == "Y"){
				if(thisAttrId == 'saveAndNewBtn'){
					$('#labelCode').val('');
					$('#title').val('');
					$('#description').val('');
					$('.saveTipBtn').bind('click', function(){saveAnswerTip($(this).attr('id'));});
				}else{
					parent.saveAnswerTipSuccess(answerId, params.title, params.description);
				}
			}else{
				alert('数据保存失败：'+data);
				$('.saveTipBtn').bind('click', function(){saveAnswerTip($(this).attr('id'));});
			}
		}
	});
}

/**
 * 标签保存成功，子页面传递回来的值
 */
function saveLabelSuccess(labelCode, labelName){
	$('#labelCode').append('<option value="'+labelCode+'">'+labelName+'</option>');
	closeLayer();
}

function goBack(){
	parent.closeLayer();
}

function closeLayer(){
	layer.closeAll('iframe');
}
