$(document).ready(function(){
	$(".city").hide();
	$(".district").hide();
	$(".province_name").click(function(){
		$(this).siblings('.city').slideToggle();
	});
	
	$(".city_name").click(function(){
		   $(this).next().slideToggle();
		  // e.stopPropagation();
	});
	
	$(".province_button").bind("click",function(event){
		event.stopPropagation();
    });
	
	$(".city_button").bind("click",function(event){
        event.stopPropagation();
    });
	
	$(".province_button_all").bind("click",function(event){
	    $(this).parent().parent().next().find('.district_checkbox').attr("checked",true);
    });
	
    $(".province_button_none").bind("click",function(event){
        $(this).parent().parent().next().find('.district_checkbox').attr("checked",false);
    });
    
    $(".back_button").bind("click",function(event){
    	window.location.href = "/provider/party/providersearch";
    });
    
    $(".province_button_invert").bind("click",function(event){
        $(this).parent().parent().next().find('.district_checkbox').each(function(){
        	if($(this).attr("checked")){
        		$(this).attr("checked", false);
        	}else{
        		$(this).attr("checked",true);
        	}
        });
    });
	
    
	$(".city_button_all").bind("click",function(event){
        $(this).parent().parent().next().find('.district_checkbox').attr("checked",true);
    });
	
    $(".city_button_none").bind("click",function(event){
        $(this).parent().parent().next().find('.district_checkbox').attr("checked",false);
    });
    
    $(".city_button_invert").bind("click",function(event){
        $(this).parent().parent().next().find('.district_checkbox').each(function(){
            if($(this).attr("checked")){
                $(this).attr("checked", false);
            }else{
                $(this).attr("checked",true);
            }
        });
    });

});

/**
 * 删除服务区域
 */
function deleteArea(){

	var areaid=[];
	$(".delete_areaid").each(function(){
		
		if($(this).attr('checked')){
			areaid.push($(this).val());
		}	
	});
	
	if(areaid.length == 0){
		alert('请选择区域');
		return;
	}
	
	areaidStr = areaid.join(",");
	
	$(document).progressDialog.showDialog("正在删除中...");
	
	$.ajax({
        type : 'POST'//请求方式
        ,url : "/provider/party/deletearea"  //请求路径
        ,data : {providerid:$('#providerid').val(),areaids:areaidStr}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
            if('Y' == data){
            	window.location.href = "/provider/party/areamange?providerid="+$('#providerid').val()+"&providername="+$('#providername').text();
            }else{
            	$(document).progressDialog.hideDialog();
                alert("保存失败 "); 
            }
        }
    });
}

/**
 * 添加服务区域
 */
function saveArea(){
	var areaid=[];
	$(".save_areaid").each(function(){
		if($(this).attr('checked')){
			areaid.push($(this).val());
		}
	});
	
	if(areaid.length == 0){
		$(document).progressDialog.hideDialog(); 
		alert('请选择区域');
		return;
	}
	
	areaidStr = areaid.join(",");
	
	$(document).progressDialog.showDialog("正在保存中...");
	
	$.ajax({
        type : 'POST'//请求方式
        ,url : "/provider/party/addarea"  //请求路径
        ,data : {providerid:$('#providerid').val(),areaids:areaidStr}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
            if('Y' == data){
            	window.location.href = "/provider/party/areamange?providerid="+$('#providerid').val()+"&providername="+$('#providername').text();
            }else{
            	$(document).progressDialog.hideDialog();
                alert("删除失败 "); 
            }
        }
    });
}

