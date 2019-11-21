var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "编号", dataIndex: 'CARTNO', width:'95px',sortable:false} 
			,{header: "联系方式", dataIndex: 'PHONENUM', width:'100px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return value+"("+data['CONTACTNAME']+")";
				}
			} 
			,{header: "订单日期", dataIndex: 'CREATEDATE', width:'50px',sortable:false} 
			,{header: "新订单", dataIndex: 'SALEPRICE', width:'35px',sortable:false} 
			,{header: "旧订单", dataIndex: 'RECYCLEPRICE', width:'35px',sortable:false}
			,{header: "新结算", dataIndex: 'SETTLESALEPRICE', width:'35px',sortable:false} 
            ,{header: "旧结算", dataIndex: 'SETTLERECYCLEPRICE', width:'35px',sortable:false}
            ,{header: "折扣", dataIndex: 'DISCOUNTPRICE', width:'30px',sortable:false}
            ,{header: "应付款", dataIndex: '', width:'40px', sortable:false, 
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    if(!data['DISCOUNTPRICE'])
                        data['DISCOUNTPRICE'] = '0';
                    return parseInt(data['SETTLESALEPRICE'])-parseInt(data['SETTLERECYCLEPRICE'])-parseInt(data['DISCOUNTPRICE']);
                }
            }
			,{header: "交易类型", dataIndex: 'TRADETYPENAME', width:'40px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'40px',sortable:false}
			,{header: "操作", dataIndex: '', width:'8%', sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var url = '/dingdan/exchange/orderinfo?cartNo='+data['CARTNO']+'&goBackUrl=/dingdan/exchange/orderindex';
					return '<a href="'+url+'" class="a_link">订单详情</a>';
				}
			}
		]
		,url : '/dingdan/exchange/pagelist'
	});
});

function getParams(){
	return {
	    cartNo:$('#cartNo').val(), 
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		startPrice:$('#startPrice').val(),
		endPrice:$('#endPrice').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}
