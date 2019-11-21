/**
 * 器材询价
 * @return
 */
function xunjia(){
	
    var oper = true;
    var radioIds = [];
    var multiSelectIds = [];
    
    var activeCode = $('#activeCode').val();
    
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
    	multiSelectIds.push($(this).val());
    });
        
    if(oper){
    	var load1 = layer.load('加载中...');
        $.post('/yhd/dingdan/baojia', 
        		{spId:$('#spId').val(), merType:$('#merType').val(), sslxId:$('#sslxId').val(), radioIds:radioIds.join('#'), multiSelectIds:multiSelectIds.join('#')}, 
        		function(data){
        			if(data.PROVIDERID != null && parseInt(data.PRICE) > 0){
        				var htmlActives = "";
        				for(var i = 0; i < data.ACTIVES.length; i++){
        					var checked = "";
        					var code = data.ACTIVES[i].activeCode;
        					var name = data.ACTIVES[i].activeName;
        					var price = data.ACTIVES[i].activePrice;
        					if(activeCode == data.ACTIVES[i].activeCode){
        						checked = "checked='checked'";
        					}
        					htmlActives+="<label><input name='actives' type='radio' disabled='disabled' "+checked+" value='"+code+"' />"+name+"("+price+")</label>&nbsp;&nbsp;";
        				}
        				$('#activeLabel').html(htmlActives);
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
	
	//检测日期
	var date = $('#inspectionDate').val();
	if(date == ''){
		errorBox('检测时间不能为空');	    
		return;
	}
	
	//所选活动
	if($('#activeLabel').html() == ''){
		errorBox("请先询价，询价后选择兑换的活动");
		return;
	}else{
		var activeCode = $('input[name="actives"]:checked').val();
		if(activeCode== ''){
			errorBox("请先询价，询价后选择兑换的活动");
			return;
		}else{
			$('#activeCode').val(activeCode);
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
    var multiSelectIds = [];
    
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
    	multiSelectIds.push($(this).val());
    });
    
    $('#radioIds').val(radioIds.join('#'));
    $('#multiSelectIds').val(multiSelectIds.join('#'));
    
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

