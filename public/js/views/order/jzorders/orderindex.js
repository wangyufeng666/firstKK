var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单号", dataIndex: 'ORDERNO', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					return '<span ondblclick="showRemark(\''+orderNo+'\')">'+orderNo+'</span>';
				}
			}
			,{header: "商品名称", dataIndex: 'MERNAME', width:'60px',sortable:false}
			,{header: "订单日期", dataIndex: 'CREATEDATE', width:'100px',sortable:false}
			,{header: "预约日期", dataIndex: 'VISITDATE', width:'100px',sortable:false}
			,{header: "联系方式", dataIndex: '', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTS']+'('+data['MOBILE']+')';
				}
			}
			,{header: "联系地址", dataIndex: 'ADDRESS', width:'140px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'60px',sortable:false}
			,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var status = data['ORDERSTATUS'];
					var returnText ='';
					
					if(status == '1'){//审核
						returnText+='<a href="javascript:void(0);" onclick="sureOrder(\''+orderNo+'\')" class="a_link">审批</a> | ';
						returnText +='<a href="javascript:void(0);" onclick="editOrder(\''+orderNo+'\')" class="a_link">修改预约</a> | ';
					}
					
					if(status != '99' && status != '66'){
						returnText+='<a href="javascript:void(0);" onclick="stopOrder(\''+orderNo+'\')" class="a_link">终止</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/order/jzorders/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params.start = start;
		params.limit = limit;
		return params;
	}else{
		return {};
	}
}

/**
 * 检测操作
 * @param orderId
 * @return
 */
function sureOrder(orderNo){
	if(confirm('是否确认已经收到卡片机，交易完成？')){
		$.post('/order/jzorders/updateorderstatus',{orderNo:orderNo,orderStatus:66},function(data){
			if(data == 'Y'){
				alert('操作成功');
				grid.query(getParams());
			}else{
				alert('修改失败');
			}
		})
	}
}

/**
 * 检测操作
 * @param orderId
 * @return
 */
function stopOrder(orderNo){
	if(confirm('是否确认终止订单？')){
		$.post('/order/jzorders/updateorderstatus',{orderNo:orderNo,orderStatus:99},function(data){
			if(data == 'Y'){
				alert('操作成功');
				grid.query(getParams());
			}else{
				alert('修改失败');
			}
		})
	}
}

function editOrder(orderNo){
	layer.open({
		  type: 2,
		  title: '修改预约',
		  shadeClose: true,
		  shade: 0.8,
		  area: ['500px', '300px'],
		  content: '/order/jzorders/yuyue?orderNo='+orderNo
		}); 
}

function getParams(){
	return {
		orderNo:$('#orderNo').val(),
		contactWay:$('#contactWay').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo){
	$.post('/order/jzorders/jsonremark',{orderNo:orderNo}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', 'auto'],
			content:'<div class="layer_notice">'+orderNo+'<br/>'+data+'</div>'
		});
	});
}

function doSearch(){
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}
	});
}

function exprotOrder(){
	var param = '';
	param += '&orderNo=' + $('#orderNo').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	window.location.href = '/order/jzorders/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}