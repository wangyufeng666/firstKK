var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250,
		cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"销售日期", dataIndex:'SALEDATE', width:'80px',sortable:false}
			,{header:"销售单号", dataIndex:'SALENO', width:'100px',sortable:false}
			,{header:"旧机单号", dataIndex:'ORDERNO', width:'130px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'80px',sortable:false}
			,{header:"回收报价", dataIndex:'MERPRICE', width:'70px',sortable:false}
			,{header:"成交价格", dataIndex:'SETTLEPRICE', width:'70px',sortable:false}
			,{header:"人工加价", dataIndex:'PLUSPRICE', width:'70px',sortable:false}
			,{header:"销售价格", dataIndex:'SALEPRICE', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'', width:'130px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}
		]
		,url:'/sale/sale/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		saleNo:$('#saleNo').val(),
		orderType:$('#orderType').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val()
	};
}

function importsaleOrder(){
	layer.open({
		type:2,
		title:'导入销售订单',
		shadeClose:false,
		shade:0.8,
		content:'/sale/sale/import',
		area:['400px','300px'],
		close:function(index){
			layer.close(index);
			doSearch();
  	     }
	});
}

/**
 * 导出销售订单
 */
function downsaleOrder(){
	var param = '';
	param += 'merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&orderType=' + $('#orderType').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&saleNo=' + $('#saleNo').val();
	window.location.href = '/sale/sale/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function doSearch(){
	var params = getParams();
	params.start = 1;
	grid.query(params);
}
