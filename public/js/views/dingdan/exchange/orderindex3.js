var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "序号", dataIndex: 'R', width:'40PX',sortable:false} 
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
					var url = '/dingdan/exchange/orderinfo?cartNo='+data['CARTNO']+'&goBackUrl=/dingdan/exchange/orderindex2';
					var returnText = '<a href="'+url+'" class="a_link">订单详情</a>';
					returnText += ' | <a href="javascript:void(0);" onclick="complete(\''+data['CARTNO']+'\')" class="a_link">完成</a>';
					return returnText;
				}
			}
		]
		,url : '/dingdan/exchange/pagelist'
	    ,baseParams:{status:4}
	});
});

/**
 * 检测操作
 * @param orderId
 * @return
 */
function inspection(orderId){
	
	function inner(){
		if(confirm("是否确认检测？")){
			$.post('/dingdan/exchange/inspection', {orderId:orderId}, function(data){
				if(data == 'Y'){
					doSearch();
				}else{
					alert('操作错误');
				}
			});
		}
	}
	setTimeout(inner, 1000);
}

/**
 * 完成交易
 */
function complete(cartNo){
    if(confirm("是否确认检测？")){
        $.post('/dingdan/exchange/complete', {cartNo:cartNo}, function(data){
            if(data == 'Y'){
                doSearch();
            }else{
                alert(data);
            }
        });
    }
}

function getParams(){
	return {
		orderId:$('#orderId').val(), 
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		startPrice:$('#startPrice').val(),
		endPrice:$('#endPrice').val(),
		status:4
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}
