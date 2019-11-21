var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			  ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'150px',sortable:false}
			  ,{header: "订单编号", dataIndex: 'ORDERNO', width:'160px',sortable:false}
			  ,{header: "转账单号", dataIndex: 'ORDER_ID', width:'250px',sortable:false}
			  ,{header: "支付编号", dataIndex: 'YDMPAYNO', width:'250px',sortable:false}
			  ,{header: "支付金额", dataIndex: 'PAY_PRICE', width:'80px',sortable:false}
			  ,{header: "支付时间", dataIndex: 'PAY_DATE', width:'150px',sortable:false}
			  ,{header: "支付类型", dataIndex: 'TYPE_EXT', width:'80px',sortable:false}
			  ,{header: "支付状态", dataIndex: 'STATUS_EXT', width:'80px',sortable:false}
			  ,{header: "IP", dataIndex: 'IP', width:'100px',sortable:false}
			  ,{header: "操作", dataIndex: '', width:'150px', sortable:false,
			
							renderer : function(value, data, rowIndex, colIndex, metadata){
							  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="infos(\''+data['PKID']+'\')">详情</a>';
							  	return returnText;
							}
			           	}
		]
		,url : '/idlefishv2/creditfinance/paypagelist'
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

function downloadPayExport(){
	var param = '';
	param += '&startDate=' + $('#pay_date_start').val();
	param += '&endDate=' + $('#pay_date_end').val();
	window.location.href = '/idlefishv2/recyorder/payexport?'+param;
	return false;
}
/**
 * 详情
 */
function infos(pkid){
	window.location.href = "/idlefishv2/creditfinance/payinfo?pkid="+pkid+"&backUrl="+backUrl;
}

function goBack(){
	window.history.go(-1);
}
function getParams(){
    return {
    	orderno:$('#orderno').val(), 
    	order_id:$('#order_id').val(),
    	ydmpayno:$('#ydmpayno').val(),
    	pay_type:$('#pay_type').val(),
    	pay_date_start:$('#pay_date_start').val(),
    	pay_date_end:$('#pay_date_end').val(),
    	createdate_start:$('#createdate_start').val(),
    	createdate_end:$('#createdate_end').val(),
    	pay_status:$('#pay_status').val()
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