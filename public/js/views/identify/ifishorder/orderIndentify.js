$().ready(function(){
	$('#identifyRule').change(function(){
		var ruleId = $(this).val();
		if(ruleId != ''){
			
			$.get('/identify/rule/getruleinfo', {ruleId:ruleId}, function(data){
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
				
				var qHtml = '', question = {}, typeCode = '', typeTip = '', qId = '', qName='', thisHtml = '',
				answers = [], inputType = '', index = 0, imgFlag = '', textFlag = '', aId='', aName='';
				
				for(var i in questions){
					index++;
					question = questions[i];
					typeCode = question.TYPECODE;
					qId = question.QUESTIONID;
					qName = question.QUESTIONNAME;
					answers = question.ANSWERS;
					
					if(typeCode == '1'){//单选
						typeTip = '<span class="qTip">(单选)</span>';
					}else if(typeCode == '2'){//多选
						typeTip = '<span class="qTip">(多选)</span>';
					}else if(typeCode == '3'){//文本
						typeTip = '<span class="qTip">(鉴定文字)</span>';
					}else if(typeCode == '4'){//图片
						typeTip = '<span class="qTip">(图片)</span>';
					}else if(typeCode == '5'){//图+文
						typeTip = '<span class="qTip">(图片+鉴定文字)</span>';
					}
					
					thisHtml += '<div id="'+qId+'" data_type="'+typeCode+'" class="question" title="'+qName+'">';
					thisHtml += '  <div class="title">'+index+'、'+qName+typeTip+'</div>';
					thisHtml += '  <div class="answer">';
					if(typeCode == '1' || typeCode == '2'){//单选项或多选
						
						inputType = typeCode == '1' ? 'radio' : 'checkbox';
						
						if(answers){
							for(var j in answers){
								aId = answers[j]['ANSWERID'];
								aName = answers[j]['ANSWERNAME'];
								imgFlag = answers[j]['IMGFLAG'];
								textFlag = answers[j]['TEXTFLAG'];
								
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
								
								if(imgFlag == 'Y' && textFlag == 'Y'){
									aName = aName + '<span class="tip">图+文</span>';
								}else if(imgFlag == 'Y'){
									aName = aName + '<span class="tip">图</span>';
								}else if(textFlag == 'Y'){
									aName = aName + '<span class="tip">文</span>';
								}
								thisHtml += '<label><input class="answerItem" '+iptArray.join(' ')+'/>'+aName+'</label>';
							}
						}
						
					}else if(typeCode == '3'){//文本输入
						thisHtml += '<textarea id="ta_'+qId+'" rows="2" cols="60"></textarea>';
					}else if(typeCode == '4' || typeCode == '5'){//图片 || 图片+文字
						
						if(typeCode == '5'){
							thisHtml += '<textarea id="ta_'+qId+'" rows="2" cols="60"></textarea>';
						}
						thisHtml += '<button class="answerBtn choiceImg" data_qid="'+qId+'" data_aid="" type="button">请选择图片</button>';
						thisHtml += '<button class="answerBtn mobileOper" data_qid="'+qId+'" data_aid="" type="button">手机上传</button>';
					}
					thisHtml += '</div>';
					//扩展项
					thisHtml += '<div class="extInfo"></div>';
					thisHtml += '</div>';
					
					$('#identifyBox').html(thisHtml);
					
					//答案项，点击动态添加事件
					$('#identifyBox .question .answerItem').unbind('click');
					$('#identifyBox .question .answerItem').bind('click', function(){
						answerItemClick($(this));
					});
					
					//问题项图片上传，点击动态添加事件。上传图片按钮点击事件
					$('#identifyBox .question .choiceImg').unbind('click');
					$('#identifyBox .question .choiceImg').bind('click', function(){
						choiceImgBtnClick($(this), 'Q');
					});
					
					//问题项图片上传，点击动态添加事件。手机上传图片按钮点击事件
					$('#identifyBox .question .mobileOper').unbind('click');
					$('#identifyBox .question .mobileOper').bind('click', function(){
						mobileOperBtnClick($(this), 'Q');
					});
					
					//文本框获取焦点事件
					$('textarea').focus(function(){
						$(this).css({'border':'1px solid #bfbfbf'});
					});
				}
				//判断是否是重新鉴定
				if(identifyAgain == 'Y' && ruleId == identifiedRuleId){
					for(var i in rebuildDetails){
						if(rebuildDetails[i].type == '1' || rebuildDetails[i].type == '2'){//单选
							$('input[data_id="'+rebuildDetails[i].id+'"]').attr("checked", true);
						}else if(rebuildDetails[i].type == '3'){//文本
							$('#'+rebuildDetails[i].id).text(rebuildDetails[i].value);
						}
					}
				}
			});
		}else{
			$('#identifyBox').html('');
		}
	});
	
	//单选、多选点击事件
	function answerItemClick($item){
		var imgFlag = $item.attr('data_imgflag');
		var textFlag = $item.attr('data_textflag');
		
		console.log(imgFlag+'__'+textFlag);
		var itemType = $item.attr('type');
		
		var qId = $item.attr('data_qid');
		var aId = $item.attr('data_id');
		var checkboxTextFlag = false;
		var checkboxImgFlag = false;
		
		//多选项，如果已存在勾选的多选框，
		if(itemType == 'checkbox'){

			imgFlag = 'N';
			textFlag = 'N';
			
			var answers = $item.parents('.answer');
			
			$('.answerItem', answers).each(function(){
				
				if($(this).attr('checked') == 'checked'){
					console.log($(this).attr('data_id')+'_'+$(this).attr('checked')+'_'+$(this).attr('data_textflag')+' '+$(this).attr('data_imgflag'));
					
					if($(this).attr('data_textflag') == 'Y'){
						textFlag = 'Y';
						checkboxTextFlag = true;
					}
					if($(this).attr('data_imgflag') == 'Y'){
						imgFlag = 'Y';
						checkboxImgFlag = true;
					}
				}
			});
		}
		
		if(imgFlag == 'Y' || textFlag == 'Y'){
			var extInfo = $item.parents('.question').find('.extInfo');
			var thisHtml = '';
			
			if(textFlag == 'Y' || checkboxTextFlag){
				thisHtml += '<textarea class="extTextArea" id="note_'+qId+'" data_qid="'+qId+'" rows="2" cols="60"></textarea>';
			}
			
			if(imgFlag == 'Y' || checkboxImgFlag){
				thisHtml += '<button class="answerBtn extChoiceImg" data_qid="'+qId+'" type="button">请选择图片</button>';
				thisHtml += '<button class="answerBtn extMobileOper" data_qid="'+qId+'" type="button">手机上传</button>';
			}
			
			extInfo.empty().html(thisHtml);
			if(textFlag == 'Y'){
				//文本框获取焦点事件
				$('textarea').focus(function(){
					$(this).css({'border':'1px solid #bfbfbf'});
				});
			}
			
			//上传图片按钮点击事件
			$('#identifyBox .question .extInfo .extChoiceImg').unbind('click');
			$('#identifyBox .question .extInfo .extChoiceImg').bind('click', function(){
				choiceImgBtnClick($(this), 'A');
			});
			
			//手机上传图片按钮点击事件
			$('#identifyBox .question .extInfo .extMobileOper').unbind('click');
			$('#identifyBox .question .extInfo .extMobileOper').bind('click', function(){
				mobileOperBtnClick($(this), 'A');
			});
		}else{
			$item.parents('.question').find('.extInfo').empty();
		}
	}
	
	//上传图片点击事件
	function choiceImgBtnClick($item, type){
		var answerId = $item.attr('data_aid');
		var questionId = $item.attr('data_qid');
		
		var paramStr = '?orderNo='+orderNo+'&reportNo='+reportNo+'&questionId='+questionId+'&type='+type;
		if(type == 'Q' || type == 'A'){
			if(type == 'A'){
				paramStr += '&answerId='+answerId;
			}
		}else{
			alert('无效的操作');
			return false;
		}
		//图片上传
		layer.open({
			type:2,
			title:'扫码上传图片报告',
			shadeClose:false,
			shade:0.8,
			content:'/identify/ifishorder/imageupload'+paramStr,
			area:['90%','90%'],
			close:function(index){
				layer.close(index);
			}
	   });
	}
	
	//手机上传点击事件
	function mobileOperBtnClick($item, type){
		var answerId = $item.attr('data_aid');
		var questionId = $item.attr('data_qid');
		
		var paramStr = '?orderNo='+orderNo+'&reportNo='+reportNo+'&questionId='+questionId+'&type='+type;
		if(type == 'Q' || type == 'A'){
			if(type == 'A'){
				paramStr += '&answerId='+answerId;
			}
		}else{
			alert('无效的操作');
			return false;
		}
		
		//生成二维码
		layer.open({
			type:2,
			title:'扫码上传图片报告',
			shadeClose:false,
			shade:0.8,
			content:'/identify/ifishorder/identifyqrcode'+paramStr,
			area:['300px','400px'],
			close:function(index){
				layer.close(index);
			}
	   });
	}
	//保存鉴定报告
	$('#saveButton').bind('click', function(){saveOrderIndentify()});
});

function saveOrderIndentify(){
	$('#saveButton').unbind('click');
	var ruleId = $('#identifyRule').val();
	if(ruleId == ''){
		alert('请选择鉴定规则模板');
		$('#saveButton').bind('click', function(){saveOrderIndentify()});
		return;
	}
	
	var questions = [];
	var submitFlag = true;
	
	//所有问题遍历
	$('#identifyBox .question').each(function(){
		
		var thisQId = $(this).attr('id');
		var thisQName = $(this).attr('title');
		var typeCode = $(this).attr('data_type');
		var answers = [];
		var textValue = '';
		var questionExceptionFlag  = 'N';
		
		if(typeCode == '1'){//单选
			var thisAId = '';
			var answerException = 'N';
			var thisATextFlag = '';//文字标记
			var thisAImgFlag = '';//图片标记
			$(':radio[name="answer_'+thisQId+'"]:checked').each(function(){
				
				thisAId = $(this).val();
				answerException = $(this).attr('data_exception');
				
				questionExceptionFlag = answerException;
				
				thisAImgFlag = $(this).attr('data_imgflag');
				thisATextFlag = $(this).attr('data_textflag');
				
				var textFlag = $(this).attr('data_textflag');
				if(textFlag == 'Y'){//文字鉴定备注
					textValue = $.trim($('#note_'+thisQId).val());
					if(textValue == ''){
						$('#note_'+thisQId).css({'border':'1px solid red'});
						alert('请输入【'+thisQName+'】文本鉴定结果');
						$('#saveButton').bind('click', function(){saveOrderIndentify()});
						submitFlag = false;
						return false;
					}
				}
				answers.push({
						answerId:thisAId,
						answerName:$(this).attr('title'),
						answerException:answerException,
						imgFlag:thisAImgFlag,
						textFlag:thisATextFlag
				});
			});
			if(answers.length == 0 && submitFlag){
				alert('请选择【'+thisQName+'】鉴定结果，保存失败');
				$('#saveButton').bind('click', function(){saveOrderIndentify()});
				submitFlag = false;
				return false;
			}
		}else if(typeCode == '2'){//多选
			
			$(':checkbox[name="answer_'+thisQId+'"]:checked').each(function(){
				answerException = $(this).attr('data_exception');
				if(answerException == 'Y'){
					questionExceptionFlag = 'Y';
				}
				answers.push({
					answerId:$(this).val(),
					answerName:$(this).attr('title'),
					answerException:answerException,
					imgFlag:$(this).attr('data_imgflag'),
					textFlag:$(this).attr('data_textflag')
				});
			});
			
			if(questionExceptionFlag == 'Y'){
				textValue = $.trim($('#note_'+thisQId).val());
				if(textValue == ''){
					$('#note_'+thisQId).css({'border':'1px solid red'});
					alert('请输入【'+thisQName+'】文本鉴定结果');
					$('#saveButton').bind('click', function(){saveOrderIndentify()});
					submitFlag = false;
					return false;
				}
			}
			
		}else if(typeCode == '3'){//文本
			textValue = $.trim($('#ta_'+thisQId).val());
			if(textValue == ''){
				submitFlag = false;
				$('#ta_'+thisQId).css({'border':'1px solid red'});
				alert('请输入【'+thisQName+'】鉴定结果，保存失败');
				$('#saveButton').bind('click', function(){saveOrderIndentify()});
				return false;
			}else if(textValue.length > 200){
				submitFlag = false;
				alert('输入的鉴定结果不能超过200个字');
				$('#ta_'+thisQId).css({'border':'1px solid red'});
				$('#saveButton').bind('click', function(){saveOrderIndentify()});
				return false;
			}

			answers.push({anserId:'', ansesrName:$(this).attr('title'), answerException:exceptionFlag});
			
		}else if(typeCode == '4'){//图片
			
		}else if(typeCode == '5'){//图片+文字
			textValue = $.trim($('#ta_'+thisQId).val());
			if(textValue == ''){
				submitFlag = false;
				alert('请输入【'+thisQName+'】鉴定结果，保存失败');
				$('#ta_'+thisQId).css({'border':'1px solid red'});
				$('#saveButton').bind('click', function(){saveOrderIndentify()});
				return false;
			}else if(textValue.length > 200){
				submitFlag = false;
				alert('输入的鉴定结果不能超过200个字');
				$('#ta_'+thisQId).css({'border':'1px solid red'});
				$('#saveButton').bind('click', function(){saveOrderIndentify()});
				return false;
			}
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
	
	console.log(questions);
	
	if(submitFlag){
		$.ajax({
		    type:"POST",
		    url:'/identify/ifishorder/saveidentify',
		    data:{orderNo:orderNo, ruleId:ruleId, questions:questions},
		    dataType:"json",
		    async:false,
		    timeout:20000,
		    success:function(data){
		    	if(data == 'Y'){
					//window.location.href = '/identify/ifishorder/identifypage?orderNo='+orderNo+'&identifyAgain=N';
				}else{
					alert('保存鉴定结果失败：'+data);
				}
				$('#saveButton').unbind('click');
				$('#saveButton').bind('click', function(){saveOrderIndentify()});
				//$('#saveButton').bind('click', function(){saveOrderIndentify()});
		    },
		    error:function(data){
				alert('保存鉴定报告接口出错了，请联系技术');
				$('#saveButton').bind('click', function(){saveOrderIndentify()});
		    }
		});
	}else{
		
	}
	//$('#saveButton').unbind('click');
	//$('#saveButton').bind('click', function(){saveOrderIndentify()});
}


/**
 * 选择商品
 * @returns
 */
function selectMerInfo(){
	var merName = $('#merName').val();
	layer.open({
		type:2,
		title:'商品搜索',
		shadeClose:true,
		content:'/product/cooperate/merlist?merName='+merName,
		area:['99%','99%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 获取layer页面传回的商品信息
 * @param merId
 * @param p_merInfo
 * @returns
 */
function getSelectMer(merId, p_merInfo){
	
	var orderNo = $('#orderNo').val();
	var merName = p_merInfo['MERNAME'];
	
	layer.closeAll('iframe');
	$.post('/identify/order/matchmer', {orderNo:orderNo, merId:merId}, function(data){
		if(data !== 'Y'){
			alert('商品关联失败');
		}else{
			window.location.href = window.location.href;
		}
	});
}