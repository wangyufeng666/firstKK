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
	if($('#zhongliang').length){
		var zhongliang = $('#zhongliang').val();
		zhongliang = Number(zhongliang);
		if(!(zhongliang)){
			layer.alert('请输入重量', {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
			oper = false;
			return false;
		}
		params = {orderNo:orderNo, radioIds:radioIds.join('#'), multiIds:multiIds.join('#'),zhongliang:zhongliang};
	}
	
	if(oper){
		$('#addPriceArea').show();
		var load1 = layer.load('加载中...');
		
		var eventCode = $('#eventCode').val();
		
		$.post('/rent/recyorder/getmerquote', params, function(data){
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
		layer.alert('还有未选择的选项', {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
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
		layer.alert('请先询价，询价后选择兑换的活动', {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
		$('#save').bind('click', function(){saveInspection();});
		return;
	}
	
	//检测人
	var workerId = $("#worker").val();
	var workerName = $("#worker option:selected").text();
	var addPrice = $('#addPrice').val();
	if(workerId == ''){
		layer.alert('请选择检测员', {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
		$('#save').bind('click', function(){saveInspection();});
		return;
	}
	var reg = /^(-)?\d+$/;
	if(!reg.test(addPrice)){
		layer.alert('用户补贴非法输入', {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
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
		layer.alert('请选择器材描述。', {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
		$('#save').bind('click', function(){saveInspection();});
		return;
	}
	var beyondExpressFee ='';
	if($('#deductExpressFee').hasClass('select')){
		beyondExpressFee = $('#beyondExpressFee').val();
	}
	var orderNo = $('#orderNo').val();
	var merSequence = $('#merSequence').val();
	//化妆品等级
	var merLevel = '';
	if(merLevelFlag == 'Y'){
		merLevel = $('.cz_level .on').attr('data-id');
		if(merLevel != 'A' && merLevel != 'B' && merLevel != 'C'){
			layer.alert('请选择等级', {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
			$('#save').bind('click', function(){saveInspection();});
			return;
		}
	}
	var params = {
			merId:merId,
			orderNo:orderNo,
			workerId:workerId,
			workerName:workerName,
			merSequence:merSequence,
			addPrice:addPrice,
			radioIds:radioIds.join('#'),
			multiIds:multiIds.join('#'),
			beyondExpressFee:beyondExpressFee,
			merLevel:merLevel
		};
	
	if($('#zhongliang').length){
		var zhongliang = $('#zhongliang').val();
		zhongliang =  Number(zhongliang);
		if(!(zhongliang)){
			layer.alert('请输入重量', {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
			oper = false;
			return false;
		}
		params.zhongliang = zhongliang;
	}
	var load1 = layer.load('保存检测信息，请稍后');
	
	$.post('/rent/recyorder/saveinspection', params, function(data){
		if(data == 'Y'){
			layer.alert('检测信息保存成功', {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
			window.location.href = '/rent/recyorder/orderinspection?orderNo='+orderNo+'&backUrl='+backUrl;
		}else{
			layer.alert('检测信息保存失败', {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
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
	window.location.href = '/rent/recyorder/orderinspection?orderNo='+orderNo+'&inspectFlag=Y'+'&backUrl='+backUrl;
}

/**
 * 确认检测
 */
function inspectConfirm(){
	var orderNo = $('#orderNo').val()
	var sendmessage = $('#sendmessage').val();
	var sendMsgCheckFlag = $('input:checkbox[name="sendmessage"]').attr('checked');
	var boxdetailcode = $('.det-no.selected').attr('no-data');
	var abnormInfo = $('.abnorm_desc_old').text();
	var flag = 'N';
	abnormInfo=abnormInfo.replace(/\ +/g,"");	 //去掉空格
	abnormInfo=abnormInfo.replace(/[ ]/g,"");    //去掉空格
	abnormInfo=abnormInfo.replace(/[\r\n]/g,""); //去掉回车换行
	if(inquiryPrice == inspectionPrice){
		flag = 'Y';
	}else if(abnormInfo != '' && abnormInfo != null){
		flag = 'Y';
	}
	if(flag == 'Y'){
		if(tradetype == '2' && inspectFlag != 'Y' && orderStatus == '3'){
			layer.open({
				type:2,
				title:'请选择货箱位',
				content:'/rent/recyorder/boxinfos?orderNo='+orderNo+'&sendMsgCheckFlag='+sendMsgCheckFlag,
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
				$.post('/rent/recyorder/confirminspection', {orderNo:orderNo,sendMsgCheckFlag:sendMsgCheckFlag}, function(data){
					if(data == 'Y'){
						//messagesBox("订单已确认检测");
						window.location.reload();
					}else{
						layer.alert('确认检测失败：'+data, {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
						$('#inspectConfirm').bind('click', function(){inspectConfirm();});
					}
				});
			}
		}
	}else{
		layer.alert('请选填异常描述！', {skin: 'layui-layer-lan',closeBtn: 0 ,anim: 5 });
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