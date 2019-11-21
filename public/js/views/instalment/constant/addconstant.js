$().ready(function(){


    $('#saveConstantBtn').bind('click',function(){saveConstant();});

    // 表单验证
    $('#addForm').validate({
        rules:{
            sourceCode: {
                required:true
            },
            type: {
                required:true
            },
            modes: {
                required:true
            },
        }
        ,message:{
            sourceCode: {
                required:"请输入终端来源",
            },
            type: {
                required:"请输入类型名称",
            },
            modes: {
                required:"请输入模式",
            },
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
            sourceCode:$("#sourceCode").val(),
            type:$("#type").val(),
            key:$("#key").val(),
            keyName:$("#keyName").val(),
            modes:$("#modes").val(),
            param:$("#param").val(),
            optional:$("#optional").val()
        };


        $.ajax({
            type:'POST'
            ,url:'/instalment/constant/saveconstant'
            ,data:params
            ,cache:false
            ,async:false
            ,timeout:60000
            ,success: function (data) {
                if(data.code){
                    layer.msg('保存配置成功');
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
