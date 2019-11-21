var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"销售单号", dataIndex:'SALEBILLNO', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return "<a class='a_link' href='javaScript:saleInfo(\"" + value + "\")'>"+value+"</a> ";
				}
			}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'100px',sortable:false}
            ,{header:"负责人", dataIndex:'SALER', width:'70px',sortable:false}
            ,{header:"销售时间", dataIndex:'SALEDATE', width:'80px',sortable:false}
            ,{header:"销售数量", dataIndex:'SALE_COUNT', width:'70px',sortable:false}
            ,{header:"订单总价", dataIndex:'COST_AMOUNT', width:'70px',sortable:false}
            ,{header:"运费总价", dataIndex:'EXPRESS_AMOUNT', width:'70px',sortable:false}
            ,{header:"其他费用", dataIndex:'OTHER_AMOUNT', width:'70px',sortable:false}
            ,{header:"总成本", dataIndex:'COST_AMOUNT', width:'70px',sortable:false}
            ,{header:"销售价格", dataIndex:'SALE_AMOUNT', width:'70px',sortable:false}
            ,{header:"总毛利额", dataIndex:'PROFITVALUE', width:'70px',sortable:false}
            ,{header:"毛利率(%)", dataIndex:'PROFITRATE', width:'70px',sortable:false}
            ,{header:"订单状态", dataIndex:'ORDERSTATUSNAME', width:'70px',sortable:false}
		]
		,url:'/sale/dailysale/salepagelist'
		,baseParams:initParams()
		,pageSizeList:[30,50]
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
});

function initParams(){
	return getParams();
}

function getParams(){
	return {
		saleBillNo:$('#saleBillNo').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		billStatus:$('#billStatus').val(),
		saler:$('#saler').val(),
		createrId:$('#createrId').val()
	};
}

function doSearch(){
	layerIndex = layer.msg('加载中', {icon:16, shade: 0.1, time:30000});
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

/**
 * 详情
 */
function saleInfo(saleBillNo){
	layer.open({
		type:2,
		title:'详情',
		shadeClose:false,
		shade:0.8,
		content:'/sale/dailysale/salebillinfo?saleBillNo='+saleBillNo,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function saleBillExport(){
	var saleBillNo = $('#saleBillNo').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var createrId = $('#createrId').val();
	var billStatus = $('#billStatus').val();
	var saler = $('#saler').val();
	
	var param = '?saleBillNo='+saleBillNo+'&createrId='+createrId+'&billStatus='+billStatus;
	param += '&startDate='+startDate+'&endDate='+endDate+'&saler='+saler;
	
	window.location.href = '/sale/dailysale/exportlist'+param;
}