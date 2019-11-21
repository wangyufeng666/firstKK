$().ready(function(){
	$('#saveButton').bind('click', function(){save();});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			merType:{required:true}//商品类型
			,ruleName:{required:true}//规则名称
			,profit:{required:true,max:100,min:0}//利润率
		}
		,messages:{
			merType:{required:"请选择商品类型"}//商品类型
			,ruleName:{required:"请输入规则名称"}//规则名称
			,profit:{//利润率
				required:"请输入利润率",
				max:"你输入的利润率太大",
				min:"你输入的利润率太小"
			}
		}
	});
});

/**
 * 功能描述:根据系统规则类型展示通用模板
 * added by wangbo
 */
$('#merType').change(function(){
	var merType = $("#merType").val();
	var sysFlag = $('#sysFlag').val();
	var returnText = '<option value="">全部</option>';
	$.ajax({
		type:'POST'//请求方式
		, url:"/recycle/merruletemplate/ruletemplates" //请求路径
		, data: {merType:merType,sysFlag:sysFlag} //发送到服务器的数据
		, cache: false //设置为 false 将不会从浏览器缓存中加载请求信息
		, async: false //同步请求
		, timeout: 60000//默认超时60秒
		, dataType: 'json' //预期服务器返回的数据类型
		, success: function (data) {
			for (var i in data) {
				returnText += '<option value="'+data[i]["RULEID"]+'" >'+data[i]["RULENAME"]+'</option>';
			}
			$('#ruleTemplateId').html(returnText);
		}
	});
})



$('#sysFlag').change(function(){
	var merType = $("#merType").val();
	var sysFlag = $(this).val();
	var returnText = '<option value="">全部</option>';
	$.ajax({
		type:'POST'//请求方式
		, url:"/recycle/merruletemplate/ruletemplates" //请求路径
		, data: {merType:merType,sysFlag:sysFlag} //发送到服务器的数据
		, cache: false //设置为 false 将不会从浏览器缓存中加载请求信息
		, async: false //同步请求
		, timeout: 60000//默认超时60秒
		, dataType: 'json' //预期服务器返回的数据类型
		, success: function (data) {
			for (var i in data) {
				returnText += '<option value="'+data[i]["RULEID"]+'" >'+data[i]["RULENAME"]+'</option>';
			}
			$('#ruleTemplateId').html(returnText);
		}
	});
})

//根据模板的规则ID展示模板
$('#ruleTemplateId ').change(function () {
	var ruleTemplateId = $("#ruleTemplateId").val();
	$.ajax({
		type: 'POST'//请求方式
		,url: "/recycle/merruletemplate/templateinfo" //请求路径
		,data: {ruleId:ruleTemplateId} //发送到服务器的数据
		,cache: false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async: false //同步请求
		,timeout: 60000//默认超时60秒
		,dataType: 'json' //预期服务器返回的数据类型
		,success: function(data){
			if(data.ruleInfo){
				var typeId = '', typeName = '', choiceMode = '', i = 0, returnText = '', unitShowText = '';
				var ruleType = data["ruleTypes"];
				for (var key in ruleType) {
					i++;
					typeId = ruleType[key]['TYPEID'];
					typeName = ruleType[key]['TYPENAME'];
					choiceMode = ruleType[key]['CHOICEMODE'];
					
					returnText += '<div class="item">';
					returnText += '	<div class="title clearfix">';
					if(choiceMode == 'C'){
						returnText += '	  <div class="key" data_id="'+typeId+'">'+i+'、'+typeName+'&nbsp;<span class="green">(多选)</span>';
					}else{
						returnText += '	  <div class="key" data_id="'+typeId+'">'+i+'、'+typeName+'&nbsp;<span class="blue">(单选)</span>';
					}
					returnText += '	</div>';
					returnText += '  </div>';
					
					returnText += '  <ul class="selects clearfix" data_id="'+typeId+'" type="R">';
					var details = ruleType[key]['DETAILS'];
					for (var dey in details) {
						var detailId = details[dey]['DETAILID'];
						var detailName = details[dey]['DETAILNAME'];
						var countMode = details[dey]['COUNTMODE'];
						var countValue = details[dey]['COUNTVALUE'];
						
						//unitShowText = (countMode == '百分比') ? '%' : '元';
						
						returnText += '	<li class="option checked" data_id="'+detailId+'">';
						returnText += '	  <div class="text" title="'+detailName+'">'+detailName+'</div>';
						
						if(choiceMode == 'R'){//单选
							if(countMode == '百分比'){
								unitShowText = '<span class="red">'+countValue+'&nbsp;%</span>';
								if(countValue > 0){
									unitShowText = '<span class="green">'+countValue+'&nbsp;%</span>';
								}
							}else{
								unitShowText = '<span class="red">'+countValue+'&nbsp;元</span>';
								if(countValue > 0){
									unitShowText = '<span class="green">'+countValue+'&nbsp;元</span>';
								}
							}
						}else if(choiceMode == 'C'){//多选
							if(countMode == '百分比'){
								unitShowText = '<span class="red">'+countValue+'&nbsp;%</span>';
								if(countValue > 0){
									unitShowText = '<span class="green">'+countValue+'&nbsp;%</span>';
								}
							}else{
								unitShowText = '<span class="red">'+countValue+'&nbsp;元</span>';
								if(countValue > 0){
									unitShowText = '<span class="green">'+countValue+'&nbsp;元</span>';
								}
							}
						}
						returnText += '	  <div class="value">'+countMode+'：'+unitShowText+'</div>';
						returnText += '	</li>';
					}
					returnText += '  </ul>';
					returnText += '</div>';
				}
				$('#itemList').html(returnText);
				
				$('#itemList').delegate('li', 'click', function(){
					$(this).toggleClass("checked");
				});
			}
		}
	});
});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var params = {};
		var questions = [];
		$('#itemList .selects').each(function(){
			var ruleId = $(this).attr('data_id');
			var question = {'id':ruleId, 'ids':[]};
			
			$('.option.checked', $(this)).each(function () {
				question.ids.push($(this).attr('data_id'));
			});
			var checkedIds = question.ids;
			if(checkedIds.length > 0){
				questions.push(question);
			}
		});
		
		params.sysFlag = $("#sysFlag").val();
		params.ruleName = $("#ruleName").val();
		params.merType = $("#merType").val();
		params.profit = $("#profit").val();
		params.questions = questions;
		params.ruleTemplateId = $('#ruleTemplateId').val();
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merrule/saverule" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(confirm("是否继续添加")){
						window.location.href = window.location.href;
					} else {
						goBack();
					}
				}
			}
		});
	}else{
		$('#saveButton').bind('click', function(){save();});
	}
}