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
					alert(data);
				}
			}
		);
	}else{
		layer.close(load1);
		alert('请输入备注信息');
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
		$.post('/idlefishv2/recyorder/pay', params, function(data){
			if(data == 'Y'){
				alert("转账成功");
				window.location.href = window.location.href;
			}else{
				alert('转账失败：'+data);
			}
		});
	}
});

/**
 * 尾款打款失败查询原因
 */
function payFailSearchReason(){
	var orderNo = $('#orderNo').val();
	var alipay_user_id = $('#alipay_user_id').val();
	layer.open({
		type:2,
		title:'打款失败原因详情',
		shadeClose:false,
		shade:0.8,
		content:'/idlefishv2/recyorder/payfailsearchreason?orderNo='+orderNo+'&alipay_user_id='+alipay_user_id,
		area:['500px','300px'],
		close:function(index){
			layer.close(index);
		}
	});
}