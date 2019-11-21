/*
* @Author: ydm
* @Date:   2018-08-08 17:09:43
* @Last Modified by:   ydm
* @Last Modified time: 2018-08-23 14:58:21
*/
$().ready(function(){
    $('#saveorderBtn').bind('click',function(){save();});
    $('#updateorderBtn').bind('click',function(){update();})
    $('#addForm').validate({
        rules:{
            username:{required:true},
            password:{required:true},
            legalperson:{required:true},
            legalpersonmobile:{required:true},
        },
        messages:{
            username:{required:'请输入用户名'},
            password:{required:'请输入密码'},
            legalperson:{required:'请输入店主姓名'},
            legalpersonmobile:{required:'请输入店主联系方式'},
        },
    });

});
function goBack(){
    parent.reload();
}

//更新新密码
function savepwd(){
    var pwd = $('#password').val();
    var pkid = $('#pkid').val();
    $.ajax({
            type:'post',
            datatype:'json',
            url:'/offline/store/savepwd',
            data:{pwd:pwd},
            cache:false,
            async:false,
            timeout:60000,
            success:function(data){
                if(data == 'Y'){
                    layer.msg('更新成功！',{time:1000},function(){
                        parent.reload();
                    });
                }else{
                    layer.alert('更新失败');
                }
            }
    })
}

//更新
function update(){
    $('#updateorderBtn').unbind('click');
    if($('#addForm').valid()){
        var param = {};       
        param.registype = $('input[name=registype]:checked').val();
        param.username = $('#username').val();
        param.legalperson = $('#legalperson').val();
        param.legalpersonmobile = $('#legalpersonmobile').val();
        param.pkid = $('#pkid').val();
        $.ajax({
            type:'post',
            datatype:'json',
            url:'/offline/store/updateorder',
            data:param,
            cache:false,
            async:false,
            timeout:60000,
            success:function(data){
               if(data['result'] == 'PN'){
                    layer.msg('店主已存在！',{time:1000});
                }else if(data['result'] == 'MN'){
                    layer.msg('店主联系方式已存在');
                }else if(data['result'] == 'N'){
                    layer.msg('更新失败');                	
                }else if(data['result'] == 'Y'){
                    layer.msg('更新成功！',{time:1000},function(){
                        parent.reload();
                   });                   
                                            
                }
               
                $('#updateorderBtn').bind('click',function(){update();});
            }
        });   
    }else{
        $('#updateorderBtn').bind('click',function(){update();});
    }
}

//保存
function save(){
    $('#saveorderBtn').unbind('click');
    if($('#addForm').valid()){
        var param = {};       
        param.registype = $('input[name=registype]:checked').val();
        param.username = $('#username').val();
        param.password = $('#password').val();
        param.legalperson = $('#legalperson').val();
        param.legalpersonmobile = $('#legalpersonmobile').val();
        param.partnercode = $('#partnercode').val();
        $.ajax({
            type:'post',
            datatype:'json',
            url:'/offline/store/saveorder',
            data:param,
            cache:false,
            async:false,
            timeout:60000,
            success:function(data){
                if(data['result'] == 'FN'){
                    layer.msg('该门店店主已存在',{time:1000});
                }else if(data['result'] == 'UN'){
                    layer.msg('用户名已存在',{time:1000});
                }else if(data['result'] == 'PN'){
                    layer.msg('店主已存在！',{time:1000});
                }else if(data['result'] == 'MN'){
                    layer.msg('店主联系方式已存在');
                }else if(data['result'] == 'Y'){
                   layer.msg('保存成功！');                   
                    parent.reload();                        
                }
               
                $('#saveorderBtn').bind('click',function(){save();});
            }
        });   
    }else{
        $('#saveorderBtn').bind('click',function(){save();});
    }
}
