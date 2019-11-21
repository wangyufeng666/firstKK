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
	var params = {orderNo:orderNo};
	if(confirm('是否确认发券？')){
		$.post('/order/jdorder/sendcoupon', params, function(data){
			if(data == 'Y'){
				successBox("发券成功");
				window.location.href = window.location.href;
			}else{
				errorBox('发券失败：'+data);
			}
		});
	}
});