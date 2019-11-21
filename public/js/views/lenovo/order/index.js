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
      ,{header: "联系地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
      ,{header: "订单来源", dataIndex: 'ORDERTYPENAME', width:'80px',sortable:false}
      ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false}
      ,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'70px',sortable:false}
      ,{header: "支付方式", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
      ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'150px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
          
    	  var status = data['ORDERSTATUS']+'';
    	  var orderNo = data['ORDERNO'];
    	  var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
          
          //1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
          
          if(status == '1'){//待审核
        	  returnText+=' | <a href="javascript:void(0);" onclick="auditing(\''+orderNo+'\', \''+data['CHULITYPE']+'\')" class="a_link">电话确认</a>';
          }else if(status == '2'){//待上门
        	  returnText+=' | <a href="javascript:void(0);" onclick="visiting(\''+orderNo+'\')" class="a_link">上门</a>';
          }else if(status == '6'){//待用户发货
        	  returnText+=' | <a href="javascript:void(0);" onclick="delivered(\''+orderNo+'\')" class="a_link">用户发货</a>';
          }else if(status == '7'){//待收货
        	  returnText+=' | <a href="javascript:void(0);" onclick="receiving(\''+orderNo+'\')" class="a_link">收货</a>';
          }else if(status == '3'){//待检测
        	  if(data['INSPECTIONBILLID'] != null){
        		  returnText += ' | <a href="javascript:void(0);" onclick="inspectionAgain(\''+orderNo+'\')" class="a_link">重新检测</a>';
        	  }else{
        		  returnText += ' | <a href="javascript:void(0);" onclick="orderInspection(\''+orderNo+'\')" class="a_link">检测</a>';
        	  }
          }
          
          //待发券
          if(status == '8'){
        	  returnText += ' | <a href="javascript:void(0);" onclick="sendCoupon(\''+orderNo+'\')" class="a_link">发券</a>';
          }else if(status == '20'){
        	  returnText += ' | <a href="javascript:void(0);" onclick="sendCoupon(\''+orderNo+'\')" class="a_link">确认发券</a>';
          }
          
          //终止操作
          if(status != '99' && status != '66' && status != '5'){
        	  returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+orderNo+'\', \''+status+'\')" class="a_link">终止</a>';
          }
          return returnText;
        }
      }
    ]
    ,url : '/lenovo/order/pagelist'
  });
});

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo;
}

/**
 * 订单电话确认
 * @param orderNo
 * @return
 */
function auditing(orderNo){
	$.layer({
	    type : 2,
	    title : '订单状态修改',
	    iframe : {src : '/lenovo/order/operation?orderNo='+orderNo},
	    area : ['500' , '320'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
}

/**
 * 上门操作
 * @param orderId
 * @return
 */
function visiting(orderNo){
	$.layer({
	    type : 2,
	    title : '订单状态修改',
	    iframe : {src : '/lenovo/order/operation?orderNo='+orderNo},
	    area : ['500' , '320'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
}

/**
 * 待用户发货
 */
function delivered(orderNo){
	$.layer({
	    type : 2,
	    title : '订单状态修改',
	    iframe : {src : '/lenovo/order/operation?orderNo='+orderNo},
	    area : ['500' , '320'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
}

/**
 * 收货操作
 * @param orderId
 * @return
 */
function receiving(orderNo){
	$.layer({
	    type : 2,
	    title : '订单状态修改',
	    iframe : {src : '/lenovo/order/operation?orderNo='+orderNo},
	    area : ['500' , '320'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
}

/**
 * 检测操作
 * @param orderId
 * @return
 */
function orderInspection(orderNo){
	window.location.href = "/lenovo/order/orderinspection?orderNo="+orderNo;
}

/**
 * 再次检测
 * @param orderId
 * @return
 */
function inspectionAgain(orderId){
	if(confirm('是否确认再次检测？')){
		$.post('/yhd/dingdan/inspectionagain', {orderId:orderId}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('再次检测失败');
			}
		});
	}
}

/**
 * 发券操作
 * @param orderId
 * @return
 */
function sendCoupon(orderNo){
	if(confirm('是否确认发券？')){
		$.post('/lenovo/order/sendcoupon', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				if(confirm('发券成功')){
				    doSearch();
				}
			}else{
				errorBox('发券失败');
			}
		});
	}
}

/**
 * 入库操作
 * @param orderId
 * @return
 */
function warehousing(orderNo){
	if(confirm('是否确认入库？')){
		$.post('/lenovo/order/warehousing', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('入库失败'+data);
			}
		});
	}
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(orderNo, status){
	$.layer({
	    type : 2,
	    title : '修改',
	    iframe : {src : '/lenovo/order/tostoporder?orderNo='+orderNo+'&orderStatus='+status},
	    area : ['450' , '280'],
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

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}