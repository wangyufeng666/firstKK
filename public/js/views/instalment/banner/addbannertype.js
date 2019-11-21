$().ready(function(){


    $('#saveBannerTypeBtn').bind('click',function(){saveBannerType();});

    // 表单验证
    $('#addForm').validate({
        rules:{
            typeName: {
                required:true
                ,maxlength:50
            }
        }
        ,message:{
            typeName: {
                required:"请输入Banner类型名称",
                maxlength:"Banner类型名称最大50个字符"
            }
        }
    });
});

function goBack(){
    parent.closeLayer();
}

function saveBannerType(){
    $('#saveBannerTypeBtn').unbind('click');

    if($('#addForm').valid()){

        var params = {
            typeName:$("#typeName").val(),
            note:$("#note").val(),
            isEdit:1
        };


        $.ajax({
            type:'POST'
            ,url:'/instalment/banner/savebannertype'
            ,data:params
            ,cache:false
            ,async:false
            ,timeout:60000
            ,success: function (data) {
                if(data.code){
                    layer.msg('保存Banner类型成功');
                    parent.reload();
                }else{
                    layer.msg(data.text);
                }
            }
        });
    }else{
        $('#saveBannerTypeBtn').bind('click',function(){saveBannerType();});
    }
}

function formParamsError(message){
    layer.msg(message);
    $('#saveBannerTypeBtn').bind('click',function(){saveBannerType();});
}
