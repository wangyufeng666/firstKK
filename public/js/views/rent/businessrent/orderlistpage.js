var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:500
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false
               // ,renderer : function(value, data, rowIndex, colIndex, metadata){
               //   return '<a href="/rent/installment/inspectionbill?orderNo='+data['ORDER_NO']+'" target="view_window" title="'+data['ORDER_NO']+'" class="a_link">'+value+'</a>';
               // }
            }
		   ,{header:"创建时间", dataIndex:'CREATEDATE', width:'10%', sortable:false}
           ,{header: "订单号", dataIndex: 'ORDER_NO', width:'12%',sortable:false
               // ,renderer : function(value, data, rowIndex, colIndex, metadata){
               //   return '<a href="/rent/installment/deliverbill?orderNo='+value+'" target="view_window" title="'+value+'" class="a_link">'+value+'</a>';
               // }
            }
           ,{header: "联系方式", dataIndex: '', width:'10%',sortable:false
            	,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['CONTACT_NAME']+'('+data['MOBILE']+')';
                }
              }		   
		   ,{header:"新机总价格", dataIndex:'TOTAL_NEW_PRODUCT_PRICE', width:'5%', sortable:false}
		   ,{header:"总押金", dataIndex:'TOTAL_DEPOSIT', width:'5%', sortable:false}
		   ,{header:"总租金", dataIndex:'TOTAL_PRICE', width:'5%', sortable:false}
           ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'8%', sortable:false}
           ,{header:"订单来源", dataIndex:'SOURCENAME', width:'8%', sortable:false}
           ,{header: "操作", dataIndex: '', width:'15%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var order_no = data['ORDER_NO'];
					var status = data['STATUS'];
					var order_source = data['ORDER_SOURCE'];
					var returnText ='<a href="javascript:void(0);" title="'+order_no+'" onclick="orderInfo(\''+order_no+'\')" class="a_link">查看</a>';

					if(status === '1'){//未付款终止
                        returnText+=' | <a href="javascript:void(0);" onclick="confirmOrder(\''+order_no+'\')" class="a_link">确认</a>';
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+order_no+'\')" class="a_link">终止</a>';
					}
					return returnText;
				}
			}       
		]
       ,url : '/rent/businessrent/list'
	   ,baseParams:initParams()
	   ,pageSizeList:[10,15,20,30,50]
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
 * @param order_no
 * @return
 */
function orderInfo(order_no){
	window.location.href = "/rent/businessrent/orderdetail?orderNo="+order_no+"&backUrl="+backUrl;
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(orderNo){
    layer.open({
        type:2,
        title:'订单终止',
        shadeClose:false,
        shade:0.8,
        content:'/rent/businessrent/tostoporder?orderNo='+orderNo,
        area:['400px' , '300px'],
        close:function(index){
            layer.close(index);
        }
    });
}



/**
 * 客服电话确认
 * @param Order_no
 * @return
 */
function confirmOrder(orderNo){
    layer.open({
        type:2,
        title:'订单确认',
        shadeClose:false,
        shade:0.8,
        content:'/rent/businessrent/toconfirmorder?orderNo='+orderNo,
        area:['400px' , '300px'],
        close:function(index){
            layer.close(index);
        }
    });
}
function getParams(){
    return {
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
    	mobile:$('#mobile').val(),
    	status:$('#status').val(),
    	order_no:$('#order_no').val(),
        sourceCode:$('#sourceCode').val()
    };
}

function doSearch(){
    layer.load(2, {time: 3*1000});
    grid.query(getParams());
}
