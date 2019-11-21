$().ready(function(){
    $("#uploadFile").change(function(){
        var fileElement = $(this);
        if(fileElement[0].files[0].name != '' && fileElement[0].files[0].name != undefined ){
            $("#file_name").html(fileElement[0].files[0].name);
        }
    });

    $('.saveRecordBtn').bind('click',function(){saveRecord();});

    // 表单验证
    $('#addForm').validate({
        rules:{
           
            uploadFile: {
                required:true
            }
        }
        ,message:{
            uploadFile: {
                required:"请上传数据文件"
            }
        }
    });

});

function saveRecord(){
    $('.saveRecordBtn').unbind('click');

    if($('#addForm').valid()){
        $('#addForm').submit();
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