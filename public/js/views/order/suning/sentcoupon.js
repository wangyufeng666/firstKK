function saveRemark(){
	var orderRemark = $.trim($('#orderRemark').val());
	var orderNo = $('#ORDERNO').val();
	if(orderRemark == ''){
		alert('请输入备注信息');
		return;
	}
	var load1 = layer.load('保存中...');
	$.post('/order/order/insertremark',{orderNo:orderNo, orderRemark:orderRemark},
		function(data){
			layer.close(load1);
			if(data == 'Y'){
				window.location.reload();//刷新
			}else{
				alter(data);
			}
		}
	);
}

//发劵请求后到20确认支付状态，不会真正去发劵操作
$('#btnCoupon').click(function(){
	var orderNo = $('#orderNo').val();
	var params = {orderNo:orderNo};
	if(confirm('该订单是否有发劵需求？')){
		$.post('/order/suning/sendcoupon', params, function(data){
			if(data == 'Y'){
				window.location.reload();
			}else{
				alert('提交失败：'+data);
			}
		});
	}
});

//确认支付后会向苏宁提供价格，苏宁会立马打款操作
$('#conCoupon').click(function(){
	var orderNo = $('#orderNo').val();
	var params = {orderNo:orderNo};
	if(confirm('是否确认支付？')){
		$.post('/order/suning/sendcoupon', params, function(data){
			if(data == 'Y'){
				window.location.reload();
			}
		});
	}
});