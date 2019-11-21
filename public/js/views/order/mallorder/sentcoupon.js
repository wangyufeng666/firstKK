function saveRemark(){
	var load1 = layer.load('保存中...');
	var orderRemark = $.trim($('#orderRemark').val());
	var orderNo = $('#ORDERNO').val();
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

//发券
$('#btnCoupon').click(function(){
	var couponType = '';
	var couponPrice = 0;
	$('#coupons .coupon').each(function(){
		if($(this).hasClass('checked')){
			couponType = $(this).attr('typeId');
			couponPrice = $(this).attr('price');
		}
	});
	
	var couponValue = $('#couponValue').val();
	if(confirm('是否确认发放面额为'+couponValue+'元的乐视现金券？')){
		if(couponValue > 0 && couponValue == couponPrice){
			$.post('/order/mallorder/sendcoupon', {orderNo:$('#orderNo').val(), couponValue:couponValue, couponType:couponType}, function(data){
				if(data == 'Y'){
					successBox("发券成功");
					window.location.href = window.location.href;
				}else{
					errorBox('发券失败：'+data);
				}
			});
		}else{
			errorBox('发券金额错误');
		}
	}
});

//现金转账
$('#btnCash').click(function(){
	var orderNo = $('#orderNo').val();
	var cashValue = $('#cashValue').val();
	if(cashValue > 0){
		var src = '/order/mallorder/cashpaypage?orderNo='+orderNo+'&cash='+cashValue;
		$.layer({type:2,title:'订单现金转账',iframe:{src:src},area:['450px','320px']});
	}else{
		errorBox('发券金额错误');
	}
});