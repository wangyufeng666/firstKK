var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"支付宝流水号", dataIndex:'ALIABNORMAL', width:'120px',sortable:false}
                       
			,{header:"有得卖流水号", dataIndex:'YDM_TRADE_NO', width:'120px',sortable:false}
                       ,{header:"支付账号", dataIndex:'ACCOUNTS', width:'120px',sortable:false}
			,{header:"回款金额", dataIndex:'IN_PRICE',width:'50px',sortable:false}
                        ,{header:"支出金额", dataIndex:'OUT_PRICE',width:'50px',sortable:false}
                     
//                         ,{header:"交易描述", dataIndex:'PAY_TYPE',width:'60px',sortable:false}
//                          ,{header:"支付时间", dataIndex:'PAYDATE',width:'60px',sortable:false}
//                          ,{header:"备注", dataIndex:'REMARK',width:'200px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
                                        var accounts = data['ACCOUNTS']; //支付宝账号
                                        var aliNo = data['ALIABNORMAL'];
					var returnText ='<a href="javascript:void(0);" onclick="weiWanCheng(\''+accounts+'\',\''+aliNo+'\')" class="a_link">未完成的订单信息</a>    ';
                                      //  returnText +='&nbsp&nbsp&nbsp<a href="javascript:void(0);" onclick="saveRemarke(\''+orderNo+'\')" class="a_link">添加备注</a>';
					return returnText;
				}
			}
		]
		,url:'/recycle/duizhang/pagelist1'
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


function weiWanCheng(accounts,alino){
    window.location.href = "/recycle/duizhang/nowancheng?accounts="+accounts+"&backUrl="+backUrl+"&alino="+alino;
    return false;
}


function getParams(){
	return {
		start:start,
		orderNo:$('#orderNo').val(),
		startDate:$('#startDate').val(),
		zfbNo:$('#zfbNo').val(),
		fromCode:$('#fromCode').val(),
		
	};
}

function downloadZhiMaExport(){
	var param = '';
	param += '&merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&orderType=' + $('#orderType').val();	
	param += '&contactWay=' + $('#contactWay').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&isFromCode=' + $('#isFromCode').val();
	param += '&zm_Order_Status=' + $('#zm_Order_Status').val();
	param += '&zm_Order_Type=' + $('#zm_Order_Type').val();
	window.location.href = '/zhima/recyorder/zhimaexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function flagException(){
      $.post('/recycle/duizhang/flagexception', {orderId: ''}, function(data) {
          if(data){
              alert('标记成功');
          }else{
              alert('标记失败');
          }
     
    }, 'json');
}

function doSearch(){
	grid.query(getParams());
}
