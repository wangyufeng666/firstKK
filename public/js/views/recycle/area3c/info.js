//交易方式---添加3c上门
$(".tabv").delegate(".areaAdd3c","click",function(){
	var areacode = $(this).attr('val');var flag = $(this).attr('rel');var area = $(this).attr('title');var c = 'areaDel3c';
	if(flag != 0){
		if(flag == 3){
			var txt = '当前地区交易方式为“大家电上门”,你确定要修改为“都可上门”吗？';
			if(confirm(txt)){
				$(this).hide();
				areaUpdate(areacode,1,area,0,c);
			}
		}else{
			alert('出错了，刷新后重试');
		}
	}else{
		var txt = '当前地区确定添加到3C上门服务吗？';
		if(confirm(txt)){
			$(this).hide();
			areaUpdate(areacode,2,area,0,c);
		}
	}
});

//交易方式---取消3从上门
$(".tabv").delegate(".areaDel3c","click",function(){
	var areacode = $(this).attr('val');var flag = $(this).attr('rel');var area = $(this).attr('title');var c = 'areaAdd3c';
	if(flag == 1){
		var txt = '当前地区确定取消3C上门服务吗？';
		if(confirm(txt)){
			$(this).hide();
			areaUpdate(areacode,3,area,1,c);
		}
	}
	if(flag == 2){
		var txt = '当前地区确定取消3C上门服务吗？';
		if(confirm(txt)){
			$(this).hide();
			areaUpdate(areacode,0,area,1,c);
		}
	}
});

//修改交易方式
function areaUpdate(areacode,flag,area,i,c){
	$.post('/recycle/area/areaflag',{areacode:areacode,flag:flag,cityid:cityid},function(data){
		if(data == 1){
			$('.centent').eq(i).append('<div class="'+c+'" val="'+areacode+'" rel="'+flag+'" title="'+area+'">'+area+'</div>');
		}
	});
}
