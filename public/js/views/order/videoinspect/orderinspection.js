//器材询价
function getMerQuote(){
	var oper = true;
	var radioIds = [];
	var multiIds = [];
	var eventCode = $('#eventCode').val();
	
	//单选描述
	$('.gzlx').each(function(){
		if($(this).val() == ''){
			oper = false;
			$(this).next().show();
		}else{
			radioIds.push($(this).val());
		}
	});
	
	//多选描述
	$('.check-box:checked').each(function(){
		multiIds.push($(this).val());
	});
	var orderNo = $('#orderNo').val();
	var params = {orderNo:orderNo, radioIds:radioIds.join('#'), multiIds:multiIds.join('#')};
	
	if(oper){
		$('#addPriceArea').show();
		var load1 = layer.load('加载中...');
		
		var eventCode = $('#eventCode').val();
		
		$.post('/order/order/getmerquote', params, function(data){
			if(data.providerId != null && data.result == 'Y'){
				var htmlActives = "";
				for(var i = 0; i < data.events.length; i++){
					var checked = "disabled='disabled'";
					var code = data.events[i].eventCode;
					var name = data.events[i].eventName;
					var price = data.events[i].eventPrice;
					if(eventCode == data.events[i].eventCode){
						checked = "checked='checked'";
					}
					htmlActives+="<label><input name='events' type='radio' "+checked+" value='"+code+"'/>"+name+"("+price+")</label>&nbsp;&nbsp;";
				}
				$('#eventLabel').html(htmlActives);
				var inquiryMerprice = $('#inquiryMerprice').val();
				var inspectionMerPirce = data.merPrice;
				$('#differRate').html('(异价比:<span> '+Math.round((inquiryMerprice - inspectionMerPirce)*100/inquiryMerprice)+'%</span>)');
				layer.close(load1);
			}
		});
	}else{
		alert('还有未选择的选项');
	}
}

/**
 * 保存检测结果
 */
function saveInspection(){
	$('#save').unbind('click');
	//所选活动
	var eventCode = $('input[name="events"]:checked').val();
	if($('#eventLabel').html() == '' || eventCode == ''){
		errorBox("请先询价，询价后选择兑换的活动");
		$('#save').bind('click', function(){saveInspection();});
		return;
	}
	
	//检测人
	var workerId = $("#worker").val();
	var workerName = $("#worker option:selected").text();
	var addPrice = $('#addPrice').val();
	if(workerId == ''){
		errorBox("请选择检测员");
		$('#save').bind('click', function(){saveInspection();});
		return;
	}
	//器材描述
	var oper = true;
	var radioIds = [];
	var multiIds = [];
	
	//单选描述
	$('.gzlx').each(function(){
		if($(this).val() == ''){
			oper = false;
			$(this).next().show();
		}else{
			radioIds.push($(this).val());
		}
	});
	//多选描述
	$('.check-box:checked').each(function(){
		multiIds.push($(this).val());
	});
	
	if(!oper){
		errorBox("请选择器材描述。");
		$('#save').bind('click', function(){saveInspection();});
		return;
	}
	var orderNo = $('#orderNo').val();
	var merSequence = $('#merSequence').val();
	var params = {
			merId:merId,
			orderNo:orderNo,
			workerId:workerId,
			workerName:workerName,
			merSequence:merSequence,
			radioIds:radioIds.join('#'),
			multiIds:multiIds.join('#'),
		};
	
	var load1 = layer.load('保存检测信息，请稍后');
	
	$.post('/order/videoinspect/saveinspection', params, function(data){
		if(data == 'Y'){
			alert('检测信息保存成功');
			window.location.href = '/order/videoinspect/orderinspection?orderNo='+orderNo+'&backUrl='+backUrl;
		}else{
			alert('检测信息保存失败');
			$('#save').bind('click', function(){saveInspection();});
		}
	});
}

/**
 * 订单复检，跳转到订单复检页面
 * @return
 */
function reinspectOrder(){
	var orderNo = $('#orderNo').val();
	window.location.href = '/order/videoinspect/orderinspection?orderNo='+orderNo+'&inspectFlag=Y'+'&backUrl='+backUrl;
}

/**
 * 确认检测
 */
function inspectConfirm(){
	var orderNo = $('#orderNo').val()
	if(confirm('确认检测后，订单不能复检。是否已确认检测结果？')){
		$('#inspectConfirm').unbind('click');
		var orderNo = $('#orderNo').val();
		$.post('/order/videoinspect/confirminspection', {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				window.location.href = '/order/videoinspect/index';
			}else{
				alert('确认检测失败：'+data);
				$('#inspectConfirm').bind('click', function(){inspectConfirm();});
			}
		});
	}
}

/**
 * 错误对话框
 * @param msg
 * @return
 */
function errorBox(msg){
	layer.open({
		type: 1,
		skin: 'layui-layer-rim', //加上边框
		area: ['280px','240px'], //宽高
		content: msg
	});
}
/**
 * 通知对话框
 * @param msg
 * @return
 */
function messagesBox(msg){
	 layer.open({
		type: 1,
		skin: 'layui-layer-rim', //加上边框
		area: ['280px','240px'], //宽高
		content: msg
	});
}