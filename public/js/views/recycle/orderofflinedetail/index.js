var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'CREATEDATE', width:'80px',sortable:false}
			,{header: "订单编号", dataIndex: 'ORDERNO', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTWAY']+'('+data['CONTACTS']+')';
				}
			}
			,{header: "联系地址", dataIndex: 'ADDRESS',sortable:false}
			
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
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
			,{header: "新机（IMEI）", dataIndex: '', width:'130px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['NEWMERNAME']+'('+data['IMEI']+')';
				}
			}
			,{header: "新机价格", dataIndex: 'NEWMERPRICE', width:'80px',sortable:false}
			,{header: "操作人", dataIndex: '', width:'130px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['OPERATORID']+'('+data['USERNAME']+')';
				}
			}
			,{header: "归属门店", dataIndex: 'STORENAME', width:'80px',sortable:false}
			,{header: "操作", dataIndex: '', width:'80px', sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}
		]
		,url : '/recycle/orderofflinedetail/pagelist'
	    ,baseParams:initParams()
	    ,pageSizeList:[10,15,20,30,50]
	});
});

/**
 * 订单详情
 */
function orderInfo(orderNo){
	window.location.href = "/recycle/orderofflinedetail/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

function initParams(){
	var params = getParams();
	params['start'] = start;
	params['limit'] = limit;
	return params;
}

function getParams(){
    return {
    	partnerCode:$('#partnerCode').val(),
         merName:$('#merName').val(),
         orderNo:$('#orderNo').val(),
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
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}

function downloadDdExport(){
	var param = '';
	param += '&partnerCode=' + $('#partnerCode').val();
	param += '&merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&orderType=' + $('#orderType').val();	
	param += '&contactWay=' + $('#contactWay').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&address=' + $('#address').val();
	param += '&tradeType=' + $('#tradeType').val();
	window.location.href = '/recycle/orderofflinedetail/export?'+param;
	return false; //截取返回false就不会保存网页了
}
