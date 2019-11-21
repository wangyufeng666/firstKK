var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250,
		cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"回收单号", dataIndex:'DINGDANNO', width:'120px',sortable:false}
			,{header:"销售单号", dataIndex:'ORDERNO', width:'100px',sortable:false}
			,{header:"销售时间", dataIndex:'SALEDATE', width:'80px',sortable:false}
			,{header:"商品品类", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"订单价格", dataIndex:'SETTLEPRICE', width:'80px',sortable:false}
			,{header:"销售价格", dataIndex:'PRODUCTPRICE', width:'80px',sortable:false}
			,{header:"毛利率", dataIndex:'RATE', width:'80px',sortable:false}
			,{header:"商品来源", dataIndex:'MERSOURCES', width:'80px',sortable:false}
			,{header:"负责人", dataIndex:'SALEER', width:'80px',sortable:false}
			,{header:"销售类型", dataIndex:'SALETYPE', width:'80px',sortable:false}
			,{header:"销售渠道", dataIndex:'SOURCESNAME', width:'80px',sortable:false}
			,{header:"渠道明细", dataIndex:'STORENAME', width:'80px',sortable:false}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTS']+'('+data['MOBILE']+')';
				}
			}
		]
		,url:'/sale/saleproduct/salepagelist'
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

function getParams(){
	return {
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		orderNo:$('#orderNo').val(),
		dingdanNo:$('#dingdanNo').val(),
		imei:$('#imei').val(),
	};
}

/**
 * 导出销售订单
 */
function downsaleOrder(exportSources){
	var param = '';
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&dingdanNo=' + $('#dingdanNo').val();
	param += '&imei=' + $('#imei').val();
	param += '&exportSources=' + exportSources;
	window.location.href = '/sale/saleproduct/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function doSearch(){
	grid.query(getParams());
}
