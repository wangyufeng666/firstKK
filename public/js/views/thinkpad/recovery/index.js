var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false}
      ,{header: "订单编号", dataIndex: 'ORDERNO', width:'80px',sortable:false}
      ,{header: "商品类型", dataIndex: 'PRODUCTTYPE', width:'80px',sortable:false}
      ,{header: "商品名称", dataIndex: 'PRODUCTNAME', width:'80px',sortable:false}
      ,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
    	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['MOBILE']+'('+data['CONTACTS']+')';
        }
      }
      ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'65px',sortable:false}
      ,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'65px',sortable:false}
      ,{header: "订单状态", dataIndex: 'PAYSTATUSNAME', width:'70px',sortable:false}
      ,{header: "订单日期", dataIndex: 'CREATED_AT', width:'80px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'150px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
          var status = data['PAYSTATUS']+'';
          var orderType = data['ORDERTYPE']+'';
          var orderId = data['ORDERID'];
          var orderNo = data['ORDERNO'];
          var yhdBillId = data['YHDBILLID'];
          //1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
          
            if(status == '1') {//待审核
                returnText += ' | <a href="javascript:void(0);" onclick="orderCheck(\'' + orderNo + '\')" class="a_link">打款验证</a>';
            }
            if(status == '2') {//支付验证
                returnText += ' | <a href="javascript:void(0);" onclick="orderOperation(\'' + orderNo + '\')" class="a_link">支付验证</a>';
            }
            return returnText;
        }
      }
    ]
    ,url : '/thinkpad/recovery/pagelist'
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
	window.location.href = "/thinkpad/recovery/orderinfo?orderNo="+orderNo;
}

/**
 * 订单电话确认/上门/发货/收货/
 * @param orderNo
 * @return
 */
function orderCheck(orderNo){

    $.ajax({
        url:'/thinkpad/recovery/checkorderstatus',
        data:{orderNo:orderNo},
        dataType:'json',
        success:function($res){
            if($res.status == 1) {
                layer.msg('验证成功');
                window.location.href = "/thinkpad/recovery/index";
            }else {
                layer.confirm('该订单未通过验证,请勿打款！');
            }
        }
    })
}

function orderOperation(orderNo) {
    var msg = confirm('确认已打款？');
    if(msg == true) {
        $.ajax({
            url: '/thinkpad/recovery/operation',
            data: {orderNo: orderNo},
            dataType: 'json',
            success: function (data) {
                if (data.status == 1) {
                    layer.msg('打款成功！',{icon:6});
                    window.location.href = "/thinkpad/recovery/index";
                } else if(data.status == 3) {
                    layer.msg('打款订单不存在，请确认后重试！');
                }else {
                    layer.msg('打款失败！');
                }
            }
        });
    }else{
        return false;
    }
}

/**
 * 检测操作
 * @param orderId
 * @return
 */
function orderInspection(orderNo){
	window.location.href = "/order/order/orderinspection?orderNo="+orderNo+"&backUrl="+backUrl;
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
        orderNo:$('#orderNo').val(),
        mobile:$('#mobile').val(),
        orderStatus:$('#orderStatus').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),

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

function downExport(){
    var param = '';
    param += '&startCreateDate='+$('#startCreateDate').val();
    param += '&endCreateDate='+$('#endCreateDate').val();
    param += '&orderNo='+$('#orderNo').val();
    param += '&mobile='+$('#mobile').val();
    param += '&orderStatus='+$('#orderStatus').val();
    window.location.href = '/thinkpad/recovery/export?v=1'+param;
    return false; //截取返回false就不会保存网页了
}