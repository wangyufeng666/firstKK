$().ready(function(){
	$('#btnPayInfo').click(function(){
		layer.open({
			type:2,
			title:'查看支付信息',
			shadeClose:true,
			content:'/rentrecy/order/payinfos?orderNo='+baseParams.orderNo,
			area:['800px','500px'],
			close:function(index){
				layer.close(index);
			}
		});
	});
	
	//绑定事件-保存回收单按钮
	$('.btnSaveIdentify').bind('click', function(){saveRecyOrder($(this).attr('id'));});
	
	//关联回收商品
	$('#btnChangeRecyMer').click(function(){
		layer.open({
			type:2,
			title:'回收商品搜索',
			shadeClose:true,
			content:'/product/cooperate/merlist',
			area:['800px','500px'],
			close:function(index){
				layer.close(index);
			}
		});
	});
	
	//关联鉴定规则
	$('#btnChangeIdentifyRule').click(function(){
		layer.open({
			type:2,
			title:'鉴定规则搜索',
			shadeClose:true,
			content:'/rentrecy/rule/rulelistpage',
			area:['800px','500px'],
			close:function(index){
				layer.close(index);
			}
		});
	});
	
	//加载回收规则
	if(baseParams.recyRuleId != ''){
		//loadRecyRule();
	}
	
	//加载鉴定规则
	if(baseParams.identifyRuleId != ''){
		loadIdentifyRule();
	}
});

/**
 * 获取layer页面传回的商品信息
 * @param merId
 * @param p_merInfo
 * @returns
 */
function getSelectMer(merId, p_merInfo){
	var merName = '';
	var merName = p_merInfo['PNAME']+' '+p_merInfo['MERNAME'];
	layer.closeAll('iframe');
	$('#recyMerInfoSpan').html('回收商品名称：'+merName);
	$('#recyMerId').val(merId);
	
	//归还商品关联回收商品
	$.post('/rentrecy/recyorder/savemerrelation', {skuCode:baseParams.skuCode, recyMerId:merId}, function(data){
		if(data !== 'Y'){
			layer.msg(data);
		}else{
			layer.msg('商品关联成功');
		}
	});
	
	$('#recyRuleId').val(p_merInfo['SSLXID']);
	//重新加载回收规则，目前不需要回收规则
	//loadRecyRule();
}
/**
 * 获取layer页面传回的商品信息
 * @param merId
 * @param p_merInfo
 * @returns
 */
function getSelectIdentifyRule(ruleId, p_ruleInfo){
	var ruleName = p_ruleInfo['RULENAME'];
	layer.closeAll('iframe');
	$('#identifyRuleSpan').html('鉴定规则名称：'+ruleName);
	$('#identifyRuleId').val(ruleId);
	
	//归还商品关联回收商品
	$.post('/rentrecy/recyorder/saverulerelation',
		{skuCode:baseParams.skuCode, identifyRuleId:ruleId, identifyNo:baseParams.identifyNo},
		function(data){
			if(data !== 'Y'){
				layer.msg(data);
			}else{
				layer.msg('鉴定规则关联成功');
			}
		}
	);
	
	$('#identifyRuleId').val(ruleId);
	//重新加载鉴定规则
	loadIdentifyRule();
}

//加载回收规则，暂未使用，保留【勿删】
function loadRecyRule(){
	layerIndex = layer.msg('回收规则加载中', {icon:16, shade:0.1, time:20000});
	var recyRuleId = $('#recyRuleId').val();
	$.post('/rentrecy/recyorder/recyrule',{recyRuleId:recyRuleId},function(data){
		layer.close(layerIndex);
		if(data){
			var html = '', typeHtml = '', indexQ = 1;
			for(var i in data){
				var details = data[i].DETAILS;
				typeHtml = '<span class="green">(单选)</span>';
				if(data[i].CHOICEMODE == 'C'){
					typeHtml = '<span class="blue">(多选)</span>';
				}
				html += '<div class="item" type="'+data[i].CHOICEMODE+'">';
				html += '  <div class="title">'+indexQ+'、'+data[i].TYPENAME+'  '+typeHtml+'</div>';
				indexQ++;
				
				if(details){
					html += '<ul class="selects clearfix" type="'+data[i].CHOICEMODE+'" title="'+data[i].TYPENAME+'">';
					for(var d in details){
						html += '<li class="option" id="'+details[d].DETAILID+'" title="'+details[d].DETAILNAME+'">'+details[d].DETAILNAME+'</li>';
					}
					html += '</ul>';
				}
				html += '</div>';
			}
			$('#recyRuleBox').html(html);
			//delegate
			$('#recyRuleBox .selects').delegate('.option', 'click', function(){
				if($(this).parent().attr('type') == 'R'){//单选
					if($(this).hasClass('checked')){
						
					}else{
						$(this).siblings().removeClass('checked');
						$(this).addClass('checked');
					}
				}else if($(this).parent().attr('type') == 'C'){//多选
					$(this).toggleClass('checked');
				}
			});
		}
	});
}

//加载回收规则
function loadIdentifyRule(){
	layerIndex = layer.msg('归还规则加载中', {icon:16, shade:0.1, time:20000});
	var identifyRuleId = $('#identifyRuleId').val();
	$.post('/rentrecy/rule/identifyrule',{identifyRuleId:identifyRuleId},function(data){
		layer.close(layerIndex);
		if(data){
			var html = '', typeHtml = '', indexQ = 1, question = {}, answers = [];
			var qId = '', qName = '', qType = '', aId = '', aName='', aFlag = '', deductType='', deductValue='';
			for(var i in data){
				var question = data[i];
				qId = question.questionId;
				qName = question.questionName;
				qType = question.selectMode;
				
				typeHtml = '<span class="green">(单选)</span>';
				if(qType == 'C'){
					typeHtml = '<span class="blue">(多选)</span>';
				}
				html += '<div class="item">';
				html += '  <div class="title">'+indexQ+'、'+qName+'  '+typeHtml+'</div>';
				indexQ++;
				answers = question.answers;
				if(answers){
					html += '<ul class="selects clearfix" id="'+qId+'" type="'+qType+'" title="'+qName+'">';
					for(var d in answers){
						aId = answers[d].answerId;
						aName = answers[d].answerName;
						aFlag = answers[d].exception;
						deductType = answers[d].deductType;
						deductValue = answers[d].deductValue;
						
						html += '<li class="option" id="'+aId+'" title="'+aName+'" exception="'+aFlag+'" deductType="'+deductType+'" deductValue="'+deductValue+'">'+aName+'</li>';
					}
					html += '</ul>';
				}
				html += '</div>';
			}
			$('#identifyRuleBox').html(html);
			//delegate
			$('#identifyRuleBox .selects').delegate('.option', 'click', function(){
				if($(this).parent().attr('type') == 'R'){//单选
					if($(this).hasClass('checked')){
						
					}else{
						$(this).siblings().removeClass('checked');
						$(this).addClass('checked');
					}
				}else if($(this).parent().attr('type') == 'C'){//多选
					$(this).toggleClass('checked');
				}
				//实时统计百分比和绝对值
				var percentVal = 0, absoluteVal = 0;
				$('#identifyRuleBox .selects .option.checked').each(function(){
					var thisVal = parseFloat($(this).attr('deductValue'));
					if($(this).attr('deductType') == 'A'){//绝对值
						absoluteVal = absoluteVal + thisVal;
					}else if($(this).atrr('deductType') == 'P'){//百分比
						percentVal = percentVal + thisVal;
					}
					$('#deductPercentText').html(percentVal+'&nbsp;%');
					$('#deductAbsoluteText').html(absoluteVal+'&nbsp;元');
				});
			});
		}
	});
}

function saveRecyOrder(thisId){
	$('.btnSaveIdentify').unbind('click');
	var orderParams = {}, errorFlag = false;
	orderParams.contacts = $.trim($('#contacts').val());//联系人
	orderParams.mobile = $.trim($('#mobile').val());//联系电话
	orderParams.address = $.trim($('#address').val());//联系地址
	orderParams.orderNo = $.trim($('#orderNo').val());//租赁订单编号
	orderParams.recyMerId = $.trim($('#recyMerId').val());//回收商品ID
	orderParams.recyRuleId = $.trim($('#recyRuleId').val());//回收规则
	orderParams.tradeType = $.trim($('#tradeType').val());//交易类型
	orderParams.rentOrderType = $.trim($('#rentOrderType').val());//租赁订单类型
	orderParams.identifyRuleId = $.trim($('#identifyRuleId').val());//租赁鉴定规则ID
	orderParams.identifyReturnFlag = 'Y';//鉴定归还标记，默认是可归还
	orderParams.dueAmount = 0;
	//联系人
	if(orderParams.contacts == ''){
		layer.msg('联系人不能为空');
		errorFlag = true;
	}
	//联系电话
	if(orderParams.mobile == ''){
		layer.msg('联系电话不能为空');
		errorFlag = true;
	}
	//地址
	if(orderParams.address == ''){
		layer.msg('联系地址不能为空');
		errorFlag = true;
	}
	//预约时间
	if(orderParams.visitTime == ''){
		layer.msg('预约时间不能为空');
		errorFlag = true;
	}
	if(errorFlag){
		$('.btnSaveIdentify').bind('click', function(){saveRecyOrder($(this).attr('id'));});
		return;
	}
	
	var rentQuestions = [], recyAttrDescs = '';
	
	//鉴定规则选项
	$('#identifyRuleBox .selects').each(function(){
		
		var question = {};
		question.questionId = $(this).attr('id');
		question.questionName = $(this).attr('title');
		question.selectMode = $(this).attr('type');
		question.exceptionFlag = 'N';
		var answers = [], answerValues = [], answerValue = '无';
		
		$('.option.checked', $(this)).each(function(){
			var answer = {};
			answer.answerId = $(this).attr('id');
			answer.answerName = $(this).attr('title');
			answer.exceptionFlag = $(this).attr('exception');
			answer.deductType = $(this).attr('deductType');
			answer.deductValue = parseFloat($(this).attr('deductValue'));
			
			orderParams.dueAmount = orderParams.dueAmount + answer.deductValue;
			
			if(answer.exceptionFlag == 'Y'){
				question.exceptionFlag = 'Y';
				orderParams.identifyReturnFlag = 'N';
			}
			answers.push(answer);
			answerValues.push(answer.answerName);
		});
		
		if(answerValues.length > 0){
			answerValue = answerValues.join('、');
		}
		recyAttrDescs += question.questionName+':'+answerValue+';';
		
		if(question.selectMode == 'R'){//单选
			if(answers.length != 1){
				alert('无效的租赁鉴定选项：'+$(this).attr('title'));
				errorFlag = true;
			}
		}
		if(errorFlag){
			return false;
		}
		question.answers = answers;
		rentQuestions.push(question);
	});
	
	if(errorFlag){
		$('.btnSaveIdentify').bind('click', function(){saveRecyOrder($(this).attr('id'));});
		return;
	}
	
	var recyQuestions = [];
	//回收规则选项
	$('#recyRuleBox .selects').each(function(){
		var question = {}, answers = [];
		question.name = $(this).attr('title');
		question.type = $(this).attr('type');
		question.answers = [];
		
		$('.option.checked', $(this)).each(function(){
			answers.push({id:$(this).attr('id'), name:$(this).attr('title')});
		});
		
		if(question.type == 'R'){//单选
			if(answers.length != 1){
				alert('无效的回收鉴定选项：'+$(this).attr('title'));
				errorFlag = true;
			}
		}
		if(errorFlag){
			return false;
		}
		question.answers = answers;
		recyQuestions.push(question);
	});
	
	if(errorFlag){
		$('.btnSaveIdentify').bind('click', function(){saveRecyOrder($(this).attr('id'));});
		return;
	}
	orderParams.dueAmount = 0 - orderParams.dueAmount;
	orderParams.rentQuestions = rentQuestions;//租赁鉴定结果
	orderParams.recyAttrDescs = recyAttrDescs;//回收鉴定结果
	
	orderParams.operFlag = 'SAVE';//保存操作

	if(thisId == 'btnSaveConfirmOrder'){
		orderParams.operFlag = 'SAVE_CONFIRM';//保存并确认
	}


	$.ajax({
		url:'/rentrecy/newrecyorder/boxinfos',
		data:orderParams,
		type:"post",
		dataType:'html',
		success:function(result){
			layer.open({
				type:1,
				title:'请选择库位',
				content:result,
				shadeClose:false,
				shade:0.8,
				area:['800px' , '500px'],
				close:function(index){
					console.log(index);
					layer.close(index);
				}
			});
			//if(data.result == 'Y'){
			//	alert('保存鉴定信息成功');
			//	if(orderParams.operFlag == 'SAVE_CONFIRM') {
			//		//保存并确认，添加库位
            //
			//	}else {
			//		//parent.reload();
			//		window.location.href = '/rentrecy/order/orderinfo?orderNo='+orderParams.orderNo;
			//	}
			//}else{
			//	alert('保存鉴定信息失败：'+data.msg);
			//}
		}
	});
}

function chooseBox($orderNo) {

}