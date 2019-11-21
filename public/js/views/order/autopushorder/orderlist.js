var backUrl = '/order/autopushorder/orderlist';
var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'150px',sortable:false}
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
      ,{header: "订单来源", dataIndex: 'SOURCENAME', width:'100px',sortable:false}
      ,{header: "订单金额", dataIndex: 'ORDERPRICE', width:'70px',sortable:false}
      ,{header: "检测金额", dataIndex: 'SETTLEPRICE', width:'70px',sortable:false}
      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
      ,{header: "操作人", dataIndex: 'USERNAME', width:'70px',sortable:false}
      ,{header: "操作时间", dataIndex: 'OPERDATE', width:'80px',sortable:false}
      ,{header: "备注", dataIndex: 'ORDERREMARKS', width:'80px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'180px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">详情</a>';
          var status = data['ORDERSTATUS']+'';
          var orderType = data['ORDERTYPE']+'';
          var orderId = data['ORDERID'];
          var orderNo = data['ORDERNO'];
          var yhdBillId = data['YHDBILLID'];
          //1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
          
          if(status == '1'){//待审核
        	  returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">确认</a>';
          }else if(status == '2'){//待上门
        	  returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">上门</a>';
          }else if(status == '6'){//待用户发货
        	  returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">发货</a>';
          }else if(status == '7'){//待收货
        	  returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">收货</a>';
          }
    	  
          //终止操作
          if(status != '99' && status != '98' && status != '66' && status != '5'){
        	  returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+orderNo+'\')" class="a_link">终止</a>';
          }
          return returnText;
        }
      }
    ]
    ,url : '/order/autopushorder/getorderlist'
    ,baseParams:{keywords:keywords}
    ,pageSizeList:[10,15,20,30,50]
  });
  $('.search_bt').bind('click', function(){doSearch()});
});


/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}


/**
 * 订单电话确认/上门/发货/收货/
 * @param orderNo
 * @return
 */
function orderOperation(orderNo){
	$.layer({
	    type : 2,
	    title : '订单状态修改',
	    iframe : {src : '/order/order/operation?orderNo='+orderNo},
	    area : ['500' , '320'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
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

function call(customerNumber){
	$.get(url,{enterpriseId:enterpriseId, cno:cno, pwd:pwd, customerNumber:customerNumber}, function(data){
		alert(data);
	});
}

function getParams(){
    return {
        keywords:$('.search_txt').val()
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