var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"销售单号", dataIndex:'SALEBILLNO', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return "<a class='a_link' href='javaScript:saleInfo(\"" + value + "\")'>"+value+"</a> ";
				}
			}
			,{header:"回收单号", dataIndex:'RECYORDERNO', width:'120px',sortable:false}
			,{header:"库存状态", dataIndex:'INVENTORYSTATUSNAME', width:'70px',sortable:false}
            ,{header:"负责人", dataIndex:'SPONSOR', width:'65px',sortable:false}
            ,{header:"销售时间", dataIndex:'SALEDATE', width:'80px',sortable:false}
            ,{header:"商品品类", dataIndex:'CATEGORYNAME', width:'65px',sortable:false}
            ,{header:"商品名称", dataIndex:'PRODUCTNAME', width:'70px',sortable:false}
            ,{header:"订单总价", dataIndex:'COST_PRICE', width:'65px',sortable:false}
            ,{header:"运费总价", dataIndex:'EXPRESS_PRICE', width:'65px',sortable:false}
            ,{header:"其他费用", dataIndex:'OTHER_PRICE', width:'65px',sortable:false}
            ,{header:"总成本", dataIndex:'COST_PRICE', width:'65px',sortable:false}
            ,{header:"销售价格", dataIndex:'SALE_PRICE', width:'65px',sortable:false}
            ,{header:"毛利率(%)", dataIndex:'PROFIT_RATE', width:'70px',sortable:false}
            ,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
            ,{header:"操作", dataIndex:'PKID', width:'70px', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                	return "<a class='a_link' href='javaScript:saleDetailInfo(\"" + value + "\")'>详情</a>";
                }
            }
		]
		,url:'/sale/dailysalefirm/detailpagelist'
		,baseParams:initParams()
		,pageSizeList:[15, 30, 50, 100]
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});
	
	//日期验证
	$('#startDate').click(function(){
		WdatePicker({
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
		status:$('#status').val(),
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
 * 销售单详情
 */
function saleInfo(saleBillNo){
	layer.open({
		type:2,
		title:'销售单详情',
		shadeClose:false,
		shade:0.8,
		content:'/sale/dailysalefirm/salebillinfo?saleBillNo='+saleBillNo,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 销售详情
 */
function saleDetailInfo(detailId){
	layer.open({
		type:2,
		title:'销售明细详情',
		shadeClose:false,
		shade:0.8,
		content:'/sale/dailysalefirm/saledetailinfo?detailId='+detailId,
		area:['600px' , '400px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function saleDetailExport(){
	var saleBillNo = $('#saleBillNo').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var status = $('#status').val();
	var saler = $('#saler').val();
	var param = '?saleBillNo='+saleBillNo+'&status='+status+'&startDate='+startDate+'&endDate='+endDate+'&saler='+saler;
	window.location.href = '/sale/dailysalefirm/exportdetaillist'+param;
}
