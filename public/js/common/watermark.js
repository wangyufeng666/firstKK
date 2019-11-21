$().ready(function(){
	$.post('/common/securitycode/watermark',{},function(data){
		$('body').css({'background':'url("'+data.img+'")'});
	});
});