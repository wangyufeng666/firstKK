var grid;
$().ready(function(){
	grid = $('#grid').grid({
		showSummaryBar:true
		,height:325
		,cm:[
		   {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
		   ,{header:"渠道商", dataIndex:'PARTNERNAME', width:'100px', sortable:false}
		   ,{header:"询价来源", dataIndex:'SOURCENAME', width:'140px', sortable:false}
		   ,{header:"商品类型", dataIndex:'TYPENAME', width:'100px', sortable:false}
		   ,{header:"询价日期", dataIndex:'INQUIRYDATE', width:'160px', sortable:false}
		   ,{header:"询价量", dataIndex:'INQUIRYCOUNTS', width:'70px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"询价均价", dataIndex:'INQUIRYAVGPRICE', width:'70px', sortable:false}
		   ,{header:"下单量", dataIndex:'ORDERCOUNTS', width:'70px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"下单率", dataIndex:'ORDERRATE', width:'70px', sortable:false
			   ,renderer : function(value, data, rowIndex, colIndex, metadata){
				   return data['ORDERCOUNTS'] <= 0 ? "0%" : (Math.round(data['ORDERCOUNTS']/data['INQUIRYCOUNTS'] * 10000) / 100.00 + "%");
			   }
		   }
		   ,{header:"上门回收量", dataIndex:'trade01', width:'70px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"快递回收量", dataIndex:'trade02', width:'70px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"地铁回收量", dataIndex:'trade05', width:'70px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"成交量", dataIndex:'TRADECOUNTS', width:'70px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"成交总金额", dataIndex:'TRADESUMPRICE', width:'70px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"成交均价", dataIndex:'TRADEAVGPRICE', width:'70px', sortable:false}
       ]
       ,url:'/idlefishv2/tmallmertypetrade/mertypetradelist'
       ,baseParams:{dateFlag:'2'}
	});
	
	$('input[name="dateFlag"]').click(function(){
		$('#startDate').val('');
		$('#endDate').val('');
		doSearch();
	});
});

function getParams(){
    return {
    	startDate:$('#startDate').val(),
    	endDate:$('#endDate').val()
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
	window.location.href = '/idlefishv2/tmallmertypetrade/export?v=1'+param;
	return false; //截取返回false就不会保存网页了
}

