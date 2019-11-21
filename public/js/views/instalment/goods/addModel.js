/**
 * 错误信息
 * @param msg
 */
function errorBox(msg){
    layer.msg(msg,{icon: 5,time: 2000});
}

/**
 * 成功信息
 * @param msg
 */
function successBox(msg){
    layer.msg(msg,{icon: 6,time: 2000});
}

/**
 * 关闭所有弹窗
 * @param text
 */
function closeAll(text) {
    layer.closeAll();
    layer.msg(text);
}

/**
 * 添加图片页面
 * @param imgType
 * @param files
 */
function addImg(imgType,files){
    var content = '/instalment/file/uploadimg?imgType='+imgType + '&files=' + encodeURIComponent(files);
    layer.open({
        type:2,
        title:'添加图片',
        shadeClose:false,
        shade:0.8,
        content:content,
        area:['500px' , '350px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 设置图片路径
 * @param path
 * @param type
 */
function setImgPath(path,type){
    switch(type){
        case 'MODEL_MAIN':
            addModelApp.params.imgPath = path; // 型号图片
            break;
        default:
            break;
    }
    layer.closeAll();
}

$().ready(function(){
    $("#modelForm").validate({
        rules: {
            productId: {
                required: true
            },
            modelName: {
                required: true,
                maxlength:200
            },
            attrList:{
                required: true
            },
            imgPath: {
                maxlength: 500
            },
            remarks: {
                maxlength: 200
            }
        },
        messages: {
            productId: {
                required: "缺少商品编号"
            },
            modelName: {
                required: "请选择型号名称",
                maxlength: "最多200字符"
            },
            attrList: {
                required: "请选择商品属性"
            },
            imgPath: {
                maxlength: "最多512字符"
            },
            remarks: {
                required: "最多200个字符"
            }
        }
    });
});

function saveModel(params){
    var index = layer.load(1,{shade: [0.1,'#fff']});
    if($('#modelForm').valid()) {
        $.ajax({
            type: "POST",
            url: "/instalment/goods/savemodel",
            data: params,
            dataType: "json",
            timeout: 30000,
            cache:false,
            success: function(data){
                if(data.code === '1000'){
                    successBox('保存成功');
                    window.parent.location.href = window.parent.location.href;
                }else{
                    layer.close(index);
                    errorBox(data.msg);
                }
            },
            error: function(){
                layer.close(index);
                errorBox('网络错误');
            }
        });
    }else{
        layer.close(index);
    }
}