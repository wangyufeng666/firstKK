$().ready(function(){
	$('#scrapPhone').click(function(){
		//var orderNo = '<?php echo $order['ORDERNO']?>';
		var num = $('#scrapPhoneNo').val();
		if($('#scrapPhoneNo').val() != "" && Number(num) >= 1 && Number(num) <= 10){
			var load1 = layer.load('加载中...');
			$.ajax({
				type : 'POST'//请求方式
				,url : "/order/order/scrapphone"//请求路径
				,data : {orderNo:orderNo,num:num}  //发送到服务器的数据
				,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
				,async : false //同步请求
				,timeout :60000//默认超时60秒
				,dataType:'json' //预期服务器返回的数据类型
				,success : function(data){
					if('OK' == data['flag']){
						layer.close(load1);
						alert(data['successNum']+'个成功，'+(num-data['successNum'])+'个失败');
					}else{
						layer.close(load1);
						alert("失败");
					}
				}
			});
		}else{
			alert('请输入大于等于1且小于10的整数');
		}
	});
	$('#addPriceAreaButton').bind('click', function(){addPriceAreaButton();});
});
function addPriceAreaButton(){
	$('#addPriceAreaButton').unbind('click');
	var addPrice = $('#addPriceArea').val();
	var reg = /^(-)?\d+$/;
	if(!reg.test(addPrice)){
		errorBox('用户调价非法输入');
		$('#addPriceAreaButton').bind('click', function(){addPriceAreaButton();});
		return;
	}
	$.post('/recycle/alipayorder/saveaddprice',{addPrice:addPrice,inspectionID:inspectionID,orderNo:orderNo,inspectionPrice:inspectionPrice},function(data){
		if(data=='Y'){
			alert('调价成功');
			window.location.href = window.location.href;	
		}
	})
}

/**
 * 错误对话框
 * @param msg
 * @return
 */
function errorBox(msg){
	$.layer({
		title:'错误',
		area : ['280px','auto'],
		dialog : {msg:msg, type:8}    
	});
}

function goBack(){
	window.location.href = backUrl;
}

function changeTradeType(orderNo){
	$.layer({
		type : 2,
		title : '订单状态修改',
		iframe : {src : '/order/order/changetradetype?orderNo='+orderNo},
		area : ['500', '320'],
		offset : ['50px',''],
		close : function(index){
			layer.close(index);
		},
		end : function(index){
			window.location.href="/order/order/orderinfo?orderNo="+orderNo+"&backUrl=+backUrl";
		}
	});
}

function serverDatePage(orderNo){
	$.layer({
		type:2,
		title:'预约时间修改',
		iframe:{src : '/order/order/serverdate?orderNo='+orderNo},
		area : ['500', '320'],
		offset : ['50px',''],
		close : function(index){
			layer.close(index);
		},
		end : function(index){
			window.location.href="/order/edx/orderinfo?orderNo="+orderNo+"&backUrl=+backUrl";
		}
	});
}

function saveRemark(){
	var orderRemark = $.trim($('#orderRemark').val());
	if(orderRemark != ''){
		$.post('/order/order/insertremark',{orderNo:orderNo, orderRemark:orderRemark},function(data){
			if(data == 'Y'){
				window.location.reload();//刷新
			}else{
				alter(data);
			}
		});
	}else{
		alert('请输入备注信息');
	}
}
function returnCoupon(orderNo){
	if(confirm('是否退券终止？')){
		$.post('/order/edx/returncoupon',{orderNo:orderNo},function(data){
			if(data == 'Y'){
				alert('退券成功');
			}else{
				alert('退券失败');
			}
		});
	}
}

function stopOrder(orderNo){
	if(confirm('是否确认取消订单？')){
		$.post('/order/edx/stoporder',{orderNo:orderNo},function(data){
			if(data == 'Y'){
				alert('订单取消成功');
			}else{
				alert('订单取消失败');
			}
		});
	}
}

//订单终止退回
function returnBack(orderNo, orderStatus){
	if(confirm('是否确认订单终止退回？')){
		$.post('/order/edx/returnback',{orderNo:orderNo,orderStatus:orderStatus},function(data){
			if(data == 'Y'){
				alert('操作成功');
				window.location.href = window.location.href;
			}else{
				alert('操作失败：'+data);
			}
		});
	}
}

function fillReturnExpress(orderNo){
	$.layer({
		type:2,
		title:'退货运单填写',
		iframe:{src : '/order/edx/returnexpressnum?orderNo='+orderNo},
		area : ['500', '320'],
		close : function(index){
			window.location.href = window.location.href;
		}
	});
}