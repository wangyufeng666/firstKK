var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :50,
		height:350
		,cm:[
			{header: "No.", dataIndex: 'R', width:'50PX',sortable:false} 
			,{header: "商品ID", dataIndex: 'MERID', width:'180px',sortable:false}
			,{header: "苏宁商品ID", dataIndex: 'ITEMCODE', width:'100px',sortable:false}
			,{header: "苏宁商品名", dataIndex: 'P_MERNAME', width:'100px',sortable:false}
			,{header: "商品最高价格", dataIndex: 'MAXPRICE', width:'100px',sortable:false}
			,{header: "商品均价", dataIndex: 'AVERAGEPRICE', width:'100px',sortable:false}
		]
		,url : '/order/suning/pushpricelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = new Array();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}


function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg,type:8}
	});
}

function averagePricePushSuning(){
	var params = {};
	if(confirm('推送此页商品均价给苏宁？')){
		$.post('/order/suning/averagepricepushsuning', params, function(data){
			if(data['pushFlag'] == 'Y'){
				successBox("推送成功");
			}else{
				alert('推送失败：'+data['renderText']);
			}
			window.location.href = '/order/suning/pushindex?backFlag=Y';
		});
	}
}
