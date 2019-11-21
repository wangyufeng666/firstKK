var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
        		}
			} 
			,{header:"订单地址", dataIndex:'DIZHI', width:'140px',sortable:false}
			,{header:"订单来源", dataIndex:'ORDERTYPENAME', width:'80px',sortable:false}
			,{header:"结算类型", dataIndex:'EVENTNAME', width:'80px',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
        		}
			}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'ORDERNO', width:'130px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
					var status = data['ORDERSTATUS']+'';
					var orderType = data['ORDERTYPE']+'';
					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
					//待发券
					if(orderType == '51' || orderType == '52'){
						if(status == '8'){
							returnText += ' | <a href="javascript:sendCoupon(\''+value+'\')" class="a_link">发券</a>';
						}else if(status == '20'){
							returnText += ' | <a href="javascript:sendCoupon(\''+value+'\')" class="a_link">确认发券</a>';
						}
					}
					return returnText;
				}
			}
		]
		,url:'/order/gomeonline/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
	
	//日期验证
	$('#startDate').click(function(){
		WdatePicker({
			onpicked:function(){$('#endDate').trigger('click');},
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
});

function initParams(){
	return getParams();
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'国美在线-回收单详情',
		shadeClose:false,
		shade:0.8,
		content:"/order/gomeonline/orderinfo?orderNo="+orderNo+'&layer=Y',
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
   });
}

/**
 * 发券操作
 * @param orderId
 * @return
 */
function sendCoupon(orderNo){
	layer.open({
		type:2,
		title:'国美在线-回收单支付',
		shadeClose:false,
		shade:0.8,
		content:"/order/gomeonline/sendcouponpage?orderNo="+orderNo+'&layer=Y',
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
   });
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		orderType:$('#orderType').val(),
		tradeType:$('#tradeType').val(),
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
	grid.query(getParams());
}
