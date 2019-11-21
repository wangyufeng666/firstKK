//功能描述：查找该规则下的商品
function showProduct(ruleId, ruleName){
	window.location.href = "/recycle/merrule/rulemers?ruleId="+ruleId+'&ruleName='+ruleName;
}

//查字典库翻译
$(document).on('click','.clearfix .translate',function(){
	$(this).hide();
	var cnName = $(this).attr('data-name');
	var sName = $(this).parent().find('.tName');
	$.post("/product/vnofflinem/gettranslatename", {source:source,cnName:cnName}, function(res){
		if(res.code == 1000){
			sName.val(res.data);
		}else{
			layer.msg(res.msg);
		}
	});
	$(this).next().show();
});

//单个保存翻译内容
$(document).on('click','.btnName',function(){
	var cnName = $(this).parent().prev().attr('data-name');
	var id = $(this).parent().prev().attr('id');
	var type = $(this).parent().prev().attr('data-type');
	var tName = $(this).parent().find('.tName').val();
	if (tName == '' || tName == null){
		layer.msg('翻译名不能为空');return;
	}
	$.post("/product/vnofflinem/savetranslate", {source:source,cnName:cnName,id:id,type:type,tName:tName}, function(res){
		if(res.code == 1000){
			layer.msg('保存成功');
			setTimeout(function(){
				window.location.reload();
			}, 2000);
		}else{
			layer.msg(res.msg);
		}
	});
});

//批量保存翻译内容
$('#btnAllName').click(function () {
	var questions = [];
	var answers = [];
	$('.itemlist .item').each(function(index, el) {
		var qid= $.trim($(this).find('.title .key').attr('id'));//问题id
		var qcnname = $.trim($(this).find('.key .translate').attr('data-name'));//中文名称
		var qtname = $.trim($(this).find('.qnameBox .tName').val());//翻译名称
		if (qtname !='' && qtname !=null ){
			var formQuestion = {};
			formQuestion.id = qid.replace("dt_",'');
			formQuestion.cnName = qcnname;
			formQuestion.tName = qtname;
			questions.push(formQuestion);
		}

		$(this).find('.selects .option').each(function(index, el) {
			var aid= $.trim($(this).attr('id'));//答案id
			var acnname = $.trim($(this).find('.translate').attr('data-name'));//中文名称
			var atname = $.trim($(this).find('.anameBox .tName').val());//翻译名称
			if ( atname !=null && atname !=''){
				var formAnswer = {};
				formAnswer.id = aid;
				formAnswer.cnName = acnname;
				formAnswer.tName = atname;
				answers.push(formAnswer);
			}
		});
	});

	if (questions == '' && answers == ''){
		layer.msg('翻译名称不能为空');return;
	}

	$.post("/product/vnofflinem/savealltranslate", {source:source,questions:questions,answers:answers}, function(res){
		if(res.code == 1000){
			layer.msg('保存成功');
			setTimeout(function(){
				window.location.reload();
			}, 2000);
		}else{
			layer.msg(res.msg);
		}
	});
});