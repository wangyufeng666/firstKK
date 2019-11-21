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
 * 修改分期信息
 * @param params
 */
function saveRule(params){
    var index = layer.load(1,{shade: [0.1,'#fff']});
    $.post("/instalment/onlinegoods/saverule",params,function (res) {
        layer.close(index);
        if(res.code === '1000'){
            layer.msg('状态更新成功');
            parent.reload();
        }else{
            layer.msg('状态更新失败');
        }
    },'json');
}

/*********************************************     OLD         ********************************************/




