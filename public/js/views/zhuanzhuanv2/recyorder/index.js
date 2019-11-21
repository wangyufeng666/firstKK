var grid;
var layerIndex = 0;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false
              ,renderer:function(value, data, rowIndex, colIndex, metadata){
                  var orderNo = data['ORDERNO'];
                  var partnerOrderNo = data['YHDBILLCODE'];
                  var merName = data['PNAME']+' '+data['MERNAME'];
                  var orderPrice = data['ORDERPRICE']+'——'+data['SETTLEPRICE'];
                  return '<span title="'+orderNo+'" ondblclick="showRemark(\''+orderNo+'\', \''+partnerOrderNo+'\', \''+merName+'\', \''+orderPrice+'\')">'+data['STRORDERDATE']+'</span>';
              }
        }
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
      ,{header: "订单来源", dataIndex: 'ORDERTYPENAME', width:'70px',sortable:false}
      ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var orderNo = data['ORDERNO'];
    	  var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
          var status = data['ORDERSTATUS']+'';
          //1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
            if(status == '1'){//待审核
                returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">确认</a>';
            }else if(status == '6'){//待用户发货
                returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">发货</a>';
            }else if(status == '7'){//待收货
                returnText+=' | <a href="javascript:orderOperation(\''+orderNo+'\')" class="a_link">收货</a>';
            }
         //待检测
         if(status == '3'){
            if(data['INSPECTIONBILLID'] != null){
                returnText += ' | <a href="javascript:orderInspection(\''+orderNo+'\')" class="a_link">复检</a>';
            }else{
                returnText += ' | <a href="javascript:orderInspection(\''+orderNo+'\')" class="a_link">检测</a>';
            }
         }
          return returnText;
        }
      }
    ]
    ,url : '/zhuanzhuanv2/recyorder/pagelist'
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
    layer.open({
        type:2,
        title:'订单详情',
        content:'/order/order/orderinfo?orderNo='+orderNo+'&backUrl='+backUrl,
        shadeClose:false,
        shade:0.8,
        area:['100%' , '100%'],
        close:function(index){
            layer.close(index);
        }
    });
}


/**
 * 支付
 * @param orderId
 * @return
 */
function sendCoupon(orderNo,cashValue){
    var orderNo = orderNo;
    var cashValue = cashValue;
    if(cashValue > 0){
        var src = '/zhuanzhuanv2/recyorder/cashpaypage?orderNo='+orderNo+'&cash='+cashValue;
        // layer.open({type:2,title:'订单现金转账',iframe:{src:src},area:['500px','350px']});
        layer.open({
            type:2,
            title:'订单现金转账',
            content:src,
            shadeClose:false,
            shade:0.8,
            area:['500px','350px'],
            close:function(index){
                layer.close(index);
            }
        });
    }else{
        errorBox('发券金额错误');
    }
}

/**
 * 检测操作
 * @param orderId
 * @return
 */
function orderInspection(orderNo){

    layer.open({
        type:2,
        title:'订单检测',
        content:'/order/order/orderinspection?orderNo='+orderNo+'&layer=Y',
        shadeClose:false,
        shade:0.8,
        area:['100%' , '100%'],
        close:function(index){
            layer.close(index);
        }
    });
}

function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
        contactWay:$('#contactWay').val(),
        orderStatus:$('#orderStatus').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        category:$('#category').val(),
        merType:$('#merType').val(),
        partnerOrderNo:$('#partnerOrderNo').val(),
        orderSource:$('#orderSource').val(),
        address:$('#address').val()
    };
}

function doSearch(){
    grid.query(getParams());
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo,partnerOrderNo, merName, orderPrice){
    layer.close(layerIndex);
    $.post('/recycle/order/jsonremark',{orderNo:orderNo}, function(data){
        layerIndex = layer.open({
            type:1, shade:false, title:false, area:['650px', 'auto'],
            content:'<div class="layer_notice">订单编码： '+orderNo+'<br/>转转订单编码： '+partnerOrderNo+'<br/>商品名称：'+merName+'<br/>订单金额：'+orderPrice+'<br/>'+data+'</div>'
        });
    });
}

/**
 * 订单电话确认/上门/发货/收货/
 * @param orderNo
 * @return
 */
function orderOperation(orderNo){
    layer.open({
        type:2,
        title:'订单状态修改',
        content:'/order/order/operation?orderNo='+orderNo,
        shadeClose:false,
        shade:0.8,
        area:['500px' , '320px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 下载报表
 * @param msg
 */
function downLoad(){
    var data = getParams();
    var params = 'merName='+data.merName+'&orderNo='+data.orderNo+'&contactWay='+data.contactWay+'&orderStatus='+data.orderStatus+'&startDate='+data.startDate+'&endDate='+data.endDate;
        params += '&category'+data.category+'&merType'+data.merType+'&partnerOrderNo'+data.partnerOrderNo+'&address'+data.address;
    window.location.href='/zhuanzhuanv2/recyorder/export?'+params;

}

function errorBox(msg){
    layer.msg(msg);
}

function reload(){
    layer.closeAll();
    grid.reload();
}