var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
		    {header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
		    ,{header:"联系方式", dataIndex:'', width:'120px',sortable:false,
		    	renderer:function(value, data, rowIndex, colIndex, metadata){
    				return data['LIANXIDH']+'('+data['LIANXIREN']+')';
         		}
		    }
		    ,{header:"器材名称", dataIndex:'SHANGPINGMC', width:'',sortable:false,
		    	renderer:function(value, data, rowInex, colIndex, metadata){
					return data['PNAME']+' '+value;
  				}
		    }
           ,{header:"订单价格", dataIndex:'DINGDANPRICE', width:'80px',sortable:false}
           ,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false}
           ,{header:"订单地址", dataIndex:'DIZHI', width:'120px',sortable:false}
           ,{header:"订单来源", dataIndex:'ORDERTYPE', width:'80px',sortable:false}
           ,{header:"交易方式", dataIndex:'CHULITYPE', width:'80px',sortable:false}
           ,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px',sortable:false}
           ,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:void(0);" onclick="orderInfo(\''+data['KEHUDINGDANID']+'\')">查看</a>';
					returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="printOrder(\''+data['DINGDANNO']+'\')">订单打印</a>';
					return returnText;
				}
           }
	]
    ,url:'/dingdan/dingdan/orderpagelist'
    ,baseParams:{isAll:'all'}
  });
});

/**
 * 订单详情
 */
function orderInfo(orderId){
	window.location.href = "/dingdan/dingdan/orderinfo?backUrl=/dingdan/dingdan/orderindex&orderId="+orderId;
}

/**
 * 订单打印
 */
function printOrder(orderNo, printType){
	window.location.href = "/dingdan/dingdan/orderprint?orderNo="+orderNo;
}

function getParams(){
    return {
    	contacts:$('#contacts').val(),
    	merName:$('#merName').val(), 
    	orderType:$('#orderType').val(),
    	tradeType:$('#tradeType').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        orderStatus:$('#orderStatus').val(),
        category:$('#category').val(),
        merType:$('#merType').val(),
        address:$('#address').val(),
        isAll:'all'
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area:['280px','auto'],
        dialog:{msg:msg, type:8}    
    });
}