$().ready(function(){
	//加载省份数据
	if(flag == 'Y'){
        initArea(province,city,district);
	}else{
        getProvinces();
	}

    //省份change
	$('#provinceId').change(function(){
		var thisId = $(this).val();
		resetCitys(thisId);
	});
	
	//城市change
	$('#cityId').change(function(){
		var thisId = $(this).val();
		resetDistrict(thisId);
	});
});

/**
 * 接口获取回收品类列表
 * @returns
 */
function getProvinces(){
	$.ajax({
		type:'GET',
		url:'/redis/expressarea/getprovinces',
		async:false,//同步请求
		timeout:30000,
		success:function(data){
			categorys = data;
			$('#provinceId').html('<option value="">请选择省份</option>');
			var optionHtml = '';
			for(i in data){
				optionHtml += '<option value="'+data[i]['AREAID']+'">'+data[i]['AREANAME']+'</option>';
			}
			$('#provinceId').append(optionHtml);
			
			resetCitys('');//初始化
			$('#districtId').html('<option value="">请选择县区</option>');
		}
	});
}

/**
 * 重置商品分类
 * @returns
 */
function resetCitys(provinceId){
	$('#cityId').html('<option value="">请选择城市</option>');
	$('#districtId').html('<option value="">请选择县区</option>');
	if(provinceId){
		$.ajax({
			type:'GET',
			data:{provinceId:provinceId},
			url:'/redis/expressarea/getcitys',
			async:false,//同步请求
			timeout:30000,
			success:function(data){
				var optionHtml = '';
				for(i in data){
					optionHtml += '<option value="'+data[i]['AREAID']+'">'+data[i]['AREANAME']+'</option>';
				}
				$('#cityId').append(optionHtml);
			}
		});
	}
}

/**
 * 重置商品分类
 * @returns
 */
function resetDistrict(cityId){
	$('#districtId').html('<option value="">请选择县区</option>');
	if(cityId){
		$.ajax({
			type:'GET',
			data:{cityId:cityId},
			url:'/redis/expressarea/getdistricts',
			async:false,//同步请求
			timeout:30000,
			success:function(data){
				var optionHtml = '';
				for(i in data){
					optionHtml += '<option value="'+data[i]['AREAID']+'">'+data[i]['AREANAME']+'</option>';
				}
				$('#districtId').append(optionHtml);
			}
		});
	}
}

//省份初始化
function initArea(province,city, district){
    $("#provinceId").html("<option value=''>请选择省份</option>");
    $.ajax({type:'GET',dataType:'json',cache:false,async:false,url:'/redis/expressarea/getprovinces',
        success:function(data){
            var optionHtml = "", name = "";
            for(i in data){
                name = data[i]['AREANAME'];
                optionHtml += "<option value='"+data[i]['AREAID']+"' title='"+name+"'>"+name+"</option>";
            }
            $("#provinceId").append(optionHtml);
            $("#provinceId option:contains('"+province+"')").attr("selected", true);
            $("#cityId").html("<option value='' flag='N'>请选择城市</option>");
            var thisVal = $("#provinceId").val();
            if(thisVal != ''){
                $.ajax({type:'GET',dataType:'json',cache:false,data:{provinceId:thisVal},url:'/redis/expressarea/getcitys',
                    success:function(data){
                        var optionHtml = '', id = '', name = '';
                        for(i in data){
                            id = data[i]['AREAID'];
                            name = data[i]['AREANAME'];
                            optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
                        }
                        $("#cityId").append(optionHtml);
                        $("#cityId option:contains('"+city+"')").attr("selected", true);

                        $("#districtId").html("<option flag='' value=''>请选择地区</option>");
                        var thisVal = $("#cityId").val();
                        if(thisVal != ''){
                            $.ajax({type:'GET',dataType:'json',cache:false,data:{cityId:thisVal},url:'/redis/expressarea/getdistricts',
                                success:function(data){
                                    var optionHtml = '',id = '',name = '';
                                    for(i in data){
                                        id = data[i]['AREAID'];
                                        name = data[i]['AREANAME'];
                                        optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
                                    }
                                    $("#districtId").append(optionHtml);
                                    $("#districtId option:contains('"+district+"')").attr("selected", true);
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}
