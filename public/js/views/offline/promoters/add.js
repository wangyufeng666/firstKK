function checkphone(){
	var val = $("#mobile").val();
	var mobile = /^1[23456789]\d{9}$/;//手机号验证
	return new RegExp(mobile).test(val);
}



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
	$("#partnerCode").html("<option value='' flag='N'>请选择地区</option>");
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

//合作商动态改变
$('#shi').change(function(){
	$("#partnerCode").html("<option flag='' value=''>请选择合作商</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'json',cache:false,data:{cityId:thisVal},url:'/system/brokerage/getpartners',
			success:function(data){
				var optionHtml = '',id = '',name = '';
				for(i in data){
					id = data[i]['PARTNERCODE'];
					name = data[i]['PARTNERNAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#partnerCode").append(optionHtml);
			}
		});
	}
});


function goBack(){
	window.location.href="/offline/promoters/index";
}

function saveButton(){
	var name = $("#username").val();
	var mobile = $('#mobile').val();
	var partnerCode = $('#partnerCode option:selected').val();
	if(name){
		if(mobile){
			if(checkphone()){
				if(partnerCode){
					$.ajax({
						type:'POST'//请求方式
							,url:"/offline/promoters/savepromoter"  //请求路径
							,data:{name:name,mobile:mobile,partnerCode:partnerCode} //发送到服务器的数据
							,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
							,async:false //同步请求
							,timeout:60000//默认超时60秒
							,dataType:'json' //预期服务器返回的数据类型
							,success:function(data){
							if(data == "Y"){
								alert('添加成功');
								window.location.href='/offline/promoters/index';
							}else{
								alert('该手机已经存在');
							}
						}
					});
				}else{
					alert('请选择合作商');
				}
			}else{
				alert('手机号格式不对');
			}
		}else{
			alert('手机号不能为空');
		}
	}else{
		alert('姓名不能为空');
	}
	
}