var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize:10,
    height:250
    ,cm:[
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
      ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
      ,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
      	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['PNAME']+' '+data['MERNAME'];
        }
      }
      ,{header: "联系方式", dataIndex: 'LIANXIREN', width:'130px',sortable:false}
//      ,{header: "联系地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
//      ,{header: "订单来源", dataIndex: 'SOURCENAME', width:'100px',sortable:false}
//      ,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
      ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
    	  ,renderer : function(value, data, rowIndex, colIndex, metadata){
      	  if(data['SETTLEPRICE']){
      		  return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
      	  }else{
      		  return data['ORDERPRICE'];
      	  }
        }
      }
      ,{header: "补贴金额", dataIndex: 'EXT4', width:'70px',sortable:false}
//      ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
//      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" title="'+data['ORDERNO']+''+data['ORDERREMARKS']+'" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
          
          return returnText;
        }
      }
    ]
    ,url : '/order/order2/pagelist'
    ,baseParams:initParams()
    ,pageSizeList:[10,15,20,30,50]
	,afterRender:function(e, grid){
		$("#totalPrice span").html(grid.data['totalPrice']);
		$("#totalbtPrice span").html(grid.data['totalbtPrice']);
	}
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
	window.location.href = "/order/order2/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
        orderSource:$('#orderSource').val(),
        tradeType:$('#tradeType').val(),
        contactWay:$('#contactWay').val(),
        partnerCode:$('#partnerCode').val(),
        orderStatus:$('#orderStatus').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        category:$('#category').val(),
        merType:$('#merType').val(),
        finishstartDate:$('#finishstartDate').val(),
        finishendDate:$('#finishendDate').val(),
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

/**
 * 导出销售订单
 */
function downOrder(){
	var param = '';
//	param += 'merName=' + $('#merName').val();
//	param += '&orderNo=' + $('#orderNo').val();
//	param += '&orderSource=' + $('#orderSource').val();
//	param += '&tradeType=' + $('#tradeType').val();
//	param += '&contactWay=' + $('#contactWay').val();
//	param += '&partnerCode=' + $('#partnerCode').val();
//	param += '&orderStatus=' + $('#orderStatus').val();
	param += 'startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&finishstartDate=' + $('#finishstartDate').val();
	param += '&finishendDate=' + $('#finishendDate').val();
//	param += '&category=' + $('#category').val();
//	param += '&merType=' + $('#merType').val();
//	param += '&address=' + $('#address').val();
	window.location.href = '/order/order2/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}
