
//表单验证
$('#saveButton').bind('click', save);
$("#addForm").validate({
	rules:{
		name:{required:true}//联系人
		,mobile:{required:true,phoneOrMobile:true}//联系电话
	}
	,messages:{
		name:{required:"请填写联系人"}//联系人
		,mobile:{required:"请填写来联系电话",phoneOrMobile:"联系电话格式不正确"}//联系电话
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
	window.location.href="/offlinem/invitee/partnerinfo";
})