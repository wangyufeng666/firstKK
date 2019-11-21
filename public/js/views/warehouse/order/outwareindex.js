var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
           {header: "序号", dataIndex: 'R', width:'5%',sortable:false} 
          ,{header: "联系方式", dataIndex: '', width:'15%',sortable:false
         	 ,renderer : function(value, data, rowIndex, colIndex, metadata){
               return data['LIANXIDH']+'('+data['LIANXIREN']+')';
             }
           }
		    ,{header: "器材名称", dataIndex: 'MERNAME', width:'18%',sortable:false,
		    	renderer:function(value, data, rowInex, colIndex, metadata){
					return data['PNAME']+' '+value;
  				}
		    }
//           ,{header: "器材名称", dataIndex: 'MERNAME', width:'15%',sortable:false}
           ,{header: "订单价格", dataIndex: 'DINGDANPRICE', width:'6%',sortable:false}
           ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'8%',sortable:false}
           ,{header: "订单地址", dataIndex: 'DIZHI', width:'15%',sortable:false}
           ,{header: "订单来源", dataIndex: 'ORDERTYPE', width:'7%',sortable:false}
           ,{header: "交易方式", dataIndex: 'CHULITYPE', width:'10%',sortable:false}
           ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'7%',sortable:false}
           ,{header: "操作", dataIndex: '', width:'12%', sortable:false,
		        renderer : function(value, data, rowIndex, colIndex, metadata){
		    	  var returnText ='<a class="a_link" href="javascript:void(0);" onclick="orderInfo(\''+data['KEHUDINGDANID']+'\')">查看</a>';
		          returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="outWarehouse(\''+data['KEHUDINGDANID']+'\',\''+data['DINGDANNO']+'\')">出库</a>';
		    	  return returnText;
		        }
           	}
    ]
    ,url : '/warehouse/order/outwareorderlist'
  });
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderId){
	window.location.href = "/dingdan/dingdan/orderinfo?backUrl=/warehouse/order/outwareindex&orderId="+orderId;
}

/**
 * 入库操作
 * @param orderId
 * @return
 */
function outWarehouse(orderId, orderNo){
	if(confirm('是否确认出库？')){
		$.post('/warehouse/order/outwarehouse', {orderId:orderId, orderNo:orderNo}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('订单状态修改错误');
			}
		});
	}
}

function getParams(){
    return {
    	contacts:$('#contacts').val(),
    	merName:$('#merName').val(), 
    	orderType:$('#orderType').val(),
    	tradeType:$('#tradeType').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}