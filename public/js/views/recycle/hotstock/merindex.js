var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"商品编码", dataIndex:'MERCODE', width:'80px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'100px',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'80px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'260px',sortable:false,}
			,{header:"库存数量", dataIndex:'NUM', width:'80px',sortable:false}
			,{header:"排序", dataIndex:'SEQ', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'SPID', width:'30%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'],
						spid  = data['SPID'],
						returnText = '',
						MERNAME = data['MERNAME'];
					if(data['NUM'] > 0 ){
						returnText ='<a class="a_link" href="javascript:details(\''+spid+'\')">详情</a> | ';
					}
					returnText += '<a class="a_link" href="javascript:remove(\''+pkid+'\')">删除</a>';
					return returnText;
				}
		 	}
		]
		,url:'/recycle/hotstock/pagelist'
		,baseParams:getParams()
		,pageSizeList:[15,30,50]
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});
});

/**
 * 商品详情
 * @param orderId
 * @return
 */
function addProduct(){
	layer.open({
		type:2,
		title:'商品详情',
		shadeClose:false,
		content:"/recycle/hotstock/addproduct",
		area:['800px','450px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 商品详情
 * @param orderId
 * @return
 */
function details(spid){
	layer.open({
		type:2,
		title:'商品库存详情',
		shadeClose:false,
		shade:0.8,
		content:"/recycle/hotstock/details?spid="+spid,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * top20
 */
function remove(pkid){
	if(layer.confirm('确认删除选中商品的热门库存？',{btn:['确认','取消']},function(){
		$.post('/recycle/hotstock/hotstockdel', {pkid:pkid}, function (data) {
			if (data == 'Y') {
				layer.msg('删除成功');
				setTimeout("grid.reload()",1300);
			} else {
				alert('操作错误：' + data);
			}
		});
	}));
}

function doSearch(){
	layerIndex = layer.msg('搜索中', {icon:16,shade:0.2});
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

function getParams(){
	return {
		category:$('#category').val(),
		merType:$('#merType').val(),
		merName:$('#merName').val(),
	};
}

