var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"订单号", dataIndex:'ORDERNO', width:'170px',sortable:false}
			,{header:"奖励金额", dataIndex:'PRICE', width:'60px',sortable:false}
			,{header:"奖励类型", dataIndex:'PRICEFLAG', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['PRICEFLAG'] == 'RED'){
						return '红包';
					}else if (data['PRICEFLAG'] == 'REW'){
						return '佣金';
					}else if (data['PRICEFLAG'] == 'DIV'){
						return '分成';
					}
				}
			}
			,{header:"佣金时间", dataIndex:'CREATEDATE', width:'120px',sortable:false}
			,{header:"获得人", dataIndex:'NAME', width:'120px',sortable:false}
			,{header:"所属合作商", dataIndex:'PARTNERNAME', width:'120px',sortable:false}
			,{header:"佣金状态", dataIndex:'STATUS', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['STATUS'] == '1'){
						return '<font color="red">冻结</font>';
					}else if (data['STATUS'] == '2'){
						return '<font color="green">可提现</font>';
					}else if (data['STATUS'] == '3'){
						return '<font color="blue">已提现</font>';
					}
				}
			}
			,{header:"操作", dataIndex:'', width:'180px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var brokerageStatus = data['STATUS'];//佣金状态
					var orderStatus = data['ORDERSTATUS'];//订单状态
					var id = data['ID']; //佣金状态
					var price = data['PRICE'];
					var priceFlag = data['PRICEFLAG'];
					
					if(brokerageStatus == '1'){
						if(priceFlag == 'RED' || price > 0){
							if(orderStatus == '5' || orderStatus == '66'){
								var	returnText ='<a href="javascript:void(0);" onclick="can(\''+id+'\')" class="a_link">发放</a>';
							}else{
								var	returnText ='<font color="red">交易未完成</font>';
							}
						}else{
							var	returnText ='<font color="#24D3FF">暂无佣金或分成</font>';
						}
					}else if(brokerageStatus == '4'){
						var	returnText ='<font color="#24D3FF">未达到活动规则</font>';
					}
					
					return returnText;
				}
			}
		]
		,url:'/system/brokerage/pagelist'
		,baseParams:initParams()
	});
	
	/**
	 * 业务类型change事件
	 */
	$('#businessCode').change(function(){
		var businessCode = $('#businessCode').val();
		$.post('/system/partner/recycle',{businessCode:businessCode},function(data){
			if(data.length > 0){
				var html = '<option value="">全部</option>';
				for(i in data){
					html += '<option value="'+data[i]["PARTNERCODE"]+'">'+data[i]["PARTNERNAME"]+'</option>';
				}
				$('#partnerCode').html(html);
			}
		})
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params.start = start;
		params.limit = limit;
		return params;
	}else{
		return {};
	}
}

function can(id){
	if(confirm("是否确认发放？")){
		$.post('/system/brokerage/updatebrokeragestatus', {id:id}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				
			}
		});
	}
}

function getParams(){
	return {
		name:$('#name').val(),
		status:$('#status').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		partnerCode:$('#partnerCode').val(),
		winStatus:$('#winStatus').val(),
		orderNo:$('#orderNo').val(),
		sheng:$('#sheng').val(),
		shi:$('#shi').val()
	};
}

initProvince();
//省份初始化
function initProvince(){
	$("#sheng").html("<option value=''>请选择省份</option>");
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,url:openapiUrl+'/util/util/getprovince',
		success:function(data){
			var optionHtml = "", name = "";
			for(i in data){
				name = data[i]['NAME'];
				optionHtml += "<option value='"+data[i]['ID']+"' title='"+name+"'>"+name+"</option>";
			}
			$("#sheng").append(optionHtml);
		}
	});
}

//省动态改变
$('#sheng').change(function(){
	$("#shi").html("<option value='' flag='N'>请选择城市</option>");
	$("#partnerCode").html("<option value='' flag='N'>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,data:{provinceId:thisVal},url:openapiUrl+'/util/util/getcity',
			success:function(data){
				var optionHtml = '', id = '', name = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#shi").append(optionHtml);
			}
		});
	}
});

//合作商动态改变
$('#shi').change(function(){
	$("#partnerCode").html("<option flag='' value=''>请选择合作商</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'json',cache:false,data:{cityId:thisVal},url:'/system/brokerage/getpartners',
			success:function(data){
				var optionHtml = '',id = '',name = '';
				for(i in data){
					id = data[i]['PARTNERCODE'];
					name = data[i]['PARTNERNAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#partnerCode").append(optionHtml);
			}
		});
	}
});

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function brokerageExport(){
	var param = '';
	param += '&name=' + $('#name').val();
	param += '&status=' + $('#status').val();
	param += '&startDate=' + $('#startDate').val();	
	param += '&endDate=' + $('#endDate').val();
	param += '&partnerCode=' + $('#partnerCode').val();
	param += '&winStatus=' + $('#winStatus').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&sheng=' + $('#sheng').val();
	param += '&shi=' + $('#shi').val()
	window.location.href = '/system/brokerage/brokerageexport?'+param;
	return false; //截取返回false就不会保存网页了
}

