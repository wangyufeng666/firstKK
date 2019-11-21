$(function(){
	'use strict';
	$('#keywords').autocomplete({serviceUrl:'/m/product/keywords', params:{pcode:pcode, merType:merType, cid:categoryId}, dataType:'json', width:'100%'});
});

//文本框查询
function doSearch(){
	var value = $('#keywords').val();
	if(value == ''){
		return;
	}
	location.href = '/m/product/list?keywords='+value+'&mertype='+merType+'&pcode='+pcode+'&uid='+uid+'&cid='+categoryId;
}

function merInquiry(merId){
	window.location.href = '/m/inquiry/init?spid='+merId+'&uid='+uid;;
}