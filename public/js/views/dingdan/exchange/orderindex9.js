var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "序号", dataIndex: 'R', width:'10PX',sortable:false}
			,{header: "编号", dataIndex: 'CARTNO', width:'50PX',sortable:false} 
			,{header: "联系方式", dataIndex: 'PHONENUM', width:'16%',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return value+"("+data['CONTACTNAME']+")";
				}
			} 
			,{header: "订单日期", dataIndex: 'CREATEDATE', width:'12%',sortable:false} 
			,{header: "换购新器材总价", dataIndex: 'SALEPRICE', width:'10%',sortable:false} 
			,{header: "抵扣旧器材总价", dataIndex: 'RECYCLEPRICE', width:'10%',sortable:false}
			,{header: "交易类型", dataIndex: 'TRADETYPENAME', width:'9%',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'9%',sortable:false}
			,{header: "操作", dataIndex: '', width:'15%', sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var url = '/dingdan/exchange/orderinfo?cartNo='+data['CARTNO']+'&goBackUrl=/dingdan/exchange/orderindex9';
					var returnText = '<a href="'+url+'" class="a_link">订单详情</a>';
					returnText+= ' || <a href="javascript:void(0);" onclick="buyNewMers(\''+data['CARTNO']+'\')" class="a_link">购新机</a>';
					returnText += ' | <a href="javascript:void(0);" onclick="stopOrder(\''+data['CARTNO']+'\')" class="a_link">终止</a>';
					return returnText;
				}
			}
		]
		,url : '/dingdan/exchange/pagelist'
	    ,baseParams:{status:2}
	});
});

/**
 * 待购新机
 * @param orderId
 * @return
 */
function buyNewMers(cartNo){
	window.location.href = "/dingdan/exchange/buynewmers?cartNo="+cartNo;
}
/**
 * 终止订单
 * @param orderId
 * @return
 */
function stopOrder(cartNo){
	$.layer({
	    type : 2,
	    title : '修改',
	    iframe : {src : '/dingdan/exchange/tostoporder?cartNo='+cartNo},
	    area : ['450' , '280'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		orderId:$('#orderId').val(), 
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		startPrice:$('#startPrice').val(),
		endPrice:$('#endPrice').val(),
		status:2
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}
