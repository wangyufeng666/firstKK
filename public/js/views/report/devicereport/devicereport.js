var grid;
$().ready(function(){
	grid = $('#grid').grid({
		showSummaryBar:true
		,height:325
		,cm:[
		   {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
		   ,{header:"商户名称", dataIndex:'PARTNERNAME', width:'200px', sortable:false}
		   ,{header:"商户负责人", dataIndex:'CONTACTS', width:'80px', sortable:false}
		   ,{header:"负责人电话", dataIndex:'CONTACTWAY', width:'80px', sortable:false}
		   ,{header:"运维人员", dataIndex:'PNAME', width:'80px', sortable:false}
		   ,{header:"运维电话", dataIndex:'PHONE', width:'80px', sortable:false}
		   ,{header:"设备名称", dataIndex:'DEVICENAME', width:'200px', sortable:false}
		   ,{header:"设备所在地址", dataIndex:'ADDRESS', width:'100px', sortable:false}
		   ,{header:"设备ID", dataIndex:'DEVICEID', width:'100px', sortable:false}
		   ,{header:"询价时间", dataIndex:'CREATEDATE', width:'100px', sortable:false}
		   ,{header:"所属类型", dataIndex:'MERTYPENAME', width:'100px', sortable:false}
		   ,{header:"品牌", dataIndex:'PINPAI', width:'100px', sortable:false}
		   ,{header:"商品名称", dataIndex:'SPNAME', width:'100px', sortable:false}
		   ,{header:"询价金额", dataIndex:'SETTLEPRICE', width:'100px', sortable:false}
       ]
       ,url:'/report/devicereport/inquirylist'
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
    	partnerCode:$('#partnerCode').val()
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
	window.location.href = '/report/devicereport/inquiryexport?v=1'+param;
	return false; //截取返回false就不会保存网页了
}