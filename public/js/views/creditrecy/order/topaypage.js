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
					layer.alert(data);
				}
			}
		);
	}else{
		layer.close(load1);
		layer.alert('请输入备注信息');
	}
}

//结算
$('#btnCoupon').click(function(){
	
	var payPrice = $('#payPrice').val();
	var orderNo = $('#orderNo').val();
	var params = {orderNo:orderNo,payPrice:payPrice};
	
	var needAliAcountFlag = $('#needAliAcountFlag').val();
	if(needAliAcountFlag == 'Y'){
		var alipayAccount = $.trim($('#alipayAccount').val());
		var trueName = $.trim($('#trueName').val());
		
		if(alipayAccount == '' || trueName == ''){
			alert('请输入用户支付宝账号和真实姓名');
			return;
		}
		params.needAliAcountFlag = needAliAcountFlag;
		params.alipayAccount = alipayAccount;
		params.trueName = trueName;
	}

	if(payPrice > 0){
		var hinttext = '是否确认发放金额'+payPrice+'元？';
		if(creditPayFlag == 'N'){
			hinttext = '是否确认发放券'+payPrice+'元？'
		}
	}else{
		payPrice = 0 - payPrice;
		var hinttext = '是确认否代扣用户金额'+payPrice+'元？';
	}
	if(confirm(hinttext)){
		$.post('/creditrecy/order/lastpay', params, function(data){
			if(data == 'Y'){
				if(creditPayFlag == 'N'){
					layer.alert('发券成功');
				}else{
					layer.alert('转账成功');
				}
				window.location.href = window.location.href;
			}else{
				if(creditPayFlag == 'N'){
					layer.alert('发券失败：'+data);
				}else{
					layer.alert('转账失败：'+data);
				}
			}
		});
	}
});