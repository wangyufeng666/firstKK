var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:5,
		height:125
		,cm:[
			{header:"NO.", dataIndex:'R', width:'30px', sortable:false}
			,{header:"创建时间", dataIndex:'CREATE_DATE', width:'95px', sortable:false}
			,{header:"订单来源", dataIndex:'ORDER_SOURCENAME', width:'90px', sortable:false}
			,{header:"订单号", dataIndex:'ORDER_NO', width:'110px', sortable:false}
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
			,{header:"订单状态", dataIndex:'STATUS_NAME', width:'62px', sortable:false}
			,{header: "操作", dataIndex: '', width:'140px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var order_no = data['ORDER_NO'];
					var status = data['STATUS'];
					var order_source = data['ORDER_SOURCE'];
					var returnText ='<a title="'+order_no+'" href="javascript:orderInfo(\''+order_no+'\')" class="a_link">查看</a>';
					if(status == '3'){//待仓库发货
						if(data['KFCONFIRMFLAG'] == 'N'){
							returnText+=' | <a href="javascript:confirmOrder(\''+order_no+'\')" class="a_link">确认</a>';
						}
					}else if(status == '4'){//待客户收货
						returnText+=' | <a href="javascript:orderOperation(\''+order_no+'\')" class="a_link">收货确认</a>';
					}
					if(status == '1'){//未付款终止
						returnText+=' | <a href="javascript:stopOrder(\''+order_no+'\')" class="a_link">终止</a>';
					}
					if(status == '5'){//解冻终止 
						returnText+=' | <a href="javascript:stopOrder(\''+order_no+'\')" class="a_link">解冻终止</a>';
					}
					return returnText;
				}
			}	   
		]
	   ,url : '/rent/installment/installmentlist'
	   ,baseParams:initParams()
	});
});

function initParams(){
	var params = getParams();
	params['mobile'] = contactWay;
	return params;
}
/**
 * 订单详情
 * @param order_no
 * @return
 */
function orderInfo(orderNo){
	$('#orderinfo').load("/order/callcenter/rentorderinfo?order_no="+orderNo);
}

/**
 * 客服电话确认
 * @param Order_no
 * @return
 */
function confirmOrder(orderNo){
	layer.open({
		type:2,
		title:'电话确认',
		shadeClose:false,
		shade:0.8,
		content:'/rent/installment/confirmorder?order_no='+orderNo,
		area:['500px','300px'],
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
function orderOperation(orderNo){
	layer.open({
		type:2,
		title:'订单状态修改',
		shadeClose:false,
		shade:0.8,
		content:'/rent/installment/operation?order_no='+orderNo,
		area:['500px','300px'],
		close:function(index){
			layer.close(index);
		}
	});
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
		content:'/rent/installment/tostoporder?order_no='+orderNo,
		area:['600px','400px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		mobile:$('#mobile').val(),
		status:$('#status').val(),
		product_name:$('#product_name').val(),
		order_no:$('#order_no').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

/**
 *  客户来电
 */
function noOrderUserCallIn(){
	layer.open({
		type: 2,
		title: '客户来电',
		shadeClose: true,
		shade: 0.8,
		area: ['550px', '550px'],
		content: '/call/record/noordercallin?callSource=2&contactWay='+contactWay
	});
}