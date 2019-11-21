var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
	     	{checkbox:true}
			,{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单编号", dataIndex: 'ORDERNO', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'130px',sortable:false}
			,{header: "品牌", dataIndex: 'PNAME', width:'150px',sortable:false}
			,{header: "下单时间", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "订单金额", dataIndex: 'ORDERPRICE', width:'80px',sortable:false}
			,{header: "操作", dataIndex: '', width:'200px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '';
					return returnText;
				}
			}
		]
		,url:'/order/gomestatistics/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	var params = getParams();
	params.start = start;
	params.limit = limit;
	return params;
}



function getParams(){
	return {
		startDate:startDate,
		endDate:endDate,
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}
	});
}