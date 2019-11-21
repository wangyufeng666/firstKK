var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"回收单号", dataIndex:'DINGDANNO', width:'180px',sortable:false}
			,{header:"商品品类", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"商品型号", dataIndex:'MERNAME', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"支付日期", dataIndex:'PAYDATE', width:'130px',sortable:false}
			,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"地区", dataIndex:'DISTRICT', width:'80px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'100px',sortable:false}
			,{header:"订单状态", dataIndex:'ORDERSTATUS', width:'80px',sortable:false}
			,{header:"付款方式", dataIndex:'PAYTYPENAME', width:'100px',sortable:false}
		]
		,url:'/report/report/tradereportpagelist'
		,baseParams:{isAll:'all'}
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});
	
	//日期验证
	$('#startDate').click(function(){
		WdatePicker({
			onpicked:function(){$('#endDate').trigger('click');},
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	
	$('#endDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
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

	var ignoreSources = [];
	if($('input[name="ignoreSources"]:checked')){
		$('input[name="ignoreSources"]:checked').each(function(){
			ignoreSources.push($(this).val());
		});
	}
	
	return {
		category:$('#category').val(),
		merType:$('#merType').val(),
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		ignoreSources:ignoreSources,//忽略闲鱼来源
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		isAll:'all'
	};
}

function doSearch(){
	layerIndex = layer.load('加载中');
	grid.query(getParams());
}

/**
 * 导出报表
 * @returns
 */
function exprotList(method){
	var params = getParams();
	params.method = method;
	
	if($('#orderSource').val() != ''){
		params.orderSourceName = $("#orderSource").find("option:selected").text();
	}else if($('#partnerCode').val() != ''){
		params.orderSourceName = $("#partnerCode").find("option:selected").text();
	}
	
	var param = $.param(params);
	
	window.location.href = '/report/report/exporttradereport?'+param;
	return false;
}
