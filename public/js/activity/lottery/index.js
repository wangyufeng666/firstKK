var turnplate = {bRotate:false};//false:停止;ture:旋转

$().ready(function(){
  	//旋转转盘 item:奖品位置; txt：提示语;
  	var rotateFn = function (angles, txt){
  		$('#latteryStart').stopRotate();
  		$('#latteryStart').rotate({
  			angle:0,
  			animateTo:angles+1800,
  			duration:8000,
  			callback:function(){
				turnplate.bRotate = !turnplate.bRotate;
				var HtmlPop ='';
				if($.trim(txt) == '谢谢参与'){
		        $('.slide-mask').show();
					HtmlPop+='<div class="winning_box">';
						HtmlPop+='<div class="notwom_bg">';
							HtmlPop+='<div class="winning_btn lotteryFail"><img src="/images/m/lottery1/notwon-btn.png"></div>';
							HtmlPop+='<div class="close_pop" onclick="closePop()"></div>';
						HtmlPop+='</div>';
					HtmlPop+='</div>';
					$('.slide-mask').html(HtmlPop);
				}else{
					$('.slide-mask').show();
					HtmlPop+='<div class="winning_box">'; 
						HtmlPop+='<div class="winning_bg">';
							HtmlPop+='<div class="winning_text">'+txt+'</div>';	
							HtmlPop+='<div class="winning_btn lotteryWin"><img src="/images/m/lottery1/winning_btn.png"></div>';
							HtmlPop+='<div class="close_pop" onclick="closePop()"></div>';
						HtmlPop+='</div>';
					HtmlPop+='</div>';
					$('.slide-mask').html(HtmlPop);
				}
  			}
  		});
  	};
  
  	//失败的
  	$('.slide-mask').delegate('.lotteryFail','click',function(){
  		var activeCode = $('#activeCode').val();
  		window.location.href = "/offlinem/lottery/activeindex?activeCode="+activeCode;
  	})
  	//成功的
  	$('.slide-mask').delegate('.lotteryWin','click',function(){
  	  var prizeCode = $('#prizeCode').val();
	  var activeCode = $('#activeCode').val();
	  if(prizeCode && prizeCode != ''){
    	  window.location.href = '/offlinem/lottery/login?prizeCode='+prizeCode+'&activeCode='+activeCode;
	  }else{
		  layer.open({content:'<div class="tiptext">暂无奖品可领取</div>'},3);
	  }
  	})
  	
  	
  	$('#latteryStart').click(function(){
  		if(turnplate.bRotate)return;
  		turnplate.bRotate = !turnplate.bRotate;
  		  		
		var validActiveFlag = $('#validActiveFlag').val();
		if(validActiveFlag != 'Y'){
			layer.open({content:'<div class="tiptext">活动还没开始哟~</div>'},3);
			return false;
		}
  		
  		var count = parseInt($("#counts").val());
  		if(count < 1){
			layer.open({content:'<div class="tiptext">您已经抽过奖啦,不要贪心哦~</div>'},3);
			return false;
  		}
  	    $('#counts').val(--count);
  	    $('.coud_num').html(count);
  		var item = 0;
  		$.post("/offlinem/lottery/prize",{activeCode:$('#activeCode').val()}, function(data){//获取奖品
			if(data && data.flag == 'Y'){
				$('#prizeCode').val(data.prizeCode);
				$('.btnArea').show();
				rotateFn(data.dushu, data.prizeName);
			}else{
				if(data.flag == 'ERR'){
					layer.open({content:'<div class="tiptext">活动还没开始哟~</div>'},3);
				}
			}
  		}, "json");
  	});
	
	var param = {};
	param.zoom = 1;
	param.body = {width:640};
	param.turnplate = {width:640,height:640};
	param.latteryStart = {top:196,left:196,width:247,height:247};
	param.prizeArea = {top:-50,left:0};
	param.winsBox = {width:640,height:702};
	param.winsArea = {top:170,width:430,left:115,height:400};
	param.winsList = {height:400};
	param.activenotes = {width:640,height:838};
	param.countspan = {top:920};
	param.pageInit = function(){
		
		var w = screen.width;
		w = w > param.body.width ? param.body.width : w;
		w = w < 320 ? 320 : w;
		zoom = w / param.body.width;
		$('#lotterybody').css({'width':param.body.width*zoom+'px'});
		$('#turnplate').css({'height':param.turnplate.height*zoom+'px','width':param.turnplate.width*zoom+'px'});
		$('#latteryStart').css({'height':param.latteryStart.height*zoom+'px','width':param.latteryStart.width*zoom+'px','top':param.latteryStart.top*zoom+'px','left':param.latteryStart.left*zoom+'px'});
		$('#activenotes').css({'width':param.activenotes.width*zoom+'px','height':param.activenotes.height*zoom+'px'});
		$('#winsBox').css({'width':param.winsBox.width*zoom+'px','height':param.winsBox.height*zoom+'px'});
		$('#winsArea').css({'height':param.winsArea.height*zoom+'px','width':param.winsArea.width*zoom+'px','top':param.winsArea.top*zoom+'px','left':param.winsArea.left*zoom+'px'});
		$('#winsList').css({'height':param.winsList.height*zoom+'px'});
		$('#prizeArea').css({'top':param.prizeArea.top*zoom+'px','left':param.prizeArea.left*zoom+'px'});
		
		$('#turnplate').show();
		$('#countspan').css({'top':param.countspan.top*zoom+'px'});
	};
	window.onload = param.pageInit;
	window.onresize = param.pageInit;
});
function closePop(){
	$('.slide-mask').hide();
	$('.winning_box').hide();
	
}

setInterval(winnerListWrap, 20);
function winnerListWrap(){
	var top = $('.list-wrap').attr('data-top');
	var sss = $('.list-wrap').height();
	if(sss >= 60){
		if(0-top >= sss){
			$('.list-wrap').css('top','0px');
			$('.list-wrap').attr('data-top',0);
		}else{
			$('.list-wrap').css('top', (top-0.3)+'px');
			$('.list-wrap').attr('data-top',(top-0.3));
		}
	}
}
