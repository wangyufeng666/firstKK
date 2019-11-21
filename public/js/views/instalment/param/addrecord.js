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
            modelId: {
                required:true
            }
            ,uploadFile: {
                required:true
            }
        }
        ,message:{
            modelId: {
                required:"请输入规格ID"
            }
            ,uploadFile: {
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


function goBack(){
    parent.closeLayer();
}