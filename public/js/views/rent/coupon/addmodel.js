$().ready(function(){
    $("#modelForm").validate({
        rules: {
            couponName: {
                required: true,
                maxlength: 50
            },
            rule: {
                required: true,
                maxlength: 100
            },
            discount: {
                required: true,
                number:true,
                min:1,
                max:999999
            },
            period: {
                required: true,
                digits:true,
                min:1,
                max:1000
            },
            startTime: {
                required: true
            },
            endTime: {
                required: true
            },
            isLimit: {
                required: true
            },
            limitedAmount:{
                digits:true,
                min:1,
                max:99999
            },
            type: {
                required: true
            },
            productType:{
                maxlength: 20
            },
            productId:{
                maxlength: 32
            },
            modelId:{
                maxlength: 32
            },
            modes:{
                required: true
            }
        },
        messages: {
            couponName: {
                required: "请输入优惠券名称",
                maxlength: "最多输入50个字符"
            },
            rule: {
                required: "请输入规则说明",
                maxlength: "最多输入100个字符"
            },
            discount: {
                required: "请输入抵扣金额",
                number:"必须为数字",
                min:'最小值为1',
                max:'最大值为999999'
            },
            period: {
                required: true,
                digits:true,
                min:1,
                max:1000
            },
            startTime: {
                required: "请设置开始时间"
            },
            endTime: {
                required: "请设置结束时间"
            },
            isLimit: {
                required: "请选择是否满减"
            },
            limitedAmount:{
                digits:"必须为整数",
                min:'最小值为1',
                max:'最大值为99999'
            },
            type: {
                required: "请选择限制类型"
            },
            productType:{
                maxlength:  "最多输入20个字符"
            },
            productId:{
                maxlength:  "最多输入32个字符"
            },
            modelId:{
                maxlength: "最多输入32个字符"
            },
            modes:{
                required: "请选择抵扣方式"
            }
        }
    });

    $("#isLimit").change(function(){
        $(".productTypeBox").hide();
        $(".productBox").hide();
        $(".productModelBox").hide();
        var isLimitObj = $(this);
        var isLimit = isLimitObj.val();
        if(isLimit === '1'){
            $(".limitedAmountBox").show();
            $(".type-product").hide();
            $(".type-product-model").hide();
            $(".modes-insurance").hide();

            $("#type").val("");
            $("#modes").val("");

        }else if(isLimit === '2'){
            $(".limitedAmountBox").hide();
            $(".type-product").show();
            $(".type-product-model").show();
            $(".modes-insurance").show();
            $(".modes-insurance").hide();

            $("#limitedAmount").val('');
        }
    });

    $("#type").change(function(){
        $("#productType").val('');
        $("#productId").val('');
        $("#modelId").val('');
        var isLimitObj = $(this);
        var isLimit = isLimitObj.val();
        if(isLimit === '1'){
            $(".productTypeBox").hide();
            $(".productBox").hide();
            $(".productModelBox").hide();
            $(".modes-insurance").hide();
        }else if(isLimit === '2'){
            $(".productTypeBox").show();
            $(".productBox").hide();
            $(".productModelBox").hide();
            $(".modes-insurance").hide();
        }else if(isLimit === '3'){
            $(".productTypeBox").hide();
            $(".productBox").show();
            $(".productModelBox").hide();
            $(".modes-insurance").show();
        }else if(isLimit === '4'){
            $(".productTypeBox").hide();
            $(".productBox").hide();
            $(".productModelBox").show();
            $(".modes-insurance").show();
        }
    });
    $("#saveButton").bind("click", function(){saveModelInfo();});


});

function closeView(){
    parent.closeView();
}

function saveModelInfo(){
    $("#saveButton").unbind("click");
    var submitFlag = true;
    if($('#modelForm').valid()) {
        var index = layer.load(2, {time: 10 * 1000});
        var isLimit = $('#isLimit').val();
        var limitedAmount = $('#limitedAmount').val();
        var type = $('#type').val();
        var productType = $('#productType').val();
        var productId = $('#productId').val();
        var modelId = $('#modelId').val();
        var modes = $('#modes').val();
        var startTime = $('#startTime').val();
        var endTime = $('#endTime').val();
        var period = $('#period').val();
        var discount = $('#discount').val();
        var sourceCode = $('#sourceCode').val();
        var couponName = $('#couponName').val();
        var rule = $('#rule').val();

        if (isLimit === '1') {
            if(type === '3' || type === '4'){
                layer.msg('限制类型错误');
                submitFlag = false;
            }
            if(modes === '3'){
                layer.msg('抵扣方式错误');
                submitFlag = false;
            }
        }else if (isLimit === '2'){
            limitedAmount = 0;
            if(type === '1' || type === '2'){
                if(modes === '3'){
                    layer.msg('抵扣方式错误');
                    submitFlag = false;
                }
            }
        }
        if(type === '1'){
            productType = '';
            productId = '';
            modelId = '';
        }else if (type === '2') {
            productId = '';
            modelId = '';
        } else if (type === '3') {
            productType = '';
            modelId = '';
        } else if (type === '4') {
            productType = '';
            productId = '';
        }

        var params = {
            isLimit: isLimit,
            limitedAmount: limitedAmount,
            type: type,
            productType: productType,
            productId: productId,
            modelId: modelId,
            modes: modes,
            startTime: startTime,
            endTime: endTime,
            period: period,
            discount: discount,
            sourceCode: sourceCode,
            couponName: couponName,
            rule: rule
        };

        if(submitFlag) {
            $.ajax({
                type: 'POST',
                url: '/rent/coupon/savecouponmodel',
                data: params,
                success: function (data) {
                    if (data.code) {
                        layer.msg('添加成功');
                        $("#saveButton").bind("click", function () {
                            saveModelInfo();
                        });
                        parent.reload();
                    } else {
                        layer.msg(data.text);
                        $("#saveButton").bind("click", function () {
                            saveModelInfo();
                        });
                        layer.close(index);
                    }
                },
                error: function (data) {
                    $("#saveButton").bind("click", function () {
                        saveModelInfo();
                    });
                    layer.close(index);
                }
            });
        }

    }
}
