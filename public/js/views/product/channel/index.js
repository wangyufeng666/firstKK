var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'60px',sortable:false}
			,{header:"合作商", dataIndex:'PARTNERNAME', sortable:false}
			,{header:"合作商编码", dataIndex:'PARTNERCODE', width:'100px',sortable:false}
			,{header:"合作商状态", dataIndex:'PARTNERSTATUS', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '';
					switch (value) {
						case '1' :
							returnText = '有效';
							break;
						case '2':
							returnText = '无效';
							break;
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'PARTNERCODE', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a class="a_link" href="javascript:show(\''+value+'\')">详情</a>';
				}
			}
		]
		,url:'/product/channel/pagelist'
		,baseParams:getParams()
	});
});

/**
 * 新增合作商商品
 * @return
 */
function show(partnerCode){
	layer.open({
		type:2,
		title:'渠道品类品牌详情',
		shadeClose:false,
		shade:0.8,
		content:'/product/channel/showchannel?partnerCode='+partnerCode,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		partnerCode:$('#partnerCode').val(),
		partnerName:$('#partnerName').val(),
	};
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function doSearch(){
	grid.query(getParams());
}
