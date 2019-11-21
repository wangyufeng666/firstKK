$('.card', $('#stepItems .stepItem .cards')).click(function(e){
	e.preventDefault();
	var thisCard = $(this), thisCardId = thisCard.attr('id');
	var cards = thisCard.parent('.cards');
	var stepItem = cards.parent('.stepItem');
	var itemTitle = stepItem.children('.title');
	
	thisCard.addClass('selected');
	stepItem.addClass('selected');
	$('.showText', itemTitle).html($('.text', thisCard).html());
	stepItem.attr('data-value', thisCardId);
	
	var checkVal = [];
	$('#stepItems .stepItem').each(function(){
		if($(this).attr('data-value')!= ''){
			checkVal.push($(this).attr('data-value'));
		}
	});
	
	$.get('/offlinem/product/nbattr',{spid:$('#spId').val(),attrs:checkVal.join(',')},function(datas){
		var attrs = datas.attrs;
		for(var i = 0; i < attrs.length; i++){
			var attrId = attrs[i].id;
			var crtSelect = $('#stepItems .stepItem[attr="'+attrId+'"]');
			if(crtSelect.children('.cards').length == 0){
				continue;
			}else{
				var subAttrs = attrs[i].attrs;
				if(subAttrs.length == 1){
					crtSelect.addClass('selected');
					crtSelect.children('.title').addClass('selected');
					crtSelect.children('.title').children('.showText').html(subAttrs[0].NAME);
					crtSelect.attr('data-value', subAttrs.ID);
					crtSelect.children('.cards').remove();
				}else{
					$('.card', crtSelect.children('.cards')).each(function(){
						var thisCard = $(this);
						var delFlag = true;
						for(var j = 0; j <subAttrs.length; j++){
							if(thisCard.attr('id') == subAttrs[j].ID){
								delFlag = false;
							}
						}
						if(delFlag){
							$(this).remove();
						}
					});
				}
			}
		}
		if(datas.types && datas.types != null){
			var typeId = datas.types[0].K;
			$('#typeId').val(typeId);
			$('#btn_submit').show();
		}
	},'json');
});
//下一步
function formSubmit(){
	var spId = $('#spId').val();
	var typeId = $('#typeId').val();
	if(spId != '' && typeId != ''){
		layer.open({type: 2});
		window.location.href = '/offlinem/inquiry/detail?spid='+spId+'&typeId='+typeId;
	}else{
		layer.open({content:'<div class="tiptext">请完整选择配置信息</div>'});
	}
}


$('#stepItems li.card').each(function(){
	var height = parseInt($('.text', $(this)).css('height'), 10);
	var lineHeight = parseInt($('.text', $(this)).css('line-height'), 10);
	if(lineHeight * 1.5 <= height){
		$(this).css({'width':'100%'});
	}
});