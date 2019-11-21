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
            }
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

        var typeCode = $('#typeCode').val();
        var startTime = $('#startTime').val();
        var endTime = $('#endTime').val();
        var period = $('#period').val();
        var discount = $('#discount').val();
        var sourceCode = $('#sourceCode').val();
        var couponName = $('#couponName').val();
        var rule = $('#rule').val();


        var params = {
            typeCode: typeCode,
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
                url: '/rent/coupon/editcouponmodel',
                data: params,
                success: function (data) {
                    if (data.code) {
                        layer.msg('修改成功');
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
