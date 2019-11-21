var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"原订单编号", dataIndex:'OLDORDERNO', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:orderInfo(\''+value+'\')">'+value+'</a>';
				}
			}
			,{header:"原订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false}
			,{header:"原商品名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"拆分数量", dataIndex:'SPLITCOUNT',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:splitOrders(\''+data['OLDORDERNO']+'\')">'+value+'</a>';
				}
			}
			,{header:"订单来源", dataIndex:'', width:'140px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var channel ='';
					if(data['ORDERTYPE']=='71' || data['ORDERTYPE']=='73'){
						if(data['CHANNEL']=='idle'){
							channel = '闲鱼';
						}else if(data['CHANNEL']=='tmall'){
							channel = '天猫';
						}else if(data['CHANNEL']=='alipay'){
							channel = '支付宝';
						}else if(data['CHANNEL']=='taobao'){
							channel = '淘宝';
						}else if(data['CHANNEL']=='tmall-service'){
							channel = '天猫以旧换新';
						}
					}
					if(channel){
						return data['SOURCENAME']+'('+channel+')';
					}else{
						return data['SOURCENAME'];
					}
				}
			}
		]
		,url:'/order/ordersplit/pagelist'
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[15,30,50]
	});
});

function initParams(){
	return getParams();
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		content:'/order/order/orderinfo?orderNo='+orderNo+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}


/**
 * 回收单检测操作
 * @param orderNo
 * @return
 */
function splitOrders(orderNo){
	layer.open({
		type:2,
		title:'订单检测',
		content:'/order/ordersplit/splitorders?orderNo='+orderNo,
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		oldOrderNo:$('#oldOrderNo').val(),
		newOrderNo:$('#newOrderNo').val(),
		oldMerName:$('#oldMerName').val(),
		newMerName:$('#newMerName').val(),
		oldMachineCode:$('#oldMachineCode').val(),
		newMachineCode:$('#newMachineCode').val(),
		contactWay:$('#contactWay').val()
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}

//回车事件
document.onkeypress = keypress;
function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}
