$().ready(function(){

    $('.saveRedBtn').bind('click',function(){saveRed();});

    // 表单验证
    $('#addForm').validate({
        rules:{
            invoiceId: {
                required:true
                ,maxlength:32
            }
            ,chyy: {
                required:true
            }
        }
        ,message:{
            invoiceId: {
                required:"请输入发票ID"
                ,maxlength:"发票ID最大32个字符"
            }
            ,chyy: {
                required:"请输入冲红原因"
            }
        }
    });

});

function saveRed(){
    $('.saveRedBtn').unbind('click');

    if($('#addForm').valid()){
        var params = {
            invoiceId:$("#invoiceId").val(),
            chyy:$("#chyy").val()
        };
        $.ajax({
            type:'POST'
            ,url:'/caiwu/invoice/openredinvoice'
            ,data:params
            ,cache:false
            ,async:false
            ,timeout:60000
            ,success: function (data) {
                if(data.code === 'Y'){
                    layer.msg('开红票成功');
                    parent.reload();
                }else{
                    layer.msg(data.text);
                }
            }
        });
    }else{
        $('.saveRedBtn').bind('click',function(){saveRed();});
    }
}

function formParamsError(message){
    layer.msg(message);
    $('.saveRedBtn').bind('click',function(){saveRed();});
}

function goBack(){
    parent.closeLayer();
}