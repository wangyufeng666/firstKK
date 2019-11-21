var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10
		,height:250
		,cm:[
			{header:"序号", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"联系方式", dataIndex:'', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			} 
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false,
				renderer:function(value, data, rowInex, colIndex, metadata){
					return data['PNAME']+' '+value;
				}
			}
			,{header:"订单价格", dataIndex:'DINGDANPRICE', width:'80px',sortable:false}
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'120px',sortable:false}
			,{header:"订单地址", dataIndex:'DIZHI', width:'100px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'100px',sortable:false}
			,{header:"交易方式", dataIndex:'CHULITYPE', width:'80px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'KEHUDINGDANID', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:orderInfo(\''+value+'\')">查看</a>';
					if(data['DINGDANSTATUS'] == '4' || data['DINGDANSTATUS'] == '20'){
						returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:proceeds(\''+data['DINGDANNO']+'\')">收款</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/caiwu/proceeds/orderpagelist'
	});
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderId){
	window.location.href = "/dingdan/dingdan/orderinfo?backUrl=/caiwu/proceeds/index&orderId="+orderId;
}

/**
 * 收款
 * @param orderNo
 * @param printType
 * @return
 */
function proceeds(orderNo){
	var src = '/caiwu/proceeds/toproceeds?&orderNo='+orderNo;
	$.layer({
	    type:2,
	    title:'客户订单收款',
	    iframe:{src:src},
	    area:['500px' , '420px'],
	    offset:['50px','']
	});
}

function getParams(){
    return {
    	contacts:$('#contacts').val(),
    	merName:$('#merName').val(), 
    	orderType:$('#orderType').val(),
    	tradeType:$('#tradeType').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val()
    };
}

function doSearch(){
    grid.query(getParams());
}
