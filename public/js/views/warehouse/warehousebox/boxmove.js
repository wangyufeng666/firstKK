$().ready(function(){
	initialselectshelfTab(code, boxCode,businesscode);	
	$(".btn_box li").bind('click', function(){businesscodeTab($(this).attr("businesscode"));});
	
	$(".git-box li").bind("click",function(){
		selectshelfTab($(this).attr("shelfcode"),$(this).attr("businesscode"),$(this).attr("shelfname"));
	});
	$(".locator li").bind("click",function(){
		selectBoxTab($(this).attr("boxcode"));
	});
	$(".detail-box .boxdetail .mer-boxdetail").bind('click', function(){
		if($(this).attr('mer-orderno')){
			if($(this).attr('class').indexOf('selected') == '-1'){
				$(this).addClass('selected');
			}else{
				$(this).removeClass('selected');
			}
		}
	});
	
	//确认移入库位
	$('#inHoureButton').click(function(){
		var shelfcode = $(".git-box .selected").attr("shelfcode");
		var shelfname = $(".git-box .selected").attr("shelfname");
		var businesscode = $(".git-box .selected").attr("businesscode");
		var attr_boxcode = $(".locator .selected").attr('boxcode');
		var boxname = $(".locator .selected").attr('boxname');
		var attr_mertype = $(".locator .selected").attr('mertype');
		var attr_mertypename = $(".locator .selected").attr('mertypename');
		var businessname = $(".btn_box .selected").attr('businessname');
		if(moveorderNo==''){
			alert('移库单号不能为空，请返回重试！');
		}
		if(attr_boxcode != lastboxcode){
			if(confirm('请确认移库至'+businessname+'：'+shelfname+'区 '+boxname+'库位')){
				$.post('/warehouse/warehousebox/orderremovewarehouse',{moveorderNo:moveorderNo,mertype:attr_mertype,mertypename:attr_mertypename,businesscode:businesscode,shelfcode:shelfcode,shelfname:shelfname,boxcode:attr_boxcode,boxname:boxname},function(data){
					if(data =='Y'){
						alert('移入成功！');
						window.location.href='/warehouse/warehousebox/boxmove?businessCode='+businesscode+'&shelfcode='+shelfcode+'&boxcode='+attr_boxcode
					}else{
						alert(data);
					}
				});
			}
		}else{
			alert('非法！不能和移入前库位一致噢！');	
		}
	});
	
	function initialselectshelfTab(code,boxcode,businesscode){
		$(".btn_box li").removeClass("selected");
		$(".git-box li").removeClass("selected");
		$(".btn_box").find("li[businesscode="+businesscode+"]").addClass('selected');
		$(".git-box").find("li[shelfcode="+code+"]").addClass('selected');
		$(".locator .mer-box").hide();
		$(".locator").find("li[shelfcode="+code+"]").show();
		selectBoxTab(boxcode);
	}
	//业务库位切换
	function businesscodeTab(attr_businesscode){
		$('.btn_box li').unbind('click');
		var shelfcode = attr_businesscode+'01';
		var boxCode = attr_businesscode+'01'+'A';
		window.location.href='/warehouse/warehousebox/boxmove?moveorderNo='+moveorderNo+'&businessCode='+attr_businesscode+'&shelfcode='+shelfcode+'&boxcode='+boxCode+'&lastboxcode='+lastboxcode
	}
	
	function selectshelfTab(id,businesscode,shelfname){
		$(".git-box li").removeClass("selected");
		$(".git-box").find("li[shelfcode="+id+"]").addClass('selected');
		$(".locator .mer-box").hide();
		$(".locator").find("li[shelfcode="+id+"]").show();
		var fristBox = businesscode+'01'+shelfname;
		selectBoxTab(fristBox);
	}
	
	function selectBoxTab(id){
		$(".locator li").removeClass("selected");
		$(".detail-box .boxdetail").hide();
		$(".locator li[boxcode="+id+"]").addClass("selected");
		$("#"+id).show();
	}
	$(".flash").click(function(){
		window.location.reload();
	})
});