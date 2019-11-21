$().ready(function(){
	$('#identifyRule').change(function(){
		var ruleId = $(this).val();
		if(ruleId != ''){
			
			$.get('/identify/rule/getruleinfo', {ruleId:ruleId}, function(data){
				if(data && data.result == 'Y'){
					
					var questions = data.questions;
					var qHtml = '';
					if(questions){
						
						var question = {}, typeCode = '', qId = '', qName='', thisHtml = '', answers = [], inputType = '', index = 0;
						for(var i in questions){
							index++;
							question = questions[i];
							typeCode = question.TYPECODE;
							qId = question.QUESTIONID;
							qName = question.QUESTIONNAME;
							answers = question.ANSWERS;
							
							thisHtml += '<div id="'+qId+'" data_type="'+typeCode+'" class="question" title="'+qName+'">';
							thisHtml += '  <div class="title">'+(index+1)+'、'+qName+'</div>';
							thisHtml += '  <div class="answer">';
							if(typeCode == '1' || typeCode == '2'){//单选项或多选
								
								inputType = typeCode == '1' ? 'radio' : 'checkbox';
								
								if(answers){
									for(var j in answers){
										thisHtml += '<label><input data_id="'+answers[j]['ANSWERID']+'" type="'+inputType+'" name="answer_'+qId+'" value="'+answers[j]['ANSWERID']+'" title="'+answers[j]['ANSWERNAME']+'" data_exception="'+answers[j]['EXCEPTIONFLAG']+'"/>'+answers[j]['ANSWERNAME']+'</label>';
									}
								}
							}else if(typeCode == '3'){//文本输入
								thisHtml += '<textarea id="ta_'+qId+'" rows="3" cols="60"></textarea>';
							}else if(typeCode == '4'){//图片
								
							}else if(typeCode == '5'){//图片+文字
								
							}
							thisHtml += '  </div></div>';
							$('#identifyBox').html(thisHtml);
							
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
					}else{
						alert('获取鉴定模板数据失败，请重新选择');
					}
				}else{
					alert('获取鉴定模板失败，请重新选择');
				}
			});
		}else{
			$('#identifyBox').html('');
		}
	});
	
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
	
	//鉴定价格
	var recyclePrice = parseInt($('#recyclePrice').val(), 10);
	if(isNaN(recyclePrice) || recyclePrice < 0 || recyclePrice > 99999){
		alert('鉴定价格输入异常，请输入0~99999之间的金额');
		$('#saveButton').bind('click', function(){saveOrderIndentify()});
		return;
	}
	
	var questions = [];
	var submitFlag = true;
	$('#identifyBox .question').each(function(){
		var thisQId = $(this).attr('id');
		var thisQName = $(this).attr('title');
		var typeCode = $(this).attr('data_type');
		var values = [];
		var textValue = '';
		var exceptionFlag  = 'N';
		if(typeCode == '1'){//单选
			$(':radio[name="answer_'+thisQId+'"]:checked').each(function(){
				exceptionFlag = $(this).attr('data_exception');
				values.push({id:$(this).val(), name:$(this).attr('title'), exception:exceptionFlag});
			});
			if(values.length == 0){
				alert('请选择【'+thisQName+'】鉴定结果，保存失败');
				$('#saveButton').bind('click', function(){saveOrderIndentify()});
				submitFlag = false;
				return false;
			}
		}else if(typeCode == '2'){//多选
			$(':checkbox[name="answer_'+thisQId+'"]:checked').each(function(){
				exceptionFlag = $(this).attr('data_exception');
				values.push({id:$(this).val(), name:$(this).attr('title'), exception:exceptionFlag});
			});
		}else if(typeCode == '3'){//文本
			textValue = $('#ta_'+thisQId).val();
			if(textValue == ''){
				submitFlag = false;
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
		}
		var question = {
				questionId:thisQId,
				questionName:thisQName,
				typeCode:typeCode,
				values:values,
				textValue:textValue,
				exceptionFlag:exceptionFlag
			};
		
		questions.push(question);
	});
	
	if(submitFlag){
		$.ajax({
		    type: "POST",
		    url: '/identify/zzorder/saveidentify',
		    data: {orderNo:orderNo, ruleId:ruleId, recyclePrice:recyclePrice, questions:questions},
		    dataType:"json",
		    async:false,
		    timeout: 20000,
		    success: function(data){
		    	if(data == 'Y'){
					window.location.href = '/identify/zzorder/identifypage?orderNo='+orderNo+'&identifyAgain=N';
				}else{
					alert('保存鉴定结果失败：'+data);
					$('#saveButton').bind('click', function(){saveOrderIndentify()});
				}
		    },
		    error: function(data){
				alert('保存鉴定报告接口出错了，请联系技术');
				$('#saveButton').bind('click', function(){saveOrderIndentify()});
		    }
		});
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