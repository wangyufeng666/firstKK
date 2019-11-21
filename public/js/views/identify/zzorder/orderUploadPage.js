$().ready(function(){
    $("#uploadFile").change(function(){
    	var fileName = $(this).val();
    	
    	var validFlag = fileIsValid(fileName); //状态
    	//条件判断
    	if(!validFlag){
    		alert('请选择合法的(xls|xlsx|csv)格式文件');
    	}else{
    		if(fileName != '' && fileName != undefined ){
    			$("#file_name").html(fileName);
    		}
    	}
    });
    
    $('.saveRecordBtn').bind('click',function(){saveRecord();});
});

function fileIsValid(fileName){
	var validFlag = false; //状态
	var arr = ["xls", "csv", "xlsx"];
	//取出上传文件的扩展名
	var index = fileName.lastIndexOf(".");
	var ext = fileName.substr(index+1);
	//循环比较
	for(var i=0; i<arr.length; i++){
		if(ext == arr[i]){
			validFlag = true; //一旦找到合适的，立即退出循环
			break;
		}
	}
	return validFlag;
}

function saveRecord(){
    $('.saveRecordBtn').unbind('click');
    
    var fileName = $('#uploadFile').val();
	
	var validFlag = fileIsValid(fileName); //状态
	//条件判断
	if(validFlag){
		$('#addForm').submit();
	}else{
		alert('请选择合法的(xls|xlsx|csv)格式文件');
	}
    
    if($('#addForm').valid()){
    }else{
        $('.saveRecordBtn').bind('click',function(){saveRecord();});
    }
}

function formParamsError(message){
    layer.msg(message);
    $('.saveRecordBtn').bind('click',function(){saveRecord();});
}


/**
 * 返回列表页面
 */
function goBack(){
    parent.closeLayer();
}