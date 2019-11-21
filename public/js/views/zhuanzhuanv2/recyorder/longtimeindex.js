var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"订单编号", dataIndex:'ORDERNO', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a class="a_link" title="'+value+'" href="javascript:recyOrderInfo(\''+value+'\')">'+value+'</a>';
				}
			}
			,{header:"卖家信息", dataIndex:'CONTACTWAY', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['CONTACTS']+')';
				}
			}
			,{header:"鉴定报告", dataIndex:'REPORTNO', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					if(value){
						return '<a class="a_link" href="javascript:identifyReportInfo(\''+orderNo+'\',\''+value+'\')" title="'+value+'">'+value+'</a>';
					}else{
						return '暂无';
					}
				}
			}
			,{header:"商品名称", dataIndex:'MERNAME', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+value;
				}
			}
			,{header:"订单金额", dataIndex:'ORDERPRICE', width:'90px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var text = value;
					if(data['INSPECTIONPRICE'] != null){
						text += '<span class="green">('+data['INSPECTIONPRICE']+')</span>';
					}
					return text;
				}
			}
			,{header:"订单类型", dataIndex:'ORDERTYPE', width:'70px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '寄卖';
				}
			}
			,{header:"上架天数", dataIndex:'overtime', width:'80px',sortable:false}
			,{header:"保底金额", dataIndex:'MINPRICE', width:'65px',sortable:false}
			,{header:"预拍金额", dataIndex:'AUCTIONPRICE', width:'65px',sortable:false}
			,{header:"成交金额", dataIndex:'SETTLEPRICE', width:'65px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					if(value){
						if(data['ORDERSTATUS'] == '7' && flag == 'Y'){
							return '<a class="a_link" href="javascript:modifyPrice(\''+orderNo+'\',\''+value+'\')" title="'+value+'">'+value+'</a>';
						}else{
							return value;
						}
					}
				}
			}
			,{header:"寄卖类型", dataIndex:'CONSIGNMENTTYPE', width:'65px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderStatus = data['ORDERSTATUS'];
					var status = ['6','7','15','12','66','88'];
					var text = '';
					if(status.includes(orderStatus)){//上架中|拍卖中
						if(value == '1'){
							text = '用户自主定价';
						}else if(value == '2'){
							text = '接受平台订价';
						}else{
							if(data['AUCTIONPRICE'] != data['SETTLEPRICE']){
								text = '用户自主定价';
							}else{
								text = '接受平台订价';
							}
						}
					}else if(data['ORDERSTATUS'] == '11'){//待拍卖|待上架
						if(value == '1'){
							text = '用户自主定价';
						}else if(value == '2'){
							text = '接受平台订价';
						}else{
							text = '未定价';
						}
					}else{
						text = '未定价';
					}
					return text;
				}
			}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'65px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ORDERSTATUS'] == '7'){//上架中|拍卖中
						return '寄卖中';
					}else if(data['ORDERSTATUS'] == '6'){//待拍卖|待上架
						return '待寄卖';
					}else{
						return value;
					}
				}
			}
			,{header:"操作", dataIndex:'ORDERNO',width:'130px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderStatus = data['ORDERSTATUS'];
					var returnText ='<a class="a_link" href="javascript:orderInfo(\''+value+'\')" title="'+value+'">详情</a>';
					return returnText;
				}
			}
		]
		,url:'/zhuanzhuanv2/recyorder/longtimelist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
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
			endDate:'%y-{%M-1}-%d'
		});
	});
});
function initParams(){
	var params = getParams();
	return params;
}

/**
 * 鉴定报告
 * @param callId
 * @returns
 */
function identifyReportInfo(orderNo,reportNo){
	layer.open({
		type:2,
		title:'鉴定报告',
		shadeClose:false,
		shade:0.8,
		content:'/idlefishpai/recyorder/reportpage?orderNo='+orderNo+'&reportNo='+reportNo,
		area:['640px','98%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 订单详情页面 
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/zhuanzhuanv2/recyorder/taborderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 回收订单信息
 * @param orderNo
 * @returns
 */
function recyOrderInfo(orderNo){
	layer.open({
		type:2,
		title:'回收订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/order/order/orderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function goBack(){
	window.history.go(-1);
}

function closeLayer(){
	layer.closeAll('iframe');
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function getParams(){
	return {
		orderNo:$('#orderNo').val(), 
		merName:$('#merName').val(),
		contactWay:$('#contactWay').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		partnerOrderNo:$('#partnerOrderNo').val(),
		longTimes:$('#longTimes').val(),
		consignmentType:$('#consignmentType').val(),
		merType:$('#merType').val()
	};
}
function doSearch(){
	grid.query(getParams());
}

