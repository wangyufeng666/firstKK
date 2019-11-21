var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "订单编号", dataIndex: 'ORDER_NO', width:'5%',sortable:false}
            ,{header: "订单来源", dataIndex: 'SOURCENAME', width:'5%',sortable:false}
            ,{header: "子渠道", dataIndex: 'PARTNERNAME', width:'5%',sortable:false}
            ,{header: "下单时间", dataIndex: 'CREATE_DATE', width:'5%',sortable:false}
            ,{header: "租赁人", dataIndex: 'CONTACT_NAME', width:'5%',sortable:false}
            ,{header: "联系方式", dataIndex: 'CONTACT_MOBILE', width:'5%',sortable:false}
            ,{header: "地址", dataIndex: 'ADDRESS', width:'5%',sortable:false}
            ,{header: "合同终止时间", dataIndex: 'ENDDATE', width:'5%',sortable:false}
            ,{header: "商品名称", dataIndex: 'PRODUCT_NAME', width:'5%',sortable:false}
            ,{header: "机器设备码", dataIndex: 'IMEINO', width:'5%',sortable:false}
            ,{header: "新机价格", dataIndex: 'NEW_PRODUCT_PRICE', width:'5%',sortable:false}
            ,{header: "代购价格", dataIndex: 'PURCHASEPRICE', width:'5%',sortable:false}
            ,{header: "回收价格", dataIndex: 'RECOVERYPRICE', width:'5%',sortable:false} 
            ,{header: "总租金", dataIndex: 'TOTAL_PRICE', width:'5%',sortable:false}
            ,{header: "月租", dataIndex: 'PERIOD_PRICE', width:'5%',sortable:false}
            ,{header: "保险费用", dataIndex: 'INSURANCEPRICE', width:'5%',sortable:false}
            ,{header: "实际押金", dataIndex: 'REL_FREEZEPRICE', width:'5%',sortable:false}
            ,{header: "优惠金额", dataIndex: 'DISCOUNT', width:'5%',sortable:false}
            ,{header: "优惠类型", dataIndex: 'RULE', width:'5%',sortable:false}
            ,{header: "已交租金", dataIndex: 'PAY_PRICE', width:'5%',sortable:false}
		]
		,url : '/rent/report/waitreturnpage'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		var params = [];
		return params;
	}
}

function getParams(){
	return {
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}


function doSearch(){
	layer.msg('加载中', {icon:16,shade:0.1});
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

$('#exportlist').on('click',function(){
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var param = '?startDate='+startDate+'&endDate='+endDate;
	window.location.href = '/rent/report/waitreturnexport'+param;
});
