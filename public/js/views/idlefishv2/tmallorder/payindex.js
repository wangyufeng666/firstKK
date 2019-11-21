var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"创建日期", dataIndex:'CREATEDATE', width:'140px',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'160px',sortable:false}
			,{header:"闲鱼单号", dataIndex:'BIZ_ORDER_ID', width:'240px',sortable:false}
			,{header:"发放金额", dataIndex:'AMOUNT', width:'140px',sortable:false}
			,{header:"红包类型", dataIndex:'TYPENAME', width:'180px',sortable:false}
			,{header:"发放场景", dataIndex:'FLAGNAME', width:'80px',sortable:false}
			,{header:"发放状态", dataIndex:'STATUSNAME', width:'130px',sortable:false}
			,{header:"操作", dataIndex:'ORDERNO', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:payInfo(\''+value+'\')">详情</a>';
					return returnText;
				}
			}
		]
		,url:'/idlefishv2/tmallorder/redpaypagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});
function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		return params;
	}else{
		return {};
	}
}

function downloadPayExport(){
	var param = '';
	param += '&orderNo=' + $('#orderno').val();
	param += '&partnerNo=' + $('#partnerno').val();
	param += '&createdate_start=' + $('#createdate_start').val();
	param += '&createdate_end=' + $('#createdate_end').val();
	param += '&type=' + $('#type').val();
	param += '&pay_type=' + $('#pay_type').val();
	param += '&pay_status=' + $('#pay_status').val();
	window.location.href = '/idlefishv2/tmallorder/payexport?'+param;
	return false;
}

function brokerageExport(){
	var param = '';
	param += '&startDate=' + $('#createdate_start').val();
	param += '&endDate=' + $('#createdate_end').val();
	window.location.href = '/idlefishv2/tmallorder/brokerage?'+param;
	return false;
}

/**
 * 详情
 */
function payInfo(ORDERNO){
	window.location.href = "/order/order/orderinfo?orderNo="+ORDERNO+"&backUrl="+backUrl;
}

function goBack(){
	window.history.go(-1);
}
function getParams(){
    return {
    	orderNo:$('#orderno').val(),
    	partnerNo:$('#partnerno').val(),
    	createdate_start:$('#createdate_start').val(),
    	createdate_end:$('#createdate_end').val(),
    	type:$('#type').val(),
    	pay_type:$('#pay_type').val(),
    	pay_status:$('#pay_status').val()
    };
}
function doSearch(){
    grid.query(getParams());
}
