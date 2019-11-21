
function addLabel(index,label,productId){
    var loadIndex = layer.load(2, {time: 3*1000});
    var labelId = label.PKID;
    $.ajax({
        type: "POST",
        url: "/instalment/label/addlabeltoproduct/",
        data: {labelId:labelId, productId:productId},
        dataType: "json",
        timeout: 30000,
        cache:false,
        success: function(data){
            layer.close(loadIndex);
            if(data.code){
                layer.msg('添加成功', {icon: 1});
                saveLabelApp.addLabSuccess(index,label);
            }else{
                layer.msg(data.text, {icon: 2});
            }
        },
        error: function(){
            layer.close(loadIndex);
            layer.alert('网络错误');
        }
    });
}

function closeLab(index,label,productId){
    var loadIndex = layer.load(2, {time: 3*1000});
    var labelId = label.PKID;
    $.ajax({
        type: "POST",
        url: "/instalment/label/desclabelfromproduct/",
        data: {labelId:labelId, productId:productId},
        dataType: "json",
        timeout: 30000,
        cache:false,
        success: function(data){
            layer.close(loadIndex);
            if(data.code){
                saveLabelApp.closeLabSuccess(index,label);
                layer.msg('删除成功', {icon: 1});
            }else{
                layer.msg(data.text, {icon: 2});
            }
        },
        error: function(){
            layer.close(loadIndex);
            layer.alert('网络错误');
        }
    });
}