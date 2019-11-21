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
function closeAll(text){
    layer.closeAll();
    layer.msg(text);
}

/**
 * 添加型号
 * @param productId
 */
function addModel(productId){
    var url = '/instalment/onlinegoods/addmodel?productId='+ productId;
    layer.open({
        type:2,
        title:'添加型号',
        shadeClose:false,
        shade:0.8,
        content:url,
        area:['750px','600px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 修改型号
 * @param modelId
 */
function editModel(modelId){
    var url = '/instalment/onlinegoods/editmodel?modelId='+ modelId;
    layer.open({
        type:2,
        title:'修改型号',
        shadeClose:false,
        shade:0.8,
        content:url,
        area:['750px','600px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 修改型号规格信息
 * @param modelId
 */
function editModelParam(modelId){
    layer.open({
        type:2,
        title:'商品规格',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/param/index?modelId=' + modelId,
        area:['90%','90%'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 指定型号分期信息
 * @param modelId
 */
function showRule(modelId){
    layer.open({
        type:2,
        title:'分期信息',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/onlinegoods/rulelist?modelId=' + modelId,
        area:['90%','90%'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 修改型号状态
 * @param modelId
 * @param status
 * @param statusText
 */
function statusControl(modelId, status,statusText){
    var index = layer.load(1,{shade: [0.1,'#fff']});
    var msg = '是否确认' +statusText;
    var params = {
        modelId: modelId,
        status: status
    };
    layer.confirm(msg,{btn:['确定','取消'],closeBtn:0},function(){
        $.post("/instalment/onlinegoods/updatemodelstatus",params,function (res) {
            layer.close(index);
            if(res.code === '1000'){
                layer.msg('状态更新成功');
                window.location.reload()
            }else{
                layer.msg('状态更新失败');
            }
        },'json');
    },function(){
        layer.close(index);
    });
}