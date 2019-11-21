$().ready(function(){
	$('#btn_submit').bind('click' ,function(){formSubmit();});
	
	var _ua = navigator.userAgent;
	_ua = _ua.toLowerCase();
	if(_ua.indexOf('iphone') > -1 && _ua.indexOf('safari') > -1){
		$('.maincontainer').removeClass('androidFlag');
	}
	$('#clauseImg').click(function(){
		if($(this).attr('data-flag') == 'Y'){
			$(this).attr('data-flag', 'N');
			$(this).attr('src', '/images/offlinem/icon/unchecked.png');
		}else{
			$(this).attr('data-flag', 'Y');
			$(this).attr('src', '/images/offlinem/icon/checked.png');
		}
	});
	$.post('/api/inquiry/editip',{inquiryid:$('#inquiryId').val()},function(data){});
	
	$('.coupons .item').click(function(){
		if($(this).hasClass('selected')){
			
		}else{
			$('.coupons .item').removeClass('checked');
			$(this).addClass('checked');
			$('#eventCode').val($(this).attr('data-code'));
			$('#couponName').html($(this).attr('data-name'));
			$('#couponDesc').html($(this).attr('data-desc'));
			$('#orderPriceText').html($(this).attr('data-price'));
		}
	});
});

function formSubmit(){
	$('#btn_submit').unbind('click');
	if($('#clauseImg').attr('data-flag') != 'Y'){
		layer.open({content:'<div class="tiptext">请阅读并同意回收服务条款</div>', time:2});
		$('#btn_submit').bind('click' ,function(){formSubmit();});
		return;
	}
	
	var index = layer.open({type: 2});
	
	var inquiryId = $('#inquiryId').val();
	var eventCode = $('#eventCode').val();
	
	if(inquiryId && eventCode){
		$.post('/offlinem/order/eventchange',{inquiryId:inquiryId,eventCode:eventCode},function(d){
			if(d == 'Y'){
				var spId = $('#spId').val();
				var salt = $('#salt').val();
				window.location.href = '/offlinem/order/createorder?spid='+spId+'&inquiryId='+inquiryId+'&salt='+salt;
			}else{
				layer.close(index);
				$('#btn_submit').bind('click' ,function(){formSubmit();});
			}
		});
	}else{
		layer.close(index);
		$('#btn_submit').bind('click' ,function(){formSubmit();});
	}
}

function merInit(){
	window.location.href = '/offlinem/inquiry/init?spid='+$('#spId').val();
}

