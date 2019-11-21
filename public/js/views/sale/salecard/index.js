var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250,
		cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"批次号", dataIndex:'BATCHNO', width:'80px',sortable:false}
			,{header:"卡类型", dataIndex:'CARDTYPENAME', width:'80px',sortable:false}
			,{header:"数量", dataIndex:'NUM', width:'80px',sortable:false}
			,{header:"备注", dataIndex:'REMARK', width:'120px',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'120px',sortable:false}
			,{header:"操作", dataIndex:'', width:'200px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '';
						returnText += '<a href="javascript:exportExcel(\''+data['BATCHNO']+'\')" class="a_link">下载excel</a>';
						returnText += '  |  <a href="javascript:downloadImage(\''+data['BATCHNO']+'\')" class="a_link">下载图片</a>';
					return returnText;
				}
			}
		]
		,url:'/sale/salecard/pagelist'
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
 * 下载excel
 * @returns
 */
function exportExcel(batchNo){
	if(confirm('是否下载excel？')){
		window.location.href = "/sale/salecard/downloadexcel?batchNo="+batchNo;
	}
}

/**
 * 下载二维码图片
 * @returns
 */
function downloadImage(batchNo){
	if(confirm('是否下载二维码图片？下载需要点时间,请稍等!')){
		layer.msg('正在下载中,请稍等!');
		window.location.href = "/sale/salecard/downloadimage?batchNo="+batchNo;
	}
}

/**
 * 新增批次销售卡
 */
function addCard(){
	layer.open({
		type:2,
		title:'批量生成销售卡',
		shadeClose:false,
		shade:0.8,
		content:'/sale/salecard/addcard',
		area:['400px','350px'],
		close:function(index){
			layer.close(index);
  	     },end:function () {
			doSearch();
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