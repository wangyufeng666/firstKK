$().ready(function(){
	$('.btnAddLine').click(function(){
		var newLine = '<tr class="main">';
		newLine += '<td><input name="minPrice" value="" class="input-date"/></td>';
		newLine += '<td><input name="maxPrice" value="" class="input-date"/></td>';
		newLine += '<td><input name="percentVal" value="" class="input-date"/></td>';
		newLine += '<td><input name="absoluteVal" value="" class="input-date"/></td>';
		newLine += '<td><input type="button" class="btnRemoveLine" value="-"/></td>';
		newLine += '</tr>';
		$('#eventTable').append(newLine);
		$(".btnRemoveLine").delegate("","click", function(){
			$(this).parent().parent().remove();
		});
	});
	$('#saveEventBtn').bind('click', function(){saveEventInfo();});
	// 表单验证
	$('#addForm').validate({
		rules:{
			eventName:{required:true,maxlength:50}
			,eventEvent:{required:true,maxlength:150}
			,eventMark:{required:true,maxlength:150}
			,startDate:{required:true}
			,stopDate:{required:true}
			,minPrice:{required:true,number:true}
			,maxPrice:{required:true,number:true}
			,percentVal:{required:true,number:true,min:0,max:100}
			,absoluteVal:{required:true,number:true,min:0,max:100000}
			,codePoint:{required:true,number:true}
		},
		messages:{
			eventName:{required:"请填写活动名称",maxlength:'不能超过50个字符'}
			,eventDesc:{required:'请填写活动描述',maxlength:"不能超过150个字符"}
			,eventMark:{required:'请填写活动提示',maxlength:"不能超过150个字符"}
			,startDate:{required:"请输入开始日期"}
			,stopDate:{required:"请输入结束日期"}
			,minPrice:{required:'不能为空',	number:'无效数字'}
			,maxPrice:{	required:'不能为空',number:'无效数字'}
			,percentVal:{required:'不能为空',number:'无效数字',min:'0~100之间',max:'0~100之间'}
			,absoluteVal:{required:'不能为空',number:'无效数字',min:'0~10000之间',max:'0~10000之间'}
			,codePoint:{required:'不能为空',	number:'无效数字'}
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
	        alert("已经选择了该合作商，无法再选择");
	    }else{
	        get.val(existValue+selectText+'\r\n');
	        keys += $(this).val()+'|';
	    }
});

/**
 * 保存佣金策略
 */
function saveEventInfo(){
	$('#saveEventBtn').unbind('click');
	if($('#addForm').valid()){
		var details = [];
		$('#eventTable .main').each(function(){
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
		datas.eventName = $('#eventName').val();
		datas.eventDesc = $('#eventDesc').val();
		datas.eventMark = $('#eventMark').val();
		datas.payType = $('input[name="payType"]:checked').val();
		datas.isValid = $('input[name="isValid"]:checked').val();
		datas.startDate = $('#startDate').val();
		datas.stopDate = $('#stopDate').val();
		datas.codePoint = $('#codePoint').val();
		datas.details = details;
		datas.keys = keys;
		$.post('/recycle/orderevent/saveorderevent', datas, function(data){
			if(data == 'Y'){
				goBack();
			}else{
				alert("活动策略百分比必须大于等于扣点值");
			}
		});
		$('#saveEventBtn').bind('click', function(){saveEventInfo();});
	}else{
		$('#saveEventBtn').bind('click', function(){saveEventInfo();});
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