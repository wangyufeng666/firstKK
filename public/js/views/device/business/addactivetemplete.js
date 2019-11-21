$('#saveButton').bind('click', function(){save();});
//表单验证
$('#addForm').validate({
	rules:{
		templete_name:{required:true}
		,templete_price:{required:true,maxlength:2}
	}
	,messages:{
		templete_name:{required:"请输入模板名称"}
		,templete_price:{required:"请输入模板金额",maxlength:"佣金上限最大长度为3"}
	}
});

function save(){
	$('#saveButton').unbind('click');
	var price = $('#templete_price').val();
	if($("#addForm").valid()){
		$.post('/device/business/checktempleteprice', {price:price}, function(data){
			if(data == 'Y'){
				$('#addForm').submit();
			}else{
				alert('模板金额已存在，请重新输入');
				$('#saveButton').bind('click', function(){save();});
			}
		});
	}else{
		$('#saveButton').bind('click', function(){save();});
	}
}



function goBack(){
	window.location.href = backUrl+'?backFlag=Y';
}
