var grid;
$().ready(function(){
	grid = $('#grid').grid({
		showSummaryBar:true
		,height:325
		,cm:[
		   {header:"NO.", dataIndex:'R', width:'40px', sortable:false,summaryConfig:{html:"合计"}}
		   ,{header:"渠道来源", dataIndex:'partnerName', sortable:false}
		   ,{header:"订单来源", dataIndex:'sourceName', sortable:false}
		   ,{header:"订单日期", dataIndex:'orderDate', width:'200px', sortable:false}
		   ,{header:"订单总量", dataIndex:'sumOrderCounts', width:'100px', sortable:false,summaryConfig:{calculation:'sum'}}		   
		   ,{header:"上门订单总量", dataIndex:'visitCounts', width:'100px', sortable:false,summaryConfig:{calculation:'sum'}}		   		   
		   ,{header:"快递订单总量", dataIndex:'expressCounts', width:'100px', sortable:false,summaryConfig:{calculation:'sum'}}
           ,{header:"地铁订单总量", dataIndex:'subWayCounts', width:'100px', sortable:false,summaryConfig:{calculation:'sum'}}
           ,{header:"订单总价", dataIndex:'sumOrderPrices', width:'100px', sortable:false,summaryConfig:{calculation:'sum'}}
           ,{header:"成交量", dataIndex:'successCounts', width:'100px', sortable:false,summaryConfig:{calculation:'sum'}}
           ,{header:"成交金额", dataIndex:'successPrices', width:'100px', sortable:false,summaryConfig:{calculation:'sum'}}
       ]
       ,url:'/report/orderreport/tradetypelist'
       ,baseParams:{isAll:'all'}
	});
	
	$('input[name="dateFlag"]').click(function(){
		if($(this).val() == '5'){
			$('.otherDateSpan').show();
		}else{
			$('#startDate').val('');
			$('#endDate').val('');
			$('.otherDateSpan').hide();
			doSearch();
		}
	});
});

function getParams(){
    return {
    	startDate:$('#startDate').val(),
    	endDate:$('#endDate').val(),
    	dateFlag:$('input[name="dateFlag"]:checked').val(),
    	partnerCode:$('#partnerCode').val(),
    	sourceCode:$('#sourceCode').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function orderTradeTypeExport(){
	var param = '';
	param += '&startDate='+$('#startDate').val();
	param += '&endDate='+$('#endDate').val();
	param += '&dateFlag='+$('input[name="dateFlag"]:checked').val();
	param += '&partnerCode='+$('#partnerCode').val();
	param += '&sourceCode='+$('#sourceCode').val();
	window.location.href = '/report/orderreport/tradetypereport?'+param;
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
