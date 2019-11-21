var partnerTypes = [];
$().ready(function(){
	//品类change事件
	$('#partnerType').change(function(){
		var thisId = $(this).val();
		getPartnerTypes(thisId);
	});
});

/**
 * 重置商品分类
 * @returns
 */
function getPartnerTypes(partnerType){
	$.ajax({
		type:'GET',
		url:'/recycle/partner/partners?partnerType='+partnerType,
		async:false,//同步请求
		timeout:30000,
		success:function(data){
			$('#partnerCode').html('<option value="">请选择</option>');
			var optionHtml = '';
			for(i in data){
				optionHtml += '<option value="'+data[i]['PARTNERCODE']+'">'+data[i]['PARTNERNAME']+'</option>';
			}
			$('#partnerCode').append(optionHtml);
		}
	});
}

