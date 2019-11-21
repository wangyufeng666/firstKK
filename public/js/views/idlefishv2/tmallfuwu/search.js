var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
            {checkbox : true},
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'95px',sortable:false}
			,{header:"订单号", dataIndex:'ORDERNO', width:'100px',sortable:false}
			,{header:"求助时间", dataIndex:'SUBMIT_TIME',width:'95px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['TIP']=='Y'&& data['STATUS']=='1'){
						return'<font color="red">'+data['SUBMIT_TIME']+'</font>';
					}else{
						return data['SUBMIT_TIME'];
					}
				}
			}
			,{header:"状态", dataIndex:'SUBMIT_TIME',width:'90px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['STATUS']=='1'){
						return'<font color="red">待处理</font>';
					}else{
						return '已处理';
					}
				}
			}
			,{header:"处理人", dataIndex:'PROCESS_MAN', width:'75px',sortable:false}
			,{header:"处理结果", dataIndex:'PROCESS_RESULT', width:'',sortable:false}
			,{header:"操作", dataIndex:'', width:'120px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">订单详情</a>';
					var status = data['STATUS'];
					if(status=='1'){
						returnText +=' |<a href="javascript:void(0);" onclick="dealWith(\''+orderNo+'\')" class="a_link">再次处理</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/idlefishv2/tmallfuwu/searchpagelist'
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

function doSearch(){
	grid.query(getParams());
}

function getParams(){
	return {
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

