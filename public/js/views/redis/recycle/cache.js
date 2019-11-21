var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}		
                        ,{header:"支付宝流水号", dataIndex:'YDMABNORMAL', width:'120px',sortable:false}
			,{header:"有得卖流水号", dataIndex:'YDM_TRADE_NO', width:'120px',sortable:false}
                        ,{header:"有得卖订单号", dataIndex:'ORDERNO', width:'120px',sortable:false}
			,{header:"回款金额", dataIndex:'IN_PRICE',width:'50px',sortable:false}
                        ,{header:"支出金额", dataIndex:'OUT_PRICE',width:'50px',sortable:false}
                     
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
//                                        var accounts = data['ACCOUNTS']; //支付宝账号
//					var returnText ='<a href="javascript:void(0);" onclick="weiWanCheng(\''+accounts+'\')" class="a_link">未完成的订单信息</a>    ';
//                                      //  returnText +='&nbsp&nbsp&nbsp<a href="javascript:void(0);" onclick="saveRemarke(\''+orderNo+'\')" class="a_link">添加备注</a>';
//					return returnText;
				}
			}
		]
		,url:'/redis/recycle/pagelist'
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
 * 展示备注
 * @param orderNo
 */
function isShow(orderNo) {
    $.post('/recycle/duizhang/isshow', {orderId: orderNo}, function(data) {
       
     
    }, 'json');

}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function saveRemarke(orderNo){
	window.location.href = "/recycle/duizhang/saveremarke?orderNo="+orderNo+"&backUrl="+backUrl;
}





function getParams(){
	return {
		start:start,
		orderNo:$('#orderNo').val(),
		startDate:$('#startDate').val(),
                endDate:$('#endDate').val(),
		zfbNo:$('#zfbNo').val(),
		fromCode:$('#fromCode').val(),
		
	};
}



function doSearch(){
	grid.query(getParams());
}
