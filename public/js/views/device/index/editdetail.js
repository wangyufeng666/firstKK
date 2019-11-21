$(function () {
    $("table tr td").click(function () {
        //初始化
        $("table tr td").css("background-color","#d0e3f0");
        $("table tr td").removeClass('selected');
        $("#selectVal").val("");
        //赋值
        $(this).css("background-color","#0f9ae0");
        $(this).addClass('selected');
        var selectVal = $(this).attr("values");
        if(selectVal){
            $("#selectVal").val(selectVal);
        }

    })
})

// 置为故障
function tofault() {
    if(confirm("谨慎操作！确定将该舱位置为故障舱？")) {
        var hatchid = $("#selectVal").val();
        if(hatchid) {
            $.post("/device/index/tofault",{hatchid:hatchid,deviceid:deviceid},function (data) {
                if(data.code == '200') {
                    $(".selected i").html("<span style='color:red'> (故障)</span>");
                } else {
                    alert("操作失败！请重新尝试");
                }
            },'json')
        }else {
            alert("请选择舱位！有问题请联系运维人员！");
        }
    }
}

// 恢复为正常状态
function recovery() {
    if(confirm("谨慎操作！确定将该舱位恢复正常状态？")) {
        var hatchid = $("#selectVal").val();
        if (hatchid) {
            $.post("/device/index/recovery", {hatchid: hatchid, deviceid: deviceid}, function (data) {
                if (data.code == '200') {
                    $(".selected i").html(data.statemsg);
                } else {
                    alert("操作失败！请重新尝试");
                }
            }, 'json')
        } else {
            alert("请选择舱位！有问题请联系运维人员！");
        }
    }
}

// 初始化
function reset() {
    if(confirm("谨慎操作！确定将该舱位初始化？初始化后其他用户交付时可打开该舱位！")) {
        var hatchid = $("#selectVal").val();
        if (hatchid) {
            $.post("/device/index/reset", {hatchid: hatchid, deviceid: deviceid}, function (data) {
                if (data.code == '200') {
                    $(".selected i").html(data.statemsg);
                } else {
                    alert("操作失败！请重新尝试");
                }
            }, 'json')
        } else {
            alert("请选择舱位！有问题请联系运维人员！");
        }
    }
}

// 开仓
function opentank() {
    if(confirm("谨慎操作！确定将该舱位打开？如有舱门内有设备请确认后开启！")) {
        var hatchid = $("#selectVal").val();
        if (hatchid) {
            $.post("/device/index/open", {hatchid: hatchid, deviceid: deviceid}, function (data) {
                if (data.code == '200') {
                    $(".selected i").html(data.statemsg);
                } else {
                    alert("操作失败！请重新尝试");
                }
            }, 'json')
        } else {
            alert("请选择舱位！有问题请联系运维人员！");
        }
    }
}