(function ($) {
	//step03-a 插件的默认值属性
	var defaults = {
			provinceId: 'provinceId',
			cityId: 'cityId',
			districtId: 'districtId',
			provinceName:'',
			cityName:'',
			districtName:'',
			provinces:null
	};
	
	//step06-a 在插件里定义方法
	var showLink = function (obj) {
		$(obj).append(function () { return "(" + $(obj).attr("href") + ")" });
	}
	
	var getProvinces = function(name){
		$('#'+defaults.cityId).html('<option value="">请选择城市</option>');
		$('#'+defaults.districtId).html('<option value="">请选择县区</option>');
		if(defaults.provinces == null){
			$.ajax({
				type:'GET',
				url:'/redis/expressarea/getprovinces',
				async:false,//同步请求
				timeout:30000,
				success:function(data){
					defaults.provinces = data;
				}
			});
		}
		
		$('#'+defaults.provinceId).html('<option value="">请选择省份</option>');
		var optionHtml = '', checkId = '';
		data = defaults.provinces;
		for(i in data){
			optionHtml += '<option value="'+data[i]['AREAID']+'">'+data[i]['AREANAME']+'</option>';
		}
		$('#'+defaults.provinceId).append(optionHtml);
		$("#"+defaults.provinceId+" option:contains('"+name+"')").attr("selected", true);
		
		if($('#'+defaults.provinceId).val() != ''){
			checkId = $('#'+defaults.provinceId).val();
		}
		getCitys(checkId, defaults.cityName);//初始化
	}
	
	var getCitys = function(provinceId, name){
		var cityId = defaults.cityId;
		$('#'+cityId).html('<option value="">请选择城市</option>');
		$('#'+defaults.districtId).html('<option value="">请选择县区</option>');
		if(provinceId){
			$.ajax({
				type:'GET',
				data:{provinceId:provinceId},
				url:'/redis/expressarea/getcitys',
				async:true,//同步请求
				timeout:30000,
				success:function(data){
					var optionHtml = '', checkId;
					for(i in data){
						optionHtml += '<option value="'+data[i]['AREAID']+'">'+data[i]['AREANAME']+'</option>';
					}
					$('#'+cityId).append(optionHtml);
					$("#"+cityId+" option:contains('"+name+"')").attr("selected", true);
					
					if($('#'+cityId).val() != ''){
						checkId = $('#'+cityId).val();
					}
					
					getDistricts(checkId, defaults.districtName);
				}
			});
		}
	}
	
	var getDistricts = function(cityId, name){
		var thisId = defaults.districtId;
		$('#'+thisId).html('<option value="">请选择县区</option>');
		if(cityId){
			$.ajax({
				type:'GET',
				data:{cityId:cityId},
				url:'/redis/expressarea/getdistricts',
				async:true,//同步请求
				timeout:30000,
				success:function(data){
					var optionHtml = '';
					for(i in data){
						optionHtml += '<option value="'+data[i]['AREAID']+'">'+data[i]['AREANAME']+'</option>';
					}
					
					$('#'+thisId).append(optionHtml);

					$("#"+thisId+" option:contains('"+name+"')").attr("selected", true);
				}
			});
		}
	}
    
	//step02 插件的扩展方法名称
	$.fn.areaInfo = function (options){
		//step03-b 合并用户自定义属性，默认属性
		var options = $.extend(defaults, options);
		var provinceName = options.provinceName;
		getProvinces(provinceName);
		
		
		$('#'+options.provinceId).unbind('change').change(function(){
			if($(this).val() != ''){
				getCitys($(this).val());
			}else{
				$('#'+options.cityId).html('<option value="">请选择城市</option>');
			}
			$('#'+options.districtId).html('<option value="">请选择县区</option>');
		});
		
		$('#'+options.cityId).unbind('change').change(function(){
			if($(this).val() != ''){
				getDistricts($(this).val());
			}else{
				$('#'+options.districtId).html('<option value="">请选择县区</option>');
			}
		});
	}
})(jQuery);
