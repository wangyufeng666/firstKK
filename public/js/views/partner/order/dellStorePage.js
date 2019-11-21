var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME', width:'140px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "所属门店", dataIndex: '', width:'150px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['STORENAME']+'-'+data['STORENO'];
				}
			}
			,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header: "联系地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
			,{header: "订单来源", dataIndex: 'SOURCENAME', width:'100px',sortable:false}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
			,{header: "操作", dataIndex: 'ORDERNO', width:'80px', sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}
		]
		,url : '/partner/dellstore/pagelist'
	    ,baseParams:initParams()
	    ,pageSizeList:[10,15,20,30,50]
	});
});

/**
 * 订单详情
 * @return
 */
function orderInfo(orderNo){
    layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
        content:'/partner/order/orderinfo?orderNo='+orderNo+'&layer=Y',
        area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
    });
}

function initParams(){
	var params = getParams();
	return params;
}

function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
        partnerCode:$('#partnerCode').val(),
        orderSource:$('#orderSource').val(),
        tradeType:$('#tradeType').val(),
        contactWay:$('#contactWay').val(),
        orderStatus:$('#orderStatus').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        category:$('#category').val(),
        merType:$('#merType').val(),
        address:$('#address').val()
    };
}

function doSearch(){
    grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function downloadOrder(){
	var param = '';
	param += 'contactWay=' + $('#contactWay').val();
	param += '&tradeType=' + $('#tradeType').val();
	param += '&merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&partnerCode=' + $('#partnerCode').val();
	param += '&startCreateDate=' + $('#startDate').val();
	param += '&endCreateDate=' + $('#endDate').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&orderType=' + $('#orderSource').val();
	param += '&address=' + $('#address').val();
	window.location.href = '/partner/dellstore/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}