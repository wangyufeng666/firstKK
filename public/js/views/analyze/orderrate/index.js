
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'40PX',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPE', width:'150PX',sortable:false}
			,{header: "商品品牌", dataIndex: 'PNAME', width:'150PX',sortable:false}
            ,{header: "商品名称", dataIndex: 'MERNAME', width:'200PX',sortable:false}
            ,{header: "询价量", dataIndex: 'INQUIRY_NUM', width:'100PX',sortable:false}
            ,{header: "下单量", dataIndex: 'ORDER_NUM', width:'100PX',sortable:false}
            ,{header: "下单率", dataIndex: 'ORDERRATE',sortable:false}
		]
		,url : '/analyze/orderrate/pagelist'
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
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		dayDate:$('#dayDate').val(),
		merType:$('#merType').val(),
		pname:$('#pname').val(),
		merName:$('#merName').val(),
		inquiryStart:$('#inquiryStart').val(),
		inquiryEnd:$('#inquiryEnd').val(),
		orderStart:$('#orderStart').val(),
		orderEnd:$('#orderEnd').val(),
		rate:$('#rate').val()
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
	var partnerCode = $('#partnerCode').val();
	var orderSource = $('#orderSource').val();
	var dayDate = $('#dayDate').val();
	var merType = $('#merType').val();
	var pname = $('#pname').val();
	var merName = $('#merName').val();
	var inquiryStart = $('#inquiryStart').val();
	var inquiryEnd = $('#inquiryEnd').val();
	var orderStart = $('#orderStart').val();
	var orderEnd = $('#orderEnd').val();
	var rate = $('#rate').val();
	
	
	var param = '?partnerCode='+partnerCode+'&orderSource='+orderSource+'&dayDate='+dayDate+'&merType='+merType+'&pname='+pname;
	param += '&merName='+merName+'&inquiryStart='+inquiryStart+'&inquiryEnd='+inquiryEnd+'&orderStart='+orderStart+'&orderEnd='+orderEnd+'&rate='+rate;
	window.location.href = '/analyze/orderrate/exportlist'+param;
});

//渠道change事件
$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
		$("#orderSource").html("<option value=''>请选择来源</option>");
		for(i in data){
			$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
		}
	}, 'json');
});
