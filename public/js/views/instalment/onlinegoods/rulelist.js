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

function reload(){
    layer.closeAll();
    window.location.reload()
}

/**
 * 保存报价
 * @param modelId
 * @param ruleId
 */
function saveRuleInfo(modelId,ruleId){
    var url = '/instalment/onlinegoods/saverulepage?modelId='+ modelId + '&ruleId=' + ruleId;
    layer.open({
        type:2,
        title:'保存报价',
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
 * 修改型号状态
 * @param modelId
 * @param ruleId
 * @param status
 * @param statusText
 */
function statusControl(modelId,ruleId,status,statusText){
    var index = layer.load(1,{shade: [0.1,'#fff']});
    var msg = '是否确认' +statusText;
    var params = {
        modelId: modelId,
        ruleId: ruleId,
        status: status
    };
    layer.confirm(msg,{btn:['确定','取消'],closeBtn:0},function(){
        $.post("/instalment/onlinegoods/updatemodelrulestatus",params,function (res) {
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


