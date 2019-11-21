$().ready(function(){

	$('.saveMerBtn').bind('click', function(){saveMerInfo($(this).attr('id'));});
	
	//表单验证
	$('#addForm').validate({
		rules:{
		}
		,messages:{
		}
	});
	

});

/**
 * 保存商品信息
 * @param thisAttrId
 * @returns
 */
function saveMerInfo(thisAttrId){
	$('.saveMerBtn').unbind('click');
	if($("#addForm").valid()){
		var mini = parseInt($('#mini_choose').val());
		var big = parseInt($('#big_choose').val());
		var count = parseInt($('#count').text());
		var mini_count = parseInt($('#mini').text());
		var big_count = parseInt($('#big').text());
		$('#mini').text(mini_count - mini);
		$('#big').text(big_count - big);
		count = count - ( mini + big );
		$('#count').text(count);
		window.location.href='/device/index/export?mini='+mini+'&big='+big;
	}else{
		$('.saveRecyBtn').bind('click', function(){saveMerInfo($(this).attr('id'));});
	}
}


function goBack(){
    parent.reload();
}

$('#big_choose').blur(function(){
	var max_num = $(this).parent().prev().children().text();
	var num = $(this).val();
	if(num > max_num) {
		$(this).val('0');
		alert('暂无库存')
	}else {
		getDevice(2,num);
	}
})

$('#mini_choose').blur(function(){
	var max_num = $(this).parent().prev().children().text();
	var num = $(this).val();
	if(num > max_num) {
		$(this).val('0');
		alert('暂无库存')
	}else {
		getDevice(1,num);
	}
})

var mini_uploading = false;
$('#mini_file').on('change',function(){
	if(mini_uploading){
		alert("文件正在上传中，请稍候");
		return false;
	}
	var fileObj = document.getElementById("mini_file").files[0];
	console.log(fileObj);
	var formdata = new FormData();
	formdata.append('file',fileObj);
	console.log(formdata);
	//console.log($('#mini_file').files[0]);
	var data = formdata
	debugger;
	$.ajax({
		url: "/device/index/upload",
		type: 'POST',
		cache: false,
		data: data,
		processData: false,
		contentType: false,
		dataType:"json",
		beforeSend: function(){
			mini_uploading = true;
		},
		success : function(data) {
			if (data.code == 200) {
				var html = '';
				for(var i in data.data) {
					html += '<span>'+data.data[i]+'</span>';
				}
				var mini_count = parseInt($('#mini').text());
				if(mini_count < data.data.length) {
					alert('库存不足，请重新选择对应设备！');
					resetFileInput($('#mini_file'));
				}else {
					$('.mini_box').html(html);
				}
			} else {
				alert(data.msg);
			}
			mini_uploading = false;
		}
	});
})

var big_uploading = false;
$('#big_file').on('change',function(){
	if(big_uploading){
		alert("文件正在上传中，请稍候");
		return false;
	}
	var fileObj = document.getElementById("big_file").files[0];
	var formdata = new FormData();
	formdata.append('file',fileObj);
	var data = formdata
	debugger;
	$.ajax({
		url: "/device/index/upload",
		type: 'POST',
		cache: false,
		data: data,
		processData: false,
		contentType: false,
		dataType:"json",
		beforeSend: function(){
			big_uploading = true;
		},
		success : function(data) {
			if (data.code == 200) {
				var html = '';
				for(var i in data.data) {
					html += '<span>'+data.data[i]+'</span>';
				}
				var mini_count = parseInt($('#big').text());
				if(mini_count < data.data.length) {
					alert('库存不足，请重新选择对应设备！');
					resetFileInput($('#mini_file'));
				}else {
					$('.big_box').html(html);
				}
			} else {
				alert(data.msg);
			}
			big_uploading = false;
		}
	});
})
function resetFileInput(file){
	file.after(file.clone().val(""));
	file.remove();
}

function getDevice(type,num) {
	$.ajax({
		url:'/device/index/ajaxoutdevice',
		type:'post',
		data:{flag:type,num:num},
		dataType:'json',
		success:function(data) {

			if(type == 1) {
				var html = '';
				for(var i in data) {
					html += '<span>'+data[i].DEVICEID+'</span>';
				}
				$('.mini_box').html(html);
			}else {
				var html = '';
				for(var i in data) {
					html += '<span>'+data[i].DEVICEID+'</span>';
				}
				$('.big_box').html(html);
			}
		}
	})
}

