/*
* @Author: ydm
* @Date:   2018-08-08 17:09:43
* @Last Modified by:   ydm
* @Last Modified time: 2018-09-17 14:30:52
*/
$().ready(function(){
    
    $('#updatestoreBtn').bind('click',function(){update();});
    $('#saveAddstoreBtn').bind('click',function(){save('add');});
    $('#savestoreeBtn').bind('click',function(){save();});
    $('#addForm').validate({
        rules:{
            partnerName:{required:true},
            partnerCode:{required:true},
            nickName:{required:true},
            partnertype:{required:true},
            address:{required:true},
            contacts:{required:true},
            contactway:{required:true},
            seq:{required:true},
            parentcode:{required:true},
            businessCode:{required:true}

        },
        messages:{
            partnerName:{required:'请输入门店名称'},
            partnerCode:{required:'请输入门店编码'},
            nickName:{required:'请输入门店别名'},
            partnertype:{required:'请选择门店类型'},
            address:{required:'请输入门店地址'},
            contacts:{required:'请输入联系人姓名'},
            contactway:{required:'请输入联系人联系方式'},
            seq:{required:'请输入排序'},
            businessCode:{required:'请选择合作商业务编码'},
            parentcode:{required:'请输入集团类型编码'},
        },
    });

});
function goBack(){
    parent.reload();
}
//编辑保存
function update(){
    $('#updatestoreBtn').unbind('click');
    if($('#addForm').valid()){
        var param = {};       
        param.partnerstatus = $('input[name=partnerstatus]:checked').val();
        param.auditstatus = $('input[name=auditstatus]:checked').val();
        param.partnerName = $('#partnerName').val();
        param.nickName = $('#nickName').val();
        param.address = $('#address').val();
        param.contacts = $('#contacts').val();
        param.contactway = $('#contactway').val();
        param.seq = $('#seq').val();
        param.partnerid = $('#partnerid').val();
        $.ajax({
            type:'post',
            datatype:'json',
            url:'/offline/store/updatestore',
            data:param,
            cache:false,
            async:false,
            timeout:60000,
            success:function(data){
               if(data['result'] == 'Y'){
                   layer.msg('更新成功！');                   
                    parent.reload();                        
                }else if(data['result'] == 'CTN'){
                    layer.msg('联系人已存在！',{time:1000});
                }else if(data['result'] == 'MN'){
                    layer.msg('联系电话已存在');
                }
                $('#updatestoreBtn').bind('click',function(){save();});
            }
        });   
    }else{
        $('#updatestoreBtn').bind('click',function(){update();});
    }
}
//新增保存
function save(flag){
    $('#updatestoreBtn,#saveAddstoreBtn,#savestoreeBtn').unbind('click');
    if($('#addForm').valid()){
        var param = {};
        
        param.partnerstatus = $('input[name=partnerstatus]:checked').val();
        param.businesstype = $('input[name=businesstype]:checked').val();
        param.loginway = $('input[name=loginway]:checked').val();
        param.auditstatus = $('input[name=auditstatus]:checked').val();
        param.partnerName = $('#partnerName').val();
        param.partnerCode = $('#partnerCode').val();
        param.nickName = $('#nickName').val();
        param.address = $('#address').val();
        param.contacts = $('#contacts').val();
        param.contactway = $('#contactway').val();
        param.seq = $('#seq').val();
        param.parentcode = $('#parentcode').val();
        param.partnertype = $('#partnertype').val();
        param.businessCode = $('#businessCode option:selected').val();
        $.ajax({
            type:'post',
            datatype:'json',
            url:'/offline/store/savestore',
            data:param,
            cache:false,
            async:false,
            timeout:60000,
            success:function(data){
                $('#updatestoreBtn').bind('click',function(){save('edit');});
                $('#saveAddstoreBtn').bind('click',function(){save('add');});
                $('#savestoreeBtn').bind('click',function(){save();});
               if(data['result'] == 'Y'){
                   layer.msg('新增成功！');   
                   if(flag == 'add'){
                        location.reload(); 
                   }else{
                        parent.reload();
                   }       
                }else if(data['result'] == 'PN'){
                    layer.msg('集团编码不存在');
                }else if(data['result'] == 'CN'){
                    layer.msg('门店编码已存在！',{time:1000});
                }else if(data['result'] == 'CTN'){
                    layer.msg('联系人已存在！',{time:1000});
                }else if(data['result'] == 'MN'){
                    layer.msg('联系方式已存在');
                }else if(data['result'] == 'N'){
                	layer.msg('新增失败');
                }
            }
            
        });   
    }else{
        $('#updatestoreBtn').bind('click',function(){save('edit');});
        $('#saveAddstoreBtn').bind('click',function(){save('add');});
        $('#savestoreeBtn').bind('click',function(){save();});
    }
}
