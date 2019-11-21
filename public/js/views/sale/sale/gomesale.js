var grid;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:10,
		height:250,
		cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"所属分部", dataIndex:'COMPANYNAME', width:'100px',sortable:false}
			,{header:"门店名称", dataIndex:'PARTNERNAME', width:'120px',sortable:false}
			,{header:"销售日期", dataIndex:'SALEDATE', width:'80px',sortable:false}
			,{header:"销售单号", dataIndex:'SALENO', width:'100px',sortable:false}
			,{header:"旧机单号", dataIndex:'ORDERNO', width:'150px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'100px',sortable:false}
			,{header:"订单金额", dataIndex:'DINGDANPRICE', width:'80px',sortable:false}
			,{header:"检测商品报价", dataIndex:'MERPRICE', width:'80px',sortable:false}
			,{header:"成交价格", dataIndex:'SETTLEPRICE', width:'80px',sortable:false}
			,{header:"人工加价", dataIndex:'PLUSPRICE', width:'80px',sortable:false}
			,{header:"销售价格", dataIndex:'SALEPRICE', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}
		]
		,url:'/sale/sale/gomepagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	var params = getParams();
	params['start'] = start;
	params['limit'] = limit;
	return params;
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
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

function getParams(){
	return {
		merName:$('#merName').val(),
		orderNo:$('#orderNo').val(),
		saleNo:$('#saleNo').val(),
		partnerCode:'10000363',
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val(),
		companyName:$('#companyName').val(),
		branchCode:$('#branchCode').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
		createDate:$('#createDate').val(),
		createEndDate:$('#createEndDate').val(),
	};
}

/**
 * 导出销售订单
 */
function downsaleOrder(){
	var param = '';
	param += 'merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&partnerCode=' + '10000363';
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&saleNo=' + $('#saleNo').val();
	param += '&companyName=' + $('#companyName').val();
	param += '&branchCode=' + $('#branchCode').val();
	param += '&provinceId=' + $('#provinceId').val();
	param += '&cityId=' + $('#cityId').val();
	param += '&createDate=' + $('#createDate').val();
	param += '&createEndDate=' + $('#createEndDate').val();
	window.location.href = '/sale/sale/gomeorderexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function doSearch(){
	var params = getParams();
	grid.paras.start = 1;
	grid.query(params);
}
