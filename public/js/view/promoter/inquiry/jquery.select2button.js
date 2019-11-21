/**
 * .select2Buttons - Convert standard html select into button like elements
 * Version: 1.0.1
 * Updated: 2011-04-14
 * Licensed under the MIT
 **/
jQuery.fn.select2Buttons = function(options){
	var relate = [], sslxId = '', sslxFlag = false, tabSize = this.size();
	var sslx = new Object();
	if(options && options.sslxId){
		if(typeof(options.scrolling) == 'undefined'){
			options.scrolling = true;
		}
		if(typeof(options.noDefault) == 'undefined'){
			options.noDefault = false;
		}
		if(typeof(options.hideFlag) == 'undefined'){
			options.hideFlag = true;
		}
		cascadeFlag = true;
		sslxId = options.sslxId;
		if(typeof(sslxss) != 'undefined'){
			for(var item in sslxss) {
				if(sslxss[item].sslxId == sslxId){
					relate = sslxss[item].relate;
					sslxFlag = true;
				}
			}
		}
	}
	
	var i = 0;
	$('#stepItems li.card').each(function(){
		i++;
		var height = parseInt($('.text', $(this)).css('height'), 10);
		var pdtop = parseInt($('.text', $(this)).css('padding-top'), 10);
		var pdbottom = parseInt($('.text', $(this)).css('padding-bottom'), 10);
		
		var lineHeight = parseInt($('.text', $(this)).css('line-height'), 10);
		height = height-pdbottom-pdtop;
		if((lineHeight+5) < height){
			$(this).css({'width':'100%'});
		}
	});
	
	return this.each(function(){
		var $ = jQuery;
		var thisStepItem = $(this);
		var cards = thisStepItem.children('.cards');
		var itemTitle = thisStepItem.children('.title');
		var selectMode = thisStepItem.attr('data-type');
		
		$('.card', cards).click(function(e){
			$('#subtip').hide();
			e.preventDefault();
			var thisCard = $(this), thisCardId = thisCard.attr('id');
			//当前选项是否禁用
			if(!thisCard.hasClass('hide')){
				if(selectMode == 'C'){//多选
					if(!thisCard.hasClass('closeArea')){
						thisCard.toggleClass('selected');
						var checkedText = [];
						cards.children('.selected').each(function(){
							checkedText.push($('.text', $(this)).html());
						});
						var newHtml = checkedText.length > 0 ? checkedText.join('、') : '无';
						$('.showText', itemTitle).html(newHtml);
						if(checkedText.length > 0){
							thisStepItem.addClass('selected');
						}else{
							thisStepItem.removeClass('selected');
						}
					}
				}else if(selectMode == 'R'){//单选
					if(!thisCard.hasClass('selected')){//移除本选择项
						$('.card', cards).removeClass('selected');
						thisCard.addClass('selected');
						thisStepItem.addClass('selected');
						$('.showText', itemTitle).html($('.text', thisCard).html());
						var checklx = '';
						$("#stepItems .card").each(function(){
							if($(this).hasClass('selected')){
								checklx = checklx == '' ? $(this).attr('id') : $(this).attr('id')+'#'+checklx;
							}
						});
						
						$("#stepItems li.card").removeClass('hide');
						if(sslxFlag){
							for(var i = 0; i < relate.length; i++){
								var mx = relate[i];
								var mxid = mx.mxid;		//获取规则明细id
								var mxIds = mx.mxIds;	//获取规则明细ids
								var glIds = mxIds.split('#');
								if(checklx.indexOf(mxid) >= 0){ //判断选取规则明细id是否等于当前循环的规则明细ID
									for(var index = 0; index < glIds.length; index++){
										$('#'+glIds[index]).removeClass('selected').addClass('hide');
									}
								}
							}
						}
					}
					if(thisStepItem.position().top < 160){
						$('html,body').animate({scrollTop:120}, 300);
					}else{
						$('html,body').animate({scrollTop:thisStepItem.position().top}, 300);
					}
				}
			}
		});
	});
};
