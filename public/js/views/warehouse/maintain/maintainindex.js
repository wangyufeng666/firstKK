var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
           {header: "NO.", dataIndex: 'R', width:'35px',sortable:false}
           ,{header: "订单编码", dataIndex: 'ORDERNO', width:'80px',sortable:false
               ,renderer : function(value, data, rowIndex, colIndex, metadata){
                 var url = '/order/order/orderinfo?orderNo='+data['ORDERNO']+'';
                 return '<a href="javascript:void(0)" onclick="orderInfo(\''+value+'\')" title="'+value+'" class="a_link">'+value+'</a>';
               }
           }
           ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
           ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
           ,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
           	,renderer : function(value, data, rowIndex, colIndex, metadata){
               return data['PNAME']+' '+data['MERNAME'];
             }
           }
          ,{header: "联系方式", dataIndex: '', width:'140px',sortable:false
         	 ,renderer : function(value, data, rowIndex, colIndex, metadata){
               return data['LIANXIDH']+'('+data['LIANXIREN']+')';
             }
           }
           ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'65px',sortable:false}
           ,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'65px',sortable:false}
           ,{header: "订单地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
           ,{header: "订单来源", dataIndex: 'ORDERTYPENAME', width:'80px',sortable:false}
           ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
           ,{header: "操作", dataIndex: '', width:'60px', sortable:false,
		        renderer : function(value, data, rowIndex, colIndex, metadata){
		    	  var returnText ='<a class="a_link" href="javascript:void(0);" onclick="mainTain(\''+data['ORDERNO']+'\', \''+data['MERID']+'\')">维修</a>';
		    	  return returnText;
		        }
           	}
    ]
    ,url : '/warehouse/maintain/maintainlist'
  });
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function mainTain(orderNo){
	window.location.href = "/warehouse/maintain/ordermaintain?orderNo="+orderNo+"&backUrl="+backUrl;
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(),
    	merName:$('#merName').val(),
    	contacts:$('#contacts').val(),
    	orderType:$('#orderType').val(),
    	tradeType:$('#tradeType').val(),
    	category:$('#category').val(),
    	merType:$('#merType').val(),
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