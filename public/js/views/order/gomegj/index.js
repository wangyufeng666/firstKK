var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'ORDERTIME', width:'80px',sortable:false}
			,{header: "付款时间", dataIndex: 'PAYTIME', width:'80px',sortable:false}
			,{header: "渠道名称[类型]", dataIndex: 'CHANNELTYPE', width:'80px',sortable:false}
			,{header: "服务商名称", dataIndex: 'SERVICENAME', width:'80px',sortable:false}
			,{header: "工程师名称", dataIndex: 'ENGINEERNAME', width:'80px',sortable:false}
			,{header: "商品名称", dataIndex: 'MERNAME', width:'80px',sortable:false}
			,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTWAY']+'('+data['USERNAME']+')';
        		}
			} 
			,{header: "订单地址", dataIndex: 'ORDERADRESS', width:'140px',sortable:false}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false}
			,{header: "订单状态", dataIndex: 'ORDERSTATUS', width:'70px',sortable:false}
			,{header: "操作", dataIndex: '', width:'130px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERID'];
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}
		]
		,url : '/order/gomegj/pagelist'
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
	var orderType = $('#orderType').val();
	window.location.href = "/order/gomegj/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl+"&orderType="+orderType;
}


function getParams(){
	return {
		orderType:$('#orderType').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
        engineerName:$('#engineerName').val(),
        merType:$('#merType').val(),
        orderStatus:$('#orderStatus').val()        
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
		dialog:{msg:msg,type:8}
	});
}

function downloadExport(){
	var param = '';
	param += '&orderType=' + $('#orderType').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
    param += '&engineerName=' + $('#engineerName').val();
    param += '&merType=' + $('#merType').val();
    param += '&orderStatus=' + $('#orderStatus').val();
	window.location.href = '/order/gomegj/gomegjexport?'+param;
	return false; //截取返回false就不会保存网页了
}