var grid;
$().ready(function(){
	grid = $('#grid').grid({
		height:500
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'30px', sortable:false}
		   ,{header:"订单来源", dataIndex:'sourceName', width:'100px', sortable:false}
		   ,{header:"订单总量", dataIndex:'allordercounts', width:'90px', sortable:false}		   
		   ,{header:"上门订单总量", dataIndex:'visitCounts', width:'90px', sortable:false}		   		   
		   ,{header:"快递订单总量", dataIndex:'expressCounts', width:'90px', sortable:false}
           ,{header:"地铁订单总量", dataIndex:'subWayCounts', width:'90px', sortable:false}
           ,{header:"订单总价", dataIndex:'allorderprices', width:'90px', sortable:false}
           ,{header:"成交量", dataIndex:'successCount', width:'90px', sortable:false}
           ,{header:"成交金额", dataIndex:'successPrices', width:'90px', sortable:false}
       ]
       ,url : '/report/orderreport/orderreportlist'
       ,baseParams:{isAll:'all'}
	});
});
function getParams(){
    return {
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
    	orderTypes:$('#orderTypes').val()    	
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
function downloadorderexport(){
	var param = '';
	param += '&startCreateDate=' + $('#startCreateDate').val();
	param += '&endCreateDate=' + $('#endCreateDate').val();	
	param += '&orderTypes=' + $('#orderTypes').val();
	window.location.href = '/report/orderreport/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}