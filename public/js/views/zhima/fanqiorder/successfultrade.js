var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			 {header:"No", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'150px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME', width:'200px',sortable:false}
			,{header:"联系信息", dataIndex:'', width:'150px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['MOBILE']+'('+data['UNAME']+')';
				}
			}
			,{header:"回收金额", dataIndex:'MERPRICE', width:'80px',sortable:false}
			,{header:"询价金额", dataIndex:'INQUIRY_PRICE', width:'80px',sortable:false}
			,{header:"检测金额", dataIndex:'INSPEC_PRICE', width:'80px',sortable:false}
			,{header:"下单时间", dataIndex:'CREATEDATE', width:'120px',sortable:false}
			,{header:"检测时间", dataIndex:'INSPECDATE', width:'120px',sortable:false}
			,{header:"支付时间", dataIndex:'PAYDATE', width:'120px',sortable:false}
			,{header:"支付类型", dataIndex:'PAYTYPE', width:'100px',sortable:false}
		]
		,url:'/zhima/fanqiorder/pagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[15,30,50]
	});
});

function initParams(){
	return {};
}

function doSearch() {
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

function getParams(){
	return {
		contact:$('#contact').val(),
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

function doExport(){
	var param = '?contact='+$('#contact').val();
		param += '&merName='+$('#merName').val();
		param += '&orderNo='+$('#orderNo').val();
		param += '&startDate='+$('#startDate').val();
		param += '&endDate='+$('#endDate').val();
	window.location.href = "/zhima/fanqiorder/exportexecl"+param;
}