var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header: "NO.", dataIndex: 'R', width:'3%',sortable:false} 
		    ,{header: "联系方式", dataIndex: '', width:'12%',sortable:false,
		    	renderer : function(value, data, rowIndex, colIndex, metadata){
    				return data['LIANXIDH']+'('+data['LIANXIREN']+')';
         		}
		    }
		    ,{header: "器材名称", dataIndex: 'SHANGPINGMC', width:'18%',sortable:false,
		    	renderer:function(value, data, rowInex, colIndex, metadata){
					return data['PINGPAI']+' '+value;
  				}
		    }
           ,{header: "订单价格", dataIndex: 'DINGDANPRICE', width:'6%',sortable:false}
           ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'8%',sortable:false}
           ,{header: "订单地址", dataIndex: 'DIZHI', width:'15%',sortable:false}
           ,{header: "订单来源", dataIndex: 'ORDERTYPE', width:'8%',sortable:false}
           ,{header: "交易方式", dataIndex: 'CHULITYPE', width:'8%',sortable:false}
           ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'8%',sortable:false}
           ,{header: "操作", dataIndex: '', width:'14%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="orderInfo(\''+data['KEHUDINGDANID']+'\')">查看</a>';
					if(data['OPERFLAG'] == 'Y'){
						returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="editOrder(\''+data['KEHUDINGDANID']+'\')">修改</a>';
						returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="stopOrder(\''+data['DINGDANNO']+'\')">终止</a>';
					}
				  	return returnText;
				}
           }]
           ,url : '/dingdan/dingdan/orderpagelist'
    	   ,baseParams:{orderStatus:2}
  });
});

/**
 * 订单详情
 */
function orderInfo(orderId){
	window.location.href = "/dingdan/dingdan/orderinfo?backUrl=/dingdan/dingdan/orderindex2&orderId="+orderId;
}

/**
 * 修改订单
 * os=orderstatus
 */
function editOrder(orderId){
	window.location.href = "/dingdan/dingdan/editorder?os=2&backUrl=/dingdan/dingdan/orderindex2&orderId="+orderId;
}

/**
 * 上门操作
 */
function visiting(orderId){
	if(confirm('是否确认上门？')){
		$.post('/dingdan/dingdan/visiting', {orderId:orderId}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				errorBox('订单状态修改错误');
			}
		});
	}
}

/**
 * 终止订单
 */
function stopOrder(orderNo){
	$.layer({
	    type : 2,
	    title : '修改',
	    iframe : {src : '/dingdan/dingdan/tostoporder?orderNo='+orderNo},
	    area : ['450' , '280'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
}

function getParams(){
    return {
    	contacts:$('#contacts').val(),
    	merName:$('#merName').val(), 
    	orderType:$('#orderType').val(),
    	tradeType:$('#tradeType').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        orderStatus:'2'
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