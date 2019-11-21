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
            invoiceName: {
                required:true
                ,maxlength:64
            }
            ,sendeeId: {
                required:true
            }
            ,uploadFile: {
                required:true
            }
        }
        ,message:{
            invoiceName: {
                required:"请输入发票名称"
                ,maxlength:"发票名称最大64个字符"
            }
            ,sendeeId: {
                required:"请选择收票人"
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

function addInvoiceSendee(){
    var backUrl = encodeURIComponent(window.location.href);
    window.location.href = '/caiwu/invoice/addsendee?backUrl='+backUrl + '&outLink=Y';
}

function goBack(){
    parent.closeLayer();
}