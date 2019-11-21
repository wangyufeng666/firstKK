$().ready(function(){

    $('.editSendeeBtn').bind('click',function(){editSendee();});

    jQuery.validator.addMethod("isPhone", function(value, element) {
        var length = value.length;
        var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请填写正确的手机号码");//可以自定义默认提示信息

    jQuery.validator.addMethod("isTel", function(value, element) {
        var length = value.length;
        var phone = /(^(\d{3,4}-)?\d{6,8}$)|(^(\d{3,4}-)?\d{6,8}(-\d{1,5})?$)|(\d{11})/;
        return this.optional(element) || (phone.test(value));
    }, "请填写正确的固定电话");//可以自定义默认提示信息

    // 表单验证
    $('#editForm').validate({
        rules:{
            sendeeId: {
                required:true
            }
            ,sendeeType: {
                required:true
            }
            ,sendeeName: {
                required:true
                ,maxlength:64
            }
            ,taxpayerIdNumber: {
                maxlength:32
            }
            ,address: {
                maxlength:80
            }
            ,sendeeBank: {
                maxlength:64
            }
            ,telephone: {
                maxlength:20,
                isTel:true
            }
            ,mobile: {
                maxlength:20,
                isPhone:true
            }
            ,email: {
                maxlength:50,
                email:true
            }
        }
        ,message:{
            sendeeId: {
                required:"缺少收票人ID"
            },
            sendeeType: {
                required:"请选择收票人类型"
            }
            ,sendeeName: {
                required:"请输入收票人姓名"
                ,maxlength:""
            }
            ,taxpayerIdNumber: {
                maxlength:"纳税人识别号最大32个字符"
            }
            ,address: {
                maxlength:"地址最大80个字符"
            }
            ,sendeeBank: {
                maxlength:"开户行及账号最大64个字符"
            }
            ,telephone: {
                maxlength:"固定电话最大20个字符",
                isTel:"请填写正确的固定电话"
            }
            ,mobile: {
                maxlength:"手机号最大20个字符",
                isPhone:"请输入正确的手机号码"
            }
            ,email: {
                maxlength:"邮箱最大50个字符",
                email:"请输入正确的电子邮箱"
            }
        }
    });
});

function goBack(){
    parent.closeLayer();
}

function editSendee(){
    $('.editSendeeBtn').unbind('click');

    if($('#editForm').valid()){

        var params = {
            sendeeId:$("#sendeeId").val(),
            sendeeType:$("#sendeeType").val(),
            sendeeName:$("#sendeeName").val(),
            taxpayerIdNumber:$("#taxpayerIdNumber").val(),
            address:$("#address").val(),
            sendeeBank:$("#sendeeBank").val(),
            telephone:$("#telephone").val(),
            mobile:$("#mobile").val(),
            email:$("#email").val()
        };

        if(params.sendeeType === '2'){
            var isYes = 'Y';
            if(params.taxpayerIdNumber === ""){
                formParamsError("请输入纳税人识别号");
                $("#taxpayerIdNumber").focus();
                return;
            }
        }

        $.ajax({
            type:'POST'
            ,url:'/caiwu/invoice/updatesendee'
            ,data:params
            ,cache:false
            ,async:false
            ,timeout:60000
            ,success: function (data) {
                if(data.code === 'Y'){
                    layer.msg('更新收票人信息成功');
                    parent.reload();
                }else{
                    layer.msg(data.text);
                }
            }
        });
    }else{
        $('.editSendeeBtn').bind('click',function(){editSendee();});
    }
}

function formParamsError(message){
    layer.msg(message);
    $('.editSendeeBtn').bind('click',function(){editSendee();});
}
