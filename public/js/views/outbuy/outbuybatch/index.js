var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"批次编号", dataIndex:'BATCHCODE', width:'90px',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'75px',sortable:false}
			,{header:"数量", dataIndex:'COUNTS', width:'80px',sortable:false}
			,{header:"总金额", dataIndex:'TOTALPRICE', width:'100px',sortable:false}
			,{header:"创建人", dataIndex:'USERNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var returnText ='<a href="javascript:void(0);" onclick="batchDetail(\''+pkid+'\')" class="a_link">详情</a>';
					return returnText;
				}
			}
		]
		,url:'/outbuy/outbuybatch/pagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[15,20,30,50]
	});
});

function initParams(){
	return getParams();
}

/**
 * 详情
 */
function batchDetail(pkid){
	layer.open({
		type:2,
		title:'批次详情',
		content:'/outbuy/outbuybatch/batchdetailpage?pkid='+pkid,
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}
/**
 * 下载
 * @param orderId
 * @return
 */
function batchExport(){
	var param = '';
	param += '&endDate=' + $('#endDate').val();
	param += '&startDate=' + $('#startDate').val();
	window.location.href = '/outbuy/outbuybatch/batchexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function getParams(){
	return {
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
