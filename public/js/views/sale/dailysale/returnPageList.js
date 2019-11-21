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
			,{header:"负责人", dataIndex:'SALER', width:'70px',sortable:false}
            ,{header:"销售时间", dataIndex:'SALEDATE', width:'80px',sortable:false}
            ,{header:"退货时间", dataIndex:'RETURNDATE', width:'80px',sortable:false}
//            ,{header:"售-数量", dataIndex:'SALE_COUNT', width:'70px',sortable:false}
//            ,{header:"售-订单总价", dataIndex:'COST_AMOUNT', width:'70px',sortable:false}
//            ,{header:"售-运费总价", dataIndex:'EXPRESS_AMOUNT', width:'70px',sortable:false}
//            ,{header:"售-其他费用", dataIndex:'OTHER_AMOUNT', width:'70px',sortable:false}
//            ,{header:"售-总成本", dataIndex:'COST_AMOUNT', width:'70px',sortable:false}
//            ,{header:"售-销售总价", dataIndex:'SALE_AMOUNT', width:'70px',sortable:false}

            ,{header:"退-数量", dataIndex:'TH_SALE_COUNT', width:'70px',sortable:false}
            ,{header:"退-订单总价", dataIndex:'TH_COST_AMOUNT', width:'70px',sortable:false}
            ,{header:"退-运费总价", dataIndex:'TH_EXPRESS_AMOUNT', width:'70px',sortable:false}
            ,{header:"退-其他费用", dataIndex:'TH_OTHER_AMOUNT', width:'70px',sortable:false}
            ,{header:"退-总成本", dataIndex:'TH_COST_AMOUNT', width:'70px',sortable:false}
            ,{header:"退-销售价格", dataIndex:'TH_SALE_AMOUNT', width:'70px',sortable:false}
		]
		,url:'/sale/dailysale/returnpagelist'
		,baseParams:initParams()
		,pageSizeList:[15, 30, 50]
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
		createrId:$('#createrId').val(),
		saler:$('#saler').val()
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

/**
 * 日销售退货模板下载
 */
$('#returnTemplateDownload').click(function(){
	window.location.href = '/template/xls/sale_dailysale_return_template.xls';
});

/**
 * 退货单数据导入
 * @returns
 */
function dataReturnImport(){
	layer.open({
		type:2,
		title:'日销售退货数据导入',
		shadeClose:false,
		shade:0.8,
		content:'/sale/dailysale/returnimportpage',
		area:['600px', '90%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function saleReturnExport(){
	var saleBillNo = $('#saleBillNo').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var createrId = $('#createrId').val();
	var saler = $('#saler').val();
	
	var param = '?saleBillNo='+saleBillNo+'&createrId='+createrId;
	param += '&startDate='+startDate+'&endDate='+endDate+'&saler='+saler;
	window.location.href = '/sale/dailysale/exportreturnlist'+param;
}