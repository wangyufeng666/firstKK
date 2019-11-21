var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'4%', sortable:false}
		   ,{header:"创建时间", dataIndex:"CREATEDATE", width:'15%', sortable:false}
		   ,{header:"订单来源", dataIndex:'ORDER_SOURCENAME', width:'15%', sortable:false}
           ,{header: "订单号", dataIndex: 'ORDER_NO', width:'25%',sortable:false}
		   ,{header:"商品名", dataIndex:'PRODUCTNAME', width:'14%', sortable:false}
		   ,{header:"新机价格", dataIndex:'NEW_PRODUCT_PRICE', width:'10%', sortable:false}
		   ,{header:"旧机价格", dataIndex:'OLD_PRODUCT_PRICE', width:'10%', sortable:false}
		   ,{header:"总期数", dataIndex:'TOTAL_PERIODS', width:'14%', sortable:false}
		   ,{header:"每期付费", dataIndex:'PERIOD_PRICE', width:'14%', sortable:false}
		   ,{header:"分期总费用", dataIndex:'TOTAL_PRICE', width:'14%', sortable:false}
		   ,{header:"结算金额", dataIndex:'SETTLEMENT_AMOUNT', width:'14%', sortable:false}
		   ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'14%', sortable:false}
           ,{header:"采购状态", dataIndex:'ISPURCHASENAME', width:'14%', sortable:false}           
           ,{header: "操作", dataIndex: '', width:'15%', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDER_NO'];
					var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}       
		]
       ,url : '/businessrent/order/sonInstallmentlist'
	   ,pageSizeList:[10,15,20,30,50]
       ,baseParams:initParams()

	});
});

function initParams(){	
	var params = getParams();
	return params;
}

function getParams(){
    return {
      partnerNo:$('#partnerNo').val(),
      sourceCode:$('#sourceCode').val()
    };
}
/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	var sign = $('#sign').val();
	window.location.href = "/businessrent/order/sonorderinfo?orderNo="+orderNo+"&sign="+sign;
}

function doSearch(){
    var index = layer.load(2, {time: 2*1000}); //2秒 
    layer.close(index);
   	grid.query(getParams());
}

