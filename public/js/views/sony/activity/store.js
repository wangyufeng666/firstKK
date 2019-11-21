function fasong(){
	var orderNo = $('#prize').text();
	var status = $('#prizeStatus').val();
	if(confirm('确认发送大礼包吗？')){
		$.ajax({
			type:"POST",
			url:"/sony/storeorder/sendprize",
			data:{orderno:orderNo,status:status},
			cache:false,
			timeout:60000,
			async:false,
			dataType:"json",
			success:function(data){
				if(data == 'Y'){
					alert('发送成功！');
					window.location.href = window.location.href;
				}
			}
		});
	}
}
