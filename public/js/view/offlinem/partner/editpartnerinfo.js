
//表单验证
$('#saveButton').bind('click', save);
$("#addForm").validate({
	rules:{
		contacts:{required:true}//联系人
		,contactWay:{required:true,phoneOrMobile:true}//联系电话
		,email:{required:true,email:true}//邮箱
	}
	,messages:{
		contacts:{required:"请填写联系人"}//联系人
		,contactWay:{required:"请填写来联系电话",phoneOrMobile:"联系电话格式不正确"}//联系电话
		,email:{required:"请填写邮箱",email:"邮箱格式不正确"}//邮箱
	}
});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		$('#addForm').submit();
	}else{
		$('#saveButton').bind('click', save);
	}
}


$("#goback").click(function(){
	window.location.href="/offlinem/partner/partnerinfo";
})