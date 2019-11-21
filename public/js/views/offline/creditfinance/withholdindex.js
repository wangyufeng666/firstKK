var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'3%',sortable:false} 
			  ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'10%',sortable:false}
			  ,{header: "订单来源", dataIndex: '', width:'10%',sortable:false
					,renderer : function(value, data, rowIndex, colIndex, metadata){
						return data['COMPANYNAME']+'('+data['PARTNERNAME']+')';
	        		}
				}
			  ,{header: "订单编号", dataIndex: 'ORDERNO', width:'10%',sortable:false}
			  ,{header: "联系方式", dataIndex: '', width:'15%',sortable:false
		  		  ,renderer : function(value, data, rowIndex, colIndex, metadata){
				  	  return data['USERNAME']+'('+data['MOBILE']+')';
				  }
			  } 
			  ,{header: "代扣编号", dataIndex: 'YDMTRADENO', width:'10%',sortable:false}
			  ,{header: "支付编号", dataIndex: 'YDMPAYNO', width:'10%',sortable:false}
			  ,{header: "代扣金额", dataIndex: 'WITH_PRICE', width:'7%',sortable:false}
			  ,{header: "代扣时间", dataIndex: 'WITH_STARTDATE', width:'10%',sortable:false}
			  ,{header: "支付状态", dataIndex: 'RESULT_EXT', width:'10%',sortable:false}
			
			  ,{header: "操作", dataIndex: '', width:'15%', sortable:false,
					renderer : function(value, data, rowIndex, colIndex, metadata){
					  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="infos(\''+data['PKID']+'\')">详情</a>';
					  	if(data['PUSHS_EXT'] == 1){
					  		returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="pushs(\''+data['ORDERNO']+'\')">推送</a>';
					  	}
					  	if(data['RESULT_CODE'] == 'ORDER_WILLPROCESS' || data['RESULT_CODE'] == 'ORDER_INPROCESS'){
					  		returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="withHold(\''+data['YDMTRADENO']+'\',\''+data['WITH_PRICE']+'\')">扣款</a>';
					  	}
					  	return returnText;
					}
	           	}
		]
		,url : '/offline/creditfinance/withholdpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});
function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}

function withHold(ydmtradeNo, withPrice){
	if(confirm('是否确认扣款'+withPrice+'元?')){
		$.post("/offline/creditfinance/withhold", {ydmtradeNo:ydmtradeNo,withPrice:withPrice}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				alert(data);
			}
		});
	}
}

$("#orderSourceCompany").change(function(){
	var companyCode = $(this).val();
	$.post('/offline/creditorder/ordersourcestores', {companyCode:companyCode}, function(data){
		$("#orderSourceStores").html("<option value=''>请选择门店</option>");
		for(i in data){
			$("#orderSourceStores").append("<option value='"+data[i]['PARTNERCODE']+"'>"+data[i]['PARTNERNAME']+"</option>");
		}
	}, 'json');
});

/**
 * 详情
 */
function infos(pkid){
	window.location.href = "/offline/creditfinance/withholdinfo?pkid="+pkid+"&backUrl="+backUrl;
}
/**
 * 推送
 */
function pushs(orderNo){
	if(confirm('超过七天扣款失败推送告知用户？')){
		$.post("/zhima/creditfinance/pushcard", {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				alert('推送成功');
				doSearch();
			}else{
				alert(data);
			}
		});
	}
}
function goBack(){
	window.history.go(-1);
}
function getParams(){
    return {
    	orderno:$('#orderno').val(), 
    	ydmtradeno:$('#ydmtradeno').val(),
    	ydmpayno:$('#ydmpayno').val(),
    	with_startdate_start:$('#with_startdate_start').val(),
    	with_startdate_end:$('#with_startdate_end').val(),
    	createdate_start:$('#createdate_start').val(),
    	createdate_end:$('#createdate_end').val(),
    	result_code:$('#result_code').val(),
		companyCode:$('#orderSourceCompany').val(),
		partnerCode:$('#orderSourceStores').val(),
    	contactWay:$('#contactWay').val()
    };
}
function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg,type:8}
	});
}