$().ready(function(){

    $('.editRecordBtn').bind('click',function(){editRecord();});

    // 表单验证
    $('#addForm').validate({
        rules:{
            invoiceId: {
                required:true
                ,maxlength:32
            }
            ,invoiceName: {
                required:true
                ,maxlength:64
            }
            ,sendeeId: {
                required:true
            }
        }
        ,message:{
            invoiceId: {
                required:"请输入发票ID"
                ,maxlength:"发票ID最大32个字符"
            }
            ,invoiceName: {
                required:"请输入发票名称"
                ,maxlength:"发票名称最大64个字符"
            }
            ,sendeeId: {
                required:"请选择收票人"
            }
        }
    });

});

/**
 * 修改发票
 */
function editRecord(){
    $('.editRecordBtn').unbind('click');

    if($('#editForm').valid()){
        var params = {
            sendeeId:$("#sendeeId").val(),
            invoiceId:$("#invoiceId").val(),
            invoiceName:$("#invoiceName").val()
        };
        $.ajax({
            type:'POST'
            ,url:'/caiwu/invoice/updaterecord'
            ,data:params
            ,cache:false
            ,async:false
            ,timeout:60000
            ,success: function (data) {
                if(data.code === 'Y'){
                    layer.msg('修改发票成功。');
                    parent.reload();
                }else{
                    layer.msg(data.text);
                }
            }
        });
    }else{
        $('.editRecordBtn').bind('click',function(){editRecord();});
    }
}


function goBack(){
    parent.closeLayer();
}