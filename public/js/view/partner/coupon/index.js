function useCopon(){
	var couponCode = $('#couponCode').val();
	if(couponCode != '' && couponCode != null){
		$.post('/partner/coupon/usecoupon',{couponCode:couponCode},function(data){
			if(data == 'Y'){
				showTips("使用成功",'Y');
			}else{
				showTips(data,'N');
			}
		});
	}else{
		showTips('请输入卡券兑换码');
	}
}

function showTips(text,flage){
	var html = '';
	var url = '';
	$('.slide_mark').empty();
	if(flage == 'Y'){
		url = '/images/offlinem/icon/icon_success.png';
	}else{
		url = '/images/offlinem/icon/icon_fail.png';
	}
	html += '<div class="tip_box">';
	html += '<div class="tip_img"><img src="'+url+'" /></div>';
	html += '<div class="text">'+text+'</div>';
	html += '<div class="slide_yes"><img class="reload" src="/images/offlinem/icon/icon_yes.png" /></div>';
	html += '</div>';
	$('.slide_mark').show().append(html);
}

$('.slide_mark').delegate('.reload','click',function(){
	$('.slide_mark').empty().hide();
	$('#couponCode').val('');
	location.reload();
})

function doSeach(){
	var contacts = $("#contacts").val();
	var mobile = $("#mobile").val();
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	window.location.href = '/partner/coupon?contacts='+contacts+'&mobile='+mobile+'&startTime='+startTime+'&endTime='+endTime;
}