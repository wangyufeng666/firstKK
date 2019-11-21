$().ready(function(){
    $('#optional').change(function(){
        var optionalObj = $(this);
        var optionalVal = optionalObj.val();
        $("#param").val(optionalVal);
    });

    $('#saveConstantBtn').bind('click',function(){saveConstant();});

    // 表单验证
    $('#addForm').validate({
        rules:{
            pkId: {
                required:true
            },
            param: {
                required:true
            }
        }
        ,message:{
            pkId: {
                required:"请输入类型编码",
            },
            param: {
                required:"请输入配置值",
            }
        }
    });
});

function goBack(){
    parent.closeLayer();
}

function saveConstant(){
    $('#saveConstantBtn').unbind('click');

    if($('#addForm').valid()){

        var params = {
            pkId:$("#pkId").val(),
            value:$("#param").val(),
            key:$("#key").val()
        };


        $.ajax({
            type:'POST'
            ,url:'/instalment/constant/changevalue'
            ,data:params
            ,cache:false
            ,async:false
            ,timeout:60000
            ,success: function (data) {
                if(data.code){
                    layer.msg('修改配置成功');
                    parent.reload();
                }else{
                    layer.msg(data.text);
                }
            }
        });
    }else{
        $('#saveConstantBtn').bind('click',function(){saveConstant();});
    }
}

function formParamsError(message){
    layer.msg(message);
    $('#saveConstantBtn').bind('click',function(){saveConstant();});
}
