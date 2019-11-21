var partners = [];
$().ready(function(){
	
	getPartners();//加载数据
	resetPartners('');//初始化
	
	//品类change事件
	$('#partnerCode').change(function(){
		var partnerCode = $(this).val();
		resetPartners(partnerCode);
	});
});

/**
 * 接口获取回收品类列表
 * @returns
 */
function getPartners(){
	$.ajax({
		type:'GET',
		url:'/redis/recycle/recypartners',
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
				var optionHtml = '<optgroup label="'+categorys[i].cateName+'">';
				for(j in merTypeList){
					thisMerType = merTypeList[j]['merType'];
					thismerTypeName = merTypeList[j]['merTypeName'];
					thisRemark = thismerTypeName+'_'+merTypeList[j]['remark'];
					optionHtml += '<option value="'+thisMerType+'" title="'+thisRemark+'">'+thisRemark+'</option>';
				}
				$('#merType').append(optionHtml+'</option>');
			}
		}
	}
}

