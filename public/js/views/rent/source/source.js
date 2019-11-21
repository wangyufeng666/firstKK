/**
 * 功能描述：save source
 * @createdate 2019/4/28 10:58
 * @version    V1.0.1
 * @author     yangzp
 * @copyright  2019 上海晨骏网络科技有限公司 版权所有
*/
var funcs = {};
    funcs.param = {};
    funcs.param.flag = false;

//取消
funcs.goBack = function()
{
    parent.funcs.reload();
}

//保存source
funcs.saveSource = function()
{
    if($('#sourceForm').valid() && !funcs.param.flag)
    {
        funcs.param.flag = true;
        var param = {};
            param.pkId = $("input[name=pkId]").val();
            param.sourceCode = $("input[name=sourceCode]").val();
            param.sourceName = $("input[name=sourceName]").val();
            $.post("/rent/source/save",param,function (res)
            {
                if(!res.success)
                {
                    funcs.param.flag = false;
                    layer.msg(res.msg,{time:2000});
                    return false;
                }

                layer.msg("保存成功",{time:2000});
                parent.funcs.reload();
            },"json");
    }
}

$(document).ready(function(){
    $('#saveSource').click(funcs.saveSource);
    $('#goBack').click(funcs.goBack);
    $('#sourceForm').validate({
        rules:{
            sourceCode:{required:true,maxlength:64},
            sourceName:{required:true,maxlength:64},
        },
        messages:{
            sourceCode:{required:"请填写来源编码",maxlength: "来源编码不能大于{0}个字符"},
            sourceName:{required:'请填写来源名称',maxlength: "来源名称不能大于{0}个字符"},
        }
    });
});