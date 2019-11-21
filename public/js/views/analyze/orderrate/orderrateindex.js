
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header: "序号", dataIndex: 'R', width:'40PX',sortable:false}
			,{header: "时间", dataIndex: 'INQUIRYDATE', width:'180PX',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80PX',sortable:false}
            ,{header: "商品品牌", dataIndex: 'PNAME', width:'80PX',sortable:false}
            ,{header: "商品名称", dataIndex: 'MERNAME', sortable:false}
            ,{header: "订单来源", dataIndex: 'SOURCENAME', width:'100PX',sortable:false}
            ,{header: "所属端口", dataIndex: 'PARTNERNAME', width:'100PX',sortable:false}
            ,{header: "询价量", dataIndex: 'INQUIRYCOUNTS', width:'100PX',sortable:false}
            ,{header: "下单量", dataIndex: 'ORDERCOUNTS', width:'100PX',sortable:false}
            ,{header: "下单率", dataIndex: '',width:'80PX', sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var rate = (parseFloat(data['ORDERCOUNTS']) / parseFloat(data['INQUIRYCOUNTS'])) * 100;
					return new Number(rate).toFixed(2);
				}
            }
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
		category:$('#category').val(),
		merType:$('#merType').val(),
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		dayNo:$('#dayNo').val(),
		inquiryStart:$('#inquiryStart').val(),
		inquiryEnd:$('#inquiryEnd').val(),
		orderStart:$('#orderStart').val(),
		orderEnd:$('#orderEnd').val(),
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
	var category = $('#category').val();
	var merType = $('#merType').val();
	var partnerCode = $('#partnerCode').val();
	var orderSource = $('#orderSource').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var dayNo = $('#dayNo').val();
	var inquiryStart = $('#inquiryStart').val();
	var inquiryEnd = $('#inquiryEnd').val();
	var orderStart = $('#orderStart').val();
	var orderEnd = $('#orderEnd').val();
	var param = '?partnerCode='+partnerCode+'&orderSource='+orderSource+'&category='+category+'&merType='+merType;
	param += '&startDate='+startDate+'&endDate='+endDate+'&dayNo='+dayNo+'&inquiryStart='+inquiryStart;+'&inquiryEnd='+inquiryEnd;
	param += '&orderStart='+orderStart+'&orderEnd='+orderEnd;
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