var grid;
var layerIndex = 0;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'100px',sortable:false}
			,{header:"订单时间", dataIndex:'DINGDANSHIJ', width:'100px',sortable:false}
			,{header:"分部名称", dataIndex:'COMPANYNAME', width:'100px',sortable:false}
			,{header:"门店名称", dataIndex:'PARTNERNAME', width:'100px',sortable:false}
			,{header:"销售组织", dataIndex:'XSZZ', width:'70px',sortable:false}
			,{header:"销售单号", dataIndex:'XSNO', width:'70px',sortable:false}
			,{header:"券码编号", dataIndex:'COUPONCODE', width:'70px',sortable:false}
			,{header:"券码金额", dataIndex:'COUPONPRICE', width:'70px',sortable:false}
			,{header:"销售金额", dataIndex:'XSPRICE', width:'70px',sortable:false}
			,{header:"券码状态", dataIndex:'COUPONSTATUSTXT', width:'70px',sortable:false}
			,{header:"收款时间", dataIndex:'SKDATE', width:'100px',sortable:false}
			,{header:"单据类型", dataIndex:'XSTYPENAME', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText = ' <a href="javascript:infos(\''+orderNo+'\')" class="a_link">详情</a> ';
					return returnText;
				}
			}
		]
		,url:'/order/gomestore/salespage'
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
	$('#skDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endSkDate').click(function(){
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

function getParams(){
	return {
		pName:$('#pName').val(),
		salesNo:$('#salesNo').val(),
		orderNo:$('#orderNo').val(),
		couponCode:$('#couponCode').val(),
		couponStatus:$('#couponStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		skDate:$('#skDate').val(),
		endSkDate:$('#endSkDate').val(),
		companyName:$('#companyName').val(),
		branchCode:$('#branchCode').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

/**
 * 详情
 */
function infos(orderNo){
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

function doExport(){
	var param = {};
	param.pName = $('#pName').val();
	param.salesNo = $('#salesNo').val();
	param.orderNo = $('#orderNo').val();
	param.couponCode = $('#couponCode').val();
	param.startDate = $('#startDate').val();
	param.endDate = $('#endDate').val();
	param.skDate = $('#skDate').val();
	param.endSkDate = $('#endSkDate').val();
	param.couponStatus = $('#couponStatus').val();
	param.companyName = $('#companyName').val();
	param.branchCode = $('#branchCode').val();
	param.provinceId = $('#provinceId').val();
	param.cityId = $('#cityId').val();
	window.location.href = "/order/gomestore/salesorgexport?"+$.param(param);
	return false; //截取返回false就不会保存网页了
}

function doExportPartner(data){
	var param = {};
	param.pName = $('#pName').val();
	param.skDate = $('#skDate').val();
	param.endSkDate = $('#endSkDate').val();
	param.companyName = $('#companyName').val();
	param.branchCode = $('#branchCode').val();
	param.provinceId = $('#provinceId').val();
	param.cityId = $('#cityId').val();
	window.location.href = "/order/gomestore/salesorgexportpartner?"+$.param(param);
	return false; //截取返回false就不会保存网页了
}