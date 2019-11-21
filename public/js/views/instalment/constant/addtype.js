$().ready(function(){


    $('#saveTypeBtn').bind('click',function(){saveType();});

    // 表单验证
    $('#addForm').validate({
        rules:{
            sourceCode: {
                required:true
            },
            name: {
                required:true
                ,maxlength:50
            },
        }
        ,message:{
            sourceCode: {
                required:"请输入终端来源",
            },
            name: {
                required:"请输入类型名称",
                maxlength:"类型名称最大50个字符"
            },
        }
    });
});

function goBack(){
    parent.closeLayer();
}

function saveType(){
    $('#saveTypeBtn').unbind('click');

    if($('#addForm').valid()){

        var params = {
            sourceCode:$("#sourceCode").val(),
            name:$("#name").val(),
            key:$("#key").val(),
        };


        $.ajax({
            type:'POST'
            ,url:'/instalment/constant/savetype'
            ,data:params
            ,cache:false
            ,async:false
            ,timeout:60000
            ,success: function (data) {
                if(data.code){
                    layer.msg('保存配置类型成功');
                    parent.reload();
                }else{
                    layer.msg(data.text);
                }
            }
        });
    }else{
        $('#saveTypeBtn').bind('click',function(){saveType();});
    }
}

function formParamsError(message){
    layer.msg(message);
    $('#saveTypeBtn').bind('click',function(){saveType();});
}
