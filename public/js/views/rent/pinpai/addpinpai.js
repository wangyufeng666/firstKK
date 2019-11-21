/*
* @Author: ydm
* @Date:   2018-08-08 17:09:43
* @Last Modified by:   ydm
* @Last Modified time: 2018-08-14 13:52:48
*/
$().ready(function(){

    $('#saveBrand').bind('click',function(){save();});
    $('#addForm').validate({
        rules:{
            merType:{required:true},
            pName:{required:true,maxlength:64},
            eName:{required:true,maxlength:64},
            seq:{required:true},
            imgPath:{required:true}

        },
        messages:{
            merType:{required:'请选择品类名称'},
            pName:{required:"请填写品牌名称",maxlength: "品牌名不能大于{0}个字符"},
            eName:{required:'请填写品牌编码',maxlength: "英文名不能大于{0}个字符"},
            seq:{required:'请填写品牌排序'},
            imgPath:{required:'请添加图片'}
        }
    });

});
function goBack(){
    parent.reload();
}

function save(){
    $('#saveBrand').unbind('click');
    if($('#addForm').valid()){
        var param = {};
        var flag = $('#saveBrand').attr('data-type');
        if(flag == 'edit'){
            param.merType = $('#merType').val();
        }else{
            param.merType = $('#merType option:selected').val();
        }
        param.pName = $('#pName').val();
        param.eName = $('#eName').val();
        param.seq = $('#seq').val();
        //param.imgPath = $('#imgPath').val();
        param.isEnable = $('input[name="isEnable"]:checked').val();
        param.pId = $('#pId').val();
        $.ajax({
            type:'post',
            datatype:'json',
            url:'/rent/pinpai/savepinpai',
            data:param,
            cache:false,
            async:false,
            timeout:60000,
            success:function(data){
                if(data['code'] === '1000'){
                    layer.msg('更新成功！');
                    parent.reload();
                }else{
                    layer.msg(data['msg']);
                    $('#saveBrand').bind('click',function(){save();});
                }
            }
        });   
    }else{
        $('#saveBrand').bind('click',function(){save();});
    }
}
