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
			,percentVal:{required:true,number:true,min:0,max:100}
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
				min:'0~100之间',
				max:'0~100之间'
			}
			,absoluteVal:{
				required:'不能为空',
				number:'无效数字',
				min:'0~100000之间',
				max:'0~100000之间'
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
		$.post('/recycle/redbag/savestrategy', datas, function(data){
			if(data == 'Y'){
				goBack();
			}
		});
		$('#saveBrokerage').bind('click', function(){saveBrokerage();});
	}else{
		$('#saveBrokerage').bind('click', function(){saveBrokerage();});
	}
}

/**
 * 返回列表页面
 */
function goBack(){
	window.location.href = backUri+'?backFlag=Y';
}