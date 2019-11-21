var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"订单编号", dataIndex:'ORDERNO', width:'180px',sortable:false}
			,{header:"品类", dataIndex:'MERTYPE', width:'80px',sortable:false}
			,{header:"品牌", dataIndex:'PNAME', width:'80px',sortable:false}
			,{header:"商品型号", dataIndex:'MERNAME', sortable:false}
			,{header:"付款/发券日期", dataIndex:'PAYDATE', width:'130px',sortable:false}
			,{header:"联系人", dataIndex:'LIANXIREN', width:'70px',sortable:false}
			,{header:"联系电话", dataIndex:'LIANXIDH', width:'120px',sortable:false}
			,{header:"联系地址", dataIndex:'DIZHI', width:'250px',sortable:false}
			,{header:"先行支付", dataIndex:'ORDER_TYPE', width:'80px',sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return value == '2' ? '先行支付':'普通回收';
				}
			}
			,{header:"订单状态", dataIndex:'ORDERSTATUS', width:'80px',sortable:false}
			,{header:"付款方式", dataIndex:'PAYTYPE', width:'100px',sortable:false}
			,{header:"支付类型", dataIndex:'PAYTYPE1', width:'100px',sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return value == '3' ? '券':'现金转账';
				}
			}
		]
		,url:'/zhima/orderreport/orderpagelist'
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,baseParams:{isAll:'all'}
	});
	
	$("#partnerCode").change(function(){
		var partnerCode = $(this).val();
		$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
			$("#orderSource").html("<option value=''>请选择来源</option>");
			for(i in data){
				$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
			}
		}, 'json');
	});
});


function getParams(){
	return {
		contacts:$('#contacts').val(),
		merName:$('#merName').val(),
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		tradeType:$('#tradeType').val(),
		startDate:$('#startCreateDate').val(),
		endDate:$('#endCreateDate').val(),
		orderStatus:$('#orderStatus').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		address:$('#address').val(),
		isAll:'all'
	};
}

function doSearch(){
	layerIndex = layer.msg('加载中', {icon:16, time:10000});
	grid.query(getParams());
}

/**
 * 重新加载
 * @returns
 */
function reload(){
	layer.closeAll();
	grid.reload();
}
