var grid;
$().ready(function(){
	grid = $('#grid').grid({
	pageSize :10,
	height:250
		,cm :[
			 {header:"No",dataIndex:'R',width:'100px',sortable:false}
			,{header:"入库操作人ID",dataIndex:'INOPERATORID',width:'150px',sortable:false}
			,{header:"入库数量",dataIndex:'INCOUNT',width:'150px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					var inoperatorId = data['INOPERATORID'];
					//var inCount = data['INCOUNT'];
					return '<a class= "a_link" href="javascript:showInNum(\''+inoperatorId+'\')">'+data['INCOUNT']+'</a>';
	               }			
			}	
			,{header:"出库操作人ID",dataIndex:'OUTOPERATORID',width:'150px',sortable:false}		
			,{header:"出库数量",dataIndex:'OUTCOUNT',width:'150px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					//var outCount = data['OUTCOUNT'];
					var outoperatorId = data['OUTOPERATORID'];
					return '<a class= "a_link" href="javascript:showOutNum(\''+outoperatorId+'\')">'+data['OUTCOUNT']+'</a>';
	               }				
			}	
			,{header:"操作",dataIndex:'',width:'200px',sortable:false}		
		]
	,url:'/inventory/warehouse/warehouselist'
	,baseParams : initParams()
	,pageSizeList : [10]
	});
});	
	
function initParams(){
	  var params = getParams();
	  params.start= start;
	  params.limit = limit;
	  return params;
}

function getParams(){
	return{
//		    		userName:$('#inoperatorId').val(),
//		    		startDate:$('#startDate').val(),
//		    		endDate:$('#endDate').val()
		inoperatorId:$('#inoperatorId').val(),
		inCount :$('#inCount').val(),
		outoperatorId:$('#outoperatorId').val(),
		outCount:$('#outCount').val()
		}
}
//function doSearch(){
//	layer.load('数据加载中，请稍后','2');
//		grid.query(getParams());
//}
//导出1
function doExport(){
	var param = '';
	param += 'inoperatorId=' + $('#inoperatorId').val();		
	param += 'inCount=' + $('#inCount').val();

	param += 'outoperatorId=' + $('#outoperatorId').val();	
	param += 'outCount=' +$('#outCount').val();
	
	
	window.location.href = "/inventory/warehouse/warehouseexecl?"+encodeURI(param);
	
}
//入库弹出框组件
function showInNum(inoperatorId){
	layer.open({
		type:2,//0,默认;1,页面层;2,iframe层；3加载层；4，tips层。
	    //title:'入库详细情况统计列表',
		title:['入库详细情况统计列表','font-size:20px;font-color:black;text-align:center'],
		//title:false,
		content:'/inventory/inventory/innum?inoperatorId='+inoperatorId,
		area:['95%','70%']
	});
}
///出库弹出框组件
function showOutNum(inoperatorId){
	layer.open({
		type:2,//0,默认;1,页面层;2,iframe层；3加载层；4，tips层。

		title:['出库详细情况统计列表','font-size:20px;font-color:black;text-align:center'],
		content:'/inventory/inventory/outnum?inoperatorId='+inoperatorId,
		area:['90%', '90%']
	});
}
