var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250,
		cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'120px',sortable:false}
			,{header:"来源名称", dataIndex:'SOURCENAME', width:'80px',sortable:false}
			,{header:"来源编码", dataIndex:'SOURCECODE', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'200px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var sourceCode = data['SOURCECODE'];
					var returnText = '<a href="javascript:del(\''+sourceCode+'\')" class="a_link">删除</a>';
					return returnText;
				}
			}
		]
		,url:'/sale/shopsource/pagelist'
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
 * 删除
 * @returns
 */
function del(sourceCode){
	if(confirm('是否确认删除来源？')){
		$.ajax({
			type:'post',
			url:'/sale/shopsource/delsource',
			data:{sourceCode:sourceCode},
			async:false,
			timeout:30000,
			success:function(data){
				reload();
			}
		})
	}
}

/**
 * 新增来源
 * @param orderNo
 * @returns
 */
function addSource(){
	layer.open({
		type:2,
		title:'新增来源',
		shadeClose:false,
		shade:0.8,
		content:'/sale/shopsource/addsource',
		area:['500px','350px'],
		close:function(index){
			layer.close(index);
  	     }
	});	
}

function getParams(){
	return {
		sourceName:$('#sourceName').val(),
		sourceCode:$('#sourceCode').val(),
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