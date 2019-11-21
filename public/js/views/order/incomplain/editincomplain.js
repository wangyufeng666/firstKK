$().ready(function(){
	$('#editBtn').bind('click', function(){save('Y');});

});


var index = parent.layer.getFrameIndex(window.name);

//调查结果
$('.remark_sl_div .remark_sl').bind('click', function(){clickTrigger1(this);});
function clickTrigger1(obj){
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected')
	}else{
		$(obj).siblings('.remark_sl').removeClass('selected');
		$(obj).addClass('selected');
	}
}

//处理结果
$('.dealResultMain .dealResult').bind('click', function(){clickTrigger2(this);});
function clickTrigger2(obj){
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected');
		$(".dealResult").attr("data-key","99");
	}else{
		$(obj).addClass('selected');
		$(".dealResult").attr("data-key","2");
	}
}

/**
 * @param operFlag 	新增
 * @returns
 */
function save(operFlag){
	$('#btn_save,#editBtn').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		params.pkId = pkId;
		params.orderNo = orderNo;
		params.findings = $(".remark_sl_div  .selected").attr('data-key');
		params.findingRemark = $("#findingRemark").val();
		params.imgUrl = $('#imageId').attr('src');
		params.dealPlan = $("#dealPlan").val();
		params.lossMoney = $("#lossMoney").val();
		params.dealResult = $(".dealResult").attr('data-key');

		$.ajax({
			type:'POST'//请求方式
			,url:"/order/incomplain/updateincomplain"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if (data.code == 1000){
					layer.msg('修改成功');
					setTimeout("parent.layer.close(index);",2000);
				}else{
					layer.msg(data.data);
					$('#btn_save,#editBtn').bind('click', function(){save();});
				}
			}
		});
	}else{
		$('#editBtn').bind('click', function(){save('Y');});
	}
}

/**
 * 	上传图片
 * @returns {boolean}
 */
function upload(){
	var animateimg = $('#uploadsc').val(); //获取上传的图片名 带//
	var imgarr=animateimg.split('\\'); //分割
	var myimg=imgarr[imgarr.length-1]; //去掉 // 获取图片名
	var houzui = myimg.lastIndexOf('.'); //获取 . 出现的位置
	var ext = myimg.substring(houzui, myimg.length).toUpperCase();  //切割 . 获取文件后缀
	var file = $('#uploadsc').get(0).files[0]; //获取上传的文件
	if (file == undefined || file == '' || file == null) {return false;}
	var fileSize = file.size;           //获取上传的文件大小
	var maxSize = 10240000;              //最大10MB
	if(ext !='.PNG' && ext !='.GIF' && ext !='.JPG' && ext !='.JPEG'){
		layer.msg('文件类型错误,请重新上传');
		return false;
	}else if(parseInt(fileSize) >= parseInt(maxSize)){
		layer.msg('上传的文件不能超过20MB,对您造成的不便敬请谅解,谢谢!');
		return false;
	}else{
		var data = new FormData($('#addForm')[0]);
		$.ajax({
			url: "/order/incomplain/imgupload/",
			type: 'POST',
			data: data,
			dataType: 'JSON',
			beforeSend: function () {
				layer.msg('加载中', {
					icon: 16
					,shade: 0.01
				});
			},
			complete: function () {

			},
			cache: false,
			processData: false,
			contentType: false
		}).done(function(ret){
			if(ret.code == true){
				console.log(ret);
				layer.msg('上传成功');
				$("#imageId").attr("src",ret.data.path);
				$("#imgPath").val(ret.data.path);
			}else{
				layer.msg('上传失败');
			}
		});
		return false;
	}
}
