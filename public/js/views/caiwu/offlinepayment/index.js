var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm : [
        	{header: "序号", dataIndex: 'R', width:'40px',sortable:false} 
        	,{header: "联系方式", dataIndex: '', width:'140px',sortable:false,
        		renderer : function(value, data, rowIndex, colIndex, metadata){
        			return data['LIANXIDH']+'('+data['LIANXIREN']+')';
             	}
        	}
            //,{header: "订单地址", dataIndex: 'DIZHI', width:'15%',sortable:false}
           ,{header: "器材名称", dataIndex: 'SHANGPINGMC',sortable:false,
       			renderer:function(value, data, rowInex, colIndex, metadata){
   					return data['PINGPAI']+' '+value;
      			}
           	}
           ,{header: "订单价格", dataIndex: 'DINGDANPRICE', width:'80px',sortable:false
         	  ,renderer : function(value, data, rowIndex, colIndex, metadata){
           	  if(data['SETTLEPRICE']){
           		  return data['DINGDANPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
           	  }else{
           		  return data['DINGDANPRICE'];
           	  }
             }
           }
           ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'120px',sortable:false}
           ,{header: "订单来源", dataIndex: 'SOURCENAME', width:'100px',sortable:false}
           ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'80px',sortable:false}
           ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'80px',sortable:false}
           ,{header: "操作", dataIndex: '', width:'200px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
        	   	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="orderInfo(\''+data['DINGDANNO']+'\')">查看</a>';
        	   	if(data['ZHIMA_ORDER_TYPE'] == '2'){
        	   		
        	   	}else{
        	   		if(data['DINGDANSTATUS'] == '4'){
        	   			returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="payment(\''+data['DINGDANNO']+'\')">付款</a>';
        	   		}else if(data['DINGDANSTATUS'] == '20'){
        	   			
        	   			var unPays = ['2','5','8','10','11','21','22','25','26','29','30','31','32','33','36','37','40','41','44','45','51','52'];
        	   			if($.inArray(data['ORDERSOURCES'], unPays) < 0){
        	   				returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="payment(\''+data['DINGDANNO']+'\')">确认付款</a>';
        	   			}
        	   		}
        	   	}
        	   	return returnText;
           }
       }
    ]
    ,url : '/caiwu/offlinepayment/orderpagelist'
    ,baseParams:{orderStatus:4}
    ,pageSizeList:[20,30,50]
  });
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/offline/orderinfo?backUrl=/caiwu/offlinepayment/index&orderNo="+orderNo;
}

/**
 * 付款
 * @param orderNo
 */
function payment(orderNo){
	
	var src = '/caiwu/offlinepayment/topayment?orderNo='+orderNo;
	$.layer({
	    type : 2,
	    title : '客户订单付款',
	    iframe : {src : src},
	    area : ['500px' , '420px'],
	    offset : ['50px','']
	});
}

function getParams(){
    return {
    	contacts:$('#contacts').val(),
    	merName:$('#merName').val(), 
    	orderType:$('#orderType').val(),
    	tradeType:$('#tradeType').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        orderNo:$('#orderNo').val(),
        orderStatus:4
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