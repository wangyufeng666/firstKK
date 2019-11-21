$("#bannerUrl").change(function(){
	var docObj=document.getElementById("bannerUrl");
	 if (docObj.files && docObj.files[0]){
			var reader = new FileReader();  
			reader.onload = function(evt){  
			$("#preview").attr('src',''+evt.target.result+'');
		}    
		 reader.readAsDataURL(docObj.files[0]);  
		}
	}) ;
	

function fsubmit(){
    var data = new FormData($('#modelForm')[0]);
    var  bannerUrl = $("#bannerUrl").val();
    var  jumpUrl = $("#jumpUrl").val(); 
    var  imgSource = $("#imgSource").val(); 
    var  imgAlt = $("#imgAlt").val(); 
    var  startDate = $("#startDate").val(); 
    var  endDate = $("#endDate").val();
    var  eventName = $("#eventName").val();
    var  sort = $("#sort").val();
    var image = new Image();
    image.src = $("#preview").attr("src");
    var height = image.height;
    var width = image.width;
    
    if(imgSource != '' && imgSource != null){
    	if(bannerUrl != '' && bannerUrl != null){
    		if(imgSource == 'PC'){
    			if(width == 1200 && height == 550){
    				if(sort != '' && sort != null){
    					if(startDate != '' && startDate != null){
    						if(endDate != '' && endDate != null){
    							$.ajax({  
    								url: '/system/banner/saveaddbanner',  
    								type: 'POST',  
    								data: data,  
    								dataType: 'JSON',  
    								cache: false,  
    								processData: false,  
    								contentType: false, 
    								success:function(data){
    									if(data == 'Y'){  
    										alert('保存成功');
    										window.parent.location.href = window.parent.location.href;
    									}else{  
    										alert(data);  
    									}  
    								} 
    							}) 
    						}else{
    							alert("请选择活动结束时间");
    						}	
    					}else{
    						alert("请选择活动开始时间");
    					}
    				}else{
    					alert("请设置banner顺序");
    				}
    			}else{
    				alert("PC端banner大小有误。宽：1200，高：550");
    			}	
    		}else if(imgSource == 'M'){
    			if(width == 640 && height == 320){
    				if(sort != '' && sort != null){
    					if(startDate != '' && startDate != null){
    						if(endDate != '' && endDate != null){
    							$.ajax({  
    								url: '/system/banner/saveaddbanner',  
    								type: 'POST',  
    								data: data,  
    								dataType: 'JSON',  
    								cache: false,  
    								processData: false,  
    								contentType: false, 
    								success:function(data){
    									if(data == 'Y'){  
    										alert('保存成功');
    										window.parent.location.href = window.parent.location.href;
    									}else{  
    										alert(data);  
    									}  
    								} 
    							}) 
    						}else{
    							alert("请选择活动结束时间");
    						}	
    					}else{
    						alert("请选择活动开始时间");
    					}
    				}else{
    					alert("请设置banner顺序");
    				}
    			}else{
    				alert("移动端banner大小有误。宽：640，高：320");
    			}	
    		}
    	}else{
    		alert("请选择上传的banner图");
        }   
    }else{
    	alert("请选择banner来源");
    }
}  