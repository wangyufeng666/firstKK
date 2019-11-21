var orderNos = $("#orderNos").val();
function addBank(){
	window.location.href = '/offlinem/bank/applyblan?orderNos='+orderNos;
}

$().ready(function(){
	$('.unApproval').click(function(e){
		stopEvent(e);
		var pkId = $(this).attr('data-id');
		window.location.href="/offlinem/bank/deletebank?pkId="+pkId;
	});
	
	$('.promoterBox').click(function(){
		var bankCode = $(this).attr('data-bankCode');
		window.location.href='/offlinem/bank/getbankmonery?bankCode='+bankCode+'&orderNos='+orderNos;
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

