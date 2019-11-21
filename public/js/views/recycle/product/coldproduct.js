var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'20px',sortable:false} 
			,{header:"商品编码", dataIndex:'MERCODE', width:'30px',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'70px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'70px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'100px',sortable:false}
			,{header:"热度", dataIndex:'REDU', width:'30px',sortable:false}
			,{header:"下单时间", dataIndex:'DINGDANSHIJ', width:'100px',sortable:false}
			,{header:"报价时间", dataIndex:'PRICEDATE', width:'100px',sortable:false}
		]
		,url:'/recycle/product/coldpagelist'
		,baseParams:{merType:$('#merType').val(), days:$('#days').val()}
	});
});

function getParams(){
	return {
		merType:$('#merType').val(),
		days:$('#days').val(),
	};
}

function doSearch(){
	grid.query(getParams());
}

function exprot(){
	var param = '';
	param += '&merType=' + $('#merType').val();
	param += '&days=' + $('#days').val();
	window.location.href = '/recycle/product/exprotcold?'+param;
	return false; //截取返回false就不会保存网页了
}