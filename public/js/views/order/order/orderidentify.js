$().ready(function() {
	//保存检测单
	$('#btnSaveInfo').bind('click', function () {
		saveInspection();
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

function num(obj){
	obj.value = obj.value.replace(/[^\d.]/g,"");
	obj.value = obj.value.replace(/^\./g,"");
	obj.value = obj.value.replace(/\.{2,}/g,".")
	obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
}

/**
 * 保存检测结果
 * var confirmFlag 确认检测标记
 */
function saveInspection(){
	var params = {orderNo:orderNo};

	var identifyParams = getOrderIndentifyParams();
	if(identifyParams === false){
		return false;
	}
	params.identifyReportNo = identifyParams.identifyReportNo;//鉴定报告
	params.identifyRemark = identifyParams.identifyRemark;//鉴定备注
	params.identifyTemplateId = identifyParams.identifyTemplateId;//鉴定模板
	params.questions = identifyParams.questions;//鉴定问题列表
	console.log(params);
	if(!confirm('确认提交鉴定单信息吗？')){
		return false;
	}

	$('#btnSaveInfo').unbind('click');//防止重复提交

	var load1 = layer.load('保存鉴定信息，请稍后');
	$.post('/order/order/saveidentify', params, function(data){
		layer.close(load1);
		if(data == 'Y'){
			layer.msg('鉴定保存成功');
			var index = parent.layer.getFrameIndex(window.name);
			parent.layer.close(index);
			parent.reload();
			//window.location.href ='/order/order/orderinfo?orderNo='+orderNo+'&layer=Y';
		}else{
			layer.msg('鉴定信息保存失败：'+data);
		}
		$('#btnSaveInfo').bind('click', function(){saveInspection('');});
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


