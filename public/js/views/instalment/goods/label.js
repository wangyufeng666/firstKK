
$().ready(function(){
    /**
     *  显示/隐藏 删除按钮
     */
    $("#selected-label-list").on("mouseover mouseout",".selected-label-name",function(event){
        if(event.type === "mouseover"){
            $(this).children('i').show();
        }else if(event.type === "mouseout"){
            $(this).children('i').hide();
        }
    });

    /**
     * 显示/隐藏 添加按钮
     */
    $("#label-list").on("mouseover mouseout",".label-name",function(event){
        if(event.type === "mouseover"){
            $(this).children('i').show();
        }else if(event.type === "mouseout"){
            $(this).children('i').hide();
        }
    });

    /**
     * 删除标签
     */
    $("#selected-label-list").on("click",".selected-label-close",function(){
        var parent = $(this).parent('.selected-label-name');
        delLabel(parent)
    });

    /**
     * 添加标签
     */
    $("#label-list").on("click",".label-add",function(event){
        var parent = $(this).parent('.label-name');
        addLabel(parent);
    });
});

function notSelectListNull(element){
    element.remove();
    var childrenCount = $('#label-list').children('button').length;
    if(childrenCount === 0){
        $('#label-list').html('<p class="noList">没有更多了...</p>');
    }
}

function addSelectedBtn(id,name){
    var childrenCount = $('#selected-label-list').children('button').length;
    if(childrenCount === 0){
        $('#selected-label-list').html('');
    }
    var button = '<button class="layui-btn selected-label-name" data-id="'+id+'" data-name="'+name+'">'+name+'<i class="layui-icon selected-label-close" >&#x1006;</i></button>';
    $('#selected-label-list').append(button);
}

function selectedListNull(element){
    element.remove();
    var childrenCount = $('#selected-label-list').children('button').length;
    if(childrenCount === 0){
        $('#selected-label-list').html('<p class="noList">没有更多了...</p>');
    }
}

function addUnSelectedBtn(id,name){
    var childrenCount = $('#label-list').children('button').length;
    if(childrenCount === 0){
        $('#label-list').html('');
    }
    var button = '<button class="layui-btn layui-btn-normal label-name" data-id="'+id+'" data-name="'+name+'">'+name+'<i class="layui-icon label-add" >&#xe654;</i></button>';
    $('#label-list').append(button);
}

function addLabel(element){
    var index = layer.load(2, {time: 3*1000});
    var labelId = element.data('id');
    var labelName = element.data('name');
    var productId = $("#productId").val();
    $.ajax({
        type: "POST",
        url: "/instalment/label/addlabeltoproduct/",
        data: {labelId:labelId, productId:productId},
        dataType: "json",
        timeout: 30000,
        cache:false,
        success: function(data){
            layer.close(index);
            if(data.code){
                layer.msg('添加成功', {icon: 1});
                notSelectListNull(element);
                addSelectedBtn(labelId,labelName);
            }else{
                layer.close(index);
                layer.msg(data.text, {icon: 2});
            }
        },
        error: function(){
            layer.close(index);
            layer.alert('网络错误');
        }
    });
}

function delLabel(element){
    var index = layer.load(2, {time: 3*1000});
    var labelId = element.data('id');
    var labelName = element.data('name');
    var productId = $("#productId").val();
    $.ajax({
        type: "POST",
        url: "/instalment/label/desclabelfromproduct/",
        data: {labelId:labelId, productId:productId},
        dataType: "json",
        timeout: 30000,
        cache:false,
        success: function(data){
            layer.close(index);
            if(data.code){
                layer.msg('删除成功', {icon: 1});
                selectedListNull(element);
                addUnSelectedBtn(labelId,labelName);
            }else{
                layer.close(index);
                layer.msg(data.text, {icon: 2});
            }
        },
        error: function(){
            layer.close(index);
            layer.alert('网络错误');
        }
    });
}