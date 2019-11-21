var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"订单编号", dataIndex:'ORDERNO', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					return '<span ondblclick="showRemark(\''+orderNo+'\')">'+orderNo+'</span>';
				}
			}
			,{header:"品类", dataIndex:'MERTYPE', width:'80px',sortable:false}
			,{header:"商品型号", dataIndex:'MERNAME', sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"付款/发券日期", dataIndex:'PAYDATE', width:'130px',sortable:false}
			,{header:"联系方式", dataIndex:'LIANXIREN', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"联系地址", dataIndex:'DIZHI', width:'160px',sortable:false}
			,{header:"先行支付", dataIndex:'ORDER_TYPE', width:'80px',sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '2' ? '先行支付' : '普通回收';
				}
			}
			,{header:"订单状态", dataIndex:'ORDERSTATUS', width:'80px',sortable:false}
			,{header:"付款方式", dataIndex:'PAYTYPE', width:'80px',sortable:false}
			,{header:"支付类型", dataIndex:'PAYTYPE1', width:'80px',sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '3' ? '券' : '现金转账';
				}
			}
		]
		,url:'/idlefishv2/orderreport/orderpagelist'
		,baseParams:{isAll:'all'}
	});
});

function getParams(){
	return {
		category:$('#category').val(),
		merType:$('#merType').val(),
		startDate:$('#startCreateDate').val(),
		endDate:$('#endCreateDate').val(),
		isAll:'all'
	};
}

function doSearch(){
	grid.query(getParams());
}

/**
 * 导出交易汇总
 * @returns
 */
function exportTradeReport(){
	var params = getParams();
	var paramText = $.param(params);
	window.location.href = '/idlefishv2/orderreport/exporttradereport?'+paramText;
	return false; //截取返回false就不会保存网页了
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo){
	layer.close(layerIndex);
	$.post('/recycle/order/jsonremark',{orderNo:orderNo}, function(data){
		layerIndex = layer.open({
			type:1,
			shade:false,
			title:false,
			area:['650px','400px'],
			content:'<div class="layer_notice">'+orderNo+'<br/>'+data+'</div>'
		});
	});
}
