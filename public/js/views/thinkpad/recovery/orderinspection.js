/**
 * 器材询价
 * @return
 */
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
    	var load1 = layer.load('加载中...');
    	var merId = $('#merId').val();
    	var typeId = $('#typeId').val();
    	var sslxId = $('#sslxId').val();
    	var eventCode = $('#eventCode').val();
    	
        $.post('/thinkpad/order/getmerquote', 
    		{merId:merId, typeId:typeId, sslxId:sslxId, eventCode:eventCode, radioIds:radioIds.join('#'), multiIds:multiIds.join('#')}, 
    		function(data){
    			if(data.providerId != null && parseInt(data.eventPrice) > 0){
    				var htmlActives = "";
    				for(var i = 0; i < data.EVENTS.length; i++){
    					var checked = "";
    					var code = data.EVENTS[i].eventCode;
    					var name = data.EVENTS[i].eventName;
    					var price = data.EVENTS[i].eventPrice;
    					if(eventCode == data.EVENTS[i].eventCode){
    						checked = " checked='checked'";
    					}
    					htmlActives+="<label><input name='events' type='radio' disabled='disabled' "+checked+" value='"+code+"' />"+name+"("+price+")</label>&nbsp;&nbsp;";
    				}
    				$('#eventLabel').html(htmlActives);
    				layer.close(load1);
    			}
    		}
        );
    }
}


/**
 * 保存
 */
function save(){
	//所选活动
	if($('#eventLabel').html() == ''){
		errorBox("请先询价，询价后选择兑换的活动");
		return;
	}else{
		var eventCode = $('input[name="events"]:checked').val();
		if(eventCode== ''){
			errorBox("请先询价，询价后选择兑换的活动");
			return;
		}else{
			$('#eventCode').val(eventCode);
		}
	}
	
	//检测人
	var workerId = $("#worker").val();
	var workerName = $("#worker option:selected").text();
	if(workerId == ''){
		errorBox("检测员不能为空");
		return;
	}
	$('#workerId').val(workerId);
	$('#workerName').val(workerName);
	
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
    
    $('#radioIds').val(radioIds.join('#'));
    $('#multiIds').val(multiIds.join('#'));
    
    if(!oper){
    	errorBox("请选择器材描述。");
    	return;
    }
    $('#inspectionForm').submit();
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