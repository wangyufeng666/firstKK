var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"订单编号", dataIndex:'ORDERNO', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a class="a_link" href="javascript:recyOrderInfo(\''+value+'\')" title="'+value+'">'+value+'</a>';
				}
			}
			,{header:"卖家信息", dataIndex:'CONTACTWAY', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['CONTACTS']+')';
				}
			}
			,{header:"鉴定报告", dataIndex:'REPORTNO', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					if(value){
						return '<a class="a_link" href="javascript:identifyReportInfo(\''+orderNo+'\',\''+value+'\')" title="'+value+'">'+value+'</a>';
					}else{
						return '暂无';
					}
				}
			}
			,{header:"商品名称", dataIndex:'MERNAME', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					return data['MERTYPENAME']+' '+data['PNAME']+' '+value;
				}
			}
			,{header:"订单金额", dataIndex:'ORDERPRICE', width:'90px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var text = value;
					if(data['INSPECTIONPRICE'] != null){
						text += '<span class="green">('+data['INSPECTIONPRICE']+')</span>';
					}
					return text;
				}
			}
			,{header:"订单类型", dataIndex:'ORDERTYPE', width:'70px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == '1'){
						return '帮卖';
					}else{
						return '一口价';
					}
				}
			}
			,{header:"检测日期", dataIndex:'INSPECTIONDATE', width:'80px',sortable:false}
			,{header:"保底金额", dataIndex:'MINPRICE', width:'65px',sortable:false}
			,{header:"预拍金额", dataIndex:'AUCTIONPRICE', width:'65px',sortable:false}
			,{header:"成交金额", dataIndex:'SETTLEPRICE', width:'65px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'ORDERNO',width:'130px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderStatus = data['ORDERSTATUS'];
					var returnText = '<a class="a_link" href="javascript:orderInfo(\''+value+'\')" title="'+value+'">详情</a>';
					if(orderStatus == '5'){
						returnText += '<a class="a_link" href="javascript:quotePage(\''+value+'\')" title="'+value+'"> | 保价</a>';
						if(data['MINPRICE'] != null && data['AUCTIONPRICE'] != null){
							returnText += '<a class="a_link" href="javascript:confirmQuote(\''+value+'\')"> | 确认保价</a>';
						}
					}
					return returnText;
				}
			}
		]
		,url:'/idlefishpai/recyorder/identifylist'
		,baseParams:initParams()
		,pageSizeList:[15, 30, 50, 100]
	});
	
	//日期验证
	$('#startDate').click(function(){
		WdatePicker({
			onpicked:function(){$('#endDate').trigger('click');},
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	
});
function initParams(){
	return getParams();
}

/**
 * 订单保价
 */
function quotePage(orderNo){
	layer.open({
		type:2,
		title:['订单保价', 'text-align:center;'],
		shadeClose:false,
		shade:0.8,
		content:'/idlefishpai/recyorder/quotepage?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 确认保价
 */
function confirmQuote(orderNo){
	if(confirm('是否确认保价？')){
	    $.post('/idlefishpai/recyorder/confirmquote', {orderNo:orderNo}, function(data){
	        if(data == 'Y'){
	            grid.reload();
	        }else{
	          alert(data);
	        }
	    });
	}
}

/**
 * 鉴定报告
 * @param callId
 * @returns
 */
function identifyReportInfo(orderNo,reportNo){
	layer.open({
		type:2,
		title:'鉴定报告',
		shadeClose:false,
		shade:0.8,
		content:'/idlefishpai/recyorder/reportpage?orderNo='+orderNo+'&reportNo='+reportNo,
		area:['640px','98%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 鉴定订单详情页面 
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/idlefishpai/recyorder/taborderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 回收订单信息
 * @param orderNo
 * @returns
 */
function recyOrderInfo(orderNo){
	layer.open({
		type:2,
		title:'回收订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/order/order/orderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}


function closeLayer(){
	layer.closeAll('iframe');
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(), 
    	merName:$('#merName').val(),
    	bizOrderNo:$('#bizOrderNo').val(),
    	orderStatus:'5',
    	contactWay:$('#contactWay').val(),
    	startDate:$('#startDate').val(),
    	endDate:$('#endDate').val(),
    	merType:$('#merType').val(),
    	category:$('#category').val()
    };
}
function doSearch(){
    grid.query(getParams());
}