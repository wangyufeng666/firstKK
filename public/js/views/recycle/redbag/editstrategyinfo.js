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
		$(".btnRemoveLine").delegate("", "click", function(){
			$(this).parent().parent().remove();
		});
	});

	$(".btnRemoveLine").click(function(){
		$(this).parent().parent().remove();
	});
	
	$('#saveButton').bind('click', function(){save();});
	//表单验证
	$('#addForm').validate({
		rules:{
			strategyName:{required:true,maxlength:50}
			,startDate:{required:true}
			,endDate:{required:true}
			,minPrice:{required:true,number:true}
			,maxPrice:{required:true,number:true}
			,percentVal:{required:true,number:true,min:0,max:100}
			,absoluteVal:{required:true,number:true,min:0,max:100000}
		}
		,messages:{
			strategyName:{required:"请填写佣金策略名称",maxlength:'不能超过50个字符'}
			,startDate:{required:"请输入开始日期"}
			,endDate:{required:"请输入结束日期"}
			,minPrice:{required:'不能为空',	number:'无效数字'}
			,maxPrice:{	required:'不能为空',number:'无效数字'}
			,percentVal:{required:'不能为空',number:'无效数字',min:'0~100之间',max:'0~100之间'}
			,absoluteVal:{required:'不能为空',number:'无效数字',min:'0~10000之间',max:'0~10000之间'}
		}
	});
	var payType=$("#pay_Type").val();
	$("label input[value="+payType+"]").attr("checked",true);});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var strategyCode = $("#strategyCode").val();
		var strategyName = $("#strategyName").val();
		var startDate = $("#startDate").val();
		var endDate = $('#endDate').val();
		var strategyDesc = $('#strategyDesc').val();
		var details = [];
		$('#eventTable .main').each(function(){
			var minPrice = $('input[name="minPrice"]', $(this)).val();
			var maxPrice = $('input[name="maxPrice"]', $(this)).val();
			var percentVal = $('input[name="percentVal"]', $(this)).val();
			var absoluteVal = $('input[name="absoluteVal"]', $(this)).val();
			var detail = {minPrice:minPrice, maxPrice:maxPrice, percentVal:percentVal, absoluteVal:absoluteVal};
			details.push(detail);
		});
		if(strategyName != "" && startDate != "" && endDate != "" && details!=""){
			var params = {strategyCode:strategyCode,strategyName:strategyName, startDate:startDate, endDate:endDate, strategyDesc:strategyDesc, details:details};
			$.ajax({
				type:'POST'//请求方式
				,url:"/recycle/redbag/saveupdatestrategyinfo" //请求路径
				,data:params //发送到服务器的数据
				,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
				,async:false //同步请求
				,timeout:60000//默认超时60秒
				,dataType:'json' //预期服务器返回的数据类型
				,success:function(data){
					if(data == "Y"){
						layer.alert("修改成功",1);
						parent.location.href = parent.location.href;
					}
				}
			});
		}else{
			$('#saveButton').bind('click', function(){save();});
			alert("必填项不能为空");
		}
	}else{
		$('#saveButton').bind('click', function(){save();});
	}
}

function goBack(){
	parent.location.href = parent.location.href;
}