var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize:10,
    height:250
    ,cm:[
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "订单编号", dataIndex: 'ORDERNO',sortable:false}
      ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'80px',sortable:false}
      ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
      ,{header: "器材名称", dataIndex: 'MERNAME',width:'100px',sortable:false
      	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['PNAME']+' '+data['MERNAME'];
        }
      }
      ,{header: "联系人", dataIndex: 'CONTACTS', width:'80px',sortable:false}
      ,{header: "联系电话", dataIndex: 'CONTACTWAY', width:'90px',sortable:false}
      ,{header: "联系地址", dataIndex: 'CONTACTADDRESS',width:'100px', sortable:false}
      ,{header: "订单来源", dataIndex: '',width:'130px',sortable:false
        	,renderer : function(value, data, rowIndex, colIndex, metadata){
            return data['SOURCENAME']+'('+data['CHANNELNAME']+')';
          }
        }
      ,{header: "订单类型", dataIndex: 'ORDER_TYPE_NAME',width:'95px', sortable:false}
      ,{header: "支付方式", dataIndex: 'IDLE_PAY_TYPE_NAME',width:'85px', sortable:false}
      ,{header: "快递单号", dataIndex: 'EXPRESSNUM', width:'100px',sortable:false
          ,renderer : function(value, data, rowIndex, colIndex, metadata){
        	  if(data['EXPRESSNUM']){
        		  return '<a class="a_link" href="http://www.sf-express.com/cn/sc/dynamic_functions/waybill/#search/bill-number/'+value+'" target="_blank">'+value+'</a>';
        	  }
            }
      }
      ,{header: "快递公司", dataIndex: 'EXPRESSPARTNERNAME', width:'80px',sortable:false}
      ,{header: "快递状态", dataIndex: 'EXPRESSSTATUSNAME', width:'80px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'170px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" title="'+data['ORDERNO']+''+data['ORDERREMARKS']+'" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
          var status = data['EXPRESSSTATUS'];
          var orderNo = data['ORDERNO'];
          
          if(status == '2' || status == '3'){//待寄回
        	  returnText+=' | <a href="javascript:void(0);" onclick="returnBack(\''+orderNo+'\')" class="a_link">确认寄回</a>';
        	  returnText += '| <a href="javascript:void(0);" onclick="returnCancle(\''+orderNo+'\')" class="a_link">取消寄回</a>';
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

function returnCancle(orderNo){
	if(confirm('确认取消寄回吗？')){
		$.post('/order/expressreturn/cancle',{orderNo:orderNo},function(data){
			if(data == 'Y'){
				location.reload();
			}else{
				alert("取消失败，请从新操作！");
			}
		})
	}
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}

function downloadBackOrder(){
	var param = '';
	param += 'merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&address=' + $('#address').val();
	window.location.href = '/order/expressreturn/backorderexport?'+param;
	return false; //截取返回false就不会保存网页了
}