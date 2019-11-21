$(document).ready(function(){

	username = parent.username;//获取Iframe 父元素的用户名
	contactWay =parent.contactWay;//获取Iframe 父元素的手机号
	orderNo =parent.orderNo;//获取Iframe 父元素的手机号
	callSource =parent.callSource;//获取Iframe 父元素的来源

	$(".tab-item").click(function (){
		$(this).addClass("active").siblings().removeClass("active");
		var idx = $(this).index();
		$(".main").eq(idx).addClass("selected").siblings().removeClass("selected");
	});

	$('#newComplain').bind('click', function(){newComplain();});
	$('#complainDeal').bind('click', function(){complainDeal();});
	$('#userCallIn').bind('click', function(){userCallIn();});

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

//新建投诉-客诉内容
$('.onersl_div .onersl').bind('click', function(){clickTrigger1(this);});
function clickTrigger1(obj){
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected')
	}else{
		$(obj).siblings('.onersl').removeClass('selected');
		$(obj).addClass('selected');
	}
}


//新建投诉
function newComplain(){
	$('#newComplain').unbind('click');
	var callType = 2;
	var contentType = $('.onersl_div  .selected').attr('data-key');
	var contentRemark = $('#contentRemark').val();
	var complainType = $('#complainType').val();
	var complainLevel = $('#complainLevelType').val();
	var liablePerson = $('#liablePerson').val();

	$.post('/call/record/usercomplain',{
		callType:callType,orderNo:orderNo, contactWay:contactWay,username:username,
		contentType:contentType,contentRemark:contentRemark,complainType:complainType,
		complainLevel:complainLevel,liablePerson:liablePerson
	},function(res){
		if (res.code == 1000){
			layer.msg('提交成功',2,9);
			setTimeout(function () {
				window.location.reload();
			},3000);
		}else{
			layer.msg('提交失败');
			$('#newComplain').bind('click', function(){newComplain();});
		}
	})
}


//投诉处理-处理方案
$('.tworsl_div .tworsl').bind('click', function(){clickTrigger2(this);});
function clickTrigger2(obj){
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected')
	}else{
		$(obj).siblings('.tworsl').removeClass('selected');
		$(obj).addClass('selected');
	}
}

//投诉处理-处理结果
$('.twors4_div .twors4').bind('click', function(){clickTrigger3(this);});
function clickTrigger3(obj){
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected')
	}else{
		$(obj).siblings('.twors4').removeClass('selected');
		$(obj).addClass('selected');
	}
}

//投诉处理
function complainDeal(){
	$('#complainDeal').unbind('click');
	var callType = 2;
	var dealPlanType = $(".tworsl_div  .selected").attr('data-key');
	var dealPlanRemark = $('#dealPlanRemark').val();
	var complainMoney = $('#complainMoney').val();
	var dealResultType = $(".twors4_div  .selected").attr('data-key');
	var dealResultRemark = $('#dealResultRemark').val();

	$.post('/call/record/usercomplain',{
		callType:callType,orderNo:orderNo, contactWay:contactWay,username:username,
		dealPlanType:dealPlanType,dealPlanRemark:dealPlanRemark,complainMoney:complainMoney,
		dealResultType:dealResultType,dealResultRemark:dealResultRemark
	},function(res){
		if (res.code == 1000){
			layer.msg('提交成功',2,9);
						setTimeout(function () {
				window.location.reload();
			},3000);
		}else{
			layer.msg('提交失败');
			$('#complainDeal').bind('click', function(){complainDeal();});
		}
	})
}

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

//用户来电--客诉内容
$('.threers2_div .threers2').bind('click', function(){clickTrigger4(this);});
function clickTrigger4(obj){
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected')
	}else{
		$(obj).siblings('.threers2').removeClass('selected');
		$(obj).addClass('selected');
	}
}

//用户来电--处理方案
$('.threers6_div .threers6').bind('click', function(){clickTrigger5(this);});
function clickTrigger5(obj){
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected')
	}else{
		$(obj).siblings('.threers6').removeClass('selected');
		$(obj).addClass('selected');
	}
}

//用户来电--处理结果
$('.threers8_div .threers8').bind('click', function(){clickTrigger6(this);});
function clickTrigger6(obj){
	if ($(obj).hasClass('selected')){
		$(obj).removeClass('selected')
	}else{
		$(obj).siblings('.threers8').removeClass('selected');
		$(obj).addClass('selected');
	}
}

//用户来电
function userCallIn(){
	$('#userCallIn').unbind('click');

	var callInType = $(".callInType_div  .selected").attr('data-key');
	var callInDetail = $('#callInDetail').val();
	var callInContent = '';
	$(".callInContent_div .selected").each(function(){
		callInContent += $(this).attr('data-key')+',';
	});

	if (callInType == '' || callInType == null ){
		layer.msg('请选择来电类型!');
		$('#userCallIn').bind('click', function(){userCallIn();});
		return false;
	}

	if (callInContent == '' || callInContent == null ){
		layer.msg('请选择来电内容!');
		$('#userCallIn').bind('click', function(){userCallIn();});
		return false;
	}

	$.post('/call/record/usercallin',{
		orderNo:orderNo,contactWay:contactWay,username:username,callInType:callInType,
		callInContent:callInContent,callSource:callSource,callInDetail:callInDetail
	},function(res){
		if (res.code == 1000){
			//判断是否选择投诉
			if(callInContent.indexOf("10")!= -1){
				userCallInComplain(res.data);
			}else{
				layer.msg('提交成功',2,9);
				setTimeout(function () {
					window.location.reload();
				},3000);
			}
		}else{
			layer.msg('提交失败');
			$('#userCallIn').bind('click', function(){userCallIn();});
		}
	})
}

//用户来电投诉
function userCallInComplain(callComplainId) {
	var callType = 1;
	var contactWay1 = $('#inContactWay').val();

	if (contactWay1 == '' || contactWay1 == null || contactWay1 == 'underfine'){
		contactWay1 = contactWay;
	}
	var contentType = $(".threers2_div  .selected").attr('data-key');
	var contentRemark = $('#inContentRemark').val();
	var complainType = $('#InComplainType').val();
	var complainLevel = $('#InComplainLevelType').val();
	var dealPlanType = $(".threers6_div  .selected").attr('data-key');
	var dealPlanRemark = $('#inDealPlanRemark').val();
	var dealResultType = $(".threers8_div  .selected").attr('data-key');
	var dealResultRemark = $('#inDealResultRemark').val();

	$.post('/call/record/usercomplain',{
		callType:callType,orderNo:orderNo,contactWay:contactWay1,username:username,contentType:contentType,contentRemark:contentRemark,
		complainType:complainType,complainLevel:complainLevel,dealPlanType:dealPlanType,dealPlanRemark:dealPlanRemark,
		dealResultType:dealResultType,dealResultRemark:dealResultRemark,callComplainId:callComplainId
	},function(res){
		if (res.code == 1000){
			layer.msg('提交成功',2,9);
			setTimeout(function () {
				window.location.reload();
			},3000);
		}else{
			layer.msg('提交失败');
			$('#userCallIn').bind('click', function(){userCallIn();});
		}
	})
}

