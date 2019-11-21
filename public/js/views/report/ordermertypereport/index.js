var grid;
$().ready(function(){
	grid = $('#grid').grid({
		showSummaryBar:true
		,height:325
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'30px', sortable:false}
		   ,{header:"渠道商", dataIndex:'PARTNERNAME', width:'100px', sortable:false}
		   ,{header:"订单来源", dataIndex:'SOURCENAME', width:'100px', sortable:false}
		   ,{header:"商品类型", dataIndex:'TYPENAME', width:'85px', sortable:false}
		   ,{header:"下单量", dataIndex:'ORDERCOUNTS', width:'85px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"下单金额", dataIndex:'SUMPRICE', width:'90px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"成交量", dataIndex:'SUCCESSCOUNTS', width:'80px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"成交金额", dataIndex:'SETTLECOUNTPRICES', width:'95px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"成交率", dataIndex:'', width:'85px', sortable:false
        	,renderer : function(value, data, rowIndex, colIndex, metadata){
        		return data['SUCCESSCOUNTS'] <= 0 ? "0%" : (Math.round(data['SUCCESSCOUNTS']/data['ORDERCOUNTS'] * 10000) / 100.00 + "%");
              }
		    }
       ]
       ,url : '/report/ordermertypereport/ordermertypereportlist'
       ,baseParams:{dateFlag:'2'}
	});
	
	$('input[name="dateFlag"]').click(function(){
		if($(this).val() == '5'){
			$('#otherDateSpan').show();
		}else{
			$('#startDate').val('');
			$('#endDate').val('');
			$('#otherDateSpan').hide();
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
	layer.load('数据加载中...', 2);
    grid.query(getParams());
}

function downloadOrderMertypeReport(){
	var param = '';
	param += '&startDate='+$('#startDate').val();
	param += '&endDate='+$('#endDate').val();
	param += '&dateFlag='+$('input[name="dateFlag"]:checked').val();
	param += '&partnerCode='+$('#partnerCode').val();
	param += '&sourceCode='+$('#sourceCode').val();
	window.location.href = '/report/ordermertypereport/downloadordermertyperepor?v=1'+param;
	return false; //截取返回false就不会保存网页了
}

$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
		$("#sourceCode").html("<option value=''>请选择来源</option>");
		for(i in data){
			$("#sourceCode").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
		}
	}, 'json');
});
