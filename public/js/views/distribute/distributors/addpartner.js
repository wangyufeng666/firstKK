$('#saveButton').bind('click', function(){save();});
//表单验证
$('#addForm').validate({
	rules:{
		partnerName:{required:true}//门店名称
		,qu:{required:true}//区域ID
		,partnerCode:{required:true,maxlength:4}//门店编码
		,branchCode:{required:true}//所属分部
		,contacts:{required:true}//联系人
		,contactWay:{required:true,phoneOrMobile:true}//联系电话
		,jobnum:{required:true,maxlength:8, number:true}//工号
		,address:{required:true}//地址
		,saleSmanRole:{required:true}//主任类型
		,visitFlag:{required:true}//取件方式
	}
	,messages:{
		partnerName:{required:"请输入门店名称"}//渠道商名称
		,qu:{required:"请选择地区"}//地区
		,partnerCode:{required:"请输入门店编码",maxlength:"门店编码是4位"}//门店编码
		,branchCode:{required:"请选择所属分部"}//所属分部
		,contacts:{required:"请填写联系人"}//联系人
		,contactWay:{required:"请填写联系电话",phoneOrMobile:"联系电话格式不正确"}//联系电话
		,jobnum:{required:"请输入工号",maxlength:"工号位8位纯数字",number:"工号位8位纯数字"}//工号
		,address:{required:"请填写地址"}//地址
		,saleSmanRole:{required:"请选择主任类型"}//备注
		,visitFlag:{required:"请选择取件方式"}//备注
	}
});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		if(checkSaleSmanRole()){
			var jobnum = $('#jobnum').val();
			var contactWay = $('#contactWay').val();
			var partnerCode = $('#partnerCode').val();
			$.post('/tmall/distributors/checkpartnerisval', {jobnum:jobnum,contactWay:contactWay,partnerCode:partnerCode}, function(data){
				if(!data){
					$('#addForm').submit();
				}else{
		            if(partnerCode == data['PARTNERCODE']){
		            	alert('改门店编码【'+partnerCode+'】已是【'+data['PARTNERNAME']+'】门店的编码');
		            }else if(contactWay == data['CONTACTWAY']){
		            	alert('该手机号已存在');
		            }else if(jobnum == data['JOBNUM']){
		            	alert('该工号已存在');
		            }
					$('#saveButton').bind('click', function(){save();});
				}
			});
		}else{
			alert('请选择主任类型');
			$('#saveButton').bind('click', function(){save();});
		}
	}else{
		$('#saveButton').bind('click', function(){save();});
	}
}

function checkSaleSmanRole(){
	$flag = false;
    $("input[name='saleSmanRole[]']").each(function(){  
        if($(this).get(0).checked){  
        	$flag = true;;  
        }  
    }) 
    return $flag;
}

function goBack(){
	window.location.href = "/tmall/distributors/partnerindex";
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
	$("#qu").html("<option value='' flag='N'>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$('#shengName').val($(this).find("option:selected").text());
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
		$('#shiName').val($(this).find("option:selected").text());
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

//市动态改变
$('#shi').change(function(){
	$('#quName').val($(this).find("option:selected").text());
});
