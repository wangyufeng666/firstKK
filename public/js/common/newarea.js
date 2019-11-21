/**
 * 初始化地区
 * province：省份ID
 * city：城市ID
 * district：地区ID
 */
function initArea(province, city, district){
	bindProvince(province);
	
	if(arguments.length==2){
		$('#'+province).bind('change',function(){
			bindCity(province, city, district);
		});
	}
	
	if(arguments.length==3){
		$('#'+province).bind('change',function(){
			bindCity(province, city, district);
		});
		
		$('#'+city).bind('change',function(){
			bindDistrict(city, district);
		});
	}
}
/**
 * 绑定省
 */
function bindProvince(province){
	$("#"+province).html("<option value=''>-请选择省份-</option>");
	$.ajax({
		type:'GET',
		dataType:'jsonp',
		jsonp:'jsonp_callback',
		cache:false,
		async:false,
		url:apiUrl+'/util/util/getprovince',
		success:function(data){
        	for(i in data){
        		$("#"+province).append("<option value='"+data[i]['ID']+"'>"+data[i]['NAME']+"</option>");
        	}
		}
	});
}

/**
 * 绑定城市
 */ 
function bindCity(province, city, district){
	$("#"+city).html("<option value='' isvisit='N'>-请选择城市-</option>");
	$("#"+district).html("<option value='' isvisit='N'>-请选择地区-</option>");
	if($('#'+province).val() != ''){
		$.ajax({
			type:'GET',
			dataType:'jsonp',
			jsonp:'jsonp_callback',
			cache:false,
			async:false,
			data:{provinceId:$('#'+province).val()},
			url:'http://www.testopenapi.com/util/util/getcity',
			success:function(data){
				$("#"+city).html("<option value='' isvisit='N'>-请选择城市-</option>");
				$("#"+district).html("<option value='' isvisit='N'>-请选择地区-</option>");
	        	for(i in data){
	        		$("#"+city).append("<option value='"+data[i]['ID']+"' flag='"+data[i]['FLAG']+"'>"+data[i]['NAME']+"</option>");
	        	}
			}
		});
	}
}

/**
 * 绑定地区
 */ 
function bindDistrict(city, district){
	$("#"+district).html("<option value='' isvisit='N'>-请选择地区-</option>");
	if($('#'+city).val() != ''){
		$.ajax({
			type:'GET',
			dataType:'jsonp',
			cache:false,
			jsonp:'jsonp_callback',
			async:false,
			data:{cityId:$('#'+city).val()},
			url:'http://www.testopenapi.com/util/util/getdistrict',
			success:function(data){
				$("#"+district).html("<option value='' flag='N'>-请选择地区-</option>");
	        	for(i in data){
	        		$("#"+district).append("<option value='"+data[i]['ID']+"' flag='"+data[i]['FLAG']+"'>"+data[i]['NAME']+"</option>");
	        	}
			}
		});
	}
}


/**
 * 获取地铁线
 */ 
function getSubwayline(subwayline,subwayststion,city){
	$("#"+subwayline).html("<option value=''>-请选择地铁线-</option>");
	$("#"+subwayststion).html("<option value=''>-请选择地铁站-</option>");
	var cityId = $('#'+city).val();
	if(cityId != ''){
		$.ajax({
    		type:'GET',
    		dataType:'jsonp',
    		jsonp:'jsonp_callback',
    		cache:false,
    		async:false,
    		data:{cityId:cityId},
    		url:'http://www.testopenapi.com/util/util/getsubwayline',
    		success:function(data){
    			if(data != '0'){
                	for(i in data){
                		$('#subwayline').append("<option value='"+data[i]['LINEID']+"'>"+data[i]['LINENAME']+"</option>");
                	}
            	}
    		}
    	});
	}
}

/**
 * 获取地铁站
 */ 
function getSubwayststion(subwayline,subwayststion){
	$('#'+subwayststion).html("<option value=''>-请选择地地铁站-</option>");
	if($('#'+subwayline).val() != ''){
    	$.ajax({
    		type:'GET',
    		dataType:'jsonp',
    		jsonp:'jsonp_callback',
    		cache:false,
    		async:false,
    		data:{lineId:$('#'+subwayline).val()},
    		url:'http://www.testopenapi.com/util/util/getsubwaystation',
    		success:function(data){
    			$('#'+subwayststion).html("<option value=''>-请选择地地铁站-</option>");
    			if(data != '0'){
                	for(i in data){
                		$('#'+subwayststion).append("<option value='"+data[i]['STATIONID']+"'>"+data[i]['STATIONNAME']+"</option>");
                	}
            	}
    		}
    	});
	}
}
