var answerTips = [];
$().ready(function(){
	$('#save').bind('click', function(){saveInspection();});//保存检测单
	$('#btn-search').bind('click', function(){getMerQuote();});//获取报价
	$('#reinspect').bind('click', function(){reInspectOrder();});//订单复检
	$('#inspectConfirm').bind('click', function(){inspectConfirm();});//确认检测
	$('#merPassword').bind('click', function(){needmerPassword();});//需要开机密码
	
	//加载出当前规则下，所有答案项的快捷描述问题
	loadRecyRuleShortcutQuestions(recyRuleId);
	/**
	 * 单选项选择事件
	 */
	$('.inspectItem').change(function(){
		
		var answerId = $(this).val();
		var questionId = $(this).attr('data_id');
		var tipName = $(this).attr('title');
		
		var parentItemId = $(this).parent().attr('id');
		
		if(answerId != ''){
			$(this).removeClass('error');//移除错误显示标记
			
			if(inquiryDescIds.indexOf(answerId) == -1){
				addDifferentHtml('R', questionId, answerId, tipName);
				
				$('#'+parentItemId+' .differentSpan').show();
			}else{
				$('#'+parentItemId+' .differentSpan').hide();
				$('#tipBoxs_'+questionId).empty();
			}
		}else{
			$(this).siblings('.differentSpan').hide();
			$(this).siblings('.tipBoxs').empty();
		}
	});
	
	/**
	 * 多选框点击事件
	 */
	$('.multiItem .check-box').click(function(e){
		var ev = e || window.event;
		var elm = ev.target || ev.srcElement;
		if(elm.tagName === 'INPUT'){
			var questionId = $(this).attr('data_qid');
			if($(this).prop('checked')){
				addDifferentHtml('M', questionId, $(this).val(), $(this).attr('title'));
			}else{
				$('.errBox_'+$(this).val()).remove();
			}
		}
	});
	
	//扣除快递费
	$("#deductExpressFee").bind('click',function(){
		if($(this).hasClass('select')){
			$(this).removeClass('select');
		}else{
			$(this).addClass('select');
		}
	});
	
	/**
	 * 修改产品信息
	 * create by zhuhaili
	 * create date 2017-6-28
	 */
	$("#merMoreBtn").click(function(){
		layer.open({
			type:2,
			title:'商品选择',
			content:'/order/product/index?merId='+merId+'&orderNo='+orderNo+'&typeId='+merType+'&pCode='+pCode,
			area:['700px', '450px'],
		});
	});
	
	//检测异常信息
	$('#abnormalText').change(function(){
		$('#abnormalDesc').hide();
		if($(this).val() == 'other'){
			$('#abnormalDesc').show();
		}
	});
	
	$('.cz_level span').on('click',function(){
		$('.cz_level span').removeClass('on');
		$(this).addClass('on');
	});
	
	//验证码打印
	$('#qrcodeBtn').click(function(){
		var url = '/order/order/qrcode?orderNo='+orderNo;
		layer.open({
			type:2,
			title:'二维码打印',
			shadeClose:false,
			shade:0.8,
			content:url,
			area:['300px', '370px'],
			close:function(index){
				layer.close(index);
			}
		});
	});
	
	$("#stopOrderInspection").click(function(){
		layer.open({
			type:2,
			title:'终止检测原因选择',
			content:'/order/order/stoporderinspection?orderNo='+orderNo,
			shadeClose:false,
			shade:0.8,
			area:['400px' , '250px'],
			close:function(index){
				layer.close(index);
			}
		});
	});
	
	$('.diffBox img').click(function(){
		var imgSrc = $(this).attr('max_src');
		layer.open({
			type:1
			,title:false
			,closeBtn:0
			,skin:'layui-layer-nobg'
			,shadeClose:true
			,content:'<img src="'+imgSrc+'" onclick="window.open(\''+imgSrc+'\');">'
			,scrollbar:false
			,area:['80%']
		})
	})
});

/**
 * 保存检测明细对应问题项成功
 */
function saveAnswerTipSuccess(answerId, title, description){
	
	var array = answerTips[answerId] || [];
	array.push({DESCRIPT:description, TITLE:title, RULE_ANSWERID:answerId});
	answerTips[answerId] = array;
	
	var html = '<option value="'+title+'" data_name="'+title+'" data_desc="'+description+'">'+title+'</option>';
	$('#select_'+answerId).append(html);
	layer.closeAll('iframe');
}

/**
 * 加载规则下所有检测明细的快捷异常提示项
 * @param recyRuleId
 * @returns
 */
function loadRecyRuleShortcutQuestions(recyRuleId){
	$.ajax({
		type:'POST'//请求方式
		,url:"/recycle/inspection/diffrentanswertips" //请求路径
		,data:{recyRuleId:recyRuleId} //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			answerTips = data;
		}
	});
}

/**
 * 加载异常提示项
 * @param questionId
 * @param answerId
 * @returns
 */
function addDifferentHtml(selectType, questionId, answerId, tipName){
	if(answerId){
		var data = [];
		if($.inArray(answerTips, answerId) < 0){
			data = answerTips[answerId];
		}
		
		var html = '<div class="errBox errBox_'+answerId+'"><span>请填写  <span class="red">'+tipName+'</span>  描述信息</span><br/>';
		html += '   <select class="questionList" id="select_'+answerId+'"><option value="">请选择</option>';
		if(data){
			for(var i in data){
				html += '<option value="'+data[i].TITLE+'" data_name="'+data[i].TITLE+'" data_desc="'+data[i].DESCRIPT+'">'+data[i].TITLE+'</option>';
			}
		}
		html += '</select><span data_id="'+answerId+'" class="addButton">+添加</span><br/>';
		html += '<textarea class="textTipArea" data_id="'+answerId+'" rows="3" cols="50"></textarea></div>';
		
		if(selectType == 'R'){//单选
			$('#tipBoxs_'+questionId).empty().append(html);
		}else{
			$('#tipBoxs_'+questionId).append(html);
		}
		
		//change事件
		$('#inspectArea .errBox .questionList').unbind('change');
		$('#inspectArea .errBox .questionList').bind('change', function(){
			var desc = $('option:selected', $(this)).attr('data_desc');
			$(this).siblings('.textTipArea').val(desc);
		});
		
		//按钮点击事件
		$('#inspectArea .errBox .addButton').unbind('click');
		$('#inspectArea .errBox .addButton').bind('click', function(){
			answerId = $(this).attr('data_id');
			layer.open({
				type:2,
				title:'新增问题项',
				shadeClose:false,
				shade:0.8,
				content:'/recycle/inspection/addanswertip?answerId='+answerId+'&merType='+merType,
				area:['600px','400px'],
				close:function(index){
					layer.close(index);
				}
			});
		});
	}
}

//询价信息展示
function showInquiryInfo(){
	$('#inquiryBox').toggle();
}

//特殊备注
function specialRemarks(){
	layer.open({
		type:2,
		title:'订单备注',
		content:'/order/order/specialremarks?orderNo='+orderNo,
		area:['600px', '400px']
	});
}

function num(obj){
	obj.value = obj.value.replace(/[^\d.]/g,"");
	obj.value = obj.value.replace(/^\./g,""); 
	obj.value = obj.value.replace(/\.{2,}/g,".")
	obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
}

//开机密码
function needmerPassword(){
	if(confirm("是否需要用户提供开机密码？")){
		$.post("/order/order/needmerpassword", {orderNo:orderNo}, function(data){
			if(data == 'Y'){
				window.location.reload();
			}else{
				layer.msg(data);
			}
		});
	}
}

/**
 * 重新补单
 */
function reCreateOrder(){
    layer.open({
        type:2,
        title:'重新下单',
        shadeClose:false,
        shade:0.8,
        content:'/order/recreate/recreateorder?orderNo='+orderNo,
        area:['100%','100%'],
        close:function(index){
            layer.close(index);
        }
    });
}

//返回
function goBack(){
}

//保存备注
function saveRemark(){
	var orderRemark = $.trim($('#orderRemark').val());
	if(orderRemark != ''){
		$.post('/order/order/insertremark',{orderNo:orderNo, orderRemark:orderRemark},function(data){
			if(data == 'Y'){
				$('#orderRemarks').append('<br>'+orderRemark);
			}
		});
	}else{
		layer.msg('请输入备注信息');
	}
}

//器材询价
function getMerQuote(){
	var operFlag = true;
	var radioIds = [];
	var multiIds = [];
	
	//单选描述
	$('.inspectItem').each(function(){
		if($(this).val() == ''){
			operFlag = false;
			$(this).addClass('error');
		}else{
			radioIds.push($(this).val());
		}
	});
	
	//多选描述
	$('.check-box:checked').each(function(){
		multiIds.push($(this).val());
	});
	var params = {orderNo:orderNo, radioIds:radioIds.join('#'), multiIds:multiIds.join('#')};
	if($('#unit').length){
		var unit = Number($('#unit').val());
		
		if(!unit){
			layer.msg('请输入重量');
			operFlag = false;
			return false;
		}
		params.unit = unit;
	}
	
	if(!operFlag){
		layer.msg('还有未选择的选项');
		return;
	}
	
	$('#addPriceArea').show();
	var load1 = layer.load('获取报价中，请稍后');
	
	var eventCode = $('#eventCode').val();
	
	$.post('/order/order/getmerquote', params, function(data){
		layer.close(load1);
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
				htmlActives += "<label><input name='events' type='radio' "+checked+" value='"+code+"' data_val='"+price+"'/>"+name+"("+price+")</label>&nbsp;&nbsp;";
			}
			$('#eventLabel').html(htmlActives);
			var inquiryMerprice = $('#inquiryMerprice').val();
			var inspectionMerPirce = data.merPrice;
			$('#differRate').html('(异价比:<span> '+Math.round((inquiryMerprice - inspectionMerPirce)*100/inquiryMerprice)+'%</span>)');
		}else{
			alert('获取报价失败，请联系品类进行报价');
		}
	});
}

/**
 * 保存检测结果
 */
function saveInspection(){
	//所选活动
	var eventCode = $('input[name="events"]:checked').val();
	if($('#eventLabel').html() == '' || eventCode == ''){
		layer.msg('请先询价，询价后选择兑换的活动');
		return false;
	}
	
	//检测人
	var workerId = $("#worker").val();
	var workerName = $("#worker option:selected").text();
	var addPrice = $('#addPrice').val();
	if(workerId == ''){
		layer.msg('请选择检测员');
		return false;
	}
	
	var reg = /^(-)?\d+$/;
	if(!reg.test(addPrice)){
		layer.msg('用户补贴非法输入');
		return false;
	}
	
	//器材描述
	var operFlag = true, radioIds = [], multiIds = [];
	
	//单选描述
	$('.inspectItem').each(function(){
		if($(this).val() == ''){
			operFlag = false;
			$(this).addClass('error');
		}else{
			radioIds.push($(this).val());
		}
	});
	
	//多选描述
	$('.check-box:checked').each(function(){
		multiIds.push($(this).val());
	});
	
	if(!operFlag){
		layer.msg('请选择器材描述');
		return false;
	}
	
	var beyondExpressFee ='';
	if($('#deductExpressFee').hasClass('select')){
		beyondExpressFee = $('#beyondExpressFee').val();
	}
	var merSequence = $('#merSequence').val();//商品串码
	
	//商品等级
	var merLevel = $('.cz_level .on').attr('data-id');
	if(merLevel != 'S' && merLevel != 'A' && merLevel != 'B' && merLevel != 'C' && merLevel != 'D' && merLevel != '无'){
		layer.msg('请选择等级');
		return false;
	}
	
	var answerTips = [];
	//异常选项描述
	$('.tipBoxs .textTipArea').each(function(){
		var answerTip = {};
		answerTip.answerId = $(this).attr('data_id');
		answerTip.description = $.trim($(this).val());
		if(answerTip.description != ''){
			console.log(answerTip.description.length);
			answerTips.push(answerTip);
		}
	});
	
	var params = {
			merId:merId,
			orderNo:orderNo,
			workerId:workerId,
			workerName:workerName,
			merSequence:merSequence,
			addPrice:addPrice,
			recyRuleId:recyRuleId,
			radioIds:radioIds.join('#'),
			multiIds:multiIds.join('#'),
			beyondExpressFee:beyondExpressFee,
			merLevel:merLevel
	};
	
	if($('#unit').length){
		var unit = Number($('#unit').val());
		if(!(unit)){
			layer.msg('请输入重量');
			return false;
		}
		params.unit = unit;
	}
	
	//价格不一致时，提示选择异常描述
	var inspectPrice = Number($(':radio[name="events"]:checked').attr('data_val'));
	var eventCode = $(':radio[name="events"]:checked').val();
	
	var abnormalText = $('#abnormalText').val();
	if(abnormalText && abnormalText != ''){
		if(abnormalText == 'other'){
			abnormalText = $('#abnormalDesc').val();
		}
	}
	
	if(inspectPrice < inquiryPrice && abnormalText == ''){
		layer.msg('请选择或手动填写异常信息');
		return false;
	}
	
	params.abnormalText = abnormalText;
	params.answerTips = answerTips;
	
	var load1 = layer.load('保存检测信息，请稍后');
	$('#save').unbind('click');
	$.post('/order/order/saveinspection', params, function(data){
		layer.close(load1);
		if(data == 'Y'){
			layer.msg('检测信息保存成功');
			window.location.href = '/idlefishpai/recyorder/orderinspection?orderNo='+orderNo+'&layer=Y';
		}else{
			layer.msg('检测信息保存失败');
		}
		$('#save').bind('click', function(){saveInspection();});
	});
}

/**
 * 订单复检，跳转到订单复检页面
 * @return
 */
function reInspectOrder(){
	window.location.href = '/idlefishpai/recyorder/orderinspection?orderNo='+orderNo+'&inspectFlag=Y&layer=Y';
}

/**
 * 确认检测
 */
function inspectConfirm(){
	var sendMsgCheckFlag = $('input:checkbox[name="sendmessage"]').attr('checked');
	
	//快递交易
	if(tradeType == '2' && inspectFlag != 'Y' && orderStatus == '3'){
		layer.open({
			type:2,
			title:'请选择库位',
			content:'/idlefishpai/recyorder/boxinfos?orderNo='+orderNo+'&sendMsgCheckFlag='+sendMsgCheckFlag+"&orderSource="+orderSource,
			shadeClose:false,
			shade:0.8,
			area:['800px' , '500px'],
			close:function(index){
				layer.close(index);
			}
		});
	}
}

