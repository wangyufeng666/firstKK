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

//发券
$('#btnCoupon').click(function(){
	var orderNo = $('#orderNo').val();
	var couponName = $('#couponName').val();
	var couponValue = $('#couponValue').val();
	var params = {orderNo:orderNo, couponValue:couponValue, couponName:couponName};
	if(confirm('是否确认发放面额为'+couponValue+'元的'+couponName+'？')){
		if(couponValue > 0 ){
			var load1 = layer.load('保存中...');
			$.post('/order/mogujie/sendcoupon', params, function(data){
				if(data == 'Y'){
					successBox("发券成功");
				}else{
					errorBox('发券失败：'+data);
				}
				layer.close(load1);
				window.location.href = window.location.href;
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
	var couponFlag = $('#couponFlag').val();
	if(cashValue > 0){
		var src = '/order/mogujie/cashpaypage?orderNo='+orderNo+'&cash='+cashValue+'&couponFlag='+couponFlag;
		$.layer({type:2,title:'订单现金转账',iframe:{src:src},area:['500px','350px']});
	}else{
		errorBox('发券金额错误');
	}
});