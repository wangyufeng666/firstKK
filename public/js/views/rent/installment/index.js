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
		   ,{header:"订单来源", dataIndex:'ORDER_SOURCENAME', width:'14%', sortable:false}
           ,{header: "订单号", dataIndex: 'ORDER_NO', width:'12%',sortable:false
               ,renderer : function(value, data, rowIndex, colIndex, metadata){
                 return '<a href="/rent/installment/deliverbill?orderNo='+value+'" target="view_window" title="'+value+'" class="a_link">'+value+'</a>';
               }
            }
		   ,{header:"商品类型", dataIndex:'PRODUCT_TYPE_NAME', width:'5%', sortable:false}
		   ,{header:"商品名", dataIndex:'', width:'15%', sortable:false
           	,renderer : function(value, data, rowIndex, colIndex, metadata){
                return data['PRODUCT_NAME']+' '+data['MODEL_NAME'];
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
                    return data['payTypeName'];
			    }
            }
           ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'8%', sortable:false}
            , {header: "是否采购", dataIndex: 'ISPURCHASE', width: '8%', sortable: false,
                renderer: function (value, data, rowIndex, colIndex, metadata) {
                    return value == 'N' ? '未采购' : value == 'Y' ? '<span style="color:red">已采购</span>' : '未知';
                }
            }
           , {
                header: "操作", dataIndex: '', width: '15%', sortable: false,
                renderer: function (value, data, rowIndex, colIndex, metadata) {
                    var order_no = data['ORDER_NO'];
                    var status = data['STATUS'];
                    var order_source = data['ORDER_SOURCE'];
                    var realPayType = data['realPayType']; // 实际支付方式
                    var returnText = '<a href="javascript:void(0);" title="' + order_no + '" onclick="orderInfo(\'' + order_no + '\')" class="a_link">查看</a>';
                    // 1:待支付； 2:待上门；3:待仓库发货； 4:待客户收货；5:已收货；7:订单已失效；99:退款终止 ；98、退货终止；99：终止
                    if (realPayType == '5') {
                        if(data['BTNFLAG'] == '1'){
                            if (status == '3' || status == '4') {
                                returnText += ' | <a href="javascript:void(0);" onclick="newBrandStopOrder(\'' + order_no + '\')" class="a_link">取消订单</a>';
                            }
                            if (status == '3') {//待仓库发货
                                if (handleSend === 'Y') {
                                    returnText += ' | <a href="javascript:void(0);" onclick="sendGoods(\'' + order_no + '\')" class="a_link">发货</a>';
                                }
                                if (handlePurchase == 'Y') {
                                    if (data['ISPURCHASE'] == 'N') {
                                        returnText += ' | <a href="javascript:void(0);" onclick="confirmPurchase(\'' + order_no + '\')" class="a_link">确认采购</a>';
                                    }
                                }
                            }else if (status == '4') {//待客户收货
                                returnText += ' | <a href="javascript:void(0);" onclick="deliveryGoods(\'' + order_no + '\')" class="a_link">收货确认</a>';
                            }
                        }
                    } else {
                        if (order_source == '1010') {
                            if (status == '88') {
                                returnText += ' | <a href="javascript:void(0);" onclick="storeTopay(\'' + order_no + '\')" class="a_link">结算</a>';
                            } else if (status == '95') {
                                returnText += ' | <a href="javascript:void(0);" onclick="stopOrder(\'' + order_no + '\')" class="a_link">再次退款</a>';
                                //1
                            }
                        } else {
                            if (status == '2') {//待上门
                                returnText += ' | <a href="javascript:void(0);" onclick="orderOperation(\'' + order_no + '\')" class="a_link">上门</a>';
                            } else if (status == '3' && order_source == '1005') {//通知顺电发货
                                returnText += ' | <a href="javascript:void(0);" onclick="inform(\'' + order_no + '\')" class="a_link">通知发货</a>';
                            } else if (status == '3') {//待仓库发货
                                if (handleSend === 'Y') {
                                    returnText += ' | <a href="javascript:void(0);" onclick="orderOperation(\'' + order_no + '\')" class="a_link">发货</a>';
                                }
                                if (handlePurchase == 'Y') {
                                    if (data['ISPURCHASE'] == 'N') {
                                        returnText += ' | <a href="javascript:void(0);" onclick="confirmPurchase(\'' + order_no + '\')" class="a_link">确认采购</a>';
                                    }
                                }
                            } else if (status == '4') {//待客户收货
                                returnText += ' | <a href="javascript:void(0);" onclick="orderOperation(\'' + order_no + '\')" class="a_link">收货确认</a>';
                            } else if (status == '95') {
                                returnText += ' | <a href="javascript:void(0);" onclick="stopOrder(\'' + order_no + '\')" class="a_link">再次退款</a>';
                            }
                        }
                        if (status == '1') {//未付款终止
                            returnText += ' | <a href="javascript:void(0);" onclick="stopOrder(\'' + order_no + '\')" class="a_link">终止</a>';
                        }
                        if (status == '2' || status == '3' || status == '4') {//退款终止
                            returnText += ' | <a href="javascript:void(0);" onclick="stopOrder(\'' + order_no + '\')" class="a_link">未收货退款</a>';
                            //2
                        }
                        if (status == '5') {//解冻终止
                            returnText += ' | <a href="javascript:void(0);" onclick="stopOrder(\'' + order_no + '\')" class="a_link">解冻终止</a>';
                        }
                    }
                    returnText += '| <a href="javascript:void(0);" onclick="call(\'' + data['CONTACT_MOBILE'] + '\')" class="a_link">外呼</a>';
                    return returnText;
                }
            }
		]
       ,url : '/rent/installment/installmentlist'
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

// 初始化查询参数
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
	window.location.href = "/rent/installment/orderinfo?order_no="+order_no+"&backUrl="+backUrl;
}

/**
 * 外呼
 * @param customerNumber
 * @return
 */
function call(customerNumber){
	$.get(url,{enterpriseId:enterpriseId, cno:cno, pwd:pwd, customerNumber:customerNumber}, function(data){
		alert(data);
	});
}

/**
 * 取消订单
 * @param order_no
 */
function stopOrder(order_no){
	$.layer({
		type:2,
		title:'订单终止',
		iframe:{src:'/rent/installment/tostoporder?order_no='+order_no},
		area:['500', '350'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 预授权订单 -  取消页面
 * @param orderNo
 */
function newBrandStopOrder(orderNo){
    $.layer({
        type:2,
        title:'订单终止',
        iframe:{src:'/rent/installment/tonewbrandstoporder?orderNo='+orderNo},
        area:['500', '350'],
        offset:['50px', ''],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 发货页面
 * @param orderNo
 */
function sendGoods(orderNo){
    $.layer({
        type:2,
        title:'订单发货',
        iframe:{src:'/rent/installment/sendgoods?orderNo='+orderNo},
        area:['500', '350'],
        offset:['50px', ''],
        close:function(index){
            layer.close(index);
            window.location.href = window.location.href;
        }
    });
}

/**
 * 门店支付
 * @param orderId
 * @return
 */
function storeTopay(order_no){
	$.layer({
		type:2,
		title:'门店结算',
		iframe:{src:'/rent/installment/storetopay?order_no='+order_no},
		area:['500', '350'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 通知合作方发货
 * @param orderId
 * @return
 */
function inform(order_no){
	$.post("/rent/installment/inform", {order_no:order_no}, function(data){
		if(data == 'Y'){
			alert('通知成功');
			doSearch();
		}else{
			alert(data);
			doSearch();
		}
	});
}

/**
 * 订单电话确认/上门/发货/收货/
 * @param Order_no
 * @return
 */
function orderOperation(order_no){
	$.layer({
		type:2,
		title:'订单状态修改',
		iframe:{src:'/rent/installment/operation?order_no='+order_no},
		area:['500' , '400'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
			window.location.href = window.location.href;
		}
	});
}

/**
 * 客服电话确认
 * @param Order_no
 * @return
 */
function confirmOrder(order_no){
	$.layer({
		type:2,
		title:'订单状态修改',
		iframe:{src:'/rent/installment/confirmorder?order_no='+order_no},
		area:['400' , '300'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
			doSearch();
		}
	});
}

// 获取查询参数
function getParams(){
    return {
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
    	mobile:$('#mobile').val(),
    	order_source:$('#order_source').val(),
    	status:$('#status').val(),
    	product_name:$('#product_name').val(),
    	merType:$('#merType').val(),
    	order_no:$('#order_no').val(),
        sourceCode:$('#sourceCode').val(),
        isPurchase:$('#isPurchase').val(),
        shopTypes:$('#shopTypes').val()
    };
}

// 开始查询
function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

// 设定商品已采购
function confirmPurchase(orderNo){
	if(confirm('确认订单已采购？')){
        $.post("/rent/installment/confirmpurchase", {orderNo:orderNo}, function(data){
            if(data == 'Y'){
                layer.msg('成功');
                doSearch();
            }else{
                layer.msg(data);
                doSearch();
            }
        });
    }
}

/**
 * 订单收货页面
 * @param orderNo
 */
function deliveryGoods(orderNo){
    $.layer({
        type:2,
        title:'订单收货',
        iframe:{src:'/rent/installment/deliverygoods?orderNo='+orderNo},
        area:['500', '350'],
        offset:['50px', ''],
        close:function(index){
            layer.close(index);
            window.location.href = window.location.href;
        }
    });
}