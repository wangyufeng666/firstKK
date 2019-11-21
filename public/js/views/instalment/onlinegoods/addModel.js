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
 * 打开选择型号页面
 * @param productId
 * @param modelId
 */
function showModelList(productId,modelId){
    var url = '/instalment/onlinegoods/selectmodel?productId='+ productId + "&modelId=" + modelId;
    layer.open({
        type:2,
        title:'选择型号',
        shadeClose:false,
        shade:0.8,
        content:url,
        area:['700px','500px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 打开选择分期页面
 * @param ruleList
 */
function showRulelList(ruleList){
    var url = '/instalment/onlinegoods/selectrule?ruleList=' + ruleList;
    layer.open({
        type:2,
        title:'选择分期',
        shadeClose:false,
        shade:0.8,
        content:url,
        area:['700px','500px'],
        close:function(index){
            layer.close(index);
        }
    });
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
    // $("#modelForm").validate({
    //     rules: {
    //         productId: {
    //             required: true
    //         },
    //         itemId:{
    //             required: true
    //         },
    //         goodsModelId:{
    //             required: true
    //         },
    //         newProductPrice:{
    //             required: true,
    //             number:true
    //         },
    //         oldProductPrice:{
    //             required: true,
    //             number:true
    //         },
    //         recoveryPrice:{
    //             required: true,
    //             number:true
    //         },
    //         modelName: {
    //             required: true,
    //             maxlength:200
    //         },
    //         ruleList:{
    //             required: true
    //         },
    //         imgPath: {
    //             maxlength: 500
    //         },
    //         remarks: {
    //             maxlength: 200
    //         }
    //     },
    //     messages: {
    //         productId: {
    //             required: "缺少商品编号"
    //         },
    //         itemId:{
    //             required: "缺少库商品编号"
    //         },
    //         goodsModelId:{
    //             required: "缺少型号编号"
    //         },
    //         newProductPrice:{
    //             required: "缺少新机价格",
    //             number:"必须是数字"
    //         },
    //         oldProductPrice:{
        //             required: "缺少旧机价格",
    //             number:"必须是数字"
    //         },
    //         recoveryPrice:{
    //             required: "缺少回收价格",
    //             number:"必须是数字"
    //         },
    //         modelName: {
    //             required: "请选择型号名称",
    //             maxlength: "最多200字符"
    //         },
    //         ruleList:{
    //             required: "请选择分期"
    //         },
    //         imgPath: {
    //             maxlength: "最多512字符"
    //         },
    //         remarks: {
    //             required: "最多200个字符"
    //         }
    //     },
    //     errorPlacement: function(error, element) {
    //         console.log(error,element)
    //     }
    // });
});

function saveModel(params){
    var index = layer.load(1,{shade: [0.1,'#fff']});
    // if($('#modelForm').valid()) {
    $.ajax({
        type: "POST",
        url: "/instalment/onlinegoods/savemodel",
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
    // }else{
    //     layer.close(index);
    // }
}