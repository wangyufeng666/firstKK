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
      ,{header: "订单来源", dataIndex: 'SOURCENAME', width:'80px',sortable:false}
      ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false}
      ,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'70px',sortable:false}
      ,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
      ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var orderNo = data['ORDERNO'];
    	  var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
          var status = data['ORDERSTATUS']+'';
          var orderType = data['ORDERTYPE']+'';
          //1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
    	  //待检测
    	  if(status == '8' && (orderType == '64' || orderType == '65')){
			  returnText += ' | <a href="javascript:void(0);" onclick="sendCoupon(\''+orderNo+'\',\''+data['SETTLEPRICE']+'\',\''+data['EVENTNAME']+'\')" class="a_link">发券</a>';
          }else if(status == '20' && (orderType == '64' || orderType == '65')){
        	  returnText += ' | <a href="javascript:void(0);" onclick="sendCoupon(\''+orderNo+'\',\''+data['SETTLEPRICE']+'\',\''+data['EVENTNAME']+'\')" class="a_link">确认发券</a>';
          }
          return returnText;
        }
      }
    ]
    ,url : '/order/raytine/pagelist'
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
	window.location.href = "/order/raytine/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}


/**
 * 发券操作
 * @param orderId
 * @return
 */
function sendCoupon(orderNo,couponValue,couponName){
	if(confirm('是否确认发放面额为'+couponValue+'元的'+couponName+'？')){
		if(couponValue > 0){
			$.post('/order/raytine/sendcoupon', {orderNo:orderNo}, function(data){
				if(data == 'Y'){
					successBox("发券成功");
					doSearch();
				}else{
					errorBox('发券失败：'+data);
				}
			});
		}else{
			errorBox('发券金额错误');
		}
	}
	
}

function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
    	orderType:$('#orderType').val(),
        tradeType:$('#tradeType').val(),
        contactWay:$('#contactWay').val(),
        orderStatus:$('#orderStatus').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
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