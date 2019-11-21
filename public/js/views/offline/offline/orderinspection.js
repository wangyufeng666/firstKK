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
    
    if(oper){
    	$('#addPriceArea').show();
    	var load1 = layer.load('加载中...');
    	var orderNo = $('#orderNo').val();
    	var eventCode = $('#eventCode').val();
    	var params = {orderNo:orderNo, radioIds:radioIds.join('#'), multiIds:multiIds.join('#')};
        $.post('/order/offline/getmerquote', params, function(data){
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
	//所选活动
	var eventCode = $('input[name="events"]:checked').val();
	if($('#eventLabel').html() == '' || eventCode == ''){
		errorBox("请先询价，询价后选择兑换的活动");
		return;
	}
	
	//检测人
	var workerId = $("#worker").val();
	var workerName = $("#worker option:selected").text();
	var addPrice = $('#addPrice').val();
	if(workerId == ''){
		errorBox("请选择检测员");
		return;
	}
	var reg = /^(-)?\d+$/;
	if(!reg.test(addPrice)){
		errorBox('用户补贴非法输入');
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
    	return;
    }
    var orderNo = $('#orderNo').val();
    var merSequence = $('#merSequence').val();
    var params = {orderNo:orderNo,
    		workerId:workerId,
    		workerName:workerName,
    		merSequence:merSequence,
    		addPrice:addPrice,
    		radioIds:radioIds.join('#'),
    		multiIds:multiIds.join('#')};

	$('#save').unbind('click');
    var load1 = layer.load('保存检测信息，请稍后');
    $.post('/order/offline/saveinspection', params, function(data){
    	if(data == 'Y'){
    		alert('检测信息保存成功');
    		window.location.href = '/order/order/orderinspection?orderNo='+orderNo+'&backUrl='+backUrl;
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
	window.location.href = '/order/offline/orderinspection?orderNo='+orderNo+'&inspectFlag=Y'+'&backUrl='+backUrl;
}

/**
 * 确认检测
 */
function inspectConfirm(){
    var orderNo = $('#orderNo').val();	
    var sendmessage = $('#sendmessage').val();
    var sendMsgCheckFlag = $('input:checkbox[name="sendmessage"]').attr('checked');
	//var boxdetailcode = $('.det-no.selected').attr('no-data');
	if(tradetype == '2' && inspectFlag != 'Y' && orderStatus == '3'){
		layer.open({
			type:2,
			title:'请选择库位',
			content:'/order/order/boxinfos?orderNo='+orderNo+'&sendMsgCheckFlag='+sendMsgCheckFlag+"&offlineFlag=Y",
			shadeClose:false,
			shade:0.8,
			area:['800px' , '500px'],
			close:function(index){
				layer.close(index);
			}
		});
	}else{
		if(confirm('确认检测后，订单不能复检。是否已确认检测结果？')){
			$('#inspectConfirm').unbind('click');
			var orderNo = $('#orderNo').val();
			$.post('/order/offline/confirminspection', {orderNo:orderNo,sendMsgCheckFlag:sendMsgCheckFlag}, function(data){
				if(data == 'Y'){
					messagesBox("订单已确认检测");
					window.location.reload();
				}else{
					alert('确认检测失败：'+data);
					$('#inspectConfirm').bind('click', function(){inspectConfirm();});
				}
			});
		}
	}
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
/**
 * 通知对话框
 * @param msg
 * @return
 */
function messagesBox(msg){
    $.layer({
        title:'提示',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}