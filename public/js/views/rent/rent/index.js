var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "租赁编号", dataIndex: 'CARTNO', width:'190px',sortable:false}
      ,{header: "租赁日期", dataIndex: 'CREATEDATE', width:'90px',sortable:false}
      ,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
        	,renderer : function(value, data, rowIndex, colIndex, metadata){
              return data['PHONENUM']+'('+data['CONTACTNAME']+')';
            }
          }
      ,{header: "联系地址", dataIndex: 'ADDRESS', width:'160px',sortable:false}
      ,{header: "折扣总价", dataIndex: 'DISCOUNTPRICE', width:'65px',sortable:false}
      ,{header: "押金总额", dataIndex: 'DEPOSIT', width:'65px',sortable:false}
      ,{header: "退款", dataIndex: 'REBACKPRICE', width:'65px',sortable:false}
      ,{header: "结算折扣总价", dataIndex: 'SETTLEDISCOUNTPRICE', width:'65px',sortable:false}
      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'65px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'60px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" onclick="rentInfo(\''+data['CARTNO']+'\')" class="a_link">查看</a>';
          return returnText;
        }
      }
    ]
    ,url : '/rent/rent/pagelist'
  });
});

/**
 * 租赁详情
 * @param orderNo
 * @return
 */
function rentInfo(cartNo){
	window.location.href = "/rent/rent/rentinfo?cartNo="+cartNo;
}

function getParams(){
    return {
    	rentNo:$('#rentNo').val(),
    	merName:$('#merName').val(),
    	rentStatus:$('#rentStatus').val(),
    	contactWay:$('#contactWay').val(),
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