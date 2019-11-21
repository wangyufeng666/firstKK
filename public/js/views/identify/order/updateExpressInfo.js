$().ready(function(){
	$('#editExpressBtn').bind('click', function(){updateExpressInfo();});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			contacts:{//联系人
				required:true
				,maxlength:20
			}
			,contactWay:{//电话
				required:true
				,maxlength:20
			}
			,address:{//地址
				required:true
				,maxlength:100
			}
			,merName:{//商品名称
				required:true
				,maxlength:50
			}
			,provinceId:{
				required:true
			}
			,cityId:{
				required:true
			}
			,districtId:{
				required:true
			}
		}
		,messages:{
			contacts:{//联系人
				required:"请输入联系人"
			}
			,contactWay:{//电话
				required:"请输入联系方式"
			}
			,address:{//地址
				required:"请输入地址"
			}
			,merName:{//商品名称
				required:"请输入商品名称"
			}
		}
	});
});

function updateExpressInfo(){
	$('#editExpressBtn').unbind('click');
	if($("#addForm").valid()){
		
		var provinceName = $('#provinceId option:selected').text();;
		var cityName = $('#cityId option:selected').text();;
		var districtName = $('#districtId option:selected').text();;
		
		var areaName = provinceName+' '+cityName+' '+districtName;
		var params = {
				contacts:$('#contacts').val(),
				contactWay:$('#contactWay').val(),
				areaName:areaName,
				address:$('#address').val(),
				merName:$('#merName').val(),
				callId:$('#callId').val(),
            	orderNo:orderNo
		};
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/order/saveexpress" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:20000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
                    parent.reload();
					// window.location.href = '/identify/zzorder/index';
				}else{
					alert('保存失败：'+data);
					$('#editExpressBtn').bind('click', function(){updateExpressInfo();});
				}
			}
		});
	}else{
		$('#editExpressBtn').bind('click', function(){updateExpressInfo();});
	}
}
