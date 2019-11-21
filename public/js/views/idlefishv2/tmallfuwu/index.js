var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
            {checkbox : true},
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					return '<span ondblclick="showRemark(\''+orderNo+'\')">'+data['STRORDERDATE']+'</span>';
				}
			}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'80px',sortable:false}
			,{header:"订单号", dataIndex:'ORDERNO', width:'85px',sortable:false}
			,{header:"求助时间", dataIndex:'SUBMIT_TIME',width:'95px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['TIP']=='Y'&& data['STATUS']=='1'){
						return'<font color="red">'+data['SUBMIT_TIME']+'</font>';
					}else{
						return data['SUBMIT_TIME'];
					}
				}
			}
			,{header:"处理状态", dataIndex:'SUBMIT_TIME',width:'60px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['STATUS']=='2'){
						return'已处理';
					}else{
						return'<font color="red">未处理</font>';
					}
				}
			}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'70px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',width:'90px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
        		}
			} 
			,{header:"支付状态", dataIndex:'ZM_ORDER_STATUSNAME', width:'90px',sortable:false}
			,{header:"订单类型", dataIndex:'ZMTYPENAME', width:'70px',sortable:false}
			,{header:"未参与原因", dataIndex:'ZM_ORDER_TYPENAME', width:'80px',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
        		}
			}
			,{header:"渠道来源", dataIndex:'CHANNELNAME', width:'65px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'60px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">订单详情</a>';
					var status = data['STATUS'];
					if(status=='1'){
						returnText +=' |<a href="javascript:void(0);" onclick="dealWith(\''+orderNo+'\')" class="a_link">去处理</a>';
					}else{
						returnText +=' |<a href="javascript:void(0);" onclick="dealWith(\''+orderNo+'\')" class="a_link">查看</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/idlefishv2/tmallfuwu/pagelist'
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
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}

function doSearch(){
	grid.query(getParams());
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}
/**
 * 订单详情
 * @param orderNo
 * @return
 */
function dealWith(orderNo){
	window.location.href = "/idlefishv2/tmallfuwu/dealwith?orderNo="+orderNo+"&backUrl="+backUrl;
}



function getParams(){
	return {
		start:start,
		status:$('#status').val(),
		orderNo:$('#orderNo').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

