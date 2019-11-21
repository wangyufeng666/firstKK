var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
      ,{header: "商品品类", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
      ,{header: "商品名称", dataIndex: 'MERNAME',sortable:false
      	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['PNAME']+' '+data['MERNAME'];
        }
      }
      ,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
    	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['LIANXIDH']+'('+data['LIANXIREN']+')';
        }
      } 
      ,{header: "联系地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
      ,{header: "新机名称", dataIndex: 'NEWMERNAME', width:'100px',sortable:false}
      ,{header: "订单来源", dataIndex: 'STORENAME', width:'120px',sortable:false}
      ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'65px',sortable:false}
      ,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'65px',sortable:false}
      ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'65px',sortable:false}
      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'65px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'60px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
          return returnText;
        }
      }
    ]
    ,url : '/lenovo/storeorder/pagelist'
  });
});

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/lenovo/storeorder/orderinfo?orderNo="+orderNo;
}

function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
    	orderType:$('#orderType').val(),
        tradeType:$('#tradeType').val(),
        contactWay:$('#contactWay').val(),
        orderStatus:$('#orderStatus').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        category:$('#category').val(),
        merType:$('#merType').val(),
        address:$('#address').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
