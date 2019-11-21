var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"创建日期", dataIndex:'CREATEDATE', width:'120px',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'130px',sortable:false}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
		  		,renderer:function(value, data, rowIndex, colIndex, metadata){
		  			return data['USERNAME']+'('+data['MOBILE']+')';
		  		}
			}
			,{header:"代扣编号", dataIndex:'YDMTRADENO', width:'130px',sortable:false}
			,{header:"支付编号", dataIndex:'YDMPAYNO', width:'130px',sortable:false}
			,{header:"代扣金额", dataIndex:'WITH_PRICE', width:'60px',sortable:false}
			,{header:"代扣时间", dataIndex:'WITH_STARTDATE', width:'80px',sortable:false}
			,{header:"支付状态", dataIndex:'RESULT_EXT', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var ydmTradeNo = data['YDMTRADENO'];
					var returnText ='<a class="a_link" href="javascript:withholdInfo(\''+data['PKID']+'\')">详情</a>';
					if(data['PUSHS_EXT'] == 1){
						returnText +=' | <a class="a_link" href="javascript:overdueCard(\''+orderNo+'\')">推送</a>';
					}
					if(data['RESULT_CODE'] == 'ORDER_WILLPROCESS' || data['RESULT_CODE'] == 'ORDER_INPROCESS'){
						returnText +=' | <a class="a_link" href="javascript:orderWithhold(\''+ydmTradeNo+'\',\''+data['WITH_PRICE']+'\')">扣款</a>';
					}
					if(data['RESULT_CODE'] == 'ORDER_INPROCESS' && data['WITH_PRICE'] > 100){
						returnText +=' | <a class="a_link" href="javascript:withholdSplit(\''+data['PKID']+'\')">拆分</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/idlefishv2/creditfinance/withholdpagelist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50,100]
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

/**
 * 代扣
 * @param ydmtradeNo
 * @param withPrice
 */
function orderWithhold(ydmtradeNo, withPrice){
	if($('#quickWithhold').val() == 'Y'){
		$.post("/idlefishv2/creditfinance/withhold", {ydmtradeNo:ydmtradeNo}, function(data){
			console.log('【'+ydmtradeNo+'】'+data);
		});
	}else{
		if(confirm('是否确认扣款'+withPrice+'元?')){
			$.post("/idlefishv2/creditfinance/withhold", {ydmtradeNo:ydmtradeNo}, function(data){
				if(data == 'Y'){
					doSearch();
				}else{
					alert(data);
				}
			});
		}
	}
}

/**
 * 批次代扣
 * @returns
 */
var withholdIndex = -1;
var timerId = null;
var failOrderList = [];
function batchWithhold(){
	
	if($('#quickWithhold').val() != 'Y'){
		console.log('请设置标记为Y');
		return false;
	}
	
	if($('#btn_batchWithhold').attr('data-val') == 'Y'){//代扣中
		$('#btn_batchWithhold').attr('data-val', 'N');
		$('#btn_batchWithhold').html('一键代扣');
		clearTimeout(timerId);
		withholdIndex = -1;
		failOrderList = [];
		grid.reload();
	}else{
		$('#btn_batchWithhold').attr('data-val', 'Y');
		$('#btn_batchWithhold').html('代扣终止');
		if($('#quickWithhold').val() == 'Y'){
			withholdIndex = -1;
			timerId = setTimeout("timerWithhold()", 1000);
		}
	}
}
/**
 * 代扣定时器
 */
function timerWithhold(){
	var result = grid.getResult();
	withholdIndex++;
	if(result.length > withholdIndex){
		var orderNo = result[withholdIndex].ORDERNO;
		if($.inarray(orderNo, failOrderList) < 0){
			var ydmtradeNo = result[withholdIndex].YDMTRADENO;
			$.post("/idlefishv2/creditfinance/withhold", {ydmtradeNo:ydmtradeNo}, function(data){
				console.log((withholdIndex+1)+'【'+orderNo+' '+ydmtradeNo+'】'+data);
				if(data != 'Y'){
					failOrderList.push(orderNo);
				}
				if($('#btn_batchWithhold').attr('data-val') == 'Y'){//代扣中
					timerId = setTimeout("timerWithhold()", 1000);
				}
			});
		}else{
			console.log((withholdIndex+1)+'【'+orderNo+' '+ydmtradeNo+'】跳过==');
		}
	}else{
		clearTimeout(timerId);
		console.log('执行完成');
		grid.reload();
		batchWithhold();//初始化
		alert('执行完成');
	}
}

/**
 * 扣款订单拆分
 */
function withholdSplit(pkid){
	$.post("/idlefishv2/creditfinance/withholdsplit", {pkid:pkid}, function(data){
		if(data == 'Y'){
			doSearch();
		}else{
			console.log('【'+pkid+'】'+data);
		}
	});
}

/**
 * 下载
 * @returns {Boolean}
 */
function downloadBackPayExport(){
	var param = '';
	param += '&startDate=' + $('#with_startdate_start').val();
	param += '&endDate=' + $('#with_startdate_end').val();
	window.location.href = '/idlefishv2/recyorder/backpayexport?'+param;
	return false;
}

/**
 * 详情
 */
function withholdInfo(pkid){
	window.location.href = "/idlefishv2/creditfinance/withholdinfo?pkid="+pkid+"&backUrl="+backUrl;
}
/**
 * 推送催缴
 */
function overdueCard(orderNo){
	if(confirm('超过七天扣款失败推送告知用户？')){
		$.post("/idlefishv2/creditfinance/pushcard", {orderNo:orderNo}, function(data){
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
	var pageNum = 1, start = 0;
	if(grid && grid.getPageNumber()){
		pageNum = grid.getPageNumber();
		start = (pageNum-1) * grid.getPageSize(); 
	}
	return {
    	start:start,
		orderno:$('#orderno').val(), 
		ydmtradeno:$('#ydmtradeno').val(),
		ydmpayno:$('#ydmpayno').val(),
		with_startdate_start:$('#with_startdate_start').val(),
		with_startdate_end:$('#with_startdate_end').val(),
		createdate_start:$('#createdate_start').val(),
		createdate_end:$('#createdate_end').val(),
		result_code:$('#result_code').val(),
		contactWay:$('#contactWay').val()
	};
}

function doSearch(){
	grid.query(getParams());
}
