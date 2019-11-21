var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375,
		cm:[
			{header:"No.", dataIndex:'R', width:'5%',sortable:false} 
			,{header:"旧机单号", dataIndex:'ORDERNO', width:'15%',sortable:false}
			,{header:"器材码", dataIndex:'IMEICODE', width:'10%',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME', width:'30%',sortable:false}
			,{header:"入库日期", dataIndex:'INWAREDATE', width:'10%',sortable:false}
			,{header:"出库日期", dataIndex:'OUTWAREDATE', width:'10%',sortable:false}
			,{header:"库存状态", dataIndex:'STATUSNAME', width:'10%',sortable:false}
			,{header:"操作", dataIndex:'', width:'10%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var status = data['STATUS'];
					var returnText ='<a href="javascript:merInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					if(status == 1){
						returnText +=' | <a href="javascript:outWare(\''+orderNo+'\')" class="a_link">出库</a>';
					}else if(status == 3){
						returnText +=' | <a href="javascript:backWare(\''+orderNo+'\')" class="a_link">退库</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/inventory/secondhand/pagelist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
	});
});

function initParams(){
	return getParams();
}

/**
 * 商品详情
 * @param orderNo
 * @return
 */
function merInfo(orderNo){
	layer.open({
		type:2,
		title:'商品详情',
		shadeClose:false,
		shade:0.8,
		content:"/inventory/secondhand/merinfo?orderNo="+orderNo,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 出库
 */
function outWare(orderNo){
	if(confirm('是否出库？')){
		$.post('/inventory/secondhand/outware',{orderNo:orderNo},function(data){
			if(data == "Y"){
				grid.reload();//刷新
			}
		});
	}
}

/**
 * 商品出库
 */
function outWare(orderNo){
	layer.open({
		type:2,
		title:'二手品出库',
		content:'/inventory/secondhand/tooutware?orderNo='+orderNo,
		area:['400px', '250px'],
		close:function(index){
			layer.close(index);
		},
		end:function(index){
			grid.reload();//刷新
		}
	});
}

/**
 * 归还入库
 */
function backWare(orderNo){
	if(confirm('是否退库？')){
		$.post('/inventory/secondhand/backware',{orderNo:orderNo},function(data){
			if(data == "Y"){
				grid.reload();//刷新
			}
		});
	}
}

/**
 * 批量出库
 * @return
 */
function outWares(){
	layer.open({
		type:2,
		title:'批量出库',
		content:'/inventory/secondhand/outwares',
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 批量退回
 * @return
 */
function backWares(){
	layer.open({
		type:2,
		title:'批量退回',
		content:'/inventory/secondhand/backwares',
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

///**
// * 批量审批
// */
//function approvals(){
//	var orderNos = []; 
//	var result = grid.getSelections();
//	if(result == ''){
//		alert('请选择订单');
//	}else{
//		for(var i = 0; i < result.length ; i++){
//			orderNos.push(result[i].ORDERNO);
//		}
//		$.post('/inventory/order/saveapprovals',{orderNos:orderNos},function(data){
//			if(data == 'Y'){
//				doSearch();//刷新
//			}
//		});
//	}
//}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		instartDate:$('#instartDate').val(),
		inendDate:$('#inendDate').val(),
		outstartDate:$('#outstartDate').val(),
		outendDate:$('#outendDate').val(),
		imeiCode:$('#imeiCode').val(),
		status:$('#status').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

/**
 * 扫码查询（器材第三方编码）
 */
function imeiscan(){
	var imeiCodeStr = $('#imeiCode').val();
	var pos;
	var imeiCode = imeiCodeStr.substr(0,pos);
	layer.load('器材码：'+imeiCode, 1);
	grid.query({imeiCode:imeiCode});
	$('#imeiCode').val('');
}

/**
 * 扫码查询（订单）
 */
function orderNoscan(){
	var orderStr = $('#orderNo').val();
	var pos;
	if( (pos = orderStr.indexOf('≌'))>0){
		var orderNo=orderStr.substr(0,pos);
		layer.load('订单编号：'+orderNo, 1);
		grid.query({orderNo:orderNo});
		$('#orderNo').val('');
	}
}

/**
 * 导入商品
 */
function importMer(){	
	layer.open({
		type:2,
		title:'导入预销售产品',
		content:'/inventory/secondhand/import',
		area:['400px' , '250px'],
		close:function(index){
			layer.close(index);
			grid.reload();
		}
	});
}

/**
 * 下载预二手库存
 * @returns {Boolean}
 */
function downloadMer(){
	
	var param = '';
	param += 'orderNo=' + $('#orderNo').val();
	param += '&imeiCode=' + $('#imeiCode').val();
	param += '&merName=' + $('#merName').val();
	param += '&instartDate=' + $('#instartDate').val();
	param += '&inendDate=' + $('#inendDate').val();
	param += '&outstartDate=' + $('#outstartDate').val();
	param += '&outendDate=' + $('#outendDate').val();
	param += '&status=' + $('#status').val();
	window.location.href = '/inventory/secondhand/merexport?'+param;
	return false; //截取返回false就不会保存网页了
}
