var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "序号", dataIndex: 'R', width:'40PX',sortable:false} 
			,{header: "订单编号", dataIndex: 'ORDERID', width:'16%',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					var url = '/dingdan/exchange/orderinfo?orderId='+value;
					return '<a href="'+url+'" class="a_link">'+value+'</a>';
				}
			} 
			,{header: "订单日期", dataIndex: 'CREATEDATE', width:'12%',sortable:false} 
			,{header: "换购器材总价", dataIndex: 'NEWPRICES', width:'8%',sortable:false} 
			,{header: "抵扣器材总价", dataIndex: 'OLDPRICES', width:'8%',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'9%',sortable:false}
			,{header: "订单类型", dataIndex: 'ORDERTYPE', width:'9%',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '1' ? '上门收货' : value == '2' ? '快递寄运' : '未知';
				}
			}
			,{header: "联系人", dataIndex: 'USERNAME', width:'9%',sortable:false}
			,{header: "联系电话", dataIndex: 'PHONENUM', width:'9%',sortable:false}
			,{header: "操作", dataIndex: '', width:'15%', sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var url = '/dingdan/exchange/orderinfo?orderId='+data['ORDERID']+'&goBackUrl='+gobackurl;
					var returnText = '<a href="'+url+'" class="a_link">查看</a>';
					
					if(data['ORDERSTATUS'] == '1'){//待电话确认
						returnText+= ' || <a href="javascript:void(0);" onclick="auditOrder(\''+data['ORDERID']+'\')" class="a_link">电话确认</a>';
					}
					
					if(data['ORDERSTATUS'] == '2'){//待上门
						returnText+= ' || <a href="javascript:void(0);" onclick="shangmen(\''+data['ORDERID']+'\')" class="a_link">上门</a>';
					}
					
					if(data['ORDERSTATUS'] == '3'){//待验货
						returnText+= ' || <a href="javascript:void(0);" onclick="yanhuo(\''+data['ORDERID']+'\')" class="a_link">验货</a>';
					}
					
					if(data['ORDERSTATUS'] == '9'){//待购新机
						returnText+= ' || <a href="javascript:void(0);" onclick="buyNewMers(\''+data['ORDERID']+'\')" class="a_link">购新机</a>';
					}
					
					if(data['ORDERSTATUS'] == '1' || data['ORDERSTATUS'] == '2'){
						returnText+= ' || <a href="javascript:void(0);" onclick="stopOrder(\''+data['ORDERID']+'\')" class="a_link">终止</a>';
					}
					return returnText;
				}
			}
		]
		,url : gridUrl
	});
});

function stopOrder(orderId){
	$.layer({
	    type : 2,
	    title : '修改',
	    iframe : {src : '/dingdan/exchange/tostoporder?orderId='+orderId},
	    area : ['450' , '280'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
}

//电话确认
function auditOrder(orderId){
	function inner(){
		if(confirm("是否电话确认？")){
			$.post('/dingdan/exchange/auditorder', {orderId:orderId}, function(data){
				grid.query(getParams());
			});
		}
	}
	setTimeout(inner,1000);
}

//待购新机
function buyNewMers(orderId){
	window.location.href = "/dingdan/exchange/buynewmers?orderId="+orderId;
}

//待上门
function shangmen(orderId){
	function inner(){
		if(confirm('是否确认上门？')){
			$.post('/dingdan/exchange/shangmen', {orderId:orderId}, function(data){
				if(data == 'Y'){
					grid.query(getParams());
				}else{
					alert('操作错误');
				}
			});
		}
	}
	setTimeout(inner,1000);
}
//待验货
function yanhuo(orderId){
	
	function inner(){
		if(confirm("是否确认验货？")){
			$.post('/dingdan/exchange/yanhuo', {orderId:orderId}, function(data){
				if(data == 'Y'){
					grid.query(getParams());
				}else{
					alert('操作错误');
				}
			});
		}
	}
	setTimeout(inner, 1000);
}

function getParams(){
	return {
		orderId:$('#orderId').val(), 
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		startPrice:$('#startPrice').val(),
		endPrice:$('#endPrice').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

function doSearchAll(){
	var params = getParams();
	params.status = $('#status').val();
	grid.query(params);
}