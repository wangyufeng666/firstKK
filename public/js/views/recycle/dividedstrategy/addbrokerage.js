$().ready(function(){
	$('.btnAddLine').click(function(){
		var newLine = '<tr class="main">';
		newLine += '<td><input name="minPrice" value="" class="input-date"/></td>';
		newLine += '<td><input name="maxPrice" value="" class="input-date"/></td>';
		newLine += '<td><input name="percentVal" value="" class="input-date"/></td>';
		newLine += '<td><input name="absoluteVal" value="" class="input-date"/></td>';
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
			,percentVal:{required:true,number:true,min:0,max:0.99999}
			,absoluteVal:{required:true,number:true,min:0,max:100000}
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
				min:'0~0.999之间',
				max:'0~0.999之间'
			}
			,absoluteVal:{
				required:'不能为空',
				number:'无效数字',
				min:'0~10000之间',
				max:'0~10000之间'
			}
		}
	});
	
	$('#businessCode').change(function(){
		var businessCode = $('#businessCode').val();
		$.post('/system/partner/recycle',{businessCode:businessCode},function(data){
			if(data.length > 0){
				var html = '<option value="">全部</option>';
				for(i in data){
					html += '<option value="'+data[i]["PARTNERCODE"]+'"  data-bc="'+data[i]['BUSINESSCODE']+'">'+data[i]["PARTNERNAME"]+'</option>';
				}
				$('#partnerCode').html(html);
			}
		})
	});
});

/**
 * 保存选择的合作商
 */
var keys='';
var get = $('#checkPartner');
$('#partnerCode').change(function(){
	var existValue = get.val(),
	    selectText = this.options[this.selectedIndex].text,            
	    existPatter =  new RegExp(selectText.replace(/[([{\^$|)?*+.\\]/g, function (re) {
	            return '\\' + re;
	        }));
	    if(existPatter.test(existValue)){
	        alert('已经选择了该合作商，无法再选择');
	    }else{
	        get.val(existValue+selectText+'\r\n');
	        keys += $(this).val()+'|';
	    }
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
			var absoluteVal = $('input[name="absoluteVal"]', $(this)).val();
			var detail = {minPrice:minPrice, maxPrice:maxPrice, percentVal:percentVal, absoluteVal:absoluteVal};
			details.push(detail);
		});
		
		var datas = {};
		datas.partnerCode = $('#partnerCode').val();
		datas.businessCode = $('#partnerCode option:selected').attr('data-bc');
		datas.strategyName = $('#strategyName').val();
		datas.isValid = $('input[name="isValid"]:checked').val();
		datas.startDate = $('#startDate').val();
		datas.endDate = $('#endDate').val();
		datas.strategyDesc = $('#strategyDesc').val();
		datas.details = details;
		datas.keys = keys;
		$.post('/recycle/dividedstrategy/savestrategy', datas, function(data){
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
		$.ajax({type:'GET',dataType:'json',jsonp:'jsonp_callback',cache:false,data:{cityId:thisVal},url:'/system/brokerage/getpartners',
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

//合作商动态改变
$('#approval').change(function(){
	$("#partnerCode").html("<option flag='' value=''>请选择合作商</option>");
	var thisVal = $(this).val();
	var cityId = $("#shi").val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'json',jsonp:'jsonp_callback',cache:false,data:{approvalFlag:thisVal,cityId:cityId},url:'/system/brokerage/getpartners',
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


/**
 * 返回列表页面
 */
function goBack(){
	window.location.href = backUri+'?backFlag=Y';
}