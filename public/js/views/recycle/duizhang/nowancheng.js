var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15
                ,height:375
		,cm:[
			{header:"订单号", dataIndex:'ORDERNO', width:'120px',sortable:false}                     
			,{header:"联系人", dataIndex:'LIANXIREN', width:'120px',sortable:false}
                        ,{header:"联系地址", dataIndex:'LIANXIDH', width:'120px',sortable:false}
			,{header:"回款金额", dataIndex:'IN_PRICE',width:'50px',sortable:false}
                        ,{header:"支出金额", dataIndex:'OUT_PRICE',width:'50px',sortable:false}
                         ,{header:"差异金额", dataIndex:'CHAYIPRICE',width:'50px',sortable:false}
                        ,{header:"订单价格", dataIndex:'DINGDANPRICE',width:'50px',sortable:false}
                        ,{header:"完成价格", dataIndex:'SETTLEPRICE',width:'50px',sortable:false}
                        ,{header:"订单状态", dataIndex:'STATUSNAME',width:'50px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
                                        var orderno = data['ORDERNO']; //支付宝账号
                                        var chayiprice=data['CHAYIPRICE'];
					var returnText ='<a href="javascript:void(0);" onclick="addData(\''+orderno+'\',\''+alino+'\',\''+chayiprice+'\')" class="a_link">手动转尾款</a>    ';
                                      //  returnText +='&nbsp&nbsp&nbsp<a href="javascript:void(0);" onclick="saveRemarke(\''+orderNo+'\')" class="a_link">添加备注</a>';
					return returnText;
				}
			}
		]
		,url:'/recycle/duizhang/nowcgpagelist?accounts='+accounts
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

/**
 * 展示备注
 * @param orderNo
 */
function addData(orderno, alino, chayiprice) {
    if (confirm("确定要添加吗？")) {
        $.post('/recycle/duizhang/adddata', {orderno: orderno, alino: alino, chayiprice: chayiprice}, function(data) {
            if (data) {
                alert('添加成功');
            } else {
                alert('添加失败');
            }

        }, 'json');
    }


}



function getParams(){
	return {
		start:start,

	};
}





function doSearch(){
	grid.query(getParams());
}
