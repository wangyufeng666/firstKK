var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
      ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
      ,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
      	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['PNAME']+' '+data['MERNAME'];
        }
      }
      ,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
    	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['LIANXIDH']+'('+data['LIANXIREN']+')';
        }
      } 
      ,{header: "订单地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
      ,{header: "订单来源", dataIndex: 'ORDERTYPENAME', width:'130px',sortable:false}
      ,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
      ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
    	  ,renderer : function(value, data, rowIndex, colIndex, metadata){
      	  if(data['SETTLEPRICE']){
      		  return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
      	  }else{
      		  return data['ORDERPRICE'];
      	  }
        }
      }
      ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'80px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var orderNo = data['ORDERNO'];
    	  var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
          return returnText;
        }
      }
    ]
    ,url : '/bierengle/order/pagelist'
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

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/bierengle/order/leorderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
    	orderType:$('#orderType').val(),
        tradeType:$('#tradeType').val(),
        contactWay:$('#contactWay').val(),
        orderStatus:$('#orderStatus').val(),
        startDate:$('#startCreateDate').val(),
        endDate:$('#endCreateDate').val(),
        category:$('#category').val(),
        merType:$('#merType').val(),
        address:$('#address').val()
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