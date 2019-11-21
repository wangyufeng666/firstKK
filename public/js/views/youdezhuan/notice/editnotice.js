$().ready(function(){
	$('#btn_submit').bind('click', function(){editNotice();});
});

//wangEditor编辑器
var E = window.wangEditor;
var editor = new E('#editor');
// 或者 var editor = new E( document.getElementById('editor') )
editor.customConfig.uploadImgServer = '/information/industry/imgupload';
editor.customConfig.uploadFileName = 'file';
editor.create();
E.fullscreen.init('#editor');
E.viewsource.init('#editor');

//编辑公告
function editNotice(){
	$('#btn_submit').unbind('click');
	var title = $("#title").val();
	var titleExt = $('#titleExt').val();
	var content = editor.txt.html();
	var viewDate = $("#viewDate").val();
	var status = $("#status").val();
	var seq = $("#seq").val();

	if (title == '' || title == null || title == "<p><br></p>"){
		layer.msg('请输入标题!');
		$('#btn_submit').bind('click', function(){editNotice();});
		return false;
	}
	
	if (titleExt == '' || titleExt == null){
		layer.msg('请输入内容简介');
		$('#btn_submit').bind('click', function(){editNotice();});
		return false;
	}
	
	if (content == '' || content == null || content == "<p><br></p>"){
		layer.msg('请编辑内容!');
		$('#btn_submit').bind('click', function(){editNotice();});
		return false;
	}

	if (viewDate == '' || viewDate == null ){
		layer.msg('请填写资讯时间!');
		$('#btn_submit').bind('click', function(){editNotice();});
		return false;
	}
	
	if (status == '' || status == null ){
		layer.msg('请选择公告状态');
		$('#btn_submit').bind('click', function(){editNotice();});
		return false;
	}
	
	if (seq == '' || seq == null ){
		layer.msg('请输入公告的排序');
		$('#btn_submit').bind('click', function(){editNotice();});
		return false;
	}
	
	var params = {};
	params.pkId = $("#pkId").val();
	params.title = title;
	params.titleExt = titleExt;
	params.content = content;
	params.status = status;
	params.seq = seq;
	params.viewDate = viewDate;
	$.ajax({
		type:'POST'//请求方式
		,url:"/youdezhuan/notice/updatenotice"  //请求路径
		,data:params  //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			if (data.code == '200'){
				window.parent.location.href = window.parent.location.href;
			}else{
				layer.msg(data.msg);
				$('#btn_submit').bind('click', function(){editNotice();});
			}
		}
	});
}