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
		$.post('/zhimaapp/recyorder/pay', params, function(data){
			if(data == 'Y'){
				successBox("转账成功");
				window.location.href = window.location.href;
			}else{
				errorBox('转账失败：'+data);
			}
		});
	}
});

//修改名字
$('#updateName').click(function(){
	var alipayName = $('#alipayName').val();
	var orderNo = $('#orderNo').val();
	var params = {orderNo:orderNo,alipayName:alipayName};
	if(alipayName){
		var hinttext = '是否确认修改支付名字';
	}else{
		var hinttext = '名字不能为空';
	}
	if(confirm(hinttext)){
		if(alipayName){
			$.post('/zhimaapp/recyorder/updatename', params, function(data){
				if(data == 'Y'){
					successBox("修改成功");
					window.location.href = window.location.href;
				}else{
					errorBox('修改失败：'+data);
				}
			});
		}
	}
});