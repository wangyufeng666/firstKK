$().ready(function(){
	$('.btnAddLine').click(function(){
		var newLine = '<tr class="main">';
		newLine += '<td><input name="minPrice" value="" class="input-date"/></td>';
		newLine += '<td><input name="maxPrice" value="" class="input-date"/></td>';
		newLine += '<td><input name="percentVal" value="" class="input-date"/>%</td>';
		newLine += '<td><input type="button" class="btnRemoveLine" value="-"/></td>';
		newLine += '</tr>';
		$('#brokerageTable').append(newLine);
		$(".btnRemoveLine").delegate("","click", function(){
			$(this).parent().parent().remove();
		});
	});
	$('#saveBrokerage').bind('click', function(){saveBrokerage();});
	// 表单验证
	$('#addForm').validate({
		rules:{
			strategyName:{required:true,maxlength:50}
			,startDate:{required:true}
			,stopDate:{required:true}
			,minPrice:{required:true,number:true}
			,maxPrice:{required:true,number:true}
			,percentVal:{required:true,number:true,min:0,max:99}
			,strategyDesc:{required:true}
		},
		messages:{
			strategyName:{
				required:"请填写策略名称"
			}
			,startDate:{
				required:"请输入开始日期"
			}
			,stopDate:{
				required:"请输入结束日期"
			}
			,minPrice:{
				required:'不能为空',
				number:'无效数字'
			}
			,maxPrice:{
				required:'不能为空',
				number:'无效数字'
			}
			,percentVal:{
				required:'不能为空',
				number:'无效数字',
				min:'最小值为0',
				max:'最大值为99'
			}
			,strategyDesc:{
				required:'不能为空'
			}
		}
	});
});

/**
 * 保存选择的合作商
 */
$("#partnerCode").change(function(){
	var typeCode = $(this).val();
	var companyName = this.options[this.selectedIndex].text;
    $.ajaxSettings.async = false;
    $.post("/device/brokerage/checktypecode", {typeCode:typeCode}, function(data) {
		if(data == 'Y'){
			alert('该代理已存在进行中的活动，如果需要开通新的活动，请先终止进行中的');
		}else{
			if($(".main").hasClass(''+typeCode+'')){
				alert('该代理添加，请勿重复选择');
			}else{
				var newLine = '<tr class="main '+typeCode+'">';
				newLine += '<td><input name="companyName" readonly typeCode = "'+typeCode+'" value="'+companyName+'" class="input-date"/></td>';
				newLine += '<td><input type="button" class="btnRemoveLine" value="-"/></td>';
				newLine += '</tr>';
				$('#checkAgents').append(newLine);
				$(".btnRemoveLine").delegate("", "click", function(){
					$(this).parent().parent().remove();
				});
			}
		}
    },"json");
    $.ajaxSettings.async = true;
});

/**
 * 保存佣金策略
 */
function saveBrokerage(){
	$('#saveBrokerage').unbind('click');
	
	if($('#addForm').valid()){
		var details = [];
		$('#brokerageTable .main').each(function(){
			var minPrice = $('input[name="minPrice"]', $(this)).val();
			var maxPrice = $('input[name="maxPrice"]', $(this)).val();
			var percentVal = $('input[name="percentVal"]', $(this)).val();
			var absoluteVal = '0';
			var detail = {minPrice:minPrice, maxPrice:maxPrice, percentVal:percentVal, absoluteVal:absoluteVal};
			details.push(detail);
		});
		
		var checkTypeCodes = [];
		$('#checkAgents .main').each(function(){
			var typeCode = $('input[name="companyName"]', $(this)).attr('typeCode');
			checkTypeCodes.push(typeCode);
		})
		
		var datas = {};
		datas.strategyName = $('#strategyName').val();
		datas.isValid = $('input[name="isValid"]:checked').val();
		datas.startDate = $('#startDate').val();
		datas.endDate = $('#endDate').val();
		datas.strategyDesc = $('#strategyDesc').val();
		datas.details = details;
		datas.checkTypeCodes = checkTypeCodes;
		$.post('/device/brokerage/savebrokerage', datas, function(data){
			if(data == 'Y'){
				goBack();
			}
		});
		$('#saveBrokerage').bind('click', function(){saveBrokerage();});
	}else{
		$('#saveBrokerage').bind('click', function(){saveBrokerage();});
	}
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
		$.ajax({type:'GET',dataType:'json',jsonp:'jsonp_callback',cache:false,data:{cityId:thisVal},url:'/system/brokerage/getagents',
			success:function(data){
				var optionHtml = '',id = '',name = '';
				for(i in data){
					id = data[i]['TYPECODE'];
					name = data[i]['COMPANYNAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#partnerCode").append(optionHtml);
			}
		});
	}
});

//合作商动态改变
$('#approval').change(function(){
	$("#partnerCode").html("<option flag='' value=''>请选择合作商</option>");
	var thisVal = $(this).val();
	var cityId = $("#shi").val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'json',jsonp:'jsonp_callback',cache:false,data:{approvalFlag:thisVal,cityId:cityId},url:'/system/brokerage/getagents',
			success:function(data){
				var optionHtml = '',id = '',name = '';
				for(i in data){
					id = data[i]['TYPECODE'];
					name = data[i]['COMPANYNAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#partnerCode").append(optionHtml);
			}
		});
	}
});


/**
 * 返回列表页面
 */
function goBack(){
	window.location.href = backUri+'?backFlag=Y';
}