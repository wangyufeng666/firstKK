function updateSeq(productId,labelId,seq){
    var index = layer.load(2, {time: 3*1000});
    $.ajax({
        type: "POST",
        url: "/instalment/label/setlabelseq/",
        data: {productId:productId, labelId:labelId,seq:seq},
        dataType: "json",
        timeout: 30000,
        cache:false,
        success: function(data){
            layer.close(index);
            if(data.code){
                layer.msg('修改成功', {icon: 1});
                location.reload();
            }else{
                layer.msg(data.text, {icon: 2});
            }
        },
        error: function(){
            layer.close(index);
            layer.alert('网络错误');
        }
    });
}
