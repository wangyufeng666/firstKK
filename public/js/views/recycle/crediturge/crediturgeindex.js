var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:50,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"下单日期", dataIndex:'ORDERDATE', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					return '<span ondblclick="showRemark(\''+orderNo+'\')">'+data['ORDERDATE']+'</span>';
				}
			}
			,{header:"最后催缴日期", dataIndex:'LASTNOTICEDATE', width:'120px',sortable:false}
			,{header:"订单来源", dataIndex:'ORDERTYPE', width:'70px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == '66'){
						return '芝麻信用';
					}else if(value == '70'){
						return '闲鱼一期';
					}else if(value == '71'){
						return '闲鱼二期';
					}else if(value == '74'){
						return '支付宝回收小程序';
					}else{
						return value;
					}
				}
			}
			,{header:"违约日期", dataIndex:'LASTREFUNDDATE', width:'90px',sortable:false}
			,{header:"催缴金额", dataIndex:'WITHPRICE', width:'70px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'70px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"订单地址", dataIndex:'DIZHI', width:'80px',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'', width:'150px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var lastNoticeDate = data['LASTNOTICEDATE'];
					var returnText ='<a href="javascript:withoutInfo(\''+orderNo+'\')" class="a_link">扣款详情</a>';
					returnText += ' | <a href="javascript:executeUrge(\''+orderNo+'\', \''+lastNoticeDate+'\')" class="a_link">催缴</a>';
					returnText += ' | <a href="javascript:urgeInfo(\''+orderNo+'\')" class="a_link">催缴详情</a>';
					return returnText;
				}
			}
		]
		,url:'/recycle/crediturge/pagelist'
		,baseParams:initParams()
		,pageSizeList:[50, 100, 200, 300]
	});
	
	$(document).keypress(function(e) {
		if(e.ctrlKey && e.which == 17){
			$('#btn_batchUrge').toggle();
		}
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
 * 批次代扣
 * @returns
 */
var creditUrgeIndex = -1;
var timerId = null;
var thisDate = getThisDate();
function batchCreditUrge(){
	if($('#btn_batchUrge').attr('data-val') == 'Y'){//代扣中
		$('#btn_batchUrge').attr('data-val', 'N');
		$('#btn_batchUrge').html('一键催缴');
		clearTimeout(timerId);
		creditUrgeIndex = -1;
		grid.reload();
	}else{
		$('#btn_batchUrge').attr('data-val', 'Y');
		$('#btn_batchUrge').html('催缴终止');
		if($('#quickCreditUrge').val() == 'Y'){
			creditUrgeIndex = -1;
			timerId = setTimeout("timerCreditUrge()", 1000);
		}
	}
}

function getThisDate(){
	var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    return year+'-'+month+'-'+strDate;
}

/**
 * 代扣定时器
 */
function timerCreditUrge(){
	var result = grid.getResult();
	creditUrgeIndex++;
	if(result.length > creditUrgeIndex){
		var orderNo = result[creditUrgeIndex].ORDERNO;
		var urgeDate = result[creditUrgeIndex].LASTREFUNDDATE;
		console.log(creditUrgeIndex+'：'+orderNo);
		
		if(urgeDate == ''){
			console.log('催缴日期为空跳过。');
			timerId = setTimeout("timerCreditUrge()", 100);
		}else if(urgeDate > thisDate){
			console.log('催缴日期未到跳过。。');
			timerId = setTimeout("timerCreditUrge()", 100);
		}else if(result[creditUrgeIndex].ORDERTYPE == '71'){
			console.log('闲鱼二期订单跳过。。。');
			timerId = setTimeout("timerCreditUrge()", 100);
		}else{
			$.post('/recycle/crediturge/executeurge', {orderNo:orderNo}, function(data){
				if(data == 'Y'){
					console.log(orderNo+'：催缴成功');
				}else{
					console.log(orderNo+'：催缴失败。。');
				}
				timerId = setTimeout("timerCreditUrge()", 1000);
			});
		}
		
	}else{
		clearTimeout(timerId);
		console.log('执行完成');
		grid.reload();
		batchCreditUrge();//初始化
		alert('执行完成');
	}
}

/**
 * 代扣详情
 * @param orderNo
 * @return
 */
function withoutInfo(orderNo){
	layer.open({
		type:2,
		title:'代扣详情',
		content:"/recycle/crediturge/withoutinfo?orderNo="+orderNo,
		area:['600px', '400px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 催缴详情
 * @param orderNo
 */
function urgeInfo(orderNo){
	layer.open({
		type:2,
		title:'催缴详情',
		content:"/recycle/crediturge/urgeinfo?orderNo="+orderNo,
		area:['800px', '600px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 催缴操作
 * @param orderId
 * @return
 */
var urgeOrderList = [];
function executeUrge(orderNo, lastNoticeDate){
	var confirmText = '是否确认发送催缴通知？';
	if(lastNoticeDate != '' && lastNoticeDate != 'null' && lastNoticeDate != null){
		confirmText = '您已于'+lastNoticeDate+'进行过催缴，是否继续发送催缴通知？';
	}
	if($.inArray(orderNo, urgeOrderList) >= 0){
		console.log('已催缴。。。');
	}else{
		if($('#urgeFlag').val() == 'Y'){
			$.post('/recycle/crediturge/executeurge', {orderNo:orderNo}, function(data){
				if(data == 'Y'){
					urgeOrderList.push(orderNo);
					console.log(orderNo+'：催缴成功');
				}else{
					console.log(orderNo+'：催缴失败。。');
				}
			});
		}else{
			if(confirm(confirmText)){
				$.post('/recycle/crediturge/executeurge', {orderNo:orderNo}, function(data){
					if(data == 'Y'){
						urgeOrderList.push(orderNo);
						console.log("催缴成功");
					}else{
						console.log('催缴失败：'+data);
					}
				});
			}
		}
	}
}

function getParams(){
	var pageNum = 1, start = 0;
	if(grid && grid.getPageNumber()){
		pageNum = grid.getPageNumber();
		start = (pageNum-1) * grid.getPageSize(); 
	}
	return {
 	  	start:start,
 	  	orderNo:$('#orderNo').val(),
 	  	contactWay:$('#contactWay').val(),
 	  	startDate:$('#startDate').val(),
 	  	endDate:$('#endDate').val()
	};
}

function doSearch(){
    grid.query(getParams());
}

function downloadUrgeOrder(){
	var params = '';
	params += 'orderNo='+$('#orderNo').val();
	params += '&contactWay='+$('#contactWay').val();
	params += '&startDate='+$('#startDate').val();
	params += '&endDate='+$('#endDate').val();
	window.location.href = '/recycle/crediturge/export?'+params;
	return false; //截取返回false就不会保存网页了
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo){
	layer.close(layerIndex);
	$.post('/recycle/order/jsonremark',{orderNo:orderNo}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', '400px'],
			content:'<div class="layer_notice">'+orderNo+'<br/>'+data+'</div>'
		});
	});
}