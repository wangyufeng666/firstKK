var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm : [
			{header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
			,{header: "手机号", dataIndex: 'CUSTOMER_MOBILE',width:'100px', sortable:false}
			,{header: "订单号", dataIndex: 'ORDERNO', width:'160px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value){
						return '<a href="javascript:orderInfo(\''+value+'\')" class="a_link">'+value+'</a>';
					}
				}
			}
			,{header: "创建时间", dataIndex: 'CREATEDATE',width:'140px',sortable:false}
			,{header: "拨打时间", dataIndex: 'CALL_OUTTIME',width:'140px',sortable:false}
			,{header: "状态", dataIndex: 'CALL_STATUS',width:'80px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['CALL_STATUS'] == '呼叫成功'){
						var returnText = '<span style="color:green;">呼叫成功</span>';
					}else if(data['CALL_STATUS'] == '用户忙线'){
						var returnText = '<span style="color:orange;">用户忙线</span>';
					}else if(data['CALL_STATUS'] == '未接通'){
						var returnText = '<span style="color:red;">未接通</span>';
					}else {
						var returnText = '<span>'+data['CALL_STATUS']+'</span>';
					}
					return returnText;
				}
			}
			,{header: "关键词", dataIndex: 'KEYWORD', sortable:false}
			,{header: "话术模板", dataIndex: 'MOULD_NAME', width:'200px', sortable:false}
        ]
        ,url : '/recycle/callai/pagelist'
        ,baseParams:getParams()
		,pageSizeList:[15,30,50,100]
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});
});

/**
 * 回收订单详情
 * @param recyOrderNo
 * @returns
 */
function orderInfo(recyOrderNo){
	layer.open({
		type:2,
		title:'回收订单详情',
		shadeClose:false,
		content:'/order/order/orderinfo?orderNo='+recyOrderNo+'&layer=Y',
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		mobile:$('#mobile').val(),
		orderno:$('#orderno').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

function doExport() {
	var param = {};
	param.mobile = $('#mobile').val();
	param.orderno = $('#orderno').val();
	param.startDate = $('#startDate').val();
	param.endDate = $('#endDate').val();
	window.location.href='/recycle/callai/export?'+$.param(param);
}