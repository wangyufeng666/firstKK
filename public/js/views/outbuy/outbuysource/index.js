var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"采购渠道", dataIndex:'SOURCENAME', width:'90px',sortable:false}
			,{header:"联系姓名", dataIndex:'CONTACTS', width:'75px',sortable:false}
			,{header:"联系电话", dataIndex:'MOBILE', width:'80px',sortable:false}
			,{header:"联系地址", dataIndex:'ADDRESS', width:'100px',sortable:false}
			,{header:"创建人", dataIndex:'USERNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var returnText ='<a href="javascript:void(0);" onclick="updateSource(\''+pkid+'\')" class="a_link">编辑</a>';
					    returnText +=' | <a href="javascript:void(0);" onclick="deleteSource(\''+pkid+'\')" class="a_link">删除</a>';
					return returnText;
				}
			}
		]
		,url:'/outbuy/outbuysource/pagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[15,20,30,50]
	});
});

function initParams(){
	var params = getParams();
//	params['start'] = start;
//	params['limit'] = limit;
	return params;
}

/**
 * 添加采购来源
 */
function addSource(){
	layer.open({
		type:2,
		title:'添加采购渠道',
		content:'/outbuy/outbuysource/addsourcepage',
		shadeClose:false,
		shade:0.8,
		area:['500px' , '350px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 编辑采购来源
 */
function updateSource(pkid){
	layer.open({
		type:2,
		title:'编辑采购渠道',
		content:'/outbuy/outbuysource/updatesourcepage?pkid='+pkid,
		shadeClose:false,
		shade:0.8,
		area:['500px' , '350px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除来源
 * @param orderId
 * @return
 */
function deleteSource(pkid){
	if(confirm('是否确认删除该渠道')){
		if(pkid){
			$.post('/outbuy/outbuysource/deletesource', {pkid:pkid}, function(data){
				if(data == 'Y'){
					alert("删除成功");
					window.location.href = window.location.href;
				}else{
					alert('删除失败：'+data);
				}
			});
		}
	}
}

function getParams(){
	return {
		//start:start,
		contacts:$('#contacts').val(),
		sourceCode:$('#sourceCode').val(),
		endDate:$('#endDate').val(),
		startDate:$('#startDate').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}
