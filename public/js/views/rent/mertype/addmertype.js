/*
* @Author: ydm
* @Date:   2018-08-08 17:09:43
* @Last Modified by:   ydm
* @Last Modified time: 2018-08-14 13:50:39
*/
$().ready(function(){
    $('#saveMerTypeBtn').bind('click',function(){save();});
    $('#addForm').validate({
        rules:{
            typeName:{required:true,maxlength:32},
            typeCode:{required:true,maxlength:5},
            seq:{required:true}
        },
        messages:{
            typeName:{required:"请填写品类名称",maxlength: "品类名不能大于{0}个字符"},
            typeCode:{required:'请填写品类编码',maxlength: "品类编码不能大于{0}个字符"},
            seq:{required:'请填写品类排序'}
        }
    });

});
function goBack(){
    parent.reload();
}

function save(){
    $('#saveMerTypeBtn').unbind('click');
    if($('#addForm').valid()){
        var param = {};
        param.typeName = $('#typeName').val();
        param.typeCode = $('#typeCode').val();
        param.seq = $('#seq').val();
        param.status = $('input[name="status"]:checked').val();
        param.typeId = $('#typeId').val();

        $.ajax({
            type:'post',
            datatype:'json',
            url:'/rent/mertype/savemertype',
            data:param,
            cache:false,
            async:false,
            timeout:60000,
            success:function(data){
                if(data['code'] === '1000'){
                    layer.msg('更新成功！',{time:1000});
                    parent.reload();
                }else {
                    layer.msg(data['msg'],{time:1000});
                    $('#saveMerTypeBtn').bind('click',function(){save();});
                }
            }
        });
    
    }else{
        $('#saveMerTypeBtn').bind('click',function(){save();});
    }
}
