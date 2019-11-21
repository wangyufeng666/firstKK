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
        $.post('/warehouse/maintain/getmerquote', params, function(data){
			if(data.providerId != null && data.result == 'Y'){
				var htmlActives = "";
				var price = data.merPrice;
				htmlActives = "<label>"+price+"元</label>";
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
	var reg = /^(-)?\d+$/;
	if(!reg.test(addPrice)){
		errorBox('用户补贴非法输入');
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
    var params = {orderNo:orderNo, workerId:workerId, workerName:workerName, addPrice:addPrice,
    		radioIds:radioIds.join('#'), multiIds:multiIds.join('#')};
    
    var load1 = layer.load('保存检测信息，请稍后');
    $.post('/warehouse/maintain/saveshipment', params, function(data){
    	if(data == 'Y'){
    		alert('检测信息保存成功');
    		window.location.href = '/warehouse/maintain/ordermaintain?orderNo='+orderNo;
    	}else{
    		alert('检测信息保存失败');
    		$('#save').bind('click', function(){saveInspection();});
    	}
    });
}

/**
 * 订单复检，跳转到订单再次维修页面
 * @return
 */
function remaintainOrder(){
    var orderNo = $('#orderNo').val();
    var backUrl = '/warehouse/maintain/ordermaintain?orderNo='+orderNo;
	window.location.href = '/warehouse/maintain/ordermaintain?orderNo='+orderNo+'&maintainFlag=Y&backUrl='+backUrl;
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