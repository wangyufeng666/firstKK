var grid;
$().ready(function(){
	grid = $('#grid').grid({
		showSummaryBar:true
		,height:325
		,cm:[
		   {header:"渠道", dataIndex:'SOURCENAME',width:'80px', sortable:false}
		   ,{header:"品类", dataIndex:'MERNAME',width:'80px', sortable:false}
		   ,{header:"询价时间", dataIndex:'CREATEDATE', width:'80px', sortable:false}
		   ,{header:"询价量", dataIndex:'INQUIRYCOUNT', width:'80px', sortable:false}
		   ,{header:"订单量", dataIndex:'ORDERCOUNT', width:'80px', sortable:false}
		   ,{header:"检测量", dataIndex:'INSPECTCOUNT', width:'80px', sortable:false}
           ,{header:"成交量", dataIndex:'DEALCOUNT', width:'80px', sortable:false}
           ,{header:"成交金额", dataIndex:'DEALPRICE', width:'80px', sortable:false}
           ,{header:"询价订单", dataIndex:'inquiryOrder', width:'80px', sortable:false}
           ,{header:"订单检测", dataIndex:'orderInspect', width:'80px', sortable:false}
           ,{header:"检测成交", dataIndex:'inspectDeal', width:'80px', sortable:false}
           ,{header:"询价成交", dataIndex:'inquiryDeal', width:'80px', sortable:false}
       ]
       ,url:'/report/orderreport/orderlist'
       ,baseParams:{isAll:'all'}
	});

});

function getParams(){
    return {
    	startDate:$('#startDate').val(),
    	endDate:$('#endDate').val(),
		partnerCode:$('#partnerCode').val(),
    	sourceCode:$('#sourceCode').val()
	};
}

function doSearch(){
	// if($('#sourceCode').val() ==''){
	// 	alert('请选择订单来源');
	// 	return false;
	// }
	if($('#startDate').val() ==''){
		alert('请选择开始时间');
		return false;
	}
	if($('#endDate').val() ==''){
		alert('请选择结束时间');
		return false;
	}
    grid.query(getParams());
}

function orderTradeTypeExport(){
	// if($('#sourceCode').val() ==''){
	// 	alert('请选择订单来源');
	// 	return false;
	// }
	if($('#startDate').val() ==''){
		alert('请选择开始时间');
		return false;
	}
	if($('#endDate').val() ==''){
		alert('请选择结束时间');
		return false;
	}
	var param = '';
	param += '&startDate='+$('#startDate').val();
	param += '&endDate='+$('#endDate').val();
	param += '&sourceCode='+$('#sourceCode').val();
	param += '&partnerCode='+$('#partnerCode').val();
	window.location.href = '/report/orderreport/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}


$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	if(partnerCode){
		$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
			$("#sourceCode").html("<option value=''>请选择来源</option>");
			for(i in data){
				$("#sourceCode").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
			}
		}, 'json');
	}else{
		$("#sourceCode").html("<option value=''>请选择来源</option>");
	}
});
