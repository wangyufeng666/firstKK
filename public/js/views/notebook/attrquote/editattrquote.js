$().ready(function() {
	$('#editButton').bind('click', saveQuoteGroup);
	// 表单验证
	$('#editForm').validate( {
		rules:{
			attrType:{
				required:true
			},
			groupName:{
				required:true,
				maxlength:100
			},
			price:{
				required:true,
				number:true
			}
		},
		messages:{
			attrType:{
				required:"请选择属性"
			},
			groupName:{
				required:"请输入集中报价名称",
				maxlength:"集中报价名称最多100字符"
			},
			price:{
				required:"请输入属性价格",
				number:"属性价格不合法"
			}
		}
	});
});

/**
 * 保存属性报价组
 */
function saveQuoteGroup(){
	layer.load('数据加载中...', 1);
	$('#editButton').unbind('click');
	if($("#editForm").valid()){
		
		var groupId = $('#groupId').val();
		var groupName = $('#groupName').val();
		var price = $('#price').val();
		
		//保存报价组
		$.post('/notebook/attrquote/updatequotegroup',{groupId:groupId, groupName:groupName, price:price},function(data){
			//根据笔记本属性，加载所有价格为空的属性
			if(data[0] == 'Y'){
				$('#editButton').html('已保存');
				layer.msg('保存成功', 2, {type:1});
			}else{
				alert('保存错误');
				$('#editButton').bind('click', saveQuoteGroup);
			}
			
		});
	}else{
		alert('保存错误');
		$('#editButton').bind('click', saveQuoteGroup);
	}
}

/**
 * 保存属性报价
 * @return
 */
function saveAttrsQuote(){
	var attrIds = [], groupId = $('#groupId').val();
	$('#attrsTab2 .box').each(function(){
		if($(this).attr('checked') == 'checked'){
			attrIds.push($(this).val());
		}
	});
	
	if(attrIds.length == 0){
		alert('请选择属性');
		return;
	}
	
	if(attrIds.length > 50){
		alert('选择属性每次最多50个');
		return;
	}
	$.post('/notebook/attrquote/saveattrsquote', {groupId:groupId, attrIds:attrIds.join(',')}, function(data){
		if(data == 'Y'){
			alert('保存成功');
			window.location.href = "/notebook/attrquote/editquotegroup?groupId="+groupId;
		}
	});
}

/**
 * 删除属性报价
 * @return
 */
function deleteAttrsQuote(){
	var attrIds = [], groupId = $('#groupId').val();
	$('#attrsTab1 .box').each(function(){
		if($(this).attr('checked') != 'checked'){
			attrIds.push($(this).val());
		}
	});
	
	if(attrIds.length == 0){
		alert('请选择属性');
		return;
	}
	
	if(attrIds.length > 50){
		alert('选择属性每次最多50个');
		return;
	}
	$.post('/notebook/attrquote/removeattrsquote', {groupId:groupId, attrIds:attrIds.join(',')}, function(data){
		if(data == 'Y'){
			alert('保存成功');
			window.location.href = "/notebook/attrquote/editquotegroup?groupId="+groupId;
		}
	});
}

function goBack(){
	window.location.href = '/notebook/attrquote/index';
}