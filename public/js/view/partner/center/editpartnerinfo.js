
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

function preview(file){  
	
	 var prevDiv = $('.list_box .head_img img');
	 if (file.files && file.files[0]){
		var reader = new FileReader();  
		reader.onload = function(evt){  
		prevDiv.attr('src',''+evt.target.result+'');
	}    
	 reader.readAsDataURL(file.files[0]);  
	}else{  
		prevDiv.attr('src','/images/partner/center/default_header.png');
	 }  
} 

$("#goback").click(function(){
	window.location.href="/partner/center/partnerinfo";
})