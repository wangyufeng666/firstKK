var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
           {header: "订单编码", dataIndex: 'ORDERNO', width:'160px',sortable:false
               ,renderer : function(value, data, rowIndex, colIndex, metadata){
                 var url = '/order/order/orderinfo?orderNo='+data['ORDERNO']+'';
                 return '<a href="javascript:void(0)" onclick="orderInfo(\''+value+'\')" title="'+value+'" class="a_link">'+value+'</a>';
               }
           }
           ,{header: "支付时间", dataIndex: 'PAYDATE', width:'130px',sortable:false} 
           ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
           ,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
           	,renderer : function(value, data, rowIndex, colIndex, metadata){
               return data['PNAME']+' '+data['MERNAME'];
             }
           }
           ,{header: "联系方式", dataIndex: 'MERNAME', width:'150px',sortable:false
              	,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['LIANXIREN']+' ('+data['LIANXIDH']+')';
                }
              }
           ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'65px',sortable:false}
           ,{header: "成交价格", dataIndex: 'PAYPRICE', width:'65px',sortable:false}
           ,{header: "订单来源", dataIndex: 'SOURCENAME', width:'100px',sortable:false}
           ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
           ,{header: "库存状态", dataIndex: 'INVENTORYSTATUSNAME', width:'90px',sortable:false}
           ,{header: "操作", dataIndex: '', width:'60px', sortable:false,
		        renderer : function(value, data, rowIndex, colIndex, metadata){
		        	var returnText;
		        	if(data['DINGDANSTATUS'] == '5'){
		        		returnText ='<a class="a_link" href="javascript:void(0);" onclick="inWarehouse(\''+data['ORDERNO']+'\', \''+data['MERID']+'\')">入库</a>';
		        	}else if(data['INVENTORYSTATUS'] == '6'){
		        		returnText ='<a class="a_link" href="javascript:void(0);" onclick="willOutWarehouse(\''+data['ORDERNO']+'\')">预出库</a>';
		        	}if(data['INVENTORYSTATUS'] == '7'){
		        		returnText ='<a class="a_link" href="javascript:void(0);" onclick="outWarehouse(\''+data['ORDERNO']+'\')">出库</a>';
		        	}
		        	return returnText;
		        }
           	}
    ]
    ,url : '/warehouse/order/storeorderlist'
    ,baseParams:{orderStatus:5}
  });
});


$(document).ready(function(){
	$('#orderNo').focus();
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?backUrl=/warehouse/order/inwareindex&orderNo="+orderNo;
}

/**
 * 入库操作
 * @param orderId
 * @return
 */
function inWarehouse(orderNo, spId){
	if(confirm('是否确认入库？')){
		$.post('/warehouse/order/inwarehouse', {orderNo:orderNo, spId:spId, isStoreorder:'Y'}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('订单状态修改错误');
			}
		});
	}
}

/**
 * 门店订单预出库操作
 * @param orderId
 * @return
 */
function willOutWarehouse(orderNo){
	if(confirm('是否确认预出库？')){
		$.post('/warehouse/order/willoutwarehouse', {orderNo:orderNo, inventoryStatus:'7'}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('订单状态修改错误');
			}
		});
	}
}

/**
 * 门店订出库操作
 * @param orderId
 * @return
 */
function outWarehouse(orderNo, spId){
	if(confirm('是否确认出库？')){
		$.post('/warehouse/order/storeoutwarehouse', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('订单状态修改错误');
			}
		});
	}
}

/**
 * 门店订单全部出库
 * @param orderId
 * @return
 */
function outWarehouseAll(){
	if(confirm('是否确认全部出库？')){
		$.post('/warehouse/order/storeoutwarehouseall', function(data){
			if(data['flag'] == 'Y'){
				alert('有'+data['num']+'个器材出库');
				doSearch();
			}else{
				errorBox('全部出库错误');
			}
		});
	}
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(),
    	merName:$('#merName').val(), 
    	contacts:$('#contacts').val(),
    	orderType:$('#orderType').val(),
    	tradeType:$('#tradeType').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        inventoryStatus:$('#inventoryStatus').val(),
        category:$('#category').val(),
        merType:$('#merType').val()
    };
}

function storeReport(){
	$('#form1').submit();
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
    $('#orderNo').focus();
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}

function scan(){
	var orderStr = $('#orderNo').val();
	var pos;
	if( (pos = orderStr.indexOf('≌'))>0){
		var orderNo=orderStr.substr(0,pos);
		layer.load('订单编号：'+orderNo, 1);
		grid.query({orderNo:orderNo,orderStatus:5});
		$('#orderNo').val('');
	}
}
