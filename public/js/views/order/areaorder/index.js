var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize:10,
    height:250
    ,cm:[
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
      ,{header: "联系地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
      ,{header: "订单来源", dataIndex: 'SOURCENAME', width:'100px',sortable:false}
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
      ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'80px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" title="'+data['ORDERNO']+''+data['ORDERREMARKS']+'" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
          return returnText;
        }
      }
    ]
    ,url : '/order/areaorder/pagelist'
    ,baseParams:initParams()
    ,pageSizeList:[10,15,20,30,50]
  });
});

function initParams(){
	var params = getParams();
	params['address'] = $('#address').val();
	if(backFlag == 'Y'){
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}
	return params;
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/areaorder/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}


function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
        orderSource:$('#orderSource').val(),
        tradeType:$('#tradeType').val(),
        contactWay:$('#contactWay').val(),
        partnerCode:$('#partnerCode').val(),
        orderStatus:$('#orderStatus').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        category:$('#category').val(),
        address:$('#address').val(),
        merType:$('#merType').val()
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

$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
		$("#orderSource").html("<option value=''>请选择来源</option>");
		for(i in data){
			$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
		}
	}, 'json');
});

function downloadOrder(){
	var param = '';
	param += 'merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&orderSource=' + $('#orderSource').val();
	param += '&tradeType=' + $('#tradeType').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&partnerCode=' + $('#partnerCode').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startCreateDate=' + $('#startDate').val();
	param += '&endCreateDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&address=' + $('#address').val();
	param += '&merType=' + $('#merType').val();
	window.location.href = '/report/report/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}