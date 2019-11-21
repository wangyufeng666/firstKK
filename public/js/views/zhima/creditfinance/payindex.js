var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"创建日期", dataIndex:'CREATEDATE', width:'140px',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'160px',sortable:false}
			,{header:"转账单号", dataIndex:'ORDER_ID', width:'240px',sortable:false}
			,{header:"支付编号", dataIndex:'YDMPAYNO', width:'180px',sortable:false}
			,{header:"支付金额", dataIndex:'PAY_PRICE', width:'80px',sortable:false}
			,{header:"支付时间", dataIndex:'PAY_DATE', width:'130px',sortable:false}
			,{header:"支付类型", dataIndex:'TYPE_EXT', width:'80px',sortable:false}
			,{header:"支付状态", dataIndex:'STATUS_EXT', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'PKID', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:payInfo(\''+value+'\')">详情</a>';
					return returnText;
				}
			}
		]
		,url:'/zhima/creditfinance/paypagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[15,30,50]
	});
});
function initParams(){
	return getParams();
}

function downloadPayExport(){
	var param = '';
	param += '&startDate=' + $('#pay_date_start').val();
	param += '&endDate=' + $('#pay_date_end').val();
	window.location.href = '/zhima/recyorder/payexport?'+param;
	return false;
}

function downloadPayExportV3(){
	var param = '';
	param += '&startDate=' + $('#pay_date_start').val();
	param += '&endDate=' + $('#pay_date_end').val();
	window.location.href = '/zhima/recyorder/payexportv3?'+param;
	return false;
}

function downloadBackExportV3(){
	var param = '';
	param += '&startDate=' + $('#pay_date_start').val();
	param += '&endDate=' + $('#pay_date_end').val();
	window.location.href = '/zhima/recyorder/backexportv3?'+param;
	return false;
}
/**
 * 详情
 */
function payInfo(pkid){
	
	layer.open({
		type:2,
		title:'订单支付详情',
		shadeClose:false,
		content:"/zhima/creditfinance/payinfo?pkid="+pkid,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		orderno:$('#orderno').val(),
		contacts:$('#contacts').val(),
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
	layerIndex = layer.msg('加载中', {icon:16, time:10000});
	grid.query(getParams());
}

/**
 * 重新加载
 * @returns
 */
function reload(){
	layer.closeAll();
	grid.reload();
}