var grid;
$().ready(function(){
	grid = $('#grid').grid({
		showSummaryBar:true
		,height:325
		,cm:[
		   {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
		   ,{header:"渠道商", dataIndex:'PARTNERNAME', width:'200px', sortable:false}
		   ,{header:"询价来源", dataIndex:'SOURCENAME', width:'200px', sortable:false}
		   ,{header:"询价子来源", dataIndex:'FROMNAME', width:'200px', sortable:false}
		   ,{header:"商品类型", dataIndex:'TYPENAME', width:'120px', sortable:false}
		   ,{header:"询价日期", dataIndex:'INQUIRYDATE', width:'200px', sortable:false}
		   ,{header:"询价量", dataIndex:'INQUIRYCOUNTS', width:'100px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"询价均价", dataIndex:'INQUIRYAVGPRICE', width:'100px', sortable:false}
		   //,{header:"下单量", dataIndex:'SUMORDER', width:'100px', sortable:false}
		   ,{header:"下单量", dataIndex:'ORDERCOUNTS', width:'100px', sortable:false,summaryConfig:{calculation:function(value, dataIndex, rowIndex, data){
				return data['SUMORDER'];
		   }}}
		   ,{header:"下单率", dataIndex:'ORDERRATE', width:'100px', sortable:false
        	,renderer : function(value, data, rowIndex, colIndex, metadata){
        		var sumorder = data['SUMORDER'];
        		$('.grid-summary-bar-ORDERCOUNTS span').html(sumorder);
        		return data['ORDERCOUNTS'] <= 0 ? "0%" : (Math.round(data['ORDERCOUNTS']/data['INQUIRYCOUNTS'] * 10000) / 100.00 + "%");
              }
		   }
		   ,{header:"", dataIndex:'', sortable:false}
       ]
       ,url:'/report/inquiryreport/inquirylist'
       ,baseParams:{dateFlag:'2'}
	   ,baseParams:initParams()
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

function initParams(){
	var params = getParams();
	params['dateFlag'] = '2';
	return params;
}

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

function downloadinquiryexport(){
	var param = '';
	param += '&startDate='+$('#startDate').val();
	param += '&endDate='+$('#endDate').val();
	param += '&dateFlag='+$('input[name="dateFlag"]:checked').val();
	param += '&partnerCode='+$('#partnerCode').val();
	param += '&sourceCode='+$('#sourceCode').val();
	window.location.href = '/report/inquiryreport/inquiryexport?v=1'+param;
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
