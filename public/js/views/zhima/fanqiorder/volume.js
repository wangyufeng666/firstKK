var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			 {header:"No", dataIndex:'R', width:'24PX',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'50px',sortable:false}
			,{header:"器材名称", dataIndex:'KEYWORDS', width:'80px',sortable:false}
			,{header:"联系人", dataIndex:'UNAME',sortable:false,width:'50px'}
			,{header:"联系方式", dataIndex:'MOBILE', width:'130px',sortable:false}
			,{header:"旧机价格", dataIndex:'MERPRICE', width:'100px',sortable:false}
			,{header:"询问价格", dataIndex:'INQUIRY_PRICE', width:'100px',sortable:false}
			,{header:"检查价格", dataIndex:'INSPECTION_PRICE', width:'100px',sortable:false}
			,{header:"订单日期", dataIndex:'ORDERDATE', width:'100px',sortable:false}
			,{header:"检查日期", dataIndex:'INSPECTION_DATE', width:'100px',sortable:false}
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
	return getParams();
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

function doExport(){
	var param = {};
	param.keyWords = $('#keyWords').val();
	param.orderNo = $('#orderNo').val();
	param.uname = $('#uName').val();
	param.mobile = $('#mobile').val();
	param.merprice = $('#merPrice').val();
	param.inquiry_price = $('#inquiry_Price').val();
	param.inspection_price = $('#inspection_Price').val();
	param.orderdate = $('#orderDate').val();
	param.inspection_date = $('#inspection_Date').val();
	
	window.location.href = "/zhima/fanqiorder/exportexecl?"+$.param(param);
}

