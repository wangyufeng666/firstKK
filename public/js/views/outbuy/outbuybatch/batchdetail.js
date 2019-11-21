var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:50,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"采购渠道", dataIndex:'SOURCENAME', width:'90px',sortable:false}
			,{header:"商品型号", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var text = data['PNAME']+' '+data['MERNAME'];
					return text;
				}
			}
			,{header:"设备IMEI编码", dataIndex:'IMEI', width:'80px',sortable:false}
			,{header:"采购价格", dataIndex:'ORDERPRICE', width:'75px',sortable:false}
			,{header:"导入时间", dataIndex:'CREATEDATE', width:'75px',sortable:false}
			,{header:"订单号", dataIndex:'', width:'90px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:orderInfo(\''+orderNo+'\')" class="a_link">'+orderNo+'</a>';
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'', width:'90px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					operationText ='<a href="javascript:orderQrCode(\''+data['ORDERNO']+'\')" class="a_link">打印二维码</a>';
					if(data['INSPECTFLAG'] === 'N'){
						operationText +=' | <a href="javascript:orderInspection(\''+data['ORDERNO']+'\')" class="a_link">检测</a>';
					}
					return operationText;
				}
			}
		]
		,url:'/outbuy/outbuybatch/batchorderdetail'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[50,100,150,200]
	});
});

function initParams(){
	return getParams();
}

/**
 * 下载
 * @return
 */
function ordersBatchExport(){
	var param = '';
	param += '&batchCode=' + $('#batchCode').val();
	param += '&createDate=' + $('#createDate').val();
	window.location.href = '/outbuy/outbuybatch/ordersbatchexport?'+param;
	return false; //截取返回false就不会保存网页了
}

/**
 * 详情
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		content:'/order/order/orderinfo?orderNo='+orderNo,
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 检测
 * @param orderNo
 * @return
 */
function orderInspection(orderNo){
	if(orderNo){
		layer.open({
			type:2,
			title:'请质检',
			content:'/order/order/orderinspection?orderNo='+orderNo,
			shadeClose:false,
			shade:0.8,
			area:['100%' , '100%'],
			close:function(index){
				layer.close(index);
			}
		});
	}
}

/**
 * 二维码
 * @param orderNo
 * @return
 */
function orderQrCode(orderNo){
	if(orderNo){
		var url = '/order/order/qrcode?orderNo='+orderNo;
		layer.open({
			type:2,
			title:'二维码打印',
			shadeClose:false,
			shade:0.8,
			content:url,
			area:['350px','380px'],
			close:function(index){
				layer.close(index);
			}
		});
	}
}

/**
 * 批量打印二维码
 * @param orderNo
 * @return
 */
function orderAllQrCode(){
	var batchCode = $('#batchCode').val();
	if(batchCode){
		var url = '/outbuy/outbuybatch/batchqrcode?batchCode='+batchCode;
		layer.open({
			type:2,
			title:'批量二维码打印',
			shadeClose:false,
			shade:0.8,
			content:url,
			area:['90%','90%'],
			close:function(index){
				layer.close(index);
			}
		});
	}
}

function getParams(){
	return {
		batchCode:$('#batchCode').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}
