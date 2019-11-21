var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "订单编号", dataIndex: 'ORDERNO', width:'180px',sortable:false}
      ,{header: "日期", dataIndex: 'CREATEDATE', width:'150px',sortable:false}
      ,{header: "商品名称", dataIndex: '', width:'190px',sortable:false
          ,renderer : function(value, data, rowIndex, colIndex, metadata){
            return data['PNAME']+' '+data['MERNAME'];
          }
      }
      ,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
        	,renderer : function(value, data, rowIndex, colIndex, metadata){
              return data['CONTACTSMOBILE']+'('+data['CONTACTSNAME']+')';
            }
      }
      ,{header: "下单价格", dataIndex: 'INQUIRYPRICE', width:'80px',sortable:false}
      ,{header: "结算价格", dataIndex: 'INQUIRYPRICE', width:'80px',sortable:false
          ,renderer : function(value, data, rowIndex, colIndex, metadata){
              if(data['SETTLEPRICE'] != "" && data['SETTLEPRICE'] != null){
                  return data['SETTLEPRICE'];
              }else{
                  return "暂无";
              }
          }
      }
      ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'80px',sortable:false}
      ,{header: "订单状态", dataIndex: 'ORDERSTATUSNAME', width:'80px',sortable:false}
      ,{header: "联系地址", dataIndex: 'ADDRESS', width:'',sortable:false}
      ,{header: "操作", dataIndex: '', width:'180px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
          var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
          returnText += operationBtn(data['ORDERNO'], data['ORDERSTATUS']);
          return returnText;
        }
      }
    ]
    ,url : '/repair/repair/repairlist'
  });
});

/**
 * 租赁详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/repair/repair/orderinfo?orderNo="+orderNo;
}

/**
 * 操作
 */
function operationBtn(orderNo, orderStatus){
    var funStr = "operation";
    var btnStr = "";
    switch(orderStatus){
        case '5':
            funStr = "isnpection";
            btnStr = "检测";
            break;
        case '8':
            btnStr = "维修";
            break;
        case '9':
            btnStr = "维修完成";
            break;
    }
    if(!btnStr == ""){
        btnStr = '&nbsp;|&nbsp;<a href="javascript:void(0);" onclick=" '+funStr+'(\''+orderNo+'\')" class="a_link">' + btnStr + '</a>';
    }
    return btnStr;
}

function isnpection(orderNo){
    window.location.href = "/repair/repair/inspection?orderNo="+orderNo;
}

function operation(orderNo){
    $.layer({
        type : 2,
        title : '订单状态修改',
        iframe : {src : '/repair/repair/operation?orderNo='+orderNo},
        area : ['500' , '320'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}

function sendback(orderNo){
    $.layer({
        type : 2,
        title : '回寄',
        iframe : {src : '/repair/repair/sendbackpage?orderNo='+orderNo},
        area : ['500' , '320'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(),
    	merName:$('#merName').val(),
    	orderStatus:$('#orderStatus').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        contactName:$('#contactName').val(),
        contactWay:$('#contactWay').val(),
        expressStatus:$('#expressStatus').val(),
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

function stopOrder(orderNo){
    $.layer({
        type : 2,
        title : '终止订单',
        iframe : {src : '/repair/repair/stoppage?orderNo='+orderNo},
        area : ['500' , '320'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}