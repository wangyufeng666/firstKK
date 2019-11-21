var unLoading = true;
function scrollEvent(){
	// 当滚动到最底部以上10像素时， 加载新内容
	var height = $(document).scrollTop() + $(window).height()-$(document).height();
	if (height > -10 && unLoading){
		unLoading = false;
		$(window).unbind('scroll');
		$('#mersUl').append('<li id="loading" style="display:none;" class="item ydm-tc">正在加载中，请稍后...</li>');
		$('#loading').fadeIn('slow', function(){
			var pageNo = parseInt($('#pageNo').val(), 10)+1;
			var totalPage = parseInt($('#totalPage').val(), 10);
			if(pageNo >= totalPage){
				$('#loading').fadeOut('slow', function(){
					$('#loading').html('这是我的底线');
				});
			}else{
				$('#pageNo').val(pageNo);
				var html = '';
				var partnerCode = $('#partnerCode').val();
				var pageNo = $('#pageNo').val();
				var keywords = $('#hidden_keywords').val();
				var pagclass = '';
				$.ajax({
					type:'GET',
					dataType:'json',
					cache:false,
					async:false,
					url:'/zzy/store/storeuserjsonlist',
					data:{partnerCode:partnerCode, keywords:keywords, pageNo:pageNo},
					success:function(data){
						var list = data['result'];
						for(var i = 0; i < list.length; i++){
							html +='<div class="oitop_box clearfix"  data-promoCode="'+list[i].PROMOCODE+'" data-partnerCode="'+list[i].PARTNERCODE+'">';
							html +='<div>';
							if(list[i].WEIXINIMG){
								html +='<div class="img"><img alt="" src="'+list[i].WEIXINIMG+'"></div>';
							}else{
								html +='<div class="img"><img alt="" src="/images/partner/center/default_header.png"></div>';
							}
							html +='<div class="info_contain">';
							html +='<div class="info"><div class="infoname">'+list[i].NAME+'</div>';
							html +='<div class="infophone">'+list[i].MOBILE+'</div></div>';
							html +='<div class="info status">';
							if(list[i].APPROVAL == 'Y'){
								html +='<div class="approval">通过审核</div><div class="progress">完成进度：'+list[i].promoterFinishCounts+'/'+list[i].promoterCounts+'</div>';
							}else{
								html +='<div class="approval">待审核</div><div class="unApproval" data-id="'+list[i].PROMOTERID+'">去审核</div>';
							}
							html +='</div></div>';
							html +='<div class="delect_obt" data-id="'+list[i].PROMOTERID+'">删除</div>';
							html +='</div></div></div>';
						}
						$("#loading").fadeOut("slow", function(){
							$('#loading').remove();
							$('#mersUl').append(html);
						    var height = $('#mersUl .oitop_box:first-child').height();
                            $('#mersUl .oitop_box .delect_obt').css('line-height',height+'px');
						});
						setTimeout(function(){$(window).bind('scroll', function(){scrollEvent();unLoading = true;});}, 1000);
					}
				});
			}
		});
	}
}

$().ready(function(){
	$('#mersUl').delegate('.delect_obt','click',function(e){
		stopEvent(e);
		var promoterId = $(this).attr('data-id');
		layer.open({
		    content: '<ul class="alter"><li class="alttop">提示</li><li class="altbody">是否确定删除？</li><ul>',
		    btn: ['确定','取消'],
		    shadeClose:false,
		    yes: function(index){
		    	window.location.href="/zzy/store/deletestoreuser?promoterId="+promoterId;
			},no:function(){
				layer.closeAll();
		    }
		});
	})
	
	$('#mersUl').delegate('.oitop_box','click',function(){
		var promoterCode = $(this).attr('data-promoCode');
		var partnerCode = $(this).attr('data-partnerCode');
		window.location.href="/zzy/store/storeuserorders?promoCode="+promoterCode;
	});
	
	function stopEvent(event){ //阻止冒泡事件
		//取消事件冒泡
		var e=arguments.callee.caller.arguments[0]||event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
		if (e && e.stopPropagation) {
			// this code is for Mozilla and Opera
			e.stopPropagation();
		} else if (window.event) {
			// this code is for IE
			window.event.cancelBubble = true;
		}
	}
});

function doSeach(){
	var keywords = $("#seachPromoter").val();
	window.location.href = '/zzy/store/storeusers?keywords='+keywords;
}

function addStoreuser(){
	window.location.href = '/zzy/store/addstoreuser';
}
