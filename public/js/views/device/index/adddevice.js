$().ready(function(){
    $(".table").hide();
    $(".small").show();
	$("#typecode").click(function () {
		$(".table").hide();
		if($(this).attr("value") == '1') {
            $(".big").show();
		} else {
            $(".small").show();
		}
    })
	
	$('.saveMerBtn').bind('click', function(){saveMerInfo($(this).attr('id'));});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			merType:{//设备编码
				required:true
			}

		}
		,messages:{
			merType:{//设备编码
				required:"请填写设备编码"
			}

		}
	});
	

});

/**
 * 保存商品信息
 * @param thisAttrId
 * @returns
 */
function saveMerInfo(thisAttrId){
	$('.saveMerBtn').unbind('click');
	if($("#addForm").valid()){
		
		var params = {
				deviceid:$('#deviceid').val(),
                typecode:$('#typecode').val()
		};
		if(params.deviceid == ''){
			alert('请填写设备编码！');
			$('.saveMerBtn').bind('click', function(){saveMerInfo($(this).attr('id'));});
			return;
		}
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/device/index/savedevice" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(thisAttrId == 'saveAndNewBtn'){
						$('#deviceid').val('');
                        $('#typecode').val('');
                        $(".table").hide();
                        $(".small").show();
						$('.saveMerBtn').bind('click', function(){saveMerInfo($(this).attr('id'));});
					}else{
						parent.reload();
					}
				}
			}
		});
	}else{
		$('.saveRecyBtn').bind('click', function(){saveMerInfo($(this).attr('id'));});
	}
}


function goBack(){
    parent.reload();
}

