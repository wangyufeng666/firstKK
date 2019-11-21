$(function () {
	$('#complainSubmit').bind('click', function(){userCallIn();});
	getCallInContent();
});

var content ='';
//初始化获取来电内容
function getCallInContent(){
	$.post('/call/record/getcallincontent',function(res){
		if (res.code == 1000){
			content = res.data;
		}
	})
}

var index = parent.layer.getFrameIndex(window.name);


var call_in_type ='';
//用户来电--来电类型
$('.callInType_div .callInType').bind('click', function(){callInType(this);});
function callInType(obj){
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected')
	}else{
		$(obj).siblings('.callInType').removeClass('selected');
		$(obj).addClass('selected');
		call_in_type = $(obj).attr('data-key');
		calInContent(call_in_type);
	}
	complainFlag = true;
}

//变更来电内容
function calInContent(call_in_type){
	var nowContent = content[call_in_type];
	var html = '';
	for(var val in nowContent){
		html += '<span class="callInContent" data-key='+val+'>'+nowContent[val]+'</span>';
	}
	$('.callInContent_div').html(html);
}


//用户来电--来电内容
$('.callInContent_div ').on('click','.callInContent',function () {
	callInContent(this);
});
function callInContent(obj){
	var isComplain = $(obj).attr('data-key');
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected');
	}else{
		// $(obj).siblings('.callInContent').removeClass('selected');
		$(obj).addClass('selected');
	}
	if (isComplain == 10){
		viewCallComplain();
	}
}

var complainFlag = true;
//用户来电显示隐藏
function viewCallComplain(){
	//判断是否为用户来电投诉
	if (complainFlag == true){
		$('.callInComplain').show();
		complainFlag = false;
	}else{
		$('.callInComplain').hide();
		complainFlag = true;
	}
}



//投诉内容
$('.onersl_div .remark_sl').bind('click', function(){clickTrigger1(this);});
function clickTrigger1(obj){
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected')
	}else{
		$(obj).siblings('.remark_sl').removeClass('selected');
		$(obj).addClass('selected');
	}
}

//投诉备案
$('.oners4_div .remark_s4').bind('click', function(){clickTrigger2(this);});
function clickTrigger2(obj){
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected')
	}else{
		$(obj).siblings('.remark_s4').removeClass('selected');
		$(obj).addClass('selected');
	}
}


//用户来电
function userCallIn(){
	$('#complainSubmit').unbind('click');

	var callInType = $(".callInType_div  .selected").attr('data-key');
	var callInContent = '';
	var callInDetail = $('#callInDetail').val();

	$(".callInContent_div .selected").each(function(){
		callInContent += $(this).attr('data-key')+',';
	});

	if (callInType == '' || callInType == null ){
		layer.msg('请选择来电类型!');
		$('#complainSubmit').bind('click', function(){userCallIn();});
		return false;
	}

	if (callInContent == '' || callInContent == null ){
		layer.msg('请选择来电内容!');
		$('#complainSubmit').bind('click', function(){userCallIn();});
		return false;
	}

	$.post('/call/record/usercallin',{
		contactWay:contactWay,callInType:callInType,callInContent:callInContent,
		callSource: callSource,callInDetail:callInDetail
	},function(res){
		if (res.code == 1000){
			//判断是否选择投诉
			if(callInContent.indexOf("10")!= -1){
				userCallInComplain(res.data);
			}else{
				layer.msg('提交成功');
				setTimeout("parent.layer.close(index);",2000);
			}
		}else{
			layer.msg('提交失败');
			$('#complainSubmit').bind('click', function(){userCallIn();});
		}
	})

}

//用户来电投诉
function userCallInComplain(callComplainId) {
	var callType = 1;
	var username = $('#username').val();
	var contentType = $(".onersl_div  .selected").attr('data-key');
	var contentRemark = $('#contentRemark').val();
	var complainFiling = $(".oners4_div  .selected").attr('data-key');
	var filingRemark = $('#filingRemark').val();
	$.post('/call/record/usercomplain',{
		contactWay:contactWay,username:username,callType:callType,
		contentType:contentType,contentRemark:contentRemark,
		complainFiling:complainFiling,filingRemark:filingRemark,
		callComplainId:callComplainId
	},function(res){
		if (res.code == 1000){
			layer.msg('提交成功');
			setTimeout("parent.layer.close(index);",2000);
		}else{
			layer.msg('提交失败');
		}

	})
}
