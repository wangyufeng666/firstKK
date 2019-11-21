var tab;
$().ready(function(){
	tab = $('#orderInfoTab').tab({
		initActiveTab:0
		,height:500
		,items:[
			{href:'/identify/ifishorder/orderinfo?orderNo='+orderNo, text:'订单基础信息'}
			,{href:'/identify/ifishorder/extorderinfo?orderNo='+orderNo, text:'闲鱼订单信息'}
			,{href:'/identify/ifishorder/reportpage?orderNo='+orderNo+'&reportNo='+reportNo, text:'鉴定报告'}
			,{href:'/identify/order/orderremark?orderNo='+orderNo, text:'订单备注'}
		]
	});
});
