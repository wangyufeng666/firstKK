/**
 * 功能描述：
 * @createdate 2019/4/28 14:37
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

//保存sourceInfo
funcs.saveSourceInfo = function()
{

    if($('#sourceInfoForm').valid() && !funcs.param.flag)
    {
            funcs.param.flag = true;
        var param = {};
            param.pkId = $("input[name=pkId]").val();
            param.parentCode = $("select[name=parentCode]").val();
            param.outCode = $("input[name=outCode]").val();
            param.sourceCode = $("input[name=sourceCode]").val();
            param.sourceName = $("input[name=sourceName]").val();
            param.aliPayAppId = $("input[name=aliPayAppId]").val();
            param.payType = $("input[name=payType]").val();
            param.bannerId = $("input[name=bannerId]").val();
            param.showBufOff = $("input[name=showBufOff]:checked").val();
            param.isFundAuth = $("input[name=isFundAuth]:checked").val();
            param.encryptKey = $("input[name=encryptKey]").val();
            param.clientPublicKey = $("input[name=clientPublicKey]").val();
            param.clientPrivateKey = $("input[name=clientPrivateKey]").val();
            param.serverPublicKey = $("input[name=serverPublicKey]").val();
            param.serverPrivateKey = $("input[name=serverPrivateKey]").val();
            console.log(param);
            $.post('/rent/sourceinfo/save',param,function (res) {
                if(!res.success)
                {
                    funcs.param.flag = false;
                    layer.msg(res.msg,{time:2000});
                    return false;
                }

                layer.msg("保存成功",{time:2000});
                parent.funcs.reload();
            },'json');
    }




}




$(document).ready(function(){
    $('#saveSourceInfo').click(funcs.saveSourceInfo);
    $('#goBack').click(funcs.goBack);

    $('#sourceInfoForm').validate({
        rules:{
            parentCode:{required:true,maxlength:30},
            outCode:{required:true,maxlength:64},
            sourceCode:{required:true,maxlength:64},
            sourceName:{required:true,maxlength:64},
            aliPayAppId:{required:true,maxlength:64},
            payType:{required:true,maxlength:2},
            bannerId:{maxlength:64},
            encryptKey:{maxlength:255},
            clientPublicKey:{maxlength:500},
            clientPrivateKey:{maxlength:500},
            serverPublicKey:{maxlength:500},
            serverPrivateKey:{maxlength:500},
        },
        messages:{
            parentCode:{required:"请选择来源",maxlength: "来源不能大于{0}个字符"},
            outCode:{required:'请填写outCode',maxlength: "outCode不能大于{0}个字符"},
            sourceCode:{required:'请填写子来源编码',maxlength: "子来源编码不能大于{0}个字符"},
            sourceName:{required:'请填写子来源名称',maxlength: "子来源名称不能大于{0}个字符"},
            aliPayAppId:{required:'请填写aliPayAppId',maxlength: "aliPayAppId不能大于{0}个字符"},
            payType:{required:'请填写payType',maxlength: "payType不能大于{0}个字符"},
            bannerId:{maxlength: "bannerId不能大于{0}个字符"},
            encryptKey:{maxlength: "encryptKey不能大于{0}个字符"},
            clientPublicKey:{maxlength: "客户端公钥不能大于{0}个字符"},
            clientPrivateKey:{maxlength: "客户端私钥不能大于{0}个字符"},
            serverPublicKey:{maxlength: "服务端公不能大于{0}个字符"},
            serverPrivateKey:{maxlength: "服务端私钥不能大于{0}个字符"},
        }
    });
});