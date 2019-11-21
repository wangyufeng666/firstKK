var grid;
var layerIndex = 0;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'60px',sortable:false}
			,{header:"商品品牌", dataIndex:'PNAME', width:'60px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"所属分部", dataIndex:'', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['COMPANYNAME'] ? data['COMPANYNAME'] :'<font color="red">未关联店员，暂无分部</font>';
				}
			}
			,{header:"所属门店", dataIndex:'HNAME', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['HNAME'] ? data['HNAME'] :'<font color="red">未关联店员，暂无门店</font>';
				}
			}
			,{header:"店员", dataIndex:'NAME', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['NAME'] ? data['NAME'] :'<font color="red">未关联店员，暂无店员</font>';
				}
			}
			,{header:"是否入库", dataIndex:'INVENTORYNAME', width:'60px',sortable:false}
			,{header:"入库时间", dataIndex:'INWAREDATE', width:'100px',sortable:false}
			,{header:"出库时间", dataIndex:'OUTWAREDATE', width:'100px',sortable:false}
			,{header:"联系地址", dataIndex:'DIZHI', width:'140px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['DIZHI'] ? data['DIZHI'] :'<font color="red">未关联店员，暂无地址</font>';
				}
			}
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
			,{header:"操作", dataIndex:'', width:'100px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var status = data['ORDERSTATUS']+'';
					var inventoryStatus = data['INVENTORYSTATUS'];
					var inventoryName = data['INVENTORYNAME'];
					var companyName = data['COMPANYNAME'];
					var partnerCode = data['PARTNERCODE'];
					var dizhi = data['DIZHI'];
					var returnText ='<a title="'+orderNo+'" href="javascript:orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					if((inventoryStatus == null || inventoryName == '未入库') && status != '99' && companyName != null && partnerCode != null && dizhi != null){
						returnText +=' | <a title="'+orderNo+'" href="javascript:againPush(\''+orderNo+'\')" class="a_link">重推串码</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/order/gomestore/pagelist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
		,afterRender:function(){
			layer.close(layerIndex);
		}
	});
	
	//订单日期验证
	$('#startDate').click(function(){
		WdatePicker({
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
	

	//入库日期验证
	$('#inwareDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endInwareDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});

	//出库日期验证
	$('#outwareDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endOutwareDate').click(function(){
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
 * 重新推送
 * @returns
 */
function againPush(orderNo){
	if(confirm('是否确定重新推送？')){
		$.post('/order/gomestore/againpush',{orderNo:orderNo},function(data){
			if(data.code == '200'){
				alert(data.msg);
				grid.reload();
			}else{
				alert(data.msg);
			}
		})
	}
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
			$('#cityId').val(cityId);
		}
	});
}

/**
 * 省份change
 */
$("#provinceId").change(function(){
	var provinceId = $('#provinceId').val();
		var optionsText = "<option value=''>请选择城市</option>";
	if(provinceId != ""){
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
	}else{
		$('#cityId').html(optionsText);
	}
});

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

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		orderSource:$('#orderSource').val(),
		repaymentTypes:$('#repaymentTypes').val(),
		contactWay:$('#contactWay').val(),
		partnerCode:$('#partnerCode').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		address:$('#address').val(),
		partnerName:$('#partnerName').val(),
		companyName:$('#companyName').val(),
		branchCode:$('#branchCode').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
		imei:$('#imei').val(),
		videoFlag:$('#videoFlag').val(),
		inwareDate:$('#inwareDate').val(),
		endInwareDate:$('#endInwareDate').val(),
		outwareDate:$('#outwareDate').val(),
		endOutwareDate:$('#endOutwareDate').val(),
		gomeStorageStatus:$('#gomeStorageStatus').val(),
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

function exprotOfflineOrder(){
	var param = {};
	param.merName = $('#merName').val();
	param.orderNo = $('#orderNo').val();
	param.contactWay = $('#contactWay').val();
	param.repaymentTypes = $('#repaymentTypes').val();
	param.orderStatus = $('#orderStatus').val();
	param.startDate = $('#startDate').val();
	param.endDate = $('#endDate').val();
	param.category = $('#category').val();
	param.merType = $('#merType').val();
	param.address = $('#address').val();
	param.partnerCode = $('#partnerCode').val();
	param.orderSource = $('#orderSource').val();
	param.partnerName = $('#partnerName').val();
	param.companyName = $('#companyName').val();
	param.branchCode = $('#branchCode').val();
	param.provinceId = $('#provinceId').val();
	param.cityId = $('#cityId').val();
	param.imei = $('#imei').val();
	param.videoFlag = $('#videoFlag').val();
	param.inwareDate = $('#inwareDate').val();
	param.endInwareDate = $('#endInwareDate').val();
	param.outwareDate = $('#outwareDate').val();
	param.endOutwareDate = $('#endOutwareDate').val();
	param.gomeStorageStatus = $('#gomeStorageStatus').val();
	window.location.href = '/order/gomestore/exprotoffline?'+$.param(param);
	return false; //截取返回false就不会保存网页了
}
