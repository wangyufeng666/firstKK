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
	return this.each(function(){
		var $ = jQuery;
		var thisStepItem = $(this);
		var cards = thisStepItem.children('.cards');
		var itemTitle = thisStepItem.children('.title');
		var selectMode = thisStepItem.attr('data-type');
		
		itemTitle.click(function(){
			var SIS = $('#stepItems .stepItem');
			$('.cards', SIS).hide();
			$('.title', SIS).removeClass('open').addClass('close');
			if(cards.css('display') == 'block'){
				itemTitle.removeClass('open').addClass('close');
				cards.slideUp('slow', function(){cards.removeClass('close').addClass('open');});
			}else{
				itemTitle.removeClass('close').addClass('open');
				cards.slideDown('slow', function(){cards.removeClass('close').addClass('open');});
			}
		});
		
		//多选项关闭事件
		$('.closeBtn', cards).click(function(){
			cards.addClass('hide');
			itemTitle.removeClass('open').addClass('close');
			if(thisStepItem.next()){
				itemTitle.removeClass('open').addClass('close');
				thisStepItem.children('.cards').slideUp('slow', function(){$(this).addClass('hide');});
				thisStepItem.next().children('.cards').slideDown('slow', function(){$(this).removeClass('hide');});
				thisStepItem.next().children('.title').removeClass('close').addClass('open');
			}
		});
		
		$('.card', cards).click(function(e){
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
						$('#stepItems .stepItem').each(function(){
							var cardLength = $('.card', $(this)).length;
							var cardHideLength = $('.card.hide', $(this)).length;
							if(cardLength == cardHideLength){
								$(this).addClass('hide');
							}else{
								$(this).removeClass('hide');
							}
						});
					}
					thisStepItem.nextAll().each(function(){
						var crtNextItem = $(this);
						if(!crtNextItem.hasClass('hide')){
							thisStepItem.children('.cards').slideUp('slow');
							itemTitle.removeClass('open').addClass('close');
							crtNextItem.children('.cards').show();
							crtNextItem.children('.title').removeClass('close').addClass('open');
							return false;
						}
					});
				}
			}
		});
	});
};