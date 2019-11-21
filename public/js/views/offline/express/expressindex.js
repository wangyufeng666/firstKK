var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"端口名称", dataIndex:'PARENTNAME', width:'100px',sortable:false}
			,{header:"门店编码", dataIndex:'PARTNERCODE', width:'80px',sortable:false}
			,{header:"门店名称", dataIndex:'PARTNERNAME', width:'160px',sortable:false}
			,{header:"门店地址", dataIndex:'ADDRESS', sortable:false}
			,{header:"店长信息", dataIndex:'',width:'160px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTWAY']+'('+data['CONTACTS']+')';
				}
			}
			,{header:"批次号", dataIndex:'BATCHCODE', width:'140px',sortable:false}
			,{header:"快递单号", dataIndex:'MAILNO', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:searchSF(\''+data['MAILNO']+'\')" class="a_link">'+data['MAILNO']+'</a>';
				}
			}
			
			,{header:"订单数量", dataIndex:'COUNT',width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var batchCode = data['BATCHCODE'] == null ? '' : data['BATCHCODE'];
					return '<a href="javascript:showOrders(\''+data['PARENTCODE']+'\', \''+data['PARTNERCODE']+'\', \''+batchCode+'\')" class="a_link">'+value+'个</a>';
				}
			}
			,{header:"操作人", dataIndex:'OPERNAME', width:'80px',sortable:false}
			,{header:"叫快递时间", dataIndex:'CREATEDATE', width:'160px',sortable:false}
			,{header:"操作", dataIndex:'ORDERNO', width:'120px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var batchCode = data['BATCHCODE'] == null ? '' : data['BATCHCODE'];
					return '<a href="javascript:againCallExpress(\''+batchCode+'\')" class="a_link">重新叫快递</a>';
				}
			}
		]
		,url:'/offline/express/expressorderlist'
		,pageSizeList:[15,30,50]
		,afterRender:function(){
			layer.close(layerIndex);
		}
	});
});

/**
 *	重新叫快递
 * @param partnerCode 门店编号
 */
function againCallExpress(batchCode){
	if (confirm('是否确认重新叫顺丰快递？')){
		$.post('/offline/express/againcallexpress', {batchCode:batchCode}, function (data){
			if(data.code == '1000'){
				layer.msg(data.msg);
				grid.reload();
			}else{
				layer.msg(data.msg);
			}
		});
	}
}

function showOrders(parentCode, partnerCode, batchCode){
	layer.open({
		type:2,
		title:'批次快递订单列表',
		shadeClose:false,
		content:"/offline/express/showorders?parentCode="+parentCode+'&batchCode='+batchCode+'&partnerCode='+partnerCode,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 顺丰路由查询
 */
function searchSF(expressNum){
	if(expressNum != '' || expressNum != null){
		var url = "/order/gomestore/searchsf?expressNum="+expressNum;
		layer.open({
			type:2,
			title:'顺丰路由信息',
			content:url,
			area:['850px', '500px'],
			close:function(index){
				layer.close(index);
			}
		});
	}else{
		alert('快递单号不存在，无法查询');
	}
}

function getParams(){
	return {
		storeName:$('#storeName').val(),
		mailNo:$('#mailNo').val(),
		contactWay:$('#contactWay').val(),
		contacts:$('#contacts').val()
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

//回车事件
document.onkeypress = keypress;
function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}

function reload(){
	layer.closeAll();
	grid.reload();
}
