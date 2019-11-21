var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"端口名称", dataIndex:'PARENTNAME', width:'100px',sortable:false}
			,{header:"门店名称", dataIndex:'PARTNERNAME', sortable:false}
			,{header:"门店编码", dataIndex:'PARTNERCODE', width:'80px',sortable:false}
			,{header:"订单编号", dataIndex:'',width:'160px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a title="'+data['ORDERNO']+'" href="javascript:orderInfo(\''+data['ORDERNO']+'\')" class="a_link">'+data['ORDERNO']+'</a>';
				}
			}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px',sortable:false}
			,{header:"操作状态", dataIndex:'OPERSTATUSNAME', width:'80px',sortable:false}
			,{header:"店长信息", dataIndex:'',width:'160px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTWAY']+'('+data['CONTACTS']+')';
				}
			}
			,{header:"店员信息", dataIndex:'',width:'160px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['WORKERMOBILE']+'('+data['WOKERNAME']+')';
				}
			}
			,{header:"用户信息", dataIndex:'',width:'160px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
		]
		,url:'/offline/express/orders'
		,pageSizeList:[15,30,50]
		,baseParams:getParams()
		,afterRender:function(){
			layer.close(layerIndex);
		}
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
		content:'/order/order/orderinfo?orderNo='+orderNo,
		shadeClose:false,
		shade:0.8,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		parentCode:$('#parentCode').val(),
		partnerCode:$('#partnerCode').val(),
		batchCode:$('#batchCode').val(),
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}
