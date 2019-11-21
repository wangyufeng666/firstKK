var grid;
$().ready(function(){
	grid = $('#grid').grid({
		height:390
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return rowIndex+1;
				}
			}
			,{header:"品类", dataIndex:'MERTYPENAME', width:'70px',sortable:false}
			,{header:"品牌", dataIndex:'PNAME', width:'70px',sortable:false}
			,{header:"商品型号", dataIndex:'MERNAME', sortable:false}
			,{header:"付款时间", dataIndex:'PAYDATE', width:'120px',sortable:false}
			,{header:"成交价格", dataIndex:'ORDERPRICE',width:'80px', sortable:false}
			,{header:"支付金额", dataIndex:'PAYPRICE', width:'80px', sortable:false}
			,{header:"联系人", dataIndex:'CONTACT', width:'80px',sortable:false}
			,{header:"联系电话", dataIndex:'MOBILE', width:'90px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'100px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px',sortable:false}
			,{header:"操作人", dataIndex:'USERNAME', width:'80px',sortable:false}
			,{header:"支付类型", dataIndex:'PAYTYPENAME', width:'80px',sortable:false}
		]
		,url:'/caiwu/report/tradereportpagelist'
		,baseParams:{isAll:'all'}
	});
	
	$("#partnerCode").change(function(){
		var partnerCode = $(this).val();
		$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
			$("#orderSource").html("<option value=''>请选择来源</option>");
			for(i in data){
				$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
			}
		}, 'json');
	});
});


function getParams(){
	return {
		contacts:$('#contacts').val(),
		merName:$('#merName').val(),
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		tradeType:$('#tradeType').val(),
		startDate:$('#startCreateDate').val(),
		endDate:$('#endCreateDate').val(),
		orderStatus:$('#orderStatus').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		address:$('#address').val(),
		isAll:'all'
	};
}

function doSearch(){
	grid.query(getParams());
}
