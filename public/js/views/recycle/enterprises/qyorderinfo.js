
//修改状态
function updateStatus(ordercode,status,statusold){
	$.post('/recycle/enterprises/updatestatus',{ordercode:ordercode,status:status,statusold:statusold},function(data){
		if(data == 'Y'){
			window.location.reload();
		}else{
			alter(data);
		}
	});
}

/**
 * 添加备注
 */
$("#saveRemark").on('click',function(){
	var remarks = $.trim($('#remarks').val()),ordercode = $('#ordercode').text();
	if(remarks != ''){
		$.post('/recycle/enterprises/insertremark',{ordercode:ordercode,remarks:remarks},function(data){
			if(data == 'Y'){
				window.location.reload();
			}else{
				alter(data);
			}
		});
	}else{
		alert('请输入备注信息');
	}
});

/**
 * 修改预约时间
 */
$("#updateServiceDate").on('click',function(){
	var servicedate = $('#servicedate').val(),ordercode = $('#ordercode').text();
	if(servicedate != ''){
		$.post('/recycle/enterprises/updateservicedate',{ordercode:ordercode,servicedate:servicedate},function(data){
			if(data == 'Y'){
				window.location.reload();
			}else{
				alter(data);
			}
		});
	}else{
		alert('请输入预约时间');
	}
});

/**
 * 修改订单详情
 */
$("#updateDetail").on('click',function(){
	var details = $('#details').val(),ordercode = $('#ordercode').text();
	if(details != ''){
		$.post('/recycle/enterprises/updatedetail',{details:details,ordercode:ordercode},function(data){
			if(data == 'Y'){
				window.location.reload();
			}else{
				alter(data);
			}
		});
	}else{
		alert('请输入订单详情');
	}
});

/**
 * 修改订单金额
 */
$("#updatePrice").on('click',function(){
	var prices = $('#prices').val(),ordercode = $('#ordercode').text();
	if(prices != ''){
		$.post('/recycle/enterprises/updateprice',{prices:prices,ordercode:ordercode},function(data){
			if(data == 'Y'){
				window.location.reload();
			}else{
				alter(data);
			}
		});
	}else{
		alert('请输入金额');
	}
});
