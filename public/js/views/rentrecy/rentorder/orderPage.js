var zzyRentGrid;//租着用租赁grid
var gomeRentGrid;//国美租赁grid
var layerIndex = 0;
$().ready(function(){
	//国美租赁归还分页
	gomeRentGrid = $('#gomeRentGrid').grid({
		pageSize:5,
		height:125
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"下单日期", dataIndex:'ORDERDATE', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var array = [];
					array.push("下单时间："+value);
					array.push("订单编号："+data['ORDERNO']);
					return '<span title="'+array.join("\n")+'" ondblclick="showRemark(\''+array.join('<br/>')+'\')">'+value+'</span>';
				}
			}
			,{header:"商品名称", dataIndex:'PRODUCT_NAME', width:'160px', sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['BRAND_NAME']+' '+value;
				}
			}
			,{header:"商品串号", dataIndex:'IMEICODE', width:'120px',sortable:false}
			,{header:"联系方式", dataIndex:'CONTACTS', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = value+'('+data['CONTACTWAY']+')';
					return returnText;
				}
			}
			,{header:"门店名称", dataIndex:'PARTNERNAME', width:'120px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var array = [];
					array.push("订单编号："+data['ORDERNO']);
					array.push("门店编码："+data['PARTNERCODE']);
					array.push("门店名称："+value);
					array.push("店长信息："+data['P_CONTACTS']+'（ '+data['P_MOBILE']+' ）');
					array.push("归还方式："+(data['VISITFLAG'] == '1' ? '上门' : '快递'));
					return '<span title="'+array.join("\n")+'" ondblclick="showRemark(\''+array.join('<br/>')+'\')">'+value+'</span>';
				}
			}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"租赁模式", dataIndex:'FROMCODE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == 'ZZY'){
						return '有抵押模式';
					}else if(value = 'GOME'){
						return '无抵押模式';
					}
				}
			}
			,{header:"回收单", dataIndex:'RECYORDERNO', width:'200px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value){
						return '<a href="javascript:recyOrderInfo(\''+value+'\')" class="a_link" title="'+value+'">'+value+'</a>';
					}
				}
			}
			,{header:"操作", dataIndex:'ORDERNO', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
					if(data['OPERSTATUS'] == 1){
						returnText += ' | <a href="javascript:orderReceiving(\''+value+'\', 1)" class="a_link">收货</a>';
					}else{
						returnText += ' | <a href="javascript:gomeOrderReturn(\''+value+'\')" class="a_link">检测</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/rentrecy/rentorder/gomepagelist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
		,afterRender:function(e, grid){
			zzyRentGrid.query(getParams());
		}
	});
	
	//租着用租赁归还列表
	zzyRentGrid = $('#zzyRentGrid').grid({
		pageSize:5,
		height:125,
		cm:[
			{header:"NO.", dataIndex:'R', width:'40px', sortable:false}
			,{header:"下单时间", dataIndex:'CREATE_DATE', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var array = [];
					array.push("下单时间："+value);
					array.push("订单编号："+data['ORDER_NO']);
					array.push("订单来源："+data['ORDER_SOURCENAME']);
					array.push("新机价格："+data['NEW_PRODUCT_PRICE']);
					array.push("订单租金："+data['TOTAL_PRICE']);
					return '<span title="'+array.join("\n")+'" ondblclick="showRemark(\''+array.join('<br/>')+'\')">'+value+'</span>';
				}
			}
			,{header:"商品名称", dataIndex:'PRODUCT_NAME', width:'160px', sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return value+' '+data['MODEL_NAME'];
				}
			}
			,{header:"商品串号", dataIndex:'IMEI', width:'120px',sortable:false}
			,{header: "联系方式", dataIndex: 'CONTACT_NAME', width:'140px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['CONTACT_MOBILE']+')';
				}
			}
			,{header:"租赁日期", dataIndex:'TOREDATE', width:'160px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var exceedFlag = data['EXCEEDFLAG'];
					var backstatus = data['BACKSTATUS'];
					var retrunText = data['CONTRACTS_DATE'];
					if(exceedFlag == 'Y' && backstatus == '1'){
						retrunText = retrunText+' ~ <span style="color:red;font-weight: bold;">'+value+'</span>';
					}
					return retrunText;
				}
			}
			,{header:"订单状态", dataIndex:'STATUS_NAME', width:'70px', sortable:false}
			,{header:"结算方式", dataIndex:'PAYTYPE', width:'80px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '1' ? '乐百分' : value == '2' ? '花呗' : '支付宝';
				}
			}
			,{header:"归还状态", dataIndex:'BACKSTATUS_NAME', width:'80px', sortable:false}
			,{header:"催还短信", dataIndex:'SMSHITCOUNT', width:'80px', sortable:false}
			,{header:"操作状态", dataIndex:'OPERASTATUSNAME', width:'80px', sortable:false}
			,{header:"操作", dataIndex: 'ORDER_NO', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a href="javascript:zzyRentOrderInfo(\''+value+'\')" class="a_link">查看</a>';
					if( data['OPERSTATUS'] == ""){
						returnText += ' | <a href="javascript:createRentRecyOrder(\''+value+'\')" class="a_link">收货</a>';
					}else if (data['OPERSTATUS'] == 1 ){
						returnText += ' | <a href="javascript:orderReceiving(\''+data['ORDERNO']+'\', 2)" class="a_link">收货</a>';
					}else if(data['OPERSTATUS'] == 2 ){
						returnText += ' | <a href="javascript:zzyOrderReturn(\''+value+'\')" class="a_link">检测</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/rentrecy/rentorder/zzypagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

/**
 * 租赁归还单收货
 * @param orderNo 订单号
 * @param gridIndex
 * @returns
 */
function orderReceiving(orderNo, gridIndex) {
	if(confirm('是否进行收货？')){
		$.post('/rentrecy/order/receive', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				layer.msg('收货完成！');
				if(gridIndex == 1){
					gomeRentGrid.reload();
				}else if(gridIndex == 2){
					zzyRentGrid.reload();
				}
			}else{
				layer.msg('收货失败');
			}
		});
	}
}

/**
 * 创建租赁归还单
 * @param orderNo
 * @returns
 */
function createRentRecyOrder(orderNo) {
	if(confirm('是否进行收货？')){
		$.post('/rentrecy/recyorder/createrecyorder', {rentOrderNo:orderNo}, function(data){
			if(data['code'] == 'Y'){
				layer.msg('收货完成！');
				zzyRentGrid.reload();
			}else {
				layer.msg(data['msg']);
			}
		});
	}
}

//国美租赁订单归还
function gomeOrderReturn(orderNo){
	layer.open({
		type:2,
		title:'租赁订单归还',
		shadeClose:false,
		shade:0.8,
		content:"/rentrecy/recyorder/orderidentify?rentRecyOrderNo="+orderNo+'&layer=Y',
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

//租着用租赁订单归还
function zzyOrderReturn(rentOrderNo){
	layer.open({
		type:2,
		title:'租赁订单归还',
		shadeClose:false,
		shade:0.8,
		content:"/rentrecy/recyorder/zzyorderreturn?rentOrderNo="+rentOrderNo+'&layer=Y',
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

//租着用租赁订单详情
function zzyRentOrderInfo(orderNo){
	layer.open({
		type:2,
		title:'租着用租赁订单详情',
		shadeClose:false,
		shade:0.8,
		content:"/rent/installment/orderinfo?order_no="+orderNo+'&layer=Y',
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 回收订单详情
 * @param recyOrderNo
 * @returns
 */
function recyOrderInfo(recyOrderNo){
	layer.open({
		type:2,
		title:'回收订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/order/order/orderinfo?orderNo='+recyOrderNo+'&layer=Y',
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(data){
	layer.close(layerIndex);
	layerIndex = layer.open({
		type:1, shade:false, title:false, area:['650px', 'auto'],
		content:'<div class="layer_notice">'+data+'</div>'
	});
}

/**
 * 订单详情
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/rentrecy/order/orderinfo?orderNo='+orderNo,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 订单详情
 * @return
 */
function orderImgs(orderNo){
	layer.open({
		type:2,
		title:'订单拍照留档',
		shadeClose:false,
		shade:0.8,
		content:'/rentrecy/order/orderimgs?orderNo='+orderNo,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 修改规则
 * @param ruleId
 * @return
 */
function videoInspect(orderNo){
	layer.open({
		type:2,
		title:'修改鉴定规则',
		shadeClose:false,
		shade:0.8,
		content:'/rentrecy/order/videoinspect?orderNo='+orderNo,
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function inwareSmsRemind(orderNo, mobile){
	if(confirm('是否进行入库短信提醒？')){
		$.post('/rentrecy/order/smsremind', {type:'2', mobile:mobile, orderNo:orderNo}, function(data){
			if(data == 'Y'){
				layer.msg('催入库短信已发送');
			}
		});
	}
}

function getParams(){
	var params = {
		initFlag:$('#initFlag').val(),
		contactWay:$('#contactWay').val(),
		imeiCode:$('#imeiCode').val(),
		mailNo:$('#mailNo').val()
	};
	
	if(params.contactWay != '' || params.imeiCode != '' || params.mailNo != ''){
		params.initFlag = '';
	}
	return params;
}

function initParams(){
	return getParams();
}

function doSearch(){
	gomeRentGrid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	gomeRentGrid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}