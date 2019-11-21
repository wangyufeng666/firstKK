$().ready(function(){
	$('#btn_submit').bind('click', function(){addIndustry();});
	//表单验证
	$('#addForm').validate({
		rules:{
			title:{required:true},
			titleExt:{required:true}
		}
		,messages:{
			typeName:{required:"请输入规则类型"}//规则类型
		}
	});
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

//新增行业资讯
function addIndustry(){
	$('#btn_submit').unbind('click');
	var content = editor.txt.html();

	var imageMain = $("#imageMain").attr('src');
	var imageSecond = $("#imageSecond").attr('src');
	var imagePC = $("#imagePC").attr('src');
	var imageList = $("#imageList").attr('src');
	var viewDate = $("#viewDate").val();
	var imageSource = $("#imageSource").attr('src');


	if (newsSource == 1 && position == 1 ){//移动端
		if (imageMain == '' || imageMain == null){
			layer.msg('请上传主图图片!');
			$('#btn_submit').bind('click', function(){addIndustry();});
			return false;
		}
	}else if(newsSource == 1 && (position == 2 || position == 3 )){
		if (imageSecond == '' || imageSecond == null){
			layer.msg('请上传次图图片!');
			$('#btn_submit').bind('click', function(){addIndustry();});
			return false;
		}
	}else if (newsSource == 2 && pcImgPosition !='9' && pcImgPosition != '10') {//PC端
		if (imagePC == '' || imagePC == null){
			layer.msg('请上传图片!');
			$('#btn_submit').bind('click', function(){addIndustry();});
			return false;
		}
	}

	if ( imageList == '' || imageList == null){
		if (pcImgPosition == '9' ){
			layer.msg('请上传租赁图片!');
		}else{
			layer.msg('请上传列表图片!');
		}
		$('#btn_submit').bind('click', function(){addIndustry();});
		return false;
	}

	if (content == '' || content == null || content == "<p><br></p>"){
		layer.msg('请编辑内容!');
		$('#btn_submit').bind('click', function(){addIndustry();});
		return false;
	}

	if (viewDate == '' || viewDate == null ){
		layer.msg('请填写资讯时间!');
		$('#btn_submit').bind('click', function(){addIndustry();});
		return false;
	}

	if($("#addForm").valid()){
		var params = {};
		params.newsSource = newsSource;
		params.title = $("#title").val();
		params.titleExt = $("#titleExt").val();
		params.position = position;
		params.pcImgPosition = pcImgPosition;
		params.imageMain = imageMain;
		params.imageSecond = imageSecond;
		params.imageList = imageList;
		params.imagePC = imagePC;
		params.content = content;
		params.status = $("#status").val();
		params.seq = $("#seq").val();
		params.viewDate = viewDate;
		params.newsUrl = $("#newsUrl").val();
		params.imgSource = imageSource;
		$.ajax({
			type:'POST'//请求方式
			,url:"/information/industry/addindustry"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if (data.code == 1000){
					layer.msg('新增成功');
					setTimeout("window.history.back(-1);",2000);
				}else{
					layer.msg('新增失败');
					$('#btn_submit').bind('click', function(){addIndustry();});
				}
			}
		});
	}else{
		$('#btn_submit').bind('click', function(){addIndustry();});
	}
}


/**
 * 	上传图片
 * @returns {boolean}
 */
function upload(that,id) {
	var animateimg = $(that).val(); //获取上传的图片名 带//
	var imgarr = animateimg.split('\\'); //分割
	var myimg = imgarr[imgarr.length - 1]; //去掉 // 获取图片名
	var houzui = myimg.lastIndexOf('.'); //获取 . 出现的位置
	var ext = myimg.substring(houzui, myimg.length).toUpperCase();  //切割 . 获取文件后缀
	var file = $(that).get(0).files[0]; //获取上传的文件
	if (file == undefined || file == '' || file == null) {
		return false;
	}
	var fileSize = file.size;           //获取上传的文件大小
	var maxSize = 10240000;              //最大10MB
	if (ext != '.PNG' && ext != '.GIF' && ext != '.JPG' && ext != '.JPEG') {
		layer.msg('文件类型错误,请重新上传');
		return false;
	} else if (parseInt(fileSize) >= parseInt(maxSize)) {
		layer.msg('上传的文件不能超过20MB,对您造成的不便敬请谅解,谢谢!');
		return false;
	} else {
		var data = new FormData();
		data.append("file", file);
		$.ajax({
			url: "/information/industry/imgupload",
			type: 'POST',
			data: data,
			dataType: 'JSON',
			beforeSend: function () {
				layer.msg('加载中', {
					icon: 16
					, shade: 0.01
				});
			},
			complete: function () {

			},
			cache: false,
			processData: false,
			contentType: false
		}).done(function (ret) {
			if (ret.errno == 0) {
				layer.msg('上传成功');
				$("#"+id).attr("src", ret.data[0]);
			} else {
				layer.msg('上传失败');
			}
		});
		return false;
	}
}


//修改移动端图片位置提示
var position = $('#position').val();
$('#position').on('change',function(){
	if (confirm('是否变换位置')){
		position = $(this).val();
	}else{
		$('#position').val(position);
	}

	if (position == 1){
		$('#mainImg').show();
		$('#nextImg').hide();
	}else if(position == 2 || position == 3){
		$('#mainImg').hide();
		$('#nextImg').show();
	}else{
		$('#mainImg').hide();
		$('#nextImg').hide();
	}
});

//修改PC端图片位置提示
var pcImgPosition = $('#pcImgPosition').val();
$('#pcImgPosition').on('change',function(){
	if (confirm('是否变换位置')){
		pcImgPosition = $(this).val();
		_init(pcImgPosition);
	}else{
		$('#pcImgPosition').val(pcImgPosition);
	}

});

//pc端变换位置
function _init(pcImgPosition){
	//初始化列表
	$('.pcListName').html('列表图片：');
	$('#pcImgList').val('上传列表图');
	$('.pcImgSize').html('尺寸要求：173*118');


	if (pcImgPosition == 9 || pcImgPosition ==10 ){
		if (pcImgPosition == '9'){//位置为租赁时
			$('.pcListName').html('租赁图片：');
			$('#pcImgList').val('上传租赁图');
			$('.pcImgSize').html('尺寸要求：160*160');
		}
		$('#pcImg').hide();
	}else{
		$('#pcImg').show();
	}

	//改位置换名称和图片尺寸
	if (pcImgPosition == 1){
		$('.pcImgName').html('首页主图：');
		$('.pcImgMainSize').html('尺寸要求：376*307');
	}else if(pcImgPosition == 2 || pcImgPosition == 3 || pcImgPosition == 4 || pcImgPosition == 5 ){
		switch (pcImgPosition) {
			case '2':
				$('.pcImgName').html('首页次图1：');
				break;
			case '3':
				$('.pcImgName').html('首页次图2：');
				break;
			case '4':
				$('.pcImgName').html('首页次图3：');
				break;
			case '5':
				$('.pcImgName').html('首页次图4：');
				break;
			default:
				break;
		}
		$('.pcImgMainSize').html('尺寸要求：122*122');
	}else if(pcImgPosition == 6){
		$('.pcImgName').html('列表主图：');
		$('.pcImgMainSize').html('尺寸要求：640：443');
	}else if(pcImgPosition == 7|| pcImgPosition == 8){
		switch (pcImgPosition) {
			case '7':
				$('.pcImgName').html('列表次图1：');
				break;
			case '8':
				$('.pcImgName').html('列表次图2：');
				break;
			default:
				break;
		}
		$('.pcImgMainSize').html('尺寸要求：443*213');
	}

	if (pcImgPosition == 1){
		$('#mainImgSource').show();
	}else{
		$('#mainImgSource').hide();
	}

}


//回退按钮点击事件
$('#btn_goback').click(function () {
	window.history.back(-1);
});