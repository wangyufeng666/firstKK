var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"联系方式", dataIndex:'LIANXIDH', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false,
				renderer:function(value, data, rowInex, colIndex, metadata){
					return data['PNAME']+' '+value;
				}
			}
			,{header:"订单价格", dataIndex:'DINGDANPRICE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['DINGDANPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['DINGDANPRICE'];
					}
				}
			}
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'120px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'100px',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'80px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'DINGDANNO', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:orderInfo(\''+value+'\')">查看</a>';
					if(data['DINGDANSTATUS'] == '4'){
						returnText += ' | <a class="a_link" href="javascript:payment(\''+value+'\')">付款</a>';
					}else if(data['DINGDANSTATUS'] == '20'){
						var unPays = ['2','5','8','10','11','21','22','25','26','29','30','31','32','33','36','37','40','41','44','45','51','52'];
						if($.inArray(data['ORDERSOURCES'], unPays) < 0){
							returnText += ' | <a class="a_link" href="javascript:payment(\''+value+'\')">确认付款</a>';
						}
					}
					return returnText;
				}
			}
		]
		,url:'/caiwu/payment/orderpagelist'
		,pageSizeList:[30,50]
	});
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderNo){
    layer.open({
        type:2,
        title:'订单详情',
        shadeClose:false,
        shade:0.8,
        content:'/order/order/orderinfo?orderNo='+orderNo+'&layer=Y',
        area:['100%','100%'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 付款
 * @param orderNo
 */
function payment(orderNo){
    layer.open({
        type:2,
        title:'订单支付',
        shadeClose:false,
        shade:0.8,
        content:'/caiwu/payment/topayment?orderNo='+orderNo,
        area:['550px','450px'],
        close:function(index){
            layer.close(index);
        }
    });
}

function getParams(){
    return {
    	contacts:$('#contacts').val(),
    	merName:$('#merName').val(), 
    	tradeType:$('#tradeType').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        orderNo:$('#orderNo').val(),
        partnerCode:$('#partnerCode').val(),
        orderSource:$('#orderSource').val()
    }
}

function doSearch(){
    grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}

//渠道change事件
$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
		$("#orderSource").html("<option value=''>请选择来源</option>");
		for(i in data){
			$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
		}
	}, 'json');
});
