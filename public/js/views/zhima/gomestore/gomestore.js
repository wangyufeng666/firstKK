var grid;
var layerIndex = 0;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'3%',sortable:false} 
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					return '<span ondblclick="showRemark(\''+orderNo+'\')">'+data['STRORDERDATE']+'</span>';
				}
			}
			,{header:"所属分部", dataIndex:'', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['COMPANYNAME'] ? data['COMPANYNAME']:'<font color="red">未关联店员，暂无分部</font>';
				}
			}
			,{header:"所属门店", dataIndex:'HNAME', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['HNAME'] ? data['HNAME']:'<font color="red">未关联店员，暂无门店</font>';
				}
			}
			,{header:"店员", dataIndex:'NAME', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['NAME'] ? data['NAME']:'<font color="red">未关联店员，暂无店员</font>';
				}
			}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'10%',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',width:'17%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			} 
			,{header:"支付状态", dataIndex:'ZM_ORDER_STATUSNAME', width:'10%',sortable:false}
			,{header:"订单类型", dataIndex:'ZMTYPENAME', width:'10%',sortable:false}
			,{header:"未参与原因", dataIndex:'ZM_ORDER_TYPENAME', width:'10%',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'10%',sortable:false}
			,{header:"操作", dataIndex:'', width:'25%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					var status = data['ORDERSTATUS'];
					var orderType = data['ORDERTYPE'];
					var overtimeFlag = data['OVERTIMEFLAG'];
					var zhimaOrderType = data['ZM_ORDER_TYPE'];
					var promoCode = data['PROMOCODE'];
					var partnerCode = data['PARTNERCODE'];
					var dizhi = data['DIZHI'];
					//1:待审核； 2:待上门； 6:待发货；7:待收货；3:待验货；8:待发券；20:发券中；5:待入库；66:交易成功；99：终止
					//待发券
					if(promoCode != null && partnerCode != null && dizhi != null){
						if(status == '8' || status == '4'){
							returnText += ' | <a href="javascript:sendCoupon(\''+orderNo+'\',\''+zhimaOrderType+'\')" class="a_link">结算</a>';
						}else if(status == '8' || status == '4' || status == '20'){
							returnText += ' | <a href="javascript:sendCoupon(\''+orderNo+'\',\''+zhimaOrderType+'\')" class="a_link">确认结算</a>';
						}
						if(overtimeFlag){
							returnText+=' | <a href="javascript:stopOrder(\''+orderNo+'\')" class="a_link">超时终止</a>';
						}
					}
					return returnText;
				}
			}
		]
		,url:'/zhima/gomestore/pagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[15,30,50]
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
		title:'订单详情',
		shadeClose:false,
		content:"/order/offline/orderinfo?orderNo="+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 省份初始化
 * @return
 */
function initProvinces(){
	$.ajax({type:'POST', dataType:'jsonp', jsonp:'jsonp_callback',
		url:openApiDomain+'/recycle/area/provinces',
		success:function(data){
			var optionsText = "<option value=''>请选择省份</option>";
			for(i in data){
				optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
			}
			$('#provinceId').html(optionsText);
			$('#provinceId').val(provinceId);
			$('#cityId').val(cityId);
		}
	});
}

/**
 * 省份change
 */
$("#provinceId").change(function(){
	var provinceId = $('#provinceId').val();
	if(provinceId != ""){
		var optionsText = "<option value=''>请选择城市</option>";
		$.ajax({type:'GET', dataType:'jsonp', jsonp:'jsonp_callback',
			data:{pid:provinceId},
			url:openApiDomain+'/recycle/area/citys',
			success:function(data){
				for(i in data){
					optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
				}
				$('#cityId').html(optionsText);
				}
			});
		}
});

/**
 * 取消订单
 * @param orderId
 * @return
 */
function stopOrder(orderNo){
	layer.open({
		type:2,
		title:'订单超时终止',
		shadeClose:false,
		shade:0.8,
		content:'/zhima/gomestore/tostoporder?overtimeFlag=Y&orderNo='+orderNo,
		area:['500px','350px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo){
	$.post('/recycle/order/jsonremark',{orderNo:orderNo}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', '400px'],
			content:'<div class="layer_notice">'+orderNo+'<br/>'+data+'</div>'
		});
	});
}

/**
 * 付款
 * @param orderNo
 */
function sendCoupon(orderNo, zhimaOrderType){
	layer.open({
		type:2,
		title:'客户订单发券',
		shadeClose:false,
		shade:0.8,
		content:'/zhima/gomestore/topayment?orderNo='+orderNo+'&zhimaOrderType='+zhimaOrderType,
		area:['500px' , '420px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		zm_Order_Status:$('#zm_Order_Status').val(),
		zm_Order_Type:$('#zm_Order_Type').val(),
		contactWay:$('#contactWay').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		noDeliveryDay:$('#noDeliveryDay').val(),
		creditOrderSource:$('#creditOrderSource').val(),
		partnerName:$('#partnerName').val(),
		companyName:$('#companyName').val(),
		branchCode:$('#branchCode').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
	};
}

function downloadZhiMaExport(){
	var param = 'merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&zm_Order_Status=' + $('#zm_Order_Status').val();
	param += '&zm_Order_Type=' + $('#zm_Order_Type').val();
	param += '&creditOrderSource=' + $('#creditOrderSource').val();
	param += '&partnerName=' + $('#partnerName').val();
	param += '&companyName=' + $('#companyName').val();
	param += '&branchCode=' + $('#branchCode').val();
	param += '&provinceId=' + $('#provinceId').val();
	param += '&cityId=' + $('#cityId').val();
	window.location.href = '/zhima/gomestore/zhimaexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function doSearch(){
	layerIndex = layer.msg('加载中', {icon:16, time:10000});
	grid.query(getParams());
}

/**
 * 重新加载
 * @returns
 */
function reload(){
	layer.closeAll();
	grid.reload();
}