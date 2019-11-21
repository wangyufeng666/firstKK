$().ready(function(){
	//保存检测单
	$('#btnSaveInfo').bind('click', function(){saveInspection('');});
	
	//获取报价
	$('#btnQuoteInfo').bind('click', function(){getMerQuote();});
	
	//需要开机密码
	$('#merPassword').bind('click', function(){needmerPassword();});
	
	//保存并确认检测结果
	$('#btnConfirmSave').bind('click', function(){saveInspection('Y');});
	
	//扣除快递费
	$("#deductExpressFee").bind('click',function(){
		if($(this).hasClass('select')){
			$(this).removeClass('select');
		}else{
			$(this).addClass('select');
		}
	});
	
	//检测项
	$('.inspectItem').change(function(){
		if($(this).val() != ''){
			$(this).removeClass('error');
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
	
	//停止检测
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
	
	$('.copySpan').click(function(e){
		var copyText = '';
		if($(this).prev('select').val() != ''){
			copyText = $(this).prev('select').find("option:selected").text();
		}else{
			layer.msg('请选择后再复制');
			return false;
		}

	    var clipboard = new Clipboard('.copySpan', {
	        text: function() {
	            return copyText;
	        }
	    });

	    clipboard.on('success', function(e) {
	    	layer.msg("复制成功");
	    });

	    clipboard.on('error', function(e) {
	        console.log(e);
	    });
	});
});

initIdentifyRule();
function initIdentifyRule(){
	if(identifyTemplateId == '' || identifyFlag != 'Y'){
		return;
	}
	$.get('/identify/rule/getruleinfo', {ruleId:identifyTemplateId}, function(data){
		if(data == null || data.result !== 'Y'){
			alert('获取鉴定模板失败，请重新选择');
			return false;
		}

		var questions = data.questions || null;

		//无效的鉴定项
		if(questions == null){
			alert('无效的鉴定项');
			return null;
		}

		var qHtml = '', question = {}, typeCode = '', typeTip = '', qId = '', qName='',
			thisHtml = '', answerHtml = '', answers = [], inputType = '', index = 0, imgFlag = '',
			textFlag = '', aId='', aName='',level='',level_seq='';

		for(var i in questions){
			index++;
			question = questions[i];
			typeCode = question.TYPECODE;
			qId = question.QUESTIONID;
			qName = question.QUESTIONNAME;
			answers = question.ANSWERS;
			aId = '';
			answerHtml = '';
			
			if(typeCode == '1'){//单选
				typeTip = '<span class="qTip">(单选)</span>';
			}else if(typeCode == '2'){//多选
				typeTip = '<span class="qTip">(多选)</span>';
			}else if(typeCode == '3'){//文本
				typeTip = '<span class="qTip">(文字)</span>';
			}else if(typeCode == '4'){//图片
				typeTip = '<span class="qTip">(图片)</span>';
			}else if(typeCode == '5'){//图+文
				typeTip = '<span class="qTip">(图片+文字)</span>';
			}

			thisHtml += '<div id="'+qId+'" data_type="'+typeCode+'" class="question" title="'+qName+'">';
			thisHtml += '  <div class="title">'+index+'、'+qName+typeTip+'</div>';
			
			if(typeCode == '1' || typeCode == '2'){//单选项或多选
				inputType = typeCode == '1' ? 'radio' : 'checkbox';
				if(answers){
					for(var j in answers){
						aId = answers[j]['ANSWERID'];
						aName = answers[j]['ANSWERNAME'];
						imgFlag = answers[j]['IMGFLAG'];
						textFlag = answers[j]['TEXTFLAG'];
						level = answers[j]['ANSWER_LEVEL'];
						level_seq = answers[j]['LEVEL_SEQ'];

						var iptArray = new Array();
						iptArray.push('data_id="'+aId+'"');
						iptArray.push('type="'+inputType+'"');
						iptArray.push('name="answer_'+qId+'"');
						iptArray.push('value="'+aId+'"');
						iptArray.push('data_qid="'+qId+'"');
						iptArray.push('title="'+aName+'"');
						iptArray.push('data_exception="'+answers[j]['EXCEPTIONFLAG']+'"');
						iptArray.push('data_imgFlag="'+imgFlag+'"');
						iptArray.push('data_textFlag="'+textFlag+'"');
						iptArray.push('data_level="'+level+'"');
						iptArray.push('data_seq="'+level_seq+'"');

						if(imgFlag == 'Y' && textFlag == 'Y'){
							aName = aName + '<span class="tip">图+文</span>';
						}else if(imgFlag == 'Y'){
							aName = aName + '<span class="tip">图</span>';
						}else if(textFlag == 'Y'){
							aName = aName + '<span class="tip">文</span>';
						}
						answerHtml += '<label><input class="answerItem" '+iptArray.join(' ')+'/>'+aName+'</label>';
						if(typeCode == '2'){//多选
							answerHtml += '<div class="extInfo"></div>';
						}
					}
				}
			}else if(typeCode == '3'){//文本输入
				answerHtml += '<div class="extInfo"><textarea id="ta_'+qId+'" rows="1" cols="60"></textarea></div>';
			}else if(typeCode == '4'){//图片 
				answerHtml += '<div class="extInfo">';
				answerHtml += '  <div qid="'+qId+'" aid="'+aId+'" class="extImgBox clearfix">';
				answerHtml += '    <div class="extImg"><img class="addimg" src="/images/idlefishpai/add.png"></div>';
				answerHtml += '  </div>';
				answerHtml += '</div>';
			}else if(typeCode == '5'){//
				answerHtml += '<div class="extInfo">';
				answerHtml += '  <textarea id="ta_'+qId+'" rows="1" cols="60"></textarea>';
				answerHtml += '  <div qid="'+qId+'" aid="'+aId+'" class="extImgBox clearfix">';
				answerHtml += '    <div class="extImg"><img class="addimg" src="/images/idlefishpai/add.png" /></div>';
				answerHtml += '  </div>';
				answerHtml += '</div>';
			}
			
			if(typeCode == '3' || typeCode == '4' || typeCode == '5'){
				thisHtml += answerHtml;
			}else{
				thisHtml += '<div class="answer">'+answerHtml+'</div>';
			}
			if(typeCode == '1'){//单选
				thisHtml += '<div class="extInfo"></div>';
			}
			//扩展项
			thisHtml += '</div>';
			$('#identifyBox').html(thisHtml);

			//答案项，点击动态添加事件
			$('#identifyBox .question .answerItem').unbind('click');
			$('#identifyBox .question .answerItem').bind('click', function(){
				answerItemClick($(this));
			});
			
			//上传图片插件
			$('#identifyBox .question .addimg').unbind('click');
			$('#identifyBox .question .addimg').bind('click', function(){
				identifyImgUpload($(this));
			});
			
			//文本框获取焦点事件
			$('textarea').focus(function(){
				$(this).css({'border':'1px solid #bfbfbf'});
			});
		}
	});
}

//单选、多选点击事件
function answerItemClick($item){
	var imgFlag = $item.attr('data_imgflag');
	var textFlag = $item.attr('data_textflag');
	var itemType = $item.attr('type');
	
	var qId = $item.attr('data_qid');
	var aId = $item.attr('data_id');
	
	//多选项，如果已存在勾选的多选框，
	if(itemType == 'checkbox'){
		var extInfo = $item.parent().next();
		extInfo.empty();
		if($item.is(':checked')){
			var thisHtml = '';
			if(textFlag == 'Y'){
				thisHtml = '<textarea class="extTextArea" id="note_'+aId+'" data_qid="'+qId+'" rows="1" cols="60"></textarea>';
			}
			if(imgFlag == 'Y'){
				thisHtml += '<div qid="'+qId+'" aid="'+aId+'" class="extImgBox clearfix">';
				thisHtml += '  <div class="extImg"><img class="addimg" src="/images/idlefishpai/add.png"></div>';
				thisHtml += '</div>';
			}
			extInfo.html(thisHtml);
		}
	}else if(itemType == 'radio'){//单选
		var thisHtml = '';
		if(textFlag == 'Y'){
			thisHtml += '<textarea class="extTextArea" id="note_'+aId+'" data_qid="'+qId+'" rows="1" cols="60"></textarea>';
		}
		if(imgFlag == 'Y'){
			thisHtml += '<div qid="'+qId+'" aid="'+aId+'" class="extImgBox clearfix">';
			thisHtml += '  <div class="extImg"><img class="addimg" src="/images/idlefishpai/add.png"></div>';
			thisHtml += '</div>';
		}
		$item.parents('.question').find('.extInfo').html(thisHtml);
	}
	//文本框获取焦点事件
	if(textFlag == 'Y'){
		$('textarea').focus(function(){
			$(this).css({'border':'1px solid #bfbfbf'});
		});
	}

	//上传图片插件
	$('#identifyBox .extInfo .addimg').unbind('click');
	$('#identifyBox .extInfo .addimg').bind('click', function(){
		identifyImgUpload($(this));
	});
}

//询价信息展示
function showInquiryInfo(){
	$('#inquiryArea').toggle();
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
	
	if(!operFlag){
		layer.msg('还有未选择的选项');
		return;
	}
	
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
 * var confirmFlag 确认检测标记
 */
function saveInspection(confirmFlag){
	
	//器材描述
	var operFlag = true, radioIds = [], multiIds = [];
	
	//单选描述
	$('.inspectItem').each(function(){
		if($(this).val() == ''){
			$(this).addClass('error');
			operFlag = false;
		}else{
			radioIds.push($(this).val());
		}
	});

	var errorMsgs = [];
	//所选活动
	var eventCode = $('input[name="events"]:checked').val();
	if($('#eventLabel').html() == '' || eventCode == ''){
		errorMsgs.push('请先询价，询价后选择兑换的活动');
	}
	
	//检测人
	var workerId = $("#worker").val();
	var workerName = $("#worker option:selected").text();
	var addPrice = $('#addPrice').val();
	if(workerId == ''){
		errorMsgs.push('请选择检测工程师');
	}
	
	var reg = /^(-)?\d+$/;
	if(!reg.test(addPrice)){
		errorMsgs.push('用户补贴非法输入');
	}
	
	//多选描述
	$('.check-box:checked').each(function(){
		multiIds.push($(this).val());
	});
	
	if(!operFlag){
		errorMsgs.push('请选择器材描述');
	}
	
	var beyondExpressFee = '';
	if($('#deductExpressFee').hasClass('select')){
		beyondExpressFee = $('#beyondExpressFee').val();
	}
	var merSequence = $('#merSequence').val();//商品串码
	if(merSequence && merSequence.length > 20){
		errorMsgs.push('输入的机器码不能超过20位');
	}
	
	//商品等级
	var merLevel = $('.cz_level .on').attr('data-id');
	if(merLevel != 'S' && merLevel != 'A' && merLevel != 'B' && merLevel != 'C' && merLevel != 'D' && merLevel != '无'){
		errorMsgs.push('请选择商品等级');
	}
	
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

	if(identifyFlag == 'Y'){
		var identifyParams = getOrderIndentifyParams();
		if(identifyParams === false){
			return false;
		}
		params.identifyReportNo = identifyParams.identifyReportNo;//鉴定报告
		params.identifyRemark = identifyParams.identifyRemark;//鉴定备注
		params.identifyTemplateId = identifyParams.identifyTemplateId;//鉴定模板
		params.questions = identifyParams.questions;//鉴定问题列表
	}
	params.identifyFlag = identifyFlag;


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
		errorMsgs.push('请选择或手动填写异常信息');
	}

	if(errorMsgs.length > 0){
		alert(errorMsgs.join("\n"));
		return false;
	}

	params.abnormalText = abnormalText;

	if(confirmFlag == 'Y' && !confirm('确认检测后，订单不能复检。是否已确认检测结果？')){
		return false;
	}

	$('#btnSaveInfo').unbind('click');//防止重复提交
	$('#btnConfirmSave').unbind('click');//防止重复提交

	params.confirmFlag = confirmFlag;

	var load1 = layer.load('保存检测信息，请稍后');
	$.post('/order/order/saveinspection', params, function(data){
		layer.close(load1);
		if(data == 'Y'){
			layer.msg('检测信息保存成功');
			if(confirmFlag == 'Y'){

				var params = {orderNo:orderNo, sendMsgCheckFlag:'Y', orderSource:orderSource, identifyFlag:identifyFlag};
				//快递交易
				if(tradeType == '2' && orderStatus == '3'){
					layer.open({
						type:2,
						title:'请选择库位',
						content:'/order/order/boxinfos?'+$.param(params),
						shadeClose:false,
						shade:0.8,
						area:['800px' , '500px'],
						close:function(index){
							layer.close(index);
						}
					});
				}else{
					$.post('/order/order/confirminspection', params, function(data){
						if(data == 'Y'){
							window.location.reload();
						}else{
							layer.msg('确认检测失败：'+data);
							$('#btnSaveInfo').bind('click', function(){saveInspection('');});
							$('#btnConfirmSave').bind('click', function(){saveInspection('Y');});
						}
					});
				}

			}else{
				window.location.href = '/order/order/orderinfo?orderNo='+orderNo+'&reinspectFlag=Y&identifyFlag='+identifyFlag;
			}
		}else{
			layer.msg('检测信息保存失败：'+data);
		}
		$('#btnSaveInfo').bind('click', function(){saveInspection('');});
		$('#btnConfirmSave').bind('click', function(){saveInspection('Y');});
	});
}

/**
 * 保存鉴定信息
 * @returns
 */
function getOrderIndentifyParams(){
	var submitFlag = true;
	var questions = [];
	var errorMsgs = [];
	var identifyTemplateId = $('#identifyTemplateId').val();
	if(identifyTemplateId == ''){
		errorMsgs.push('无效的鉴定模板');
		submitFlag = false;
	}

	var identifyRemark = $.trim($('#identifyRemark').val());
	if(identifyRemark == ''){
		errorMsgs.push('【专家评论】不能为空');
		$('#identifyRemark').css({'border':'1px solid red'});
		submitFlag = false;
	}else if(identifyRemark.length > 140){
		$('#identifyRemark').css({'border':'1px solid red'});
		errorMsgs.push('【专家评论】不能超过140个字');
		submitFlag = false;
	}
	
	//所有问题遍历
	$('#identifyBox .question').each(function(){
		var thisQId = $(this).attr('id');
		var thisQName = $(this).attr('title');
		var typeCode = $(this).attr('data_type');
		var answers = [], textValue = '';
		var questionExceptionFlag  = 'N';

		if(typeCode == '1'){//单选
			var answerException = 'N';
			var thisATextFlag = '';//文字标记
			$(':radio[name="answer_'+thisQId+'"]:checked').each(function(){
				
				var thisAId = $(this).val();
				textValue = $.trim($('#note_'+thisAId).val());
				
				answerException = $(this).attr('data_exception');
				if(answerException == 'Y'){
					questionExceptionFlag = answerException;
				}
				
				thisATextFlag = $(this).attr('data_textflag');
				if(thisATextFlag == 'Y' && textValue == ''){//文字鉴定备注
					$('#note_'+thisAId).css({'border':'1px solid red'});
					errorMsgs.push('请输入【'+thisQName+'】文本鉴定信息');
					submitFlag = false;
				}
				
				if(textValue.length > 200){
					$('#ta_'+thisAId).css({'border':'1px solid red'});
					errorMsgs.push('【'+thisQName+'】鉴定结果不能超过200个字');
					submitFlag = false;
				}

				answers.push({
					answerId:thisAId,
					answerName:$(this).attr('title'),
					answerException:answerException,
					textValue:textValue,
					answerLevel:$(this).attr('data_level'),//等级标记
					levelSeq:$(this).attr('data_seq'),//等级排序
					textFlag:thisATextFlag,
					imgFlag:$(this).attr('data_imgflag')
				});
			});
			
			if(answers.length == 0){
				errorMsgs.push('请选择【'+thisQName+'】鉴定结果');
				submitFlag = false;
			}
		}else if(typeCode == '2'){//多选
			
			$(':checkbox[name="answer_'+thisQId+'"]:checked').each(function(){
				var thisAId = $(this).val();
				textValue = $.trim($('#note_'+thisAId).val());
				
				thisATextFlag = $(this).attr('data_textflag');
				answerException = $(this).attr('data_exception');
				if(answerException == 'Y'){
					questionExceptionFlag = 'Y';
				}
				if(thisATextFlag == 'Y' && textValue == ''){//必填
					errorMsgs.push('请输入【'+thisQName+'】文本鉴定结果');
					$('#note_'+thisQId).css({'border':'1px solid red'});
					submitFlag = false;
				}
				
				if(textValue.length > 200){
					errorMsgs.push('【'+thisQName+'】鉴定结果不能超过200个字');
					$('#ta_'+thisQId).css({'border':'1px solid red'});
					submitFlag = false;
				}

				answers.push({
					answerId:$(this).val(),
					answerName:$(this).attr('title'),
					answerException:answerException,
					textValue:textValue,
					answerLevel:$(this).attr('data_level'),
					levelSeq:$(this).attr('data_seq'),
					imgFlag:$(this).attr('data_imgflag'),
					textFlag:$(this).attr('data_textflag')
				});
			});
		}else if(typeCode == '3'){//文本
			textValue = $.trim($('#ta_'+thisQId).val());
			if(textValue == ''){
				$('#ta_'+thisQId).css({'border':'1px solid red'});
				errorMsgs.push('请输入【'+thisQName+'】鉴定结果');
				submitFlag = false;
			}else if(textValue.length > 200){
				$('#ta_'+thisQId).css({'border':'1px solid red'});
				errorMsgs.push('【'+thisQName+'】鉴定结果不能超过200个字');
				submitFlag = false;
			}
			answers.push({answerId:'', answerName:'', textValue:textValue});
		}else if(typeCode == '4'){//图片

		}else if(typeCode == '5'){//图片+文字
			textValue = $.trim($('#ta_'+thisQId).val());
			
			if(textValue == ''){
				$('#ta_'+thisQId).css({'border':'1px solid red'});
				errorMsgs.push('请输入【'+thisQName+'】鉴定结果');
				submitFlag = false;
			}else if(textValue.length > 200){
				$('#ta_'+thisQId).css({'border':'1px solid red'});
				errorMsgs.push('【'+thisQName+'】鉴定结果不能超过200个字');
				submitFlag = false;
			}
			answers.push({
				answerId:'',
				answerName:'',
				textValue:textValue,
				imgFlag:'Y',
				textFlag:'Y'
			});
		}
		
		var question = {
				questionId:thisQId,
				questionName:thisQName,
				typeCode:typeCode,
				answers:answers,
				textValue:textValue,
				questionExceptionFlag:questionExceptionFlag
			};
		questions.push(question);
	});
	
	if(!submitFlag){
		alert(errorMsgs.join("\n"));
		return false;
	}
	return {
		identifyTemplateId:identifyTemplateId,
		questions:questions,
		identifyReportNo:identifyReportNo,
		identifyRemark:identifyRemark
	}
}

//添加知识库
function addKnowLedge() {
	layer.open({
		type:2,
		title:'添加知识库',
		content:'/inspect/knowledge/addknowledge',
		shadeClose:false,
		shade:0.8,
		area:['80%' , '80%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function showKnowLedge(category,brand,type) {
	layer.open({
		type:2,
		title:'查看相关知识库',
		content:'/inspect/knowledge/knowledgelist?category='+category+'&brand='+brand+"&type="+type,
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 鉴定图片上传
 * @param obj
 * @returns
 */
function identifyImgUpload(obj){
	var params = {orderNo:orderNo,
			reportNo:identifyReportNo,
			questionId:obj.parents('.extImgBox').attr('qid'),
			answerId:obj.parents('.extImgBox').attr('aid'),
			method:2
	};
	
	layer.open({
		type:2,
		title:'鉴定图片上传',
		content:'/recycle/upyun/imgpage?'+$.param(params),
		shadeClose:false,
		shade:0.8,
		area:['500px' , '500px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 图片上传回调函数-/recycle/upyun/imgpage.phtml
 * @param obj
 * @param url
 * @returns
 */
function uploadImgSuccess(obj, url){
	console.log(obj.questionId);
	console.log(url);
	
	var imgBox = '<div class="extImg"><img zoom_src="'+url+'" src="'+url+'!/fw/60"/><div class="delImg"></div></div>';
	if(obj.answerId != ''){//有答案项
		$('#'+obj.questionId+' .extInfo .extImgBox[aid="'+obj.answerId+'"]').append(imgBox);
	}else{
		$('#'+obj.questionId+' .extInfo .extImgBox').append(imgBox);
	}
	
	//图片删除
	$('#identifyBox .extInfo .delImg').unbind('click');
	$('#identifyBox .extInfo .delImg').bind('click', function(){
		var $this = $(this);
		var imgUrl = $this.prev().attr('zoom_src');
		if(confirm('是否确认删除图片？')){
			var params = {orderNo:orderNo, reportNo:identifyReportNo, method:2, imgUrl:imgUrl};
			$.post('/recycle/upyun/delimg', params, function(data){
				if(data == 'Y'){
					$this.parents('.extImg').remove();
				}else{
					alert('删除失败：'+data);
				}
			});
		}
	});
	
	layer.closeAll();
}

function orderInfo(){
	window.location.href = '/order/order/orderinfo?orderNo='+orderNo;
}

