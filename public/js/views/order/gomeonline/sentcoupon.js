function saveRemark(){
	var loadIndex = layer.msg('加载中', {icon:16, shade: 0.2, time:100000});
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
		layer.close(loadIndex);
		errorBox('请输入备注信息');
	}
}

//发券
$('#btnCoupon').click(function(){
	var orderNo = $('#orderNo').val();
	var params = {orderNo:orderNo};
	if(confirm('是否确认发券？')){
		$.post('/order/gomeonline/sendcoupon', params, function(data){
			if(data == 'Y'){
				layer.msg('发券成功', {icon: 6, shade: 0.2, time:5000});
				window.location.reload();
			}else{
				layer.alert('发券失败：'+data, {icon:5, shade: 0.2});
			}
		});
	}
});