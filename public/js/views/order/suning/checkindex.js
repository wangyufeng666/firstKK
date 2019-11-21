var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"回收单号", dataIndex:'ORDERNO', width:'160px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:orderInfo(\''+value+'\')" class="a_link">'+value+'</a>';
				}
			}
			,{header:"苏宁单号", dataIndex:'PARTNERORDER', width:'140px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			} 
			,{header:"订单地址", dataIndex:'DIZHI', width:'140px',sortable:false}
			,{header:"订单来源", dataIndex:'ORDERTYPENAME', width:'80px',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
		]
		,url:'/order/suning/pagelist'
		,pageSizeList:[15, 30, 50],
		afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});
	
	//日期验证
	$('#startDate').click(function(){
		WdatePicker({
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

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		content:"/order/suning/orderinfo?orderNo="+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		partnerOrderNo:$('#partnerOrderNo').val(),
		orderType:$('#orderType').val(),
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
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

function downloadSuningExport(){
	var param = {};
	param.merName = $('#merName').val();
	param.orderNo = $('#orderNo').val();
	param.partnerOrderNo = $('#partnerOrderNo').val();
	param.orderType = $('#orderType').val();	
	param.contactWay = $('#contactWay').val();
	param.orderStatus = $('#orderStatus').val();
	param.startDate = $('#startDate').val();
	param.endDate = $('#endDate').val();
	param.category = $('#category').val();
	param.merType = $('#merType').val();
	param.address = $('#address').val();
	param.tradeType = $('#tradeType').val();
	window.location.href = '/order/suning/suningexport?'+$.param(param);
	return false; //截取返回false就不会保存网页了
}
