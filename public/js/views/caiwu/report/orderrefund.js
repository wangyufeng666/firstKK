var grid;
$().ready(function(){
	grid = $('#grid').grid({
		height:350
		,cm:[
			{header:"NO.", dataIndex:'R', width:'35px',sortable:false} 
			,{header:"品类", dataIndex:'MERTYPENAME', width:'55px',sortable:false}
			,{header:"品牌", dataIndex:'PNAME', width:'55px',sortable:false}
			,{header:"商品型号", dataIndex:'MERNAME', sortable:false}
			,{header:"订单号", dataIndex:'ORDERNO', width:'120px',sortable:false}
			,{header:"结算价格", dataIndex:'SETTLEPRICE',width:'65px', sortable:false}
			,{header:"付款/发券金额", dataIndex:'PAYPRICE', width:'90px', sortable:false}
			,{header:"付款/发券日期", dataIndex:'PAYDATE', width:'110px',sortable:false}
			,{header:"退款/退劵日期", dataIndex:'OPERDATE', width:'110px',sortable:false}
			,{header:"联系人", dataIndex:'CONTACT', width:'65px',sortable:false}
			,{header:"联系电话", dataIndex:'MOBILE', width:'85px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'90px',sortable:false}
			,{header:"操作人", dataIndex:'USERNAME', width:'70px',sortable:false}
			,{header:"付款方式", dataIndex:'EVENTNAME', width:'80px',sortable:false}
			,{header:"支付类型", dataIndex:'PAYTYPENAME', width:'60px',sortable:false}
		]
		,url:'/caiwu/report/orderrefundlist'
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
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		startDate:$('#startCreateDate').val(),
		endDate:$('#endCreateDate').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area : ['280px','auto'],
		dialog : {msg:msg, type:8}
	});
}