/**
 * Created by Administrator on 2019/9/19.
 */
function saveInspection(){

    //器材描述
    var operFlag = true, radioIds = [], multiIds = [];

    //单选描述
    $('.inspectItem').each(function(){
        if($(this).val() == ''){
            $(this).addClass('error');
            operFlag = false;
        }else{
            radioIds.push($(this).val());
        }
    });

    var errorMsgs = [];

    //检测人
    var workerId = $("#worker").val();
    var workerName = $("#worker option:selected").text();

    if(workerId == ''){
        errorMsgs.push('请选择检测工程师');
    }


    //多选描述
    $('.check-box:checked').each(function(){
        multiIds.push($(this).val());
    });

    if(!operFlag){
        errorMsgs.push('请选择器材描述');
    }

    //商品等级
    var merLevel = $('.cz_level .on').attr('data-id');
    if(merLevel != 'S' && merLevel != 'A' && merLevel != 'B' && merLevel != 'C' && merLevel != 'D' && merLevel != '无'){
        errorMsgs.push('请选择商品等级');
    }
    var inspectionDesc = '';
    if(storeType == 'zz_1'){
        inspectionDesc = $('#inspectionDesc').val();
    }

    var params = {
        merId:merId,
        orderNo:orderNo,
        workerId:workerId,
        workerName:workerName,
        recyRuleId:recyRuleId,
        inspectionDesc:inspectionDesc,
        radioIds:radioIds.join('#'),
        multiIds:multiIds.join('#'),
        merLevel:merLevel
    };




    var abnormalText = $('#abnormalText').val();
    if(abnormalText && abnormalText != ''){
        if(abnormalText == 'other'){
            abnormalText = $('#abnormalDesc').val();
        }
    }

    if(errorMsgs.length > 0){
        alert(errorMsgs.join("\n"));
        return false;
    }

    params.abnormalText = abnormalText;

    var load1 = layer.load('保存检测信息，请稍后');
    $.post('/sale/saleproductv2/saveinspection', params, function(data){
        layer.close(load1);
        if(data == 'Y'){
            layer.msg('检测信息保存成功');
            parent.doSearch();
            var parentLayer = parent.layer.getFrameIndex(window.name);
            parent.layer.close(parentLayer);
        }else{
            layer.msg('检测信息保存失败：'+data);
        }
        //$('#btnSaveInfo').bind('click', function(){saveInspection('');});
        //$('#btnConfirmSave').bind('click', function(){saveInspection('Y');});
    });
}

$('.cz_level span').on('click',function(){
    $('.cz_level span').removeClass('on');
    $(this).addClass('on');
});