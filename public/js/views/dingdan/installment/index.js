var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false}
		   ,{header:"创建时间", dataIndex:'CREATE_DATE', width:'10%', sortable:false}
		   ,{header:"订单来源", dataIndex:'ORDER_SOURCENAME', width:'8%', sortable:false}
		   ,{header:"订单号", dataIndex:'ORDER_NO', width:'12%', sortable:false}
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
				return value == '1' ? '乐百分' : value == '2' ? '花呗' : '支付宝';
			}
          }
           ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'8%', sortable:false}
           ,{header: "操作", dataIndex: '', width:'15%', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var order_no = data['ORDER_NO'];
					var status = data['STATUS'];
					var order_source = data['ORDER_SOURCE'];
					var returnText ='<a href="javascript:void(0);" title="'+order_no+'" onclick="orderInfo(\''+order_no+'\')" class="a_link">查看</a>';
					
					//1:待支付； 2:待上门；3:待仓库发货； 4:待客户收货；5:已收货；7:订单已失效；99:退款终止 ；98、退货终止；99：终止
					if(order_source == '1010'){
						if(status == '88'){
							returnText+=' | <a href="javascript:void(0);" onclick="storeTopay(\''+order_no+'\')" class="a_link">结算</a>';
						}else if(status == '95'){
							returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+order_no+'\')" class="a_link">再次退款</a>';
						}
					}else{
						if(status == '2'){//待上门
							returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+order_no+'\')" class="a_link">上门</a>';
						}else if(status == '3' && order_source == '1005'){//通知顺电发货
							returnText+=' | <a href="javascript:void(0);" onclick="inform(\''+order_no+'\')" class="a_link">通知发货</a>';
						}else if(status == '3'){//待仓库发货
							returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+order_no+'\')" class="a_link">发货</a>';
						}else if(status == '4'){//待客户收货
							returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+order_no+'\')" class="a_link">收货确认</a>';
						}else if(status == '95'){
							returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+order_no+'\')" class="a_link">再次退款</a>';
						}
					} 
					if(status == '1' && order_source == '1012'){//未付款终止
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+order_no+'\')" class="a_link">终止</a>';
					}
					if(status == '2'||status == '3'||status == '4'){//退款终止 
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+order_no+'\')" class="a_link">未收货退款</a>';
					}
					if(status == '5'){//解冻终止 
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+order_no+'\')" class="a_link">解冻终止</a>';
					}
					if(status == '66'){//退货终止；
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+order_no+'\')" class="a_link">申请退货</a>';
					}
					return returnText;
				}
			}       
		]
       ,url : '/dingdan/installment/installmentlist'
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
	window.location.href = "/dingdan/installment/orderinfo?order_no="+order_no+"&backUrl="+backUrl;
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(order_no){
	$.layer({
		type:2,
		title:'订单终止',
		iframe:{src:'/dingdan/installment/tostoporder?order_no='+order_no},
		area:['500', '350'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
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
		iframe:{src:'/dingdan/installment/storetopay?order_no='+order_no},
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
	$.post("/dingdan/installment/inform", {order_no:order_no}, function(data){
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
		iframe:{src:'/dingdan/installment/operation?order_no='+order_no},
		area:['500' , '320'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
			window.location.href = window.location.href
		}
	});
}
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
    	shopTypes:$('#shopTypes').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
