$().ready(function(){


    $('#saveConstantTypeBtn').bind('click',function(){saveConstantType();});

    // 表单验证
    $('#addForm').validate({
        rules:{
            name: {
                required:true
                ,maxlength:50
            },
        }
        ,message:{
            name: {
                required:"请输入终端来源",
                maxlength:"终端来源名称最大50个字符"
            },
        }
    });
});

function goBack(){
    parent.closeLayer();
}

function saveConstantType(){
    $('#saveConstantTypeBtn').unbind('click');

    if($('#addForm').valid()){

        var params = {
            name:$("#name").val(),
        };


        $.ajax({
            type:'POST'
            ,url:'/instalment/constant/saveconstanttype'
            ,data:params
            ,cache:false
            ,async:false
            ,timeout:60000
            ,success: function (data) {
                if(data.code){
                    layer.msg('保存终端来源成功');
                    parent.reload();
                }else{
                    layer.msg(data.text);
                }
            }
        });
    }else{
        $('#saveBannerTypeBtn').bind('click',function(){saveConstantType();});
    }
}

function formParamsError(message){
    layer.msg(message);
    $('#saveBannerTypeBtn').bind('click',function(){saveConstantType();});
}
