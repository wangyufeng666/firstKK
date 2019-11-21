initProvince();
//省份初始化
function initProvince(){
	$("#sheng").html("<option value=''>请选择省份</option>");
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,url:openapiUrl+'/util/util/getprovince',
		success:function(data){
			var optionHtml = "", name = "";
			for(i in data){
				name = data[i]['NAME'];
				optionHtml += "<option value='"+data[i]['ID']+"' title='"+name+"'>"+name+"</option>";
			}
			$("#sheng").append(optionHtml);
		}
	});
}

//省动态改变
$('#sheng').change(function(){
	$("#shi").html("<option value='' flag='N'>请选择城市</option>");
	$("#qu").html("<option value='' flag='N'>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,data:{provinceId:thisVal},url:openapiUrl+'/util/util/getcity',
			success:function(data){
				var optionHtml = '', id = '', name = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#shi").append(optionHtml);
			}
		});
	}
});

//市动态改变
$('#shi').change(function(){
	$("#qu").html("<option flag='' value=''>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'jsonp',cache:false,jsonp:'jsonp_callback',data:{cityId:thisVal},url:openapiUrl+'/util/util/getdistrict',
			success:function(data){
				var optionHtml = '',id = '',name = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#qu").append(optionHtml);
			}
		});
	}
});

initProvince_1();
//省份初始化
function initProvince_1(){
	$("#sheng_1").html("<option value=''>请选择省份</option>");
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,url:openapiUrl+'/util/util/getprovince',
		success:function(data){
			var optionHtml = "", name = "";
			for(i in data){
				name = data[i]['NAME'];
				optionHtml += "<option value='"+data[i]['ID']+"' title='"+name+"'>"+name+"</option>";
			}
			$("#sheng_1").append(optionHtml);
		}
	});
}

//省动态改变
$('#sheng_1').change(function(){
	$("#shi_1").html("<option value='' flag='N'>请选择城市</option>");
	$("#qu_1").html("<option value='' flag='N'>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,data:{provinceId:thisVal},url:openapiUrl+'/util/util/getcity',
			success:function(data){
				var optionHtml = '', id = '', name = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#shi_1").append(optionHtml);
			}
		});
	}
});

//市动态改变
$('#shi_1').change(function(){
	$("#qu_1").html("<option flag='' value=''>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'jsonp',cache:false,jsonp:'jsonp_callback',data:{cityId:thisVal},url:openapiUrl+'/util/util/getdistrict',
			success:function(data){
				var optionHtml = '',id = '',name = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#qu_1").append(optionHtml);
			}
		});
	}
});

/**
 * 保存分配的区ID
 */
var keys='';
var get = $('#checkPartner');
$('#qu_1').change(function(){
	var existValue = get.val(),
	    selectText = this.options[this.selectedIndex].text,            
	    existPatter =  new RegExp(selectText.replace(/[([{\^$|)?*+.\\]/g, function (re) {
	            return '\\' + re;
	        }));
	    if(existPatter.test(existValue)){
	        alert("已经选择了该区域，无法再选择");
	    }else{
	        get.val(existValue+selectText+'\r\n');
	        keys += $(this).val()+',';
	    }
});

$("#btn_goback").click(function(){
	window.location.href = '/offline/areaemployee';
})

$("#btn_submit").click(function(){
	var datas = {};
	 datas.userName = $('#userName').val();
	 datas.jobNum = $('#jobNum').val();
	 datas.mobile = $('#mobile').val();
	 datas.qu = $('#qu').val();
	 datas.address = $('#address').val();
	 datas.keys = keys;
	if(datas.userName && datas.jobNum && datas.mobile && datas.qu && datas.address){
		$.post('/offline/areaemployee/saveemployee',datas,function(data){
			if(data == 'Y'){
				alert('新增成功');
				window.location.href = '/offline/areaemployee';
			}else{
				alert('新增失败');
			}
		});
	}else{
		alert('请完善信息！');
	}
})