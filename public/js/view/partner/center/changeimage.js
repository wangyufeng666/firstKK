 function preview(file){  
	 var prevDiv = document.getElementById('preview');  
	 if (file.files && file.files[0]){  
		 var reader = new FileReader();  
		 reader.onload = function(evt){  
		 prevDiv.innerHTML = '<img src="' + evt.target.result + '" />';  
	}    
	 reader.readAsDataURL(file.files[0]);  
	}else{  
		prevDiv.innerHTML = '<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';  
	 }  
 }  
 
 $("#btn_submit").click(function(){
	 var file = $("#file").val();
	 $.post('/partner/center/saveimage',{file:file},function(data){
		 if(data == 'Y'){
			 
			 showTips("上传完毕");
		 }else if(data == 'T'){
			 showTips("上传文件类型不对，请从新选择");
		 }else{
			 showTips("上传失败，文件大于2M，请重新上传");
		 }
	 })
 });
 
 
 function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}