var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize:50,
    height:375
    ,cm:[
      {header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
      ,{header: "订单编号", dataIndex: 'ORDERNO', width:'120px',sortable:false}
      ,{header: "下单日期", dataIndex: 'ORDERDATE', width:'120px',sortable:false}
      ,{header: "最后催缴日期", dataIndex: 'LASTNOTICEDATE', width:'120px',sortable:false}
      ,{header: "违约日期", dataIndex: 'LASTREFUNDDATE', width:'100px',sortable:false}
      ,{header: "催缴金额", dataIndex: 'WITHPRICE', width:'80px',sortable:false}
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
      ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
      ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'150px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var orderNo = data['ORDERNO'];
    	  var lastNoticeDate = data['LASTNOTICEDATE'];
    	  var returnText ='<a href="javascript:void(0);" onclick="withoutInfo(\''+orderNo+'\')" class="a_link">扣款详情</a>';
    	      returnText += ' | <a href="javascript:void(0);" onclick="executeUrge(\''+orderNo+'\', \''+lastNoticeDate+'\')" class="a_link">催缴</a>';
        	  returnText += ' | <a href="javascript:void(0);" onclick="urgeInfo(\''+orderNo+'\')" class="a_link">催缴详情</a>';
          return returnText;
        }
      }
    ]
    ,url : '/idlefishv2/crediturge/pagelist'
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
 * 代扣详情
 * @param orderNo
 * @return
 */
function withoutInfo(orderNo){
	var url = "/idlefishv2/crediturge/withoutinfo?orderNo="+orderNo;
	$.layer({
		type:2,
		title:'代扣详情',
		iframe:{src:url},
		area:['600', '400'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 催缴详情
 * @param orderNo
 */
function urgeInfo(orderNo){
	var url = "/idlefishv2/crediturge/urgeinfo?orderNo="+orderNo;
	$.layer({
		type:2,
		title:'催缴详情',
		iframe:{src:url},
		area:['800', '600'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 催缴操作
 * @param orderId
 * @return
 */
function executeUrge(orderNo, lastNoticeDate){
	var confirmText = '是否确认发送催缴通知？';
	if(lastNoticeDate != '' && lastNoticeDate != 'null' && lastNoticeDate != null){
		confirmText = '您已于'+lastNoticeDate+'进行过催缴，是否继续发送催缴通知？';
	}
	if(confirm(confirmText)){
		$.post('/idlefishv2/crediturge/executeurge', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				alert("催缴成功");
				doSearch();
			}else{
				errorBox('催缴失败：'+data);
			}
		});
	}
}

function getParams(){
	var pageNum = 1, start = 0;
	if(grid && grid.getPageNumber()){
		pageNum = grid.getPageNumber();
		start = (pageNum-1) * grid.getPageSize(); 
	}
    return {
    	start:start,
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
        partnerCode:$('#partnerCode').val(),
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

function downloadOrder(){
	var param = '';
	param += 'merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&partnerCode=' + $('#partnerCode').val();
	param += '&tradeType=' + $('#tradeType').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&address=' + $('#address').val();
	window.location.href = '/idlefishv2/tmallorder/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}