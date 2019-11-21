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

//现金转账
$('#btnCash').click(function(){
	var orderNo = $('#orderNo').val();
	var cashValue = $('#cashValue').val();
	if(cashValue > 0){
		var src = '/order/mechrev/cashpaypage?orderNo='+orderNo+'&cash='+cashValue;
		$.layer({type:2,title:'订单现金转账',iframe:{src:src},area:['500px','350px']});
	}else{
		errorBox('发券金额错误');
	}
});