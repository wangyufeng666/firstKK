var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize:10,
    height:250
    ,cm:[
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'80px',sortable:false}
      ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
      ,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
      	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['PNAME']+' '+data['MERNAME'];
        }
      }
      ,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
      	,renderer : function(value, data, rowIndex, colIndex, metadata){
            return data['CONTACTS']+'('+data['CONTACTWAY']+')';
          }
        }
      ,{header: "联系地址", dataIndex: 'CONTACTADDRESS', sortable:false}
      ,{header: "快递单号", dataIndex: 'EXPRESSNUM', width:'100px',sortable:false
          ,renderer : function(value, data, rowIndex, colIndex, metadata){
        	  if(data['EXPRESSNUM']){
        		  return '<a class="a_link" href="http://www.sf-express.com/cn/sc/dynamic_functions/waybill/#search/bill-number/'+value+'" target="_blank">'+value+'</a>';
        	  }
            }
      }
      ,{header: "快递公司", dataIndex: 'EXPRESSPARTNERNAME', width:'100px',sortable:false}
      ,{header: "快递状态", dataIndex: 'EXPRESSSTATUSNAME', width:'80px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" title="'+data['ORDERNO']+''+data['ORDERREMARKS']+'" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
          var status = data['EXPRESSSTATUS'];
          var orderNo = data['ORDERNO'];
          
          if(status == '2' || status == '3'){//待寄回
        	  returnText+=' | <a href="javascript:void(0);" onclick="returnBack(\''+orderNo+'\')" class="a_link">确认寄回</a>';
          }
          return returnText;
        }
      }
    ]
    ,url : '/order/expressreturn/pagelist'
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



function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
        contactWay:$('#contactWay').val(),
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

function returnBack(orderNo){
    $.layer({
        type:2,
        title:'确认寄回',
        iframe:{src : '/order/order/expressnum?orderNo='+orderNo+'&statusFlag=2'},
        area : ['500', '360'],
        close : function(index){
          layer.close(index);
        },
        end : function(index){
        	doSearch();
        }
      });
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}