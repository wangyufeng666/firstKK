var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false
               ,renderer : function(value, data, rowIndex, colIndex, metadata){
                 return '<a href="/rent/installment/inspectionbill?orderNo='+data['ORDER_NO']+'" target="view_window" title="'+data['ORDER_NO']+'" class="a_link">'+value+'</a>';
               }
            }
		   ,{header:"创建时间", dataIndex:'CREATE_DATE', width:'10%', sortable:false}
		   ,{header:"订单来源", dataIndex:'ORDER_SOURCENAME', width:'8%', sortable:false}
           ,{header: "订单号", dataIndex: 'ORDER_NO', width:'12%',sortable:false
               ,renderer : function(value, data, rowIndex, colIndex, metadata){
                 return '<a href="/rent/installment/deliverbill?orderNo='+value+'" target="view_window" title="'+value+'" class="a_link">'+value+'</a>';
               }
            }
		   ,{header:"商品类型", dataIndex:'PRODUCT_TYPE_NAME', width:'5%', sortable:false}
		   ,{header:"商品名", dataIndex:'', width:'15%', sortable:false
           	,renderer : function(value, data, rowIndex, colIndex, metadata){
		   		if(data['NEWNAME'] && data['NEWNAME'] !== ''&& data['NEWNAME'] !== null ){
                    return data['NEWNAME'];
				}else{
                    return data['PRODUCT_NAME']+' '+data['MODEL_NAME'];
				}
              }
		   }
           ,{header: "联系方式", dataIndex: '', width:'10%',sortable:false
            	,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['CONTACT_NAME']+'('+data['CONTACT_MOBILE']+')';
                }
              }		   
		   ,{header:"新机价格", dataIndex:'NEW_PRODUCT_PRICE', width:'5%', sortable:false}
           ,{header:"交易方式", dataIndex:'TRADE_TYPE', width:'8%', sortable:false}
           ,{header:"结算方式", dataIndex:'PAYTYPE', width:'8%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				return value == '1' ? '乐百分' : value == '2' ? '花呗' : value == '3' ? '支付宝全额':'小程序代扣';
			}
          }
           ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'8%', sortable:false}
           ,{header: "操作", dataIndex: '', width:'15%', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var order_no = data['ORDER_NO'];
					var status = data['STATUS'];
					var returnText ='<a href="javascript:void(0);" title="'+order_no+'" onclick="orderInfo(\''+order_no+'\')" class="a_link">查看</a>';
					returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+order_no+'\')" class="a_link">发货</a>';
                    // if(data['ORDER_SOURCE'] == '1019' && data['PAYTYPE'] == '4'){//新品牌租赁
                    //     returnText+=' | <a href="javascript:void(0);" onclick="newBrandStopOrder(\''+order_no+'\')" class="a_link">取消订单</a>';
                    // }
					return returnText;
				}
			}       
		]
       ,url : '/rent/rentorderdeliver/list'
	   ,baseParams:initParams()
	   ,pageSizeList:[10,15,20,30,50]
	});
    // 终端变更监听
    $('#order_source').change(function(){
        changeSourceShow();
    });
});

// 修改查询来源
function changeSourceShow(){
    var terminalCode = orderListApp.terminalCode;
    if(terminalCode){
        if(allSourceCode[terminalCode]) {
            orderListApp.terminalName = allTerminal[terminalCode];
            orderListApp.sourceCodeList = allSourceCode[terminalCode];
            orderListApp.showSourceCode = true;
        }else{
            orderListApp.sourceCodeList = '';
            orderListApp.showSourceCode = false;
        }
    }else{
        orderListApp.sourceCodeList = '';
        orderListApp.showSourceCode = false;
    }
    orderListApp.sourceCode = '';
}

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {'status':2};
	}
}

function newBrandStopOrder(orderNo){
    layer.open({
        type:2,
        title:'订单终止',
        shadeClose:false,
        shade:0.8,
        content:'/rent/installment/tonewbrandstoporder?orderNo='+orderNo,
        area:['600px', '400px'],
        resize:false,
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 订单详情
 * @param order_no
 * @return
 */
function orderInfo(order_no){
	window.location.href = "/rent/installment/orderinfo?order_no="+order_no+"&backUrl="+backUrl;
}

function getParams(){
    return {
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
    	mobile:$('#mobile').val(),
    	order_source:$('#order_source').val(),
    	status:2,
    	product_name:$('#product_name').val(),
    	merType:$('#merType').val(),
    	order_no:$('#order_no').val(),
        sourceCode:$('#sourceCode').val()
    };
}

function doSearch(){
    layer.load(2, {time: 3*1000});
    grid.query(getParams());
}

function reload(){
    layer.closeAll();
    grid.reload();
}

function orderOperation(orderNo){
    layer.open({
        type:2,
        title:'订单发货',
        shadeClose:false,
        shade:0.8,
        content:'/rent/rentorderdeliver/operation?orderNo='+orderNo,
        area:['800px' , '500px'],
        close:function(index){
            layer.close(index);
        }
    });
}


/**
 * 导出销售订单
 */
function downOrder(){
    window.location.href = '/rent/rentorderdeliver/sendorderexport';
    return false; //截取返回false就不会保存网页了
}