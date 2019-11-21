var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false}
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "所属合作商", dataIndex: 'HNAME', width:'80px',sortable:false}
			,{header: "地推人员", dataIndex: 'NAME', width:'80px',sortable:false}
			,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header: "联系地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
			,{header: "订单来源", dataIndex: 'SOURCENAME', width:'100px',sortable:false}
			,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
			,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var status = data['ORDERSTATUS']+'';
					var merType = data['MERTYPE'];
					var payFlag = data['PAYFLAG'];
					var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';

					returnText += ' | <a href="javascript:void(0);" onclick="orderInspection(\''+orderNo+'\',\''+payFlag+'\')" class="a_link">检测</a>';



					return returnText;
				}
			}
		]
		,url:'/offline/inspection/replaypagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(){
			layer.close(layerIndex);
		}
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
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单复检',
		content: "/offline/inspection/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});

}


/**
 * 检测操作
 * @param orderId
 * @return
 */
function orderInspection(orderNo, payFlag){
	if(payFlag == 'N') {
		layer.alert('无付款信息，请联系客服人员确定！');
		return false;
	}
	layer.open({
		type:2,
		title:'订单复检',
		content: "/offline/inspection/orderinspection?orderNo="+orderNo,
		area:['95%' , '95%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 京东订单检测
 */
function jdOrderInspection(orderNo){
	window.location.href = "/order/offline/orderinspection?orderNo="+orderNo;
}



function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		orderSource:$('#orderSource').val(),
		tradeType:$('#tradeType').val(),
		contactWay:$('#contactWay').val(),
		partnerCode:$('#partnerCode').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		address:$('#address').val(),
		partnerName:$('#partnerName').val(),
		typeCode:$('#typeCode').val(),
		mailNo:$('#mailNo').val(),
	};
}

function doSearch(){
	layerIndex = layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}
	});
}
