var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250,
		cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'120px',sortable:false}
			,{header:"所属来源", dataIndex:'SOURCENAME', width:'80px',sortable:false}
			,{header:"店铺名称", dataIndex:'SHOPNAME', width:'80px',sortable:false}
			,{header:"店铺编码", dataIndex:'SHOPCODE', width:'80px',sortable:false}
			,{header:"负责人", dataIndex:'CONTACTS', width:'80px',sortable:false}
			,{header:"店铺类型", dataIndex:'TYPENAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'200px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var shopCode = data['SHOPCODE'];
					var returnText = '<a href="javascript:edit(\''+shopCode+'\')" class="a_link">修改</a>';
					returnText += ' | <a href="javascript:del(\''+shopCode+'\')" class="a_link">删除</a>';
					return returnText;
				}
			}
		]
		,url:'/sale/shopsource/shoppagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[10,15,30,50]
	});
});

function initParams(){
	return getParams();
}

/**
 * 修改
 * @returns
 */
function edit(shopCode){
	layer.open({
		type:2,
		title:'新增来源',
		shadeClose:false,
		shade:0.8,
		content:'/sale/shopsource/editshop?shopCode='+shopCode,
		area:['500px','400px'],
		close:function(index){
			layer.close(index);
  	     }
	});		
}

/**
 * 删除
 * @returns
 */
function del(shopCode){
	if(confirm('是否确认删除店铺？')){
		$.ajax({
			type:'post',
			url:'/sale/shopsource/delshop?shopCode='+shopCode,
			data:{shopCode:shopCode},
			async:false,
			timeout:30000,
			success:function(data){
				reload();
			}
		})
	}
}

/**
 * 新增店铺
 * @param orderNo
 * @returns
 */
function addShop(){
	layer.open({
		type:2,
		title:'新增店铺',
		shadeClose:false,
		shade:0.8,
		content:'/sale/shopsource/addshop',
		area:['500px','400px'],
		close:function(index){
			layer.close(index);
  	     }
	});	
}

function getParams(){
	return {
		sources:$('#sources').val(),
		shopName:$('#shopName').val(),
		contacts:$('#contacts').val(),
		sources:$('#sources').val(),
		type:$('#type').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
	};
}


function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}