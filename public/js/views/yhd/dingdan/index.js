var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
      ,{header: "订单号", dataIndex: 'DINGDANNO', width:'60px',sortable:false
        ,renderer : function(value, data, rowIndex, colIndex, metadata){
          var url = '/yhd/dingdan/orderinfo?orderId='+data['KEHUDINGDANID'];
          return '<a href="'+url+'" class="a_link">'+value+'</a>';
        }
      }
      ,{header: "yhd订单号", dataIndex: 'YHDBILLCODE', width:'80px',sortable:false}
      ,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
      	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['PNAME']+' '+data['MERTYPENAME']+' '+data['MERNAME'];
        }
      }
      ,{header: "联系方式", dataIndex: 'PROVIDERNAME', width:'130px',sortable:false
    	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['LIANXIDH']+'('+data['LIANXIREN']+')';
        }
      } 
      ,{header: "订单来源", dataIndex: 'ORDERTYPENAME', width:'80px',sortable:false}
      ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
    	  ,renderer : function(value, data, rowIndex, colIndex, metadata){
      	  if(data['SETTLEPRICE']){
      		  return data['DINGDANPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
      	  }else{
      		  return data['DINGDANPRICE'];
      	  }
        }
      }
      ,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
      ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
      ,{header: "订单地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
      ,{header: "交易方式", dataIndex: 'CHULITYPE', width:'70px',sortable:false,
        renderer : function(value, data, rowIndex, colIndex, metadata){
          return value == '1' ? '上门回收' : value == '2' ? '快递回收' : '未知';
        }
      }
      ,{header: "订单状态", dataIndex: 'ORDERSTATUSNAME', width:'70px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'150px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
          
    	  var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+data['KEHUDINGDANID']+'\')" class="a_link">查看</a>';
          var status = data['DINGDANSTATUS']+'';
          
          //待审核、 待上门、 待发货、 待收货、 待验货、 待发券、发券中、  待入库、交易成功、 终止
          // 1    2    6    7    3     8   20    5    66   99
          
          if(status == '1'){//待审核
        	  returnText+=' | <a href="javascript:void(0);" onclick="auditing(\''+data['KEHUDINGDANID']+'\', '+status+')" class="a_link">电话确认</a>';
          }else if(status == '2'){//待上门
        	  returnText+=' | <a href="javascript:void(0);" onclick="visiting(\''+data['KEHUDINGDANID']+'\')" class="a_link">上门</a>';
          }else if(status == '6'){//待用户发货
        	  returnText+=' | <a href="javascript:void(0);" onclick="delivered(\''+data['KEHUDINGDANID']+'\', \''+data['YHDBILLID']+'\')" class="a_link">用户发货</a>';
          }else if(status == '7'){//待收货
        	  returnText+=' | <a href="javascript:void(0);" onclick="receiving(\''+data['KEHUDINGDANID']+'\', \''+data['YHDBILLID']+'\')" class="a_link">收货</a>';
          }else if(status == '3'){//待验货
        	  if(data['INSPECTIONBILLID'] != null){
        		  returnText += ' | <a href="javascript:void(0);" onclick="inspectionAgain(\''+data['KEHUDINGDANID']+'\')" class="a_link">重新检测</a>';
        	  }else{
        		  returnText += ' | <a href="javascript:void(0);" onclick="inspectionInfo(\''+data['KEHUDINGDANID']+'\')" class="a_link">检测</a>';
        	  }
          }else if(status == '8'){//待发券
        	  returnText += ' | <a href="javascript:void(0);" onclick="sendCoupon(\''+data['KEHUDINGDANID']+'\', \''+data['YHDBILLID']+'\')" class="a_link">发券</a>';
          }else if(status == '20'){//发券中
        	  returnText += ' | <a href="javascript:void(0);" onclick="sendCoupon(\''+data['KEHUDINGDANID']+'\', \''+data['YHDBILLID']+'\')" class="a_link">确认发券</a>';
          }else if(status == '5'){//待入库
        	  returnText += ' | <a href="javascript:void(0);" onclick="warehousing(\''+data['KEHUDINGDANID']+'\')" class="a_link">入库</a>';
          }
          
          var stopStatusList = ['5','20','66','94','95','96','98','99'];
          //删除操作
          if( $.inArray(status, stopStatusList) < 0){
        	  returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+data['KEHUDINGDANID']+'\', \''+data['YHDBILLID']+'\')" class="a_link">终止</a>';
          }
          return returnText;
        }
      }
    ]
    ,url : '/yhd/dingdan/pagelist'
  });
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderId){
	window.location.href = "/yhd/dingdan/orderinfo?orderId="+orderId;
}

/**
 * 待用户发货
 */
function delivered(orderId, yhdBillId){
	if(confirm('是否确认用户已发货？')){
		$.post('/yhd/dingdan/delivered', {orderId:orderId, yhdBillId:yhdBillId}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('订单状态修改异常');
			}
		});
	}
}

/**
 * 订单电话确认
 * @param orderId
 * @return
 */
function auditing(orderId){
	if(confirm('是否电话确认？')){
		$.post('/yhd/dingdan/auditing', {orderId:orderId}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('订单状态修改异常');
			}
		});
	}
}

/**
 * 上门操作
 * @param orderId
 * @return
 */
function visiting(orderId){
	if(confirm('是否确认上门？')){
		$.post('/yhd/dingdan/visiting', {orderId:orderId}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('订单状态修改错误');
			}
		});
	}
}

/**
 * 收货操作
 * @param orderId
 * @return
 */
function receiving(orderId, yhdBillId){
	
	if(confirm('是否确认收货？')){
		$.post('/yhd/dingdan/receiving', {orderId:orderId, yhdBillId:yhdBillId}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('状态修改失败');
			}
		});
	}
}

/**
 * 检测操作
 * @param orderId
 * @return
 */
function inspectionInfo(orderId){
	window.location.href = "/yhd/dingdan/inspectioninfo?orderId="+orderId;
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
function sendCoupon(orderId, yhdBillId){
	if(confirm('是否确认发券？')){
		$.post('/yhd/dingdan/sendcoupon', {orderId:orderId, yhdBillId:yhdBillId}, function(data){
			if(data == 'Y'){
				if(confirm('发券成功')){
				    doSearch();
				}
			}else{
				doSearch();
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
function warehousing(orderId, orderNo, yhdBillId){
	if(confirm('是否确认入库？')){
		$.post('/yhd/dingdan/warehousing', {orderId:orderId}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('入库失败');
			}
		});
	}
}


/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(orderId, yhdBillId){
	$.layer({
	    type : 2,
	    title : '修改',
	    iframe : {src : '/yhd/dingdan/tostoporder?orderId='+orderId+'&yhdBillId='+yhdBillId},
	    area : ['450' , '280'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
}


function getParams(){
    return {
        mername:$('#mername').val(), 
        orderNo:$('#orderNo').val(),
        lianxidh:$('#lianxidh').val(),
        chulitype:$('#chulitype').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        orderStatus:$('#orderStatus').val(),
		category:$('#category').val(),
        merType:$('#merType').val(),
        yhdBillCode:$('#yhdBillCode').val()
    };
}

function doSearch(){
    grid.query(getParams());
}

/**
 * 同步一号店订单
 */
function getYhdOrders(operFlag){
	var load1 = layer.load('数据加载中...');
	location.href = "/yhd/dingdan/yhdtransactions?operFlag="+operFlag;
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}