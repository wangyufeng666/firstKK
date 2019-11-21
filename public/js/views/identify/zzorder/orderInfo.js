$().ready(function(){
	$('#saveRemarkBtn').bind('click',function(){saveRemark();});
	
	$('#identifyPublishReportBtn').click(function(){
		layer.open({
			type:2,
			title:'鉴定报告',
			shadeClose:false,
			shade:0.8,
			content:'/identify/zzorder/reportpublishpage?orderNo='+orderNo,
			area:['800px','100%'],
			close:function(index){
				layer.close(index);
			}
		});
	});
	
	$('#identifyReportBtn').click(function(){
		layer.open({
			type:2,
			title:'鉴定报告',
			shadeClose:false,
			shade:0.8,
			content:'/identify/zzorder/reportpage?orderNo='+orderNo,
			area:['800px','100%'],
			close:function(index){
				layer.close(index);
			}
		});
	});
});

function saveRemark(){
	$('#saveRemarkBtn').unbind('click');
	var remark = $('#orderRemarks').val();
	
	$.get('/identify/order/saveremark',{orderNo:orderNo, remark:remark},function(data){
		if(data == 'Y'){
			$('#orderRemarkSpan').append('['+getDateTime()+']'+remark+'<br/>');
			$('#saveRemarkBtn').bind('click',function(){saveRemark();});
		}
	});
}

function getDateTime(){
	var myDate = new Date();
	//获取当前年
	var year=myDate.getFullYear();
	//获取当前月
	var month=myDate.getMonth()+1;
	//获取当前日
	var date=myDate.getDate(); 
	var h=myDate.getHours();       //获取当前小时数(0-23)
	var m=myDate.getMinutes();     //获取当前分钟数(0-59)
	var s=myDate.getSeconds();  

	return year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
}

function p(s) {
    return s < 10 ? '0' + s : s;
}

function showQRcode(remark){
    layer.open({
    	type:2,
    	title:'二维码',
    	shadeClose:false,
    	shade:0.8,
    	content:'/identify/order/qrcode?orderNo='+orderNo+'&remark='+remark,
    	area:['600px','450px'],
    	close:function(index){
    		layer.close(index);
    	}
    });
}

function expressInfo(callId){
    layer.open({
    	type:2,
    	title:'代叫快递信息',
    	shadeClose:false,
    	shade:0.8,
    	content:'/identify/order/expresspage?callId='+callId,
    	area:['600px','450px'],
    	close:function(index){
    		layer.close(index);
    	}
    });
}

function reload(){
	layer.closeAll('iframe');
	window.location.href = window.location.href;
}

/**
 * 选择商品
 * @returns
 */
function selectMerInfo(){
	var merName = $('#merName').val();
	layer.open({
		type:2,
		title:'商品搜索',
		shadeClose:true,
		content:'/product/cooperate/merlist?merName='+merName,
		area:['99%','99%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 获取layer页面传回的商品信息
 * @param merId
 * @param p_merInfo
 * @returns
 */
function getSelectMer(merId, p_merInfo){
	
	var orderNo = $('#orderNo').val();
	var merName = p_merInfo['MERNAME'];
	
	layer.closeAll('iframe');
	$.post('/identify/order/matchmer', {orderNo:orderNo, merId:merId}, function(data){
		if(data !== 'Y'){
			alert('商品关联失败');
		}else{
			window.location.href = window.location.href;
		}
	});
}

//终止退回
function stopAndReturn(){
	layer.open({
		type:2,
		title:'商品搜索',
		shadeClose:true,
		content:'/identify/zzorder/sendbackpage?orderNo='+orderNo+'&operType=1',
		area:['600px','500px'],
		close:function(index){
			layer.close(index);
		}
	});
}

//确认交易
function tradeConfirm(){
	layer.open({
		type:2,
		title:'商品搜索',
		shadeClose:true,
		content:'/identify/zzorder/sendbackpage?orderNo='+orderNo+'&operType=2',
		area:['600px','500px'],
		close:function(index){
			layer.close(index);
		}
	});
}