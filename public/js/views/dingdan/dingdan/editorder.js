/**
 * 器材询价
 */
function xunjia(){
	
    var oper = true;
    var radioIds = [];
    var multiIds = [];
    var spId = $('#spId').val();
    var sslxId = $('#sslxId').val();
    
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
    $('.check-box:checked').each(function(){multiIds.push($(this).val());});
        
    if(oper){
    	var rIds = radioIds.join('#');
    	var mIds = multiIds.join('#');
    	//
    	$('#radioIds').val(rIds);
    	$('#multiIds').val(mIds);
    	
    	var load1 = layer.load('加载中...');
        $.post('/dingdan/dingdan/refreshquote', {'spId':spId, 'sslxId':sslxId, 'radioIds':rIds, 'multiIds':mIds}, function(data){
			if(data.PROVIDERID != null && parseInt(data.PRICE) > 0){
				$('#providerId').val(data.PROVIDERID);
				$('#providerPrice').val(data.HSSPRICE);
				$('#orderPrice').val(data.PRICE);
				$('#newPrice').html(data.PRICE);
				layer.close(load1);
			}
		});
    }
}

/**
 * 保存
 */
function save(){
	var load1 = layer.load('保存中...');
	if($('#newPrice').html() == ''){
		layer.close(load1);
		errorBox("请重新选择商品描述并询价。");
		return;
	}
    $('#editForm').submit();
}

/**
 * 返回
 */
function goBack(backUrl){
	window.location.href = backUrl;
}

/**
 * 电话确认
 */
function auditing(orderId, orderNo, tradeType){
	//alert("id:"+orderId);
	//alert("no:"+orderNo);
	//alert("type:"+tradeType);
	//return ;
	if(confirm("是否确认电话确认？")){
		$.ajax({
			type : 'POST'//请求方式
			,url : "/dingdan/dingdan/updatenode"  //请求路径
			,data : {khddid:orderId, orderNo:orderNo, nodeid:'1'}  //发送到服务器的数据
        	,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        	,async : false //同步请求
        	,timeout :60000//默认超时60秒
        	,dataType:'json' //预期服务器返回的数据类型
    		,success : function(data){
        		window.location.href = location;
        	}
		});
	}
}

/**
 * 待用户发货
 */
function delivered(orderId){
	if(confirm('是否确认用户已发货？')){
		$.post('/dingdan/dingdan/delivered', {orderId:orderId}, function(data){
			if(data == 'Y'){
				window.location.href = location;
			}else{
				errorBox('订单状态修改异常');
			}
		});
	}
}

/**
 * 收货操作
 */
function receiving(orderId){
	
	if(confirm('是否确认收货？')){
		$.post('/dingdan/dingdan/receiving', {orderId:orderId}, function(data){
			if(data == 'Y'){
				window.location.href = location;
			}else{
				errorBox('状态修改失败');
			}
		});
	}
}


/**
 * 上门操作
 */
function visiting(orderId){
	if(confirm('是否确认上门？')){
		$.post('/dingdan/dingdan/visiting', {orderId:orderId}, function(data){
			if(data == 'Y'){
				window.location.href = location;
			}else{
				errorBox('订单状态修改错误');
			}
		});
	}
}

/**
 * 检测操作
 */
function inspection(orderId){
	if(confirm('是否确认检测？')){
		$.post('/dingdan/dingdan/inspection', {orderId:orderId}, function(data){
			if(data == 'Y'){
				window.location.href = location;
			}else{
				errorBox('状态修改失败');
			}
		});
	}
}

/**
 * 修改支付信息
 */
function editPayment(orderId, orderNo){
	var src = '/dingdan/dingdan/editpayment?orderId='+orderId+'&orderNo='+orderNo;
	$.layer({
	    type : 2,
	    title : '修改支付信息',
	    iframe : {src : src},
	    area : ['500px' , '360px'],
	    offset : ['50px','']
	});
}

/**
 * 错误对话框
 */
function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}
