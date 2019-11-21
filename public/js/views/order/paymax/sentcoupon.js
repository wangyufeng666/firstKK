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
	var orderNo = $('#orderNo').val();
	var orderStatus = $('#orderStatus').val();
	var params = {orderNo:orderNo,orderStatus:orderStatus};
	if(orderStatus=='4'){
		var test= '是否确认付款？是，订单状态将变为确认支付';
	}else if(orderStatus=='20'){
		var test= '是否确认支付？是，订单状态将变为待入库状态';
	}
	if(confirm(test)){
		$.post('/order/paymax/sendcoupon', params, function(data){
			if(data == 'Y'){
				successBox("操作成功");
				window.location.href = window.location.href;
			}else{
				errorBox('操作失败：'+data);
			}
		});
	}
});