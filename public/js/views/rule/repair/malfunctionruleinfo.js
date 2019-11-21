$().ready(function(){
    $("#goBack").click(function(){
        window.location.href = backUrl+'?backFlag=Y&start='+start;
    });
    $("#addmalfunctionitem").click(function(){addItem()});
    $(".edit-item-btn").bind('click', function(){editItem($(this))});
    $(".add-detail-btn").click(function(){addDetail($(this));});
    $(".del-detail").bind("click", function(){delDetail($(this))});
    $(".edit-detail").bind("click", function(){editDetail($(this))});
    $(".del-item-btn").bind('click', function(){delItem($(this))});
});

function addDetail(obj){
    var itemId = obj.parents('.items').attr('itemId');
    $.layer({
        type:2,
        title:'添加故障详情',
        iframe:{src : '/rule/repair/addmalfunctiondetail?ruleId='+ruleId+'&itemId='+itemId},
        area : ['450', '400'],
        offset : ['50px',''],
        close : function(index){
            window.location.href = window.location.href;
            layer.close(index);
        }
    });
}

function addItem(){
    $.layer({
        type:2,
        title:'添加故障分类',
        iframe:{src : '/rule/repair/addmalfunctionitem?ruleId='+ruleId},
        area : ['450', '500'],
        offset : ['50px',''],
        close : function(index){
            window.location.href = window.location.href;
            layer.close(index);
        }
    });
}

function editItem(obj){
    var itemId = obj.parents(".items").attr("itemId");
    $.layer({
        type:2,
        title:'修改故障分类',
        iframe:{src : '/rule/repair/editmalfunctionitem?ruleId='+ruleId+"&itemId="+itemId},
        area : ['450', '400'],
        offset : ['50px',''],
        close : function(index){
            window.location.href = window.location.href;
            layer.close(index);
        }
    });
}

function delItem(obj){
    var itemId = obj.parents(".items").attr("itemId");
    $.layer({
        shade: [0],
        area: ['auto','auto'],
        dialog: {
            msg: '是否删除故障？',
            btns: 2,                    
            type: 4,
            btn: ['是','否'],
            yes: function(){
                var loadi = layer.load('正在删除…');
                $.ajax({
                    type:'POST'//请求方式
                    ,url:"/rule/repair/delmalfunctionitem"  //请求路径
                    ,data:{itemId:itemId, ruleId:ruleId}  //发送到服务器的数据
                    ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
                    ,async:false //同步请求
                    ,timeout:60000//默认超时60秒
                    ,dataType:'json' //预期服务器返回的数据类型
                    ,success:function(data){
                        layer.close(loadi);
                        if(data == "Y"){
                            layer.msg('删除成功', 2, 1);
                            window.location.href = window.location.href;
                        }else{
                            layer.msg('删除失败');
                        }
                    }
                    ,error:function(){
                        layer.close(loadi);
                        layer.msg('删除失败');
                    }
                });
            }
        }
    });
}

function delDetail(obj){
    var itemId = obj.parents(".items ").attr("itemId");
    var detailId = obj.parents(".detail").attr('detailId');
    $.layer({
        shade: [0],
        area: ['auto','auto'],
        dialog: {
            msg: '是否删除故障？',
            btns: 2,                    
            type: 4,
            btn: ['是','否'],
            yes: function(){
                var loadi = layer.load('正在删除…');
                $.ajax({
                    type:'POST'//请求方式
                    ,url:"/rule/repair/deldetail"  //请求路径
                    ,data:{itemId:itemId, detailId:detailId}  //发送到服务器的数据
                    ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
                    ,async:false //同步请求
                    ,timeout:60000//默认超时60秒
                    ,dataType:'json' //预期服务器返回的数据类型
                    ,success:function(data){
                        layer.close(loadi);
                        if(data == "Y"){
                            layer.msg('删除成功', 2, 1);
                            window.location.href = window.location.href;
                        }else{
                            layer.msg('删除失败');
                        }
                    }
                    ,error:function(){
                        layer.close(loadi);
                        layer.msg('删除失败');
                    }
                });
            }
        }
    });
}

function editDetail(obj){
    var itemId = obj.parents(".items ").attr("itemId");
    var detailId = obj.parents(".detail").attr('detailId');
    $.layer({
        type:2,
        title:'修改故障详情',
        iframe:{src : '/rule/repair/editmalfunctiondetail?ruleId='+ruleId+'&itemId='+itemId+"&detailId="+detailId},
        area : ['450', '400'],
        offset : ['50px',''],
        close : function(index){
            window.location.href = window.location.href;
            layer.close(index);
        }
    });
}