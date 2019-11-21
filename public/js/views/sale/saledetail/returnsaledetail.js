var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250,
		cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"电商订单号", dataIndex:'BATCHORDERNO', width:'120px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var batchCode = data['BATCHCODE'];
					var batchOrderNo = data['BATCHORDERNO'];
					return '<a href="javascript:batchInfo(\''+batchCode+'\')" class="a_link">'+batchOrderNo+'</a>';
				}	
			}
			,{header:"销售单号", dataIndex:'SALENO', width:'120px',sortable:false}
			,{header:"回收单号", dataIndex:'ORDERNO', width:'120px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					return '<a href="javascript:recyOrderInfo(\''+orderNo+'\')" class="a_link">'+orderNo+'</a>';
				}	
			}
			,{header:"下单时间", dataIndex:'ORDERDATE', width:'120px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'80px',sortable:false}
			,{header:"门店名称", dataIndex:'SHOPNAME', width:'80px',sortable:false}
			,{header:"门店类型", dataIndex:'TYPENAME', width:'80px',sortable:false}
			,{header:"销售金额", dataIndex:'SALEPRICE', width:'80px',sortable:false}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTS']+'('+data['MOBILE']+')';
				}
			}
			,{header:"联系地址", dataIndex:'ADDRESS', width:'80px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var boxCode = data['BOXCODE'];
					var returnText = ''; 
					if(!boxCode || boxCode == null){
						returnText = '<a href="javascript:inWarehouse(\''+orderNo+'\')" class="a_link">入库</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/sale/saledetail/pagelist'
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
 * 来源点击事件
 */
$(function(){
	$('#sources').change(function(){
		var thisId = $(this).val();
		getStoreNames(thisId);
	});
});

/**
 * 重置店铺名称
 * @param partnerType
 * @returns
 */
function getStoreNames(sourceCode){
	$('#storeType').html('<option value="">全部</option>');
	$.ajax({
		type:'GET',
		url:'/sale/saleproductv2/getstorenames?sourceCode='+sourceCode,
		async:false,//同步请求
		timeout:30000,
		success:function(data){
			if(data.length > 0){
				var optionHtml = '';
				for(i in data){
					optionHtml += '<option value="'+data[i]['SHOPCODE']+'">'+data[i]['SHOPNAME']+'</option>';
				}
			}
			$('#storeType').append(optionHtml);
		}
	});
}

/**
 * 回收订单详情
 * @param batchCode
 * @returns
 */
function batchInfo(batchCode){
	layer.open({
		type:2,
		title:'批次订单',
		shadeClose:false,
		shade:0.8,
		content:'/sale/saleproductv2/batchorderinfo?batchCode='+batchCode,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
  	     }
	});
}

/**
 * 回收订单详情
 * @param batchCode
 * @returns
 */
function recyOrderInfo(orderNo){
	layer.open({
		type:2,
		title:'回收订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/order/order/orderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		sources:$('#sources').val(),
		storeType:$('#storeType').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		orderNo:$('#orderNo').val(),
		saleNo:$('#saleNo').val(),
		contacts:$('#contacts').val(),
		merSequence:$('#merSequence').val(),
		delFlag:'Y1'
	};
}

function doSearch(){
	grid.query(getParams());
}

/**
 * 导出销售订单
 */
function exprotOrder(){
	var param = '';
	param += 'sources=' + $('#sources').val();
	param += '&storeType=' + $('#storeType').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&saleNo=' + $('#saleNo').val();
	param += '&contacts=' + $('#contacts').val();
	param += '&merSequence=' + $('#merSequence').val();
	param += '&delFlag=Y1';
	window.location.href = '/sale/saledetail/exportorder?'+param;
	return false; //截取返回false就不会保存网页了
}

function reload(){
	layer.closeAll();
	grid.reload();
}

/**
 * 入库操作
 * @param orderNo
 * @param spId
 * @returns
 */
function inWarehouse(orderNo){
	if(orderNo){
		layer.open({
			type:2,
			title:'移动库位',
			content:'/warehouse/warehousebox/warehouse?orderNo='+orderNo,
			area : ['100%', '100%'],
			close : function(index){
				layer.close(index);
			},
			end : function(index){
				reload();
			}
		});
	}
}