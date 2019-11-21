$(document).ready(function(){
	var storeAreaId = $('.areaName').find('.check').attr('area-id');
	var jobNum = $('#jobNum').val();
	getAreaStore(storeAreaId);
	$("#areaStore").delegate("li", "click", function () {
		var partnerCode = $(this).attr('partnercode');
		var classFlag = $(this).hasClass('check');
		var storeAreaId = $('.areaName').find('.check').attr('area-id');
		if(classFlag){
			if(confirm("是否确认解除该门店?")){
				$.post('/offline/areaemployee/stopstore',{partnerCode:partnerCode},function(data){
					if(data == 'Y'){
						layer.alert('解除成功');
						getAreaStore(storeAreaId);
						$('#'+partnerCode).removeClass('check');
					}else{
						layer.alert(data+'解除失败');
					}
				})
			}
		}else{
			$.post('/offline/areaemployee/checkstoreisval',{partnerCode:partnerCode},function(data){
				if(data){
					if(confirm("该门店已经绑定了 "+data+" 此区域负责人是否更换？")){
						$.post('/offline/areaemployee/updatestore',{partnerCode:partnerCode,jobNum:jobNum},function(data){
							if(data == 'Y'){
								layer.alert('修改成功');
								getAreaStore(storeAreaId);
								$('#'+partnerCode).addClass('check');
							}else{
								layer.alert('修改失败');
							}
						})
					}
				}else{
					if(confirm("是否确认绑定该门店?")){
						$.post('/offline/areaemployee/bindstore',{partnerCode:partnerCode,jobNum:jobNum},function(data){
							if(data == 'Y'){
								layer.alert('绑定成功');
								getAreaStore(storeAreaId);
								$('#'+partnerCode).addClass('check');
							}else{
								layer.alert(data+'绑定失败');
							}
						})
					}
				}
			})
		}
	});
})
$('.area_check').click(function(){
		var storeAreaId = $(this).attr("area-id");
		$('.area_check').removeClass("check");
		$(this).addClass("check");
		getAreaStore(storeAreaId);
	})
function getAreaStore(storeAreaId){
	var jobNum = $('#jobNum').val();
	$.post('/offline/areaemployee/checkstore',{storeAreaId:storeAreaId,jobNum:jobNum},function(data){
		var html = '';
		if(data){
			for(var i = 0; i < data.length; i++){
				if(data[i].FLAG == 'Y'){
					html += '<li class="area_top check " id = "'+data[i].PARTNERCODE+'" partnercode = "'+data[i].PARTNERCODE+'">'
						html += '<div class="area_01">'+data[i].PARTNERNAME+'</div>'
							html += '<div class="but"><span class="left" partnercode = "'+data[i].PARTNERCODE+'">巡店</span><span class="right" partnercode = "'+data[i].PARTNERCODE+'">最后巡店</span></div>'
					html += '</li>'
				}else{
					html += '<li class="area_top" id = "'+data[i].PARTNERCODE+'" partnercode = "'+data[i].PARTNERCODE+'">'
						html += '<div class="area_01">'+data[i].PARTNERNAME+'</div>'
					html += '</li>'
				}
			}
			$('#areaStore').empty();
			$('#areaStore').append(html);
		}else{
			html +='<li><div class="head">暂无门店</div></li>';
			$('#areaStore').html(html);
		}
	})
}

/**
 * 功能描述：返回
 */
$("#but_back").click(function(){
	window.location.href = "/offline/areaemployee";
})

/**
 * 功能描述：巡店
 */
$('.store').delegate('.left','click',function(e){
	stopEvent(e);
	var partnerCode = $(this).attr('partnercode');
	var jobNum = $('#jobNum').val();
	$.layer({
		type:2,
		title:'巡店',
		iframe:{src:'/offline/areaemployee/xundian?jobNum='+jobNum+'&partnerCode='+partnerCode},
		area:['500' , '300'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
})

/**
 * 功能描述：查看最后巡店内容
 * @param event
 */
$('.store').delegate('.right','click',function(e){
	stopEvent(e);
	var partnerCode = $(this).attr('partnercode');
	var jobNum = $('#jobNum').val();
	$.layer({
		type:2,
		title:'巡店',
		iframe:{src:'/offline/areaemployee/lastxd?jobNum='+jobNum+'&partnerCode='+partnerCode},
		area:['500' , '300'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
})

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

