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
      ,{header: "订单来源", dataIndex: 'ORDERTYPENAME', width:'80px',sortable:false}
      ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'65px',sortable:false}
      ,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'65px',sortable:false}
      ,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
      ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'150px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
          var status = data['ORDERSTATUS']+'';
          var orderNo = data['ORDERNO'];
          //1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
          if(status == '8'){//待发券
			  returnText += ' | <a href="javascript:void(0);" onclick="sendCoupon(\''+orderNo+'\')" class="a_link">发券</a>';
    	  }else if(status == '20'){
    		  returnText += ' | <a href="javascript:void(0);" onclick="sendCoupon(\''+orderNo+'\')" class="a_link">确认发券</a>';
    	  }
          
          //终止操作
          if(status != '99'){
        	  returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+orderNo+'\')" class="a_link">终止</a>';
          }
          return returnText;
        }
      }
    ]
    ,url : '/thinkpadfans/order/pagelist'
    ,baseParams:initParams()
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
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

/**
 * 发券操作
 * @param orderId
 * @return
 */
function sendCoupon(orderNo){
	if(confirm('是否确认给用户支付Thinkworld红点？')){
		$.post('/thinkpadfans/order/sendcoupon', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				if(confirm('红点发放成功')){
				    doSearch();
				}
			}else{
				errorBox('付款失败：'+data);
			}
		});
	}
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(orderNo){
	$.layer({
	    type : 2,
	    title : '订单终止',
	    iframe : {src : '/order/order/tostoporder?orderNo='+orderNo},
	    area : ['500' , '350'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
}

function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
        tradeType:$('#tradeType').val(),
        orderType:$('#orderType').val(),
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

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}