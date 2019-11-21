var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"创建日期", dataIndex:'CREATEDATE', width:'140px',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'160px',sortable:false}
            ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
            ,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
                ,renderer:function(value, data, rowIndex, colIndex, metadata){
                    return data['PNAME']+' '+data['MERNAME'];
                }
            }
			,{header:"支付编号", dataIndex:'SERIALNO', width:'180px',sortable:false}
			,{header:"支付金额", dataIndex:'AMOUNT', width:'80px',sortable:false}
            ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
                ,renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['SETTLEPRICE']){
                        return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
                    }else{
                        return data['ORDERPRICE'];
                    }
                }
            }
			,{header:"手续费", dataIndex:'POUNDAGE', width:'80px',sortable:false}
			,{header:"支付时间", dataIndex:'PAYTIME', width:'130px',sortable:false}
			,{header:"支付状态", dataIndex:'SUCCESS', width:'80px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '';
					if(data['SUCCESS'] == true){
						returnText = '成功';
					}else if(data['SUCCESS'] == false){
						returnText = '失败';
					}else{
						returnText = '处理中';
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'PKID', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a class="a_link" href="javascript:payInfo(\''+orderNo+'\')">详情</a>';
					return returnText;
				}
			}
		]
		,url:'/order/offline/paypagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});
function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		return params;
	}else{
		return {};
	}
}

function downloadPayExport(){
	var param = '';
	param += '&createdateStart=' + $('#createdateStart').val();
	param += '&createdateEnd=' + $('#createdateEnd').val();
	param += '&payStatus=' + $('#payStatus').val();
	param += '&serialNo=' + $('#serialNo').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&payTimeStart=' + $('#payTimeStart').val();
	param += '&payTimeEnd=' + $('#payTimeEnd').val();
	param += '&contacts=' + $('#contacts').val();
	window.location.href = '/order/offline/payexport?'+param;
	return false;
}
/**
 * 详情
 */
function payInfo(orderNo){
	window.location.href = "/order/offline/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

function goBack(){
	window.history.go(-1);
}
function getParams(){
    return {
    	createdateStart:$('#createdateStart').val(),
    	createdateEnd:$('#createdateEnd').val(),
    	payStatus:$('#payStatus').val(),
    	serialNo:$('#serialNo').val(),
    	orderNo:$('#orderNo').val(),
    	payTimeStart:$('#payTimeStart').val(),
    	payTimeEnd:$('#payTimeEnd').val(),
    	contacts:$('#contacts').val()
    };
}
function doSearch(){
    grid.query(getParams());
}
