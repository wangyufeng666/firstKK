var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "NO.", dataIndex: 'R', width:'40px',sortable:false} 
			,{header: "订单编号", dataIndex: 'DINGDANNO', width:'160px',sortable:false}
			,{header: "入库日期", dataIndex: 'INWAREDATE', width:'140px',sortable:false}
			,{header: "商品品类", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header:"商品型号", dataIndex:'MERNAME', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "订单来源", dataIndex: 'ORDERSOURCE', width:'160px',sortable:false}
			,{header: "支付方式", dataIndex: 'PAYTYPE', width:'80px',sortable:false}
			,{header: "交易方式", dataIndex: 'CHULITYPE', width:'80px',sortable:false}
		]
		,url:'/report/report/inventoryreportpagelist'
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
    	category:$('#category').val(),
		merType:$('#merType').val(),
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		startDate:$('#startCreateDate').val(),
		endDate:$('#endCreateDate').val(),
    };
}

function doSearch(){
	grid.query(getParams());
}

/**
 * 导出报表
 * @returns
 */
function exprotList(){
	var params = getParams();
	var param = $.param(params);
	
	var orderSourceName = '';
	
	if($('#orderSource').val() != ''){
		orderSourceName = $("#orderSource").find("option:selected").text();
	}else if($('#partnerCode').val() != ''){
		orderSourceName = $("#partnerCode").find("option:selected").text();
	}
	
	param = param+'&orderSourceName='+orderSourceName;
	
	window.location.href = '/report/report/exportinventoryreport?'+param;
	return false;
}
