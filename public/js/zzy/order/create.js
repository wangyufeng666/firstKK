var height1 = $('.attr_type').height();
var height2 = $('.select_detaial').height();
var pad = (height2 - height1)/2;
$('.attr_type').css('padding',''+pad+'px 0.2rem');

$().ready(function(){
	$('#submit_btn').bind("click",function(){orderSubmit();});
	$('.terms_box .checkbox').bind('click',function(){
		if($(this).hasClass('checked')){
			$(this).removeClass('checked');
		}else{
			$(this).addClass('checked');
		}
	});
});

//提交订单
function orderSubmit(){
	$('#submit_btn').unbind('click');
	var submitFlag = true;
	
	if(submitFlag && !zhimaFlag){//芝麻信用
		errorTip('您的信用额度不足换个模式支付吧！');
		submitFlag = false;
	}
	
	if(submitFlag && !addressFlage){//个人信息
		errorTip('请添加联系人信息哟！');
		submitFlag = false;
	}
	
    if($('.terms_box .checkbox').hasClass('checked')){
	  
    }else{
		errorTip('请同意有得卖服务条款！');
		submitFlag = false;
    }
	
	if(submitFlag){
		$('#orderForm').submit();
	}else{
		$('#submit_btn').bind("click",function(){orderSubmit();});
	}
}

function errorTip(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}
