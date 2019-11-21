var categorys = [];
$().ready(function(){
	
	getMerTypes();//加载数据
	
	//品类change事件
	$('#category').change(function(){
		var thisId = $(this).val();
		resetMerTypes(thisId);
	});
});

/**
 * 接口获取回收品类列表
 * @returns
 */
function getMerTypes(){
	$.ajax({
		type:'GET',
		url:'/redis/recycle/recymercatetypes',
		async:false,//同步请求
		timeout:30000,
		success:function(data){
			categorys = data;
			$('#category').html('<option value="">请选择品类</option>');
			var optionHtml = '';
			for(i in data){
				optionHtml += '<option value="'+data[i]['cateCode']+'">'+data[i]['cateName']+'</option>';
			}
			$('#category').append(optionHtml);
			resetMerTypes('');//初始化
			if(typeof categoryed != "undefined"){
				$('#category').val(categoryed);
				if(categoryed != '请选择品类' && categoryed !='' && categoryed != null){
					resetMerTypes(categoryed);
				}
			}
		}
	});
}

/**
 * 重置商品分类
 * @returns
 */
function resetMerTypes(cateCode){
	$('#merType').html('<option value="">请选择分类</option>');
	var merTypeList = [], thisMerType = '', thisMerTypeName = '', thisRemark = '';
	if(categorys){
		var flag = false;
		for(i in categorys){
			if(cateCode != ''){
				flag = categorys[i].cateCode == cateCode;
			}else{
				flag = true;
			}
			if(flag){
				merTypeList = categorys[i].list;
				
				var optionHtml = '';
				if(merTypeList.length == 1 && cateCode){
					thisMerType = merTypeList[0]['merType'];
					thismerTypeName = merTypeList[0]['merTypeName'];
					thisRemark = thismerTypeName+'_'+merTypeList[0]['remark'];
					optionHtml += '<option value="'+thisMerType+'" title="'+thisRemark+'" selected>'+thisRemark+'</option>';
				}else{
					optionHtml = '<optgroup label="'+categorys[i].cateName+'">';
					for(j in merTypeList){
						thisMerType = merTypeList[j]['merType'];
						thismerTypeName = merTypeList[j]['merTypeName'];
						thisRemark = thismerTypeName+'_'+merTypeList[j]['remark'];
						optionHtml += '<option value="'+thisMerType+'" title="'+thisRemark+'">'+thisRemark+'</option>';
					}
					optionHtml += '</optgroup>';
				}
				$('#merType').append(optionHtml);
				if(typeof mertypeed != "undefined"){
					$('#merType').val(mertypeed);
				}
			}
		}
	}
}

