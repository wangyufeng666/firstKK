var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'30px', sortable:false}
		   ,{header:"创建时间", dataIndex:'CREATE_DATE', width:'95px', sortable:false}
		   ,{header:"订单号", dataIndex:'ORDER_NO', width:'110px', sortable:false}
		   ,{header:"商品类型", dataIndex:'PRODUCT_TYPE_NAME', width:'60px', sortable:false}
		   ,{header:"商品名", dataIndex:'', width:'130px', sortable:false
           	,renderer : function(value, data, rowIndex, colIndex, metadata){
                return data['PRODUCT_NAME']+' '+data['MODEL_NAME']+' '+data['DETAIL_NAME'];
              }
		   }
           ,{header: "联系方式", dataIndex: '', width:'105px',sortable:false
            	,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['CONTACT_NAME']+'('+data['CONTACT_MOBILE']+')';
                }
              }		   
		   ,{header:"联系地址", dataIndex:'ADDRESS', width:'80px', sortable:false}
		   ,{header:"新机价格", dataIndex:'NEW_PRODUCT_PRICE', width:'60px', sortable:false}
		   ,{header:"旧机价格", dataIndex:'OLD_PRODUCT_PRICE', width:'60px', sortable:false}
		   ,{header:"期数", dataIndex:'TOTAL_PERIODS', width:'45px', sortable:false}
		   ,{header:"每期付费", dataIndex:'PERIOD_PRICE', width:'65px', sortable:false}           
           ,{header:"分期总费用", dataIndex:'TOTAL_PRICE', width:'65px', sortable:false}
           ,{header:"交易方式", dataIndex:'TRADE_TYPE', width:'62px', sortable:false}
           ,{header:"订单来源", dataIndex:'ORDER_SOURCE', width:'70px', sortable:false}
           ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'62px', sortable:false}
           ,{header: "操作", dataIndex: '', width:'140px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var order_no = data['ORDER_NO'];
					var status = data['STATUS'];
					var returnText ='<a href="javascript:void(0);" title="'+order_no+'" onclick="orderInfo(\''+order_no+'\')" class="a_link">查看</a>';
					
					//1:待支付； 2:待上门；3:待仓库发货； 4:待客户收货；5:已收货；7:订单已失效；99:退款终止 ；98、退货终止；99：终止
					if(status == '2'){//待上门
						returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+order_no+'\')" class="a_link">上门</a>';
					}else if(status == '3'){//待仓库发货
						returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+order_no+'\')" class="a_link">发货</a>';
					}else if(status == '4'){//待客户收货
						returnText+=' | <a href="javascript:void(0);" onclick="orderOperation(\''+order_no+'\')" class="a_link">收货确认</a>';
					}else if(status == '95'){
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+order_no+'\')" class="a_link">待退款</a>';
					}
					if(status == '2'||status == '3'||status == '4'){//退款终止 
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+order_no+'\')" class="a_link">未收货退款</a>';
					}
					if(status == '66'){//退货终止；
						returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+order_no+'\')" class="a_link">申请退货</a>';
					}
					return returnText;
				}
			}       
		]
       ,url : '/rent/installment/installmentlist'
       ,baseParams:{isAll:'all'}
	});
});

/**
 * 订单详情
 * @param order_no
 * @return
 */
function orderInfo(order_no){
	window.location.href = "/rent/installment/orderinfo?order_no="+order_no+"&backUrl="+backUrl;
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
		iframe:{src:'/rent/installment/tostoporder?order_no='+order_no},
		area:['500', '350'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
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
		area:['500' , '320'],
		offset:['50px',''],
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
    	order_source:$('#order_source').val(),
    	status:$('#status').val(),
    	product_name:$('#product_name').val(),
    	order_no:$('#order_no').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
