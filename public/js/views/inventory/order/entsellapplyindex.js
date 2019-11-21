var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'50px',sortable:false} 
			,{header:"订单编码", dataIndex:'ORDERNO', width:'170px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var url = '/order/order/orderinfo?orderNo='+data['ORDERNO']+'';
					return '<a href="javascript:orderInfo(\''+value+'\')" title="'+value+'" class="a_link">'+value+'</a>';
				}
			}
			,{header:"申请日期", dataIndex:'APPLYDATE', width:'120px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'120px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"订单状态", dataIndex:'APPLYSTATUSNAME', width:'100px',sortable:false}
			,{header:"操作", dataIndex:'', width:'120px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var status = data['INVENTORYSTATUS'];
					var returnText ='<a class="a_link" href="javascript:orderInfo(\''+data['ORDERNO']+'\')">查看</a>';
		        	return returnText;
				}
			}
		]
		,url:'/inventory/order/applylist'
		,baseParams:{applySource:5}
	});
});

/**
 * 订单详情
 */
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?backUrl=/inventory/order/interiorapplyindex&orderNo="+orderNo;
}

/**
 * 批量出库
 */
function applyoutWarehouses(applySource){
	window.location.href = "/inventory/order/applyoutwarehousesindex?applySource="+applySource;
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(),
    	applySource:'5',
    	applyStatus:$('#applyStatus').val(),
    	merName:$('#merName').val(),
    	category:$('#category').val(),
    	merType:$('#merType').val(),
        startApplyDate:$('#startApplyDate').val(),
        endApplyDate:$('#endApplyDate').val()
    };
}

function doSearch(){
    grid.query(getParams());
}

function downloadOrder(){
	var param = 'applySource=5';
	param += '&orderNo=' + $('#orderNo').val();
	param += '&applyStatus=' + $('#applyStatus').val();
	param += '&merName=' + $('#merName').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&startApplyDate=' + $('#startApplyDate').val();
	param += '&endApplyDate=' + $('#endApplyDate').val();
	window.location.href = '/inventory/order/applyorderexport?'+param;
	return false; //截取返回false就不会保存网页了
}