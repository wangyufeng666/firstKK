var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false}
		   ,{header:"创建时间", dataIndex:'CREATE_DATE', width:'10%', sortable:false}
		   ,{header:"订单号", dataIndex:'ORDER_NO', width:'10%', sortable:false}
		   ,{header:"订单来源", dataIndex:'ORDER_SOURCENAME', width:'8%', sortable:false}
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
		   ,{header:"租金", dataIndex:'TOTAL_PRICE', width:'5%', sortable:false}
           ,{header:"起租日期", dataIndex:'CONTRACTS_DATE', width:'8%', sortable:false}
           ,{header:"截止日期", dataIndex:'TOREDATE', width:'8%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				var exceedFlag = data['EXCEEDFLAG'];
				var backstatus = data['BACKSTATUS'];
				if(exceedFlag == 'Y' && backstatus == '1'){
					return  '<span style="color:red;font-weight: bold;">'+value+'</span>';
				}else{
					return value;
				}
			}
          }
           ,{header:"结算方式", dataIndex:'PAYTYPE', width:'5%', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
        		   return value == '1' ? '乐百分' : value == '2' ? '花呗' : '支付宝';
        	   }
           }
           ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'5%', sortable:false}
           ,{header:"归还状态", dataIndex:'BACKSTATUS_NAME', width:'10%', sortable:false}
           ,{header:"催还短信", dataIndex:'SMSHITCOUNT', width:'5%', sortable:false}
           ,{header: "操作", dataIndex: '', width:'24%', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var order_no = data['ORDER_NO'];
					var status = data['STATUS'];
					var backstatus = data['BACKSTATUS'];
					var returnText ='<a href="javascript:void(0);" title="'+order_no+'" onclick="orderInfo(\''+order_no+'\')" class="a_link">查看</a>';
                    if (backstatus == '1') {
                        if (data['HINTFLAG'] == 'Y') {
                            returnText += ' | <a href="javascript:void(0);" onclick="urgeRent(\'' + order_no + '\')" class="a_link">催还</a>';
                        }
                    }
					if(canBackPay) {
                        if (data['realPayType'] == '5') {
                            if (backstatus == '1') {
                                if (canBackPay) {
                                    returnText += ' | <a href="javascript:void(0);" onclick="newBrandSettlement(\'' + order_no + '\')" class="a_link">结算</a>';
                                }
                            } else if (backstatus == '3' || backstatus == '5') {
                                var canUnFreeze = data['UNFREEZEFLAG'];
                                if (canBackPay && canUnFreeze) {
                                    returnText += ' | <a href="javascript:void(0);" onclick="newBrandUnfreeze(\'' + order_no + '\')" class="a_link">解冻</a>';
                                }
                            }
                        } else if (data['realPayType'] == '4') {
                            if (backstatus == '1') {
                                if (canBackPay) {
                                    returnText += ' | <a href="javascript:void(0);" onclick="orderBack(\'' + order_no + '\')" class="a_link">小程序归还</a>';
                                }
                            } else if (backstatus == '3' || backstatus == '5') {
                                if (canBackPay) {
                                    returnText += ' | <a href="javascript:void(0);" onclick="orderSettlement(\'' + order_no + '\')" class="a_link">小程序结算</a>';
                                }
                            }
                        } else {
                            if (backstatus == '1') {
                                returnText += ' | <a href="javascript:void(0);" onclick="finishBack(\'' + order_no + '\')" class="a_link">归还</a>';
                                returnText += ' | <a href="javascript:void(0);" onclick="buy(\'' + order_no + '\')" class="a_link">转售</a>';
                            }
                        }
                    }
					return returnText;
				}
			}       
		]
       ,url : '/rent/rentback/backorderlist'
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
    var terminalCode = backListApp.terminalCode;
    if(terminalCode){
        if(allSourceCode[terminalCode]) {
            backListApp.terminalName = allTerminal[terminalCode];
            backListApp.sourceCodeList = allSourceCode[terminalCode];
            backListApp.showSourceCode = true;
        }else{
            backListApp.sourceCodeList = '';
            backListApp.showSourceCode = false;
        }
    }else{
        backListApp.sourceCodeList = '';
        backListApp.showSourceCode = false;
    }
    backListApp.sourceCode = '';
}

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

function scan(){
	var imeiNo = $('#imeiNo').val();
	if(imeiNo){
		layer.load('IMEI号：'+imeiNo, 1);
		grid.query({imeiNo:imeiNo});
		$('#imeiNo').val('');
	}
}

/**
 * 催还
 * @param orderId
 * @return
 */
function urgeRent(order_no){
	$.post("/rent/rentback/urgerent", {orderNo:order_no}, function(data){
		if(data == 'Y'){
			alert('催还短信已发送');
			doSearch();
		}else{
			alert(data);
			doSearch();
		}
	});
}

/**
 * 同步
 * @param orderId
 * @return
 */
function sync(){
	$.post("/rent/rentback/sync", function(data){
		doSearch();
	});
}

/**
 * 退还结算
 * @param orderNo
 * @return
 */
function finishBack(orderNo){
	$.layer({
		type:2,
		title:'退还结算',
		iframe:{src:'/rent/rentback/tofinishback?orderNo='+orderNo+'&nextStatus=2'},
		area:['500', '400'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 转售
 * @param orderNo
 * @return
 */
function buy(orderNo){
	$.layer({
		type:2,
		title:'转售',
		iframe:{src:'/rent/rentback/tofinishback?orderNo='+orderNo+'&nextStatus=6'},
		area:['500', '400'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}

function orderBack(orderNo){
    $.layer({
        type:2,
        title:'退还',
        iframe:{src:'/rent/rentback/toorderback?orderNo='+orderNo},
        area:['500', '400'],
        offset:['50px', ''],
        close:function(index){
            layer.close(index);
        }
    });
}

function orderSettlement(orderNo){
    $.layer({
        type:2,
        title:'结算',
        iframe:{src:'/rent/rentback/toordersettlement?orderNo='+orderNo},
        area:['500', '400'],
        offset:['50px', ''],
        close:function(index){
            layer.close(index);
        }
    });
}

function getParams(){
    return {
    	mobile:$('#mobile').val(),
    	imeiNo:$('#imeiNo').val(),
    	status:$('#status').val(),
    	product_name:$('#product_name').val(),
    	merType:$('#merType').val(),
    	order_source:$('#order_source').val(),
    	orderNo:$('#orderNo').val(),
    	paytype:$('#paytype').val(),
        sendBackExpress:$('#sendBackExpress').val(),
        sourceCode:$('#sourceCode').val(),
        startContractsDate:$('#startContractsDate').val(),
        endContractsDate:$('#endContractsDate').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

$('#exportlist').on('click',function(){
	var mobile = $('#mobile').val();
	var imeiNo = $('#imeiNo').val();
	var status = $('#status').val();
	var product_name = $('#product_name').val();
	var merType = $('#merType').val();
	var order_source = $('#order_source').val();
	var orderNo = $('#orderNo').val();
	var paytype = $('#paytype').val();
	var sourceCode = $('#sourceCode').val();
	var startContractsDate = $('#startContractsDate').val();
	var endContractsDate = $('#endContractsDate').val();
	var param = '?mobile='+mobile+'&imeiNo='+imeiNo+'&status='+status+'&product_name='+product_name;
	param += '&merType='+merType+'&order_source='+order_source+'&orderNo='+orderNo+'&paytype='+paytype + '&sourceCode=' + sourceCode;
	param += '&startContractsDate=' + startContractsDate + '&endContractsDate=' + endContractsDate;
	window.location.href = '/rent/rentback/backorderexport'+param;
});

/************************************************新品牌租赁************************************************************/

/**
 * 结算
 * @param orderNo
 */
function newBrandSettlement(orderNo){
    $.layer({
        type:2,
        title:'押金结算',
        iframe:{src:'/rent/rentback/tonewbrandsettlement?orderNo='+orderNo},
        area:['800', '500'],
        offset:['50px', ''],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 解冻
 */
function newBrandUnfreeze(orderNo){
	$.layer({
		type:2,
		title:'预授权解冻',
		iframe:{src:'/rent/rentback/tonewbrandunfreeze?orderNo='+orderNo},
		area:['700', '400'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}
