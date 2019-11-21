function getParams(){
	return {
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
	};
}

function doSearch(){
	var data = getParams();
	$.ajax({type:'POST', dataType:'json',data:data,
		url:'/order/gomestatistics/search',
		success:function(data){
			$('#order_count').html(data.order_count.count);
			$('#order_money_count').html(data.order_count.money_count);
			$('#ticket_count').html(data.ticket_count.count);
			$('#ticket_money_count').html(data.ticket_count.money_count);

		}
	});
}

function showOrder() {
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	$.layer({
		type:2,
		title:'订单列表',
		iframe:{src:"/order/gomestatistics/orderlist?startDate="+startDate+"&endDate="+endDate},
		area:['90%','90%'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

function showTicket() {
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	$.layer({
		type:2,
		title:'订单列表',
		iframe:{src:"/order/gomestatistics/ticketlist?startDate="+startDate+"&endDate="+endDate},
		area:['90%','90%'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}