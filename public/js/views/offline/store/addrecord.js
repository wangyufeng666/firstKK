/*
* @Author: ydm
* @Date:   2018-08-21 10:59:40
* @Last Modified by:   ydm
* @Last Modified time: 2018-08-23 13:12:45
*/


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

function addInvoiceSendee(){
    var backUrl = encodeURIComponent(window.location.href);
    window.location.href = '/caiwu/invoice/addsendee?backUrl='+backUrl + '&outLink=Y';
}

function goBack(){
    parent.reload();
}