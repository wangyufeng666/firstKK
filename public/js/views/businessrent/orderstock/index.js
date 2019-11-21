var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'5%', sortable:false}
		   ,{header:"库存ID", dataIndex:'STOCK_ID', width:'15%', sortable:false}	
		   ,{header:"商品名称", dataIndex:'PRODUCTNAME', width:'20%', sortable:false}		   	   
		   ,{header:"入库时间", dataIndex:'IN_DATE', width:'12%', sortable:false}
		   ,{header:"入库人", dataIndex:'IN_USER', width:'8%', sortable:false}		   
		   ,{header:"出库时间", dataIndex:'OUT_DATE', width:'12%', sortable:false}
		   ,{header:"出库人", dataIndex:'OUT_USER', width:'8%', sortable:false}		   
		   ,{header:"总订单号", dataIndex:'PARTNER_NO', width:'16%', sortable:false}
		   ,{header:"子订单号", dataIndex:'ORDER_NO', width:'16%', sortable:false}
		   ,{header:"批次编号", dataIndex:'BATCH_ID', width:'10%', sortable:false}
		   ,{header:"串号", dataIndex:'IMEI', width:'15%', sortable:false}
		   ,{header:"采购价", dataIndex:'PURCHASE', width:'8%', sortable:false}		   
		   ,{header:"状态", dataIndex:'', width:'8%', sortable:false
		   		,renderer : function(value, data, rowIndex, colIndex, metadata){
		   			if(data['STATUS'] == '1'){
		   				var returnText = '<span style="color:red">'+data['STATUSNAME']+'</span>';
		   			}else{
		   				var returnText = '<span>'+data['STATUSNAME']+'</span>';
		   			}
		   			return returnText;
                }
		}
           ,{header: "操作", dataIndex: '', width:'24%', sortable:false}       
		]
       ,url : '/businessrent/orderstock/stocklist'
	   ,baseParams:initParams()
	   ,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}
function getParams(){
    return {
    	imei:$.trim($('#imei').val()),
    	status:$('#status').val(),
    	batchId:$.trim($('#batchId').val()),
    	orderNo:$.trim($('#orderNo').val()),
    	inStartDate:$('#inStartDate').val(),
    };
}
function downStock(){
    var param = '';
    param += '&batchId=' + $.trim($('#batchId').val());
    param += '&orderNo=' + $.trim($('#orderNo').val());
    param += '&status=' + $('#status').val();
    param += '&imei=' + $.trim($('#imei').val());
    param += '&inStartDate=' + $('#inStartDate').val();
    window.location.href = '/businessrent/orderstock/exprotstock?'+param;
    return false; //截取返回false就不会保存网页了
}

function doSearch(){
    var index = layer.load(2, {time: 2*1000}); //2秒 
    layer.close(index);
   	grid.query(getParams());
}
