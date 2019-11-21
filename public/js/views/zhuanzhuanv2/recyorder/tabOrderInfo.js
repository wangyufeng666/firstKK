var tab;
$().ready(function(){
	tab = $('#orderInfoTab').tab({
		initActiveTab:0
		,height:700
		,items:[
			{href:'/zhuanzhuanv2/recyorder/identifyorderinfo?orderNo='+orderNo, text:'订单基础信息'}
			,{href:'/idlefishpai/recyorder/orderinfo?orderNo='+orderNo, text:'转转寄卖订单信息'}
			,{href:'/zhuanzhuanv2/recyorder/reportpage?orderNo='+orderNo+'&reportNo='+reportNo, text:'鉴定报告'}
		]
	});
});