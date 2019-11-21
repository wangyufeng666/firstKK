$().ready(function(){

	//所属分类change事件
	$('#sortTypeId').change(function(){
		
		var index = layer.load();
		
		var sortTypeId = $('#sortTypeId').val();
		
		if(sortTypeId == ''){
			$('#ruleTypeId').html('<option value="">--规则类型--</option>');
		}else{
			$.ajax({
				type : 'POST'//请求方式
				,url : "/guize/guize/getruletypes"  //请求路径
				,data : {sortTypeId : sortTypeId} //发送到服务器的数据
				,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
				,async : true //同步请求
				,timeout :60000//默认超时60秒
				,contentType: "application/x-www-form-urlencoded; charset=UTF-8"
				,dataType:'json' //预期服务器返回的数据类型
				,success : function(data){
					
					var htmls = '<option value="">--规则类型--</option>'; 
					var listHtmls = '';
					if(data){
					
						var sortTypes = data.sortTypes;
					
						for(var i = 0; i < sortTypes.length; i++){
							htmls+='<option value="'+sortTypes[i].GUIZELXID+'">'+sortTypes[i].GUIZENAME+'</option>';
						}
					}
					$('#ruleTypeId').html(htmls);
					layer.close(index);
				}
			});
		}
		
		$('#ruleDetailId').html('<option value="">--规则明细--</option>');
		$("#list1").empty();
    	$("#list2").empty();
	});
	
	//规则类型change事件
	$('#ruleTypeId').change(function(){
		
		var index = layer.load();
		
		var ruleTypeId = $('#ruleTypeId').val();
		
		if(ruleTypeId == ''){
			$('#ruleDetailId').html('<option value="">--规则明细--</option>');
		}else{
			$.ajax({
				type : 'POST'//请求方式
				,url : "/guize/guize/getruledetails"  //请求路径
				,data : {ruleTypeId : ruleTypeId} //发送到服务器的数据
				,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
				,async : true //同步请求
				,timeout :60000//默认超时60秒
				,contentType: "application/x-www-form-urlencoded; charset=UTF-8"
				,dataType:'json' //预期服务器返回的数据类型
				,success : function(data){
					
					var htmls = '<option value="">--规则明细--</option>'; 
					if(data && data.length > 0){
						for(var i = 0; i < data.length; i++){
							htmls+='<option value="'+data[i].JISUANGZID+'">'+data[i].GZNAME+'</option>';
						}
					}
					$('#ruleDetailId').html(htmls);
					layer.close(index);
				}
			});
		}
		
		$("#list1").empty();
    	$("#list2").empty();
	});
	
	//规则明细change事件
	$('#ruleDetailId').change(function(){
		
		var index = layer.load();
		
		var sortTypeId = $('#sortTypeId').val();
		var ruleDetailId = $('#ruleDetailId').val();
		
		if(ruleDetailId == ''){
			layer.close(index);
			$("#list1").empty();
	    	$("#list2").empty();
		}else{
			$.ajax({
				type : 'POST'//请求方式
				,url:'/guize/guize/getalldetails'  //请求路径
				,data : {sortTypeId : sortTypeId, ruleDetailId:ruleDetailId} //发送到服务器的数据
				,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
				,async : true //同步请求
				,timeout :10000//默认超时60秒
				,contentType: "application/x-www-form-urlencoded; charset=UTF-8"
				,dataType:'json' //预期服务器返回的数据类型
				,success : function(data){
					
					if(data){
						
						var existHtmls = '';
						var unExistHtmls = '';
						
						var exists = data['exists'];
						var unExists = data['unExists'];
						
						for(var i = 0; i < exists.length; i++){
							var value = exists[i].GZNO+'、'+exists[i].GUIZENAME+'：'+exists[i].GZNAME;
							existHtmls+='<option value="'+exists[i].JISUANGZID+'">'+value+'</option>';
						}
						
						for(var i = 0; i < unExists.length; i++){
							var value = unExists[i].GZNO+'、'+unExists[i].GUIZENAME+'：'+unExists[i].GZNAME;
							unExistHtmls+='<option value="'+unExists[i].JISUANGZID+'">'+value+'</option>';
						}
						
						$("#list1").html(unExistHtmls);
						$("#list2").html(existHtmls);
					}
					layer.close(index);
				}
			});
		}
	});
});

function moveOption(e1, e2){
	for(var i=0;i<e1.options.length;i++){
		if(e1.options[i].selected){
			var e = e1.options[i];
			e2.options.add(new Option(e.text, e.value));
			e1.remove(i);
			i--;
		}
	}
}

function savelx(){
	var bhz = '';
	var ids = [];
	
	$('#list2 option').each(function(){
		ids.push($(this).val());
	});
	
	bhz = ids.join("#");
	
	var suoshulx = $('#sortTypeId').val();
	var guizemx = $('#ruleDetailId').val();

	$.ajax({
	    url:'/guize/guize/saveglxx',
	    type:'POST',
	    data:{suoshulx:suoshulx, bhz:bhz ,guizemx:guizemx},
	    dataType:'json',
	    timeout:5000,
	    error: function(){alert('服务器错误, 请与管理员联系!', '提示信息'); },
	    success: function(result){
	    	$('ruleDetailId').val('');
	    	$("#list1").empty();
	    	$("#list2").empty();
	    }
	});
}

function createDocument(){
	
	$.ajax({
	    url:'/guize/guize/createdocument',
	    type:'POST',
	    data:{},
	    dataType:'json',
	    timeout:5000,
	    error: function(data){
	    	$('#filepath').show();
	    },
	    success: function(result){
	    	$('#filepath').show();
	    }
	});
}
