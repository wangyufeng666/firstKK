function saveRemark(){
	var load1 = layer.load('保存中...');
	var orderRemark = $.trim($('#orderRemark').val());
	var orderNo = $('#orderNo').val();
	if(orderRemark != ''){
		$.post('/order/order/insertremark',{orderNo:orderNo, orderRemark:orderRemark},
			function(data){
				if(data == 'Y'){
					window.location.reload();//刷新
				}else{
					alter(data);
				}
			}
		);
	}else{
		layer.close(load1);
		errorBox('请输入备注信息');
	}
}

//结算
$('#btnCoupon').click(function(){
	var payPrice = $('#payPrice').val();
	var orderNo = $('#orderNo').val();
	var params = {orderNo:orderNo,payPrice:payPrice};
	if(payPrice > 0){
		var hinttext = '是否确认发放金额'+payPrice+'元？';
	}else{
		payPrice = 0 - payPrice;
		var hinttext = '是确认否代扣用户金额'+payPrice+'元？';
	}
	if(confirm(hinttext)){
		$.post('/offline/creditorder/pay', params, function(data){
			if(data == 'Y'){
				successBox("转账成功");
				window.location.href = window.location.href;
			}else{
				errorBox('转账失败：'+data);
			}
		});
	}
});