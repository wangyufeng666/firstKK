var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10
    ,height:250
    ,cm : [
           {header: "No.", dataIndex: 'R', width:'40px',sortable:false}
           ,{header: "订单编码", dataIndex: 'ORDERNO', width:'80px',sortable:false
               ,renderer : function(value, data, rowIndex, colIndex, metadata){
                 return '<a href="javascript:void(0)" onclick="orderInfo(\''+value+'\')" title="'+value+'" class="a_link">'+value+'</a>';
               }
            }
           ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
           ,{header: "商品名称", dataIndex: 'MERNAME', sortable:false,
        	   renderer:function(value, data, rowIndex, colIndex, metadata){
        	   	   return data['PNAME']+"  "+value;
           	   }
           }
           ,{header: "订单价格", dataIndex: 'DINGDANPRICE', width:'70px',sortable:false}
           ,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'70px',sortable:false}
           ,{header: "入库日期", dataIndex: 'STRINWAREDATE', width:'100px',sortable:false}
           ,{header: "出库日期", dataIndex: 'STROUTWAREDATE', width:'100px',sortable:false}
           ,{header: "订单来源", dataIndex: 'ORDERTYPE', width:'100px',sortable:false}
           ,{header: "结算方式", dataIndex: 'EVENTNAME', width:'100px',sortable:false}
           ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'80px',sortable:false}
           ,{header: "库存状态", dataIndex: 'INVENTORYSTATUS', width:'90px',sortable:false,
		        renderer : function(value, data, rowIndex, colIndex, metadata){
        	   		if(value == '已入库'){
        	   			return '<font color="green">已入库</font>';
        	   		}else if(value == '已出库'){
        	   			return '<font color="red"><del>已出库</del></font>';
        	   		}else{
        	   			return value;
        	   		}
           		}
           }
    ]
    ,url : '/warehouse/order/indexorderlist'
  	,pageSizeList:[10, 15, 20, 30, 50]
  });
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl=/warehouse/order/index";
}

/**
 * 入库操作
 * @param orderId
 * @return
 */
function inWarehouse(orderNo, spId){
	if(confirm('是否确认入库？')){
		$.post('/warehouse/order/inwarehouse', {orderNo:orderNo, spId:spId}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				alert('订单状态修改错误');
			}
		});
	}
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(), //商品名称
    	merName:$('#merName').val(), //商品名称
    	merType:$('#merType').val(),//商品类型
    	category:$('#category').val(),//品类
    	orderType:$('#orderType').val(),//订单类型
    	tradeType:$('#tradeType').val(),//交易类型
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        inventoryStatus:$('#inventoryStatus').val()//库存状态
    };
}

function doSearch(){
	layer.msg('正在查询，请稍后...', 2, 16);
    var s = grid.query(getParams());
}

//监听回车键
$('html').keydown(function(e){
	if(e.which == '13'){
		doSearch();
	}
});