$().ready(function(){
	$('#btn_submit').bind('click', function(){addNotice();});
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

//新增公告
function addNotice(){
	$('#btn_submit').unbind('click');
	var content = editor.txt.html();
	var title = $('#title').val();
	var viewDate = $('#viewDate').val();
	var status = $('#status').val();
	var seq = $('#seq').val();
	var titleExt = $('#titleExt').val();
	
	if (title == '' || title == null){
		layer.msg('请输入标题!');
		$('#btn_submit').bind('click', function(){addNotice();});
		return false;
	}
	
	if (titleExt == '' || titleExt == null){
		layer.msg('请输入内容简介');
		$('#btn_submit').bind('click', function(){addNotice();});
		return false;
	}

	if (content == '' || content == null || content == "<p><br></p>"){
		layer.msg('请编辑内容!');
		$('#btn_submit').bind('click', function(){addNotice();});
		return false;
	}
	
	if (viewDate == '' || viewDate == null ){
		layer.msg('请填写资讯时间!');
		$('#btn_submit').bind('click', function(){addNotice();});
		return false;
	}
	
	if (status == '' || status == null){
		layer.msg('请选择公告状态!');
		$('#btn_submit').bind('click', function(){addNotice();});
		return false;
	}
	
	if (seq == '' || seq == null){
		layer.msg('请展示顺序!');
		$('#btn_submit').bind('click', function(){addNotice();});
		return false;
	}

	var params = {};
	params.title = title;
	params.titleExt = titleExt;
	params.content = content;
	params.viewDate = viewDate;
	params.status = status;
	params.seq = seq;
	$.ajax({
		type:'POST'//请求方式
		,url:"/youdezhuan/notice/savenotice"  //请求路径
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
				$('#btn_submit').bind('click', function(){addNotice();});
			}
		}
	});
}