$().ready(function() {
	$('#saveButton').bind('click', saveQuoteGroup);
		// 表单验证
		$('#addForm').validate( {
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
function saveQuoteGroup() {
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var attrType = $('#attrType').val();
		var groupName = $('#groupName').val();
		var price = $('#price').val();
		
		//保存报价组
		$.post('/notebook/attrquote/savequotegroup',{attrType:attrType, groupName:groupName, price:price},function(data){
			
			$('#saveButton').html('已保存');
			$('#attrType').attr('disabled', 'disabled');
			//根据笔记本属性，加载所有价格为空的属性
			if(data[0] == 'Y'){
				$('#groupId').val(data[1]);
				$('#reloadBtn').bind('click', reloadAttrs);
				reloadAttrs();
			}
		});
	}else{
		alert('保存错误');
		$('#saveButton').bind('click', saveQuoteGroup);
	}
}

/**
 * 重新加载属性
 * @return
 */
function reloadAttrs(){
	var attrType = $('#attrType').val();
	$.get('/notebook/attrquote/getnopriceattrs', {attrType:attrType}, function(datas){
		if(datas.length > 0){
			var attrsTabHtml = '';
			var index = 0;
			for(var i = 0; i < datas.length; i++){
				if(index%4 == 0){ attrsTabHtml += '<tr>';}
				++index;
				var attrId = datas[i].ATTRID;
				var attrName = datas[i].ATTRNAME;
				var remark = datas[i].REMARK;
				attrsTabHtml += '<td><label><input type="checkbox" class="box" name="spIds1" value="'+attrId+'">'+attrName+'('+remark+')</label></td>';
				if(index%4 == 0){ attrsTabHtml += '</tr>';}
			}
			$('#attrsTab').empty().append(attrsTabHtml);
		}
	});
}

/**
 * 保存属性报价
 * @return
 */
function saveAttrsQuote(){
	var attrIds = [];
	$('#attrsTab .box').each(function(){
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
	$.post('/notebook/attrquote/saveattrsquote', {groupId:$('#groupId').val(), attrIds:attrIds.join(',')}, function(data){
		if(data == 'Y'){
			alert('保存成功');
			reloadAttrs();
		}
	});
}

function goBack() {
	window.location.href = '/notebook/attrquote/index';
}