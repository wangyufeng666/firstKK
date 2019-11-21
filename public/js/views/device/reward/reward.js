var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"订单号", dataIndex:'ORDERNO', width:'150px',sortable:false}
			,{header:"奖励时间", dataIndex:'SENDDATE', width:'120px',sortable:false}
			,{header:"奖励金额", dataIndex:'REWARDPRICE', width:'60px',sortable:false}
			,{header:"奖励类型", dataIndex:'PRICEFLAGNAME', width:'100px',sortable:false}
			,{header:"奖励所属", dataIndex:'REWARDGETNAME', width:'100px',sortable:false}
			,{header:"店员", dataIndex:'NAME', width:'100px',sortable:false}
			,{header:"所属合作商", dataIndex:'PARTNERNAME', width:'120px',sortable:false}
			,{header:"所属代理商", dataIndex:'COMPANYNAME', width:'120px',sortable:false}
			,{header:"奖励状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header: "操作", dataIndex: '', width:'100px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="orderInfo(\''+data['ORDERNO']+'\')">订单详情</a>';
				  	return returnText;
				}
			}
		]
		,url:'/device/reward/pagelist'
		,baseParams:initParams()
	});
});

function initParams(){
	var params = getParams();
	params['batchCode'] = $('#batchCode').val();
	if(backFlag == 'Y'){
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}
	return params;
}

function getParams(){
	return {
		agents:$('#agents').val(),
		partnerName:$('#partnerName').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		priceFlag:$('#priceFlag').val(),
		status:$('#status').val(),
		orderNo:$('#orderNo').val(),
		rewardGet:$('#rewardGet').val(),
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

/**
 * 订单详情
 * @param deviceid
 * @returns
 */
function orderInfo(orderNo) {
	window.location.href = '/order/device/orderinfo?orderNo='+orderNo+'&backUrl='+backUri;
}

function rewardExport(){
	var param = '';
	param += '&agents=' + $('#agents').val();
	param += '&partnerName=' + $('#partnerName').val();
	param += '&startDate=' + $('#startDate').val();	
	param += '&endDate=' + $('#endDate').val();
	param += '&priceFlag=' + $('#priceFlag').val();
	param += '&status=' + $('#status').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&rewardGet=' + $('#rewardGet').val();
	window.location.href = '/device/reward/rewardexport?'+param;
	return false; //截取返回false就不会保存网页了
}

