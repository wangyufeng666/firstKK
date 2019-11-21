var grid;
var layerIndex = 0;


$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'50px',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'100px',sortable:false}
			,{header:"订单日期", dataIndex:'CREATEDATE', width:'100px',sortable:false}
			,{header:"订单状态", dataIndex:'ORDERSTATUSNAME', width:'100px',sortable:false}
			,{header:"订单金额", dataIndex:'PRICE', width:'100px',sortable:false}
			,{header:"下单人", dataIndex:'LIANXIREN', width:'80px',sortable:false}
			,{header:"下单手机号", dataIndex:'LIANXIDH', width:'80px',sortable:false}
			,{header:"邀请人", dataIndex:'REALNAME', width:'80px',sortable:false}
			,{header:"邀请手机号", dataIndex:'MOBILE',width:'80px',sortable:false}
			,{header:"佣金额度", dataIndex:'REWARDPRICE',width:'80px',sortable:false}
			,{header:"佣金状态", dataIndex:'STATUSNAME', width:'80px',sortable:false}
		]
		,url:'/recycle/order/getapprewardlist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params.start = start;
		params.limit = limit;
		return params;
	}else{
		return {};
	}
}


function getParams(){
	return {
		start:start,
		orderNo:$('#orderNo').val(),
		lianxidh:$('#lianxidh').val(),
		mobile:$('#mobile').val(),
		orderStatus:$('#orderStatus').val(),
		rewardStatus:$('#rewardStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
	};
}

//下载
function rewardExport(){
	var params = {};
	params.startDate = $('#startDate').val();
	params.endDate = $('#endDate').val();
	params.orderNo = $('#orderNo').val();
	params.lianxidh = $('#lianxidh').val();
	params.mobile = $('#mobile').val();
	params.orderStatus = $('#orderStatus').val();
	params.rewardStatus = $('#rewardStatus').val();
	window.location.href='/recycle/order/rewardexport?startDate='+params.startDate+'&endDate='+params.endDate
		+'&orderNo='+params.orderNo+'&lianxidh='+params.lianxidh+'&mobile='+params.mobile+'&orderStatus='+params.orderStatus
		+'&rewardStatus='+params.rewardStatus;
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	grid.paras.start = '1';
	grid.query(getParams());
}

//回车事件
document.onkeypress = keypress;
function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}

