
/**
 * 删除答案图文信息
 */
$('.checked .bd-item').dblclick(function(){
    var pkId = $(this).attr('id');
    if(confirm('是否确认删除图文描述？')){
        $.ajax({
            type:'POST'//请求方式
            ,url:"/rentrecy/rule/deldetailimgtext"  //请求路径
            ,data:{pkId:pkId}  //发送到服务器的数据
            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async:false //同步请求
            ,timeout:60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success:function(data){
                if(data == "Y"){
                    alert('删除成功');
                    window.location.href = window.location.href;
                }
            }
        });
    }
});

/**
 * 新增答案图文信息
 */
function saveAnswertTuWen(){
	var submit = $('#submit');
	var params = submit.serialize();
	var result = params.indexOf('answers');
	if( result > 0){
		$.ajax({
			type:'POST'//请求方式
			,url:"/rentrecy/rule/addanswertuwen"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:10000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					alert('保存成功');
					parent.reload();
				}else{
					alert('保存失败');
				}
			}
		});
	}else{
		alert('请选择图文描述');
	}
}

/**
 * 返回关闭弹框
 */
function goBack(){
	// parent.reload();
    parent.layer.closeAll('iframe');
}

function closeLayer(){
    layer.closeAll('iframe');
}