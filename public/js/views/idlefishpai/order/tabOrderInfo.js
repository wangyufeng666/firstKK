var tab;
$().ready(function(){
	tab = $('#orderInfoTab').tab({
		initActiveTab:0
		,height:700
		,items:[
			{href:'/idlefishpai/order/identifyorderinfo?orderNo='+orderNo, text:'订单基础信息'}
			,{href:'/idlefishpai/order/orderinfo?orderNo='+orderNo, text:'闲鱼拍卖订单信息'}
			,{href:'/idlefishpai/order/reportpage?orderNo='+orderNo+'&reportNo='+reportNo, text:'鉴定报告'}
		]
	});
});