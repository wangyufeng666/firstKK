var grid, layerIndex = 0;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "IMEI", dataIndex: 'MERSEQUENCE', width:'120px',sortable:false}
			,{header: "所属分部", dataIndex: 'COMPANYNAME', width:'80px',sortable:false}
			,{header: "所属门店", dataIndex: 'HNAME', width:'80px',sortable:false}
			,{header: "取件方式", dataIndex: 'VISITFLAG', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['VISITFLAG'] == '1'){
						return '上门取件';
					}else{
						return '快递取件';
					}
				}
				
			}
			,{header: "店员", dataIndex: 'NAME', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['NAME']+'('+data['MOBILE']+')';
				}
			}
			,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header: "库存状态", dataIndex: 'GOMESTORAGENAME', width:'80px',sortable:false}
			,{header: "入库日期", dataIndex: 'INWAREDATE', width:'130px',sortable:false}
			,{header: "出库日期", dataIndex: 'OUTWAREDATE', width:'130px',sortable:false}
			,{header: "订单价格", dataIndex: '', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header: "操作", dataIndex: '', width:'80px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var status = data['ORDERSTATUS']+'';
					var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}
		]
		,url:'/order/gomestore/storagepagelist'
		,baseParams:initParams()
		,afterRender:function(){
			layer.close(layerIndex);
		}
		,pageSizeList:[15,30,50]
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
		contactWay:$('#contactWay').val(),
		partnerCode:$('#partnerCode').val(),
		gomeStorageStatus:$('#gomeStorageStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		inwareDate:$('#inwareDate').val(),
		endInwareDate:$('#endInwareDate').val(),
		outwareDate:$('#outwareDate').val(),
		endOutwareDate:$('#endOutwareDate').val(),
		address:$('#address').val(),
		partnerName:$('#partnerName').val(),
		expressNum:$('#expressNum').val(),
		companyName:$('#companyName').val(),
		branchCode:$('#branchCode').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
		visitFlag:$('#visitFlag').val(),
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
	param.partnerCode = $('#partnerCode').val();
	param.gomeStorageStatus = $('#gomeStorageStatus').val();
	param.startDate = $('#startDate').val();
	param.endDate = $('#endDate').val();
	param.inwareDate = $('#inwareDate').val();
	param.endInwareDate = $('#endInwareDate').val();
	param.outwareDate = $('#outwareDate').val();
	param.endOutwareDate = $('#endOutwareDate').val();
	param.address = $('#address').val();
	param.partnerName = $('#partnerName').val();
	param.expressNum = $('#expressNum').val();
	param.companyName = $('#companyName').val();
	param.branchCode = $('#branchCode').val();
	param.provinceId = $('#provinceId').val();
	param.cityId = $('#cityId').val();
	param.visitFlag = $('#visitFlag').val();
	window.location.href = '/order/gomestore/exprotstorage?'+$.param(param);
	return false; //截取返回false就不会保存网页了
}
