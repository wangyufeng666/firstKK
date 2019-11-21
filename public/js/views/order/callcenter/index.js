var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
      ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'60px',sortable:false}
      ,{header: "器材名称", dataIndex: 'MERNAME', width:'80px',sortable:false
      	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['PNAME']+' '+data['MERNAME'];
        }
      }
          ,{header: "品类报价", dataIndex: 'QUOTE', width:'60px',sortable:false
              ,renderer : function(value, data, rowIndex, colIndex, metadata){
          			if(data['ORDERTYPE']=='71' || data['ORDERTYPE']=='73'){
                        if(value > 0){
                            return '<font color="green">已报价</font>';
                        }else{
                            return '<font color="red">未报价</font>';
                        }
					}


              }
          }
      ,{header: "联系方式", dataIndex: '', width:'100px',sortable:false
    	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['LIANXIDH']+'('+data['LIANXIREN']+')';
        }
      }
      ,{header: "订单来源", dataIndex: '', width:'100px',sortable:false
			,renderer:function(value, data, rowIndex, colIndex, metadata){
				var channel ='';
				if(data['ORDERTYPE']=='71' || data['ORDERTYPE']=='73'){
					if(data['CHANNEL']=='idle'){
						channel = '闲鱼';
					}else if(data['CHANNEL']=='tmall'){
						channel = '天猫';
					}else if(data['CHANNEL']=='alipay'){
						channel = '支付宝';
					}else if(data['CHANNEL']=='taobao'){
						channel = '淘宝';
					}else if(data['CHANNEL']=='tmall-service'){
						channel = '天猫以旧换新';
					}
				}
				if(channel){
					return data['ORDERTYPENAME']+'('+channel+')';
				}else{
					return data['ORDERTYPENAME'];
				}
			}
		}
      ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
    	  ,renderer : function(value, data, rowIndex, colIndex, metadata){
      	  if(data['SETTLEPRICE']){
      		  return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
      	  }else{
      		  return data['ORDERPRICE'];
      	  }
        }
      }
      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
      ,{header: "操作人", dataIndex: 'USERNAME', width:'70px',sortable:false}
      ,{header: "操作时间", dataIndex: 'OPERDATE', width:'70px',sortable:false}
      ,{header: "备注", dataIndex: 'ORDERREMARKS', width:'80px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'200px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">详情</a>';
          var status = data['ORDERSTATUS']+'';
          var orderType = data['ORDERTYPE']+'';
          var orderId = data['ORDERID'];
          var orderNo = data['ORDERNO'];
          var yhdBillId = data['YHDBILLID'];
          var zhimaPayFlag = data['ZHIMAPAYINFOFLAG'];
          var creditCouponFlag = data['CREDITCOUPONFLAG'];
          //1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
          
          if(status == '1'){//待审核
        	  returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">确认</a>';
          }else if(status == '2'){//待上门
        	  returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">上门</a>';
          }else if(status == '6'){//待用户发货
        	  returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">发货</a>';
          }else if(status == '7'){//待收货
        	  returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+orderNo+'\')" class="a_link">收货</a>';
          }else if(status == '8' || status == '4'){//确认支付
	          returnText+='| <a href="javascript:void(0);" onclick="confirmPay(\''+orderNo+'\')" class="a_link">确认支付</a>';
	      }
          //终止操作 94:退券终止；95:转现终止；96:自动终止；97:当地回收；98:终止退回；99:终止
    	  var stopStatuss = ['20','66','94','95','96','97','98','99'];
          if($.inArray(status, stopStatuss) < 0){
        	  returnText+='| <a href="javascript:void(0);" onclick="stopOrder(\''+orderNo+'\',\''+orderType+'\',\''+zhimaPayFlag+'\',\''+creditCouponFlag+'\')" class="a_link">终止</a>';
          }
          
          returnText+='| <a href="javascript:void(0);" onclick="call(\''+data['LIANXIDH']+'\')" class="a_link">外呼</a>';
          return returnText;
        }
      }
    ]
    ,url : '/order/callcenter/pagelist'
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
function stopOrder(orderNo, orderType, zhimaPayFlag, creditCouponFlag){
	var url = '/order/order/tostoporder?orderNo='+orderNo;
	var title = '订单终止';
/*	var array = ['5001','5002','5003','5004','5005','5006','5007','5008','5009','5100','5101','5102','5103','5104','5123'
	             ,'5105','5106','5107','5108','5109','5110','5112','5113','5114','5115','5116','5117','5118','5119','5120','5121','5122',
	             '5124','5125','5126','5127','5128','5129','5130','5131','5132','5133','5134','5135','5136','5137','5138','5139'];*/
	// 根据订单来源查询合作商businesscode，如果是11 则为设备回收机回收
	var businesscode = getBusinesscodeBySource(orderType);
	if(orderType == '70'){//闲鱼信用回收
		url = '/idlefish/recyorder/tostoporder?orderNo='+orderNo;
		title = '闲鱼信用回收订单终止';
	}if(orderType == '71'){//闲鱼二期信用回收
		url = '/idlefishv2/recyorder/tostoporder?orderNo='+orderNo;
		title = '闲鱼信用回收订单终止';
	}if(orderType == '73'){//闲鱼三期信用回收
		url = '/idlefishv3/recyorder/tostoporder?orderNo='+orderNo;
		title = '闲鱼信用回收订单终止';
	}else if(orderType == '66'){//信用回收订单
		url = '/zhima/recyorder/tostoporder?orderNo='+orderNo;
		title = '芝麻信用回收订单终止';
	}else if(orderType == '92'){//信用回收订单
        url = '/zhima/baichuanorder/tostoporder?orderNo='+orderNo;
        title = '百川信用回收订单终止';
    }else if(creditCouponFlag == 'Y'){//支付宝天猫店
		url = '/zhima/offlinemall/tostoporder?orderNo='+orderNo;
		title = '天猫店信用回收订单终止';
	}else if(orderType == '175' && zhimaPayFlag == 'Y'){
		url = '/zhima/recyorder/tostoporder?orderNo='+orderNo;
		title = '线下信用回收订单终止';
	}else if(orderType == '74'){//信用回收订单
		url = '/zhimaapp/recyorder/tostoporder?orderNo='+orderNo;
		title = '芝麻小程序信用回收订单终止';
	}else if(businesscode == '11'){//设备回收
		url = '/order/device/tostoporder?orderNo='+orderNo;
		title = '设备回收订单终止';
    }
	$.layer({
	    type : 2,
	    title : title,
	    iframe : {src : url},
	    area : ['500' , '350'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
}

function getBusinesscodeBySource(source) {
    var businesscode = "";
    $.ajax({
        type : "post",
        url : "/order/order/getbusinesscodebysource",
        data : {source:source},
        async : false,
        success : function(result){
			businesscode = result.BUSINESSCODE
        }
    });
    return businesscode;
}

function call(customerNumber){
	$.get(url,{enterpriseId:enterpriseId, cno:cno, pwd:pwd, customerNumber:customerNumber}, function(data){
		alert(data);
	});
}

/**
 * 确认支付
 */
function confirmPay(orderNo){
	if(confirm('是否确认支付')){
		$.post('/order/callcenter/confirmpay', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				doSearch();
			}
		});
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
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        category:$('#category').val(),
        merType:$('#merType').val(),
        categoryPrice:$('#categoryPrice').val(),
        address:$('#address').val(),
		operatorName:$('#operatorName').val()
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