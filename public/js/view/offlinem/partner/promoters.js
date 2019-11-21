
$().ready(function(){
	$('.unApproval').click(function(e){
		stopEvent(e);
		var promoterId = $(this).attr('data-id');
		window.location.href="/offlinem/partner/approval?promoterId="+promoterId;
	});
	
	$('.promoterBox').click(function(){
		var promoterCode = $(this).attr('data-promoCode');
		var partnerCode = $(this).attr('data-partnerCode');
		window.location.href="/offlinem/trade/promoterorders?promoCode="+promoterCode+"&partnerCode="+partnerCode;
	});
	
	function stopEvent(event){ //阻止冒泡事件
		//取消事件冒泡
		var e=arguments.callee.caller.arguments[0]||event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
		if (e && e.stopPropagation) {
			// this code is for Mozilla and Opera
			e.stopPropagation();
		} else if (window.event) {
			// this code is for IE
			window.event.cancelBubble = true;
		}
	}
});
