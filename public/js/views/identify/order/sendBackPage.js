$().ready(function(){
	$('.btnSaveInfo').bind('click', function(){updateExpressInfo($(this).attr('id'));});
	initCitys('');
	function initCitys(areaInfo){
		areaInfo = areaInfo || '   ';
		//识别省市区
		if(areaInfo != ''){
			areaInfos = areaInfo.split(' ');
		}
		areaInfos[0] = areaInfos[0] || '';
		areaInfos[1] = areaInfos[1] || '';
		areaInfos[2] = areaInfos[2] || '';
		//省市区插件
		$('body').areaInfo({provinceName:areaInfos[0], cityName:areaInfos[1], districtName:areaInfos[2]});
	}
	
	$('input[name="sendBackType"]').change(function(){
		if($(this).val() == '1'){//卖家取消
			$('#recycleBtn').hide();
			$('#editExpressBtn').show();
			$('#sendBackBtn').show();
			expressInfo = inExpressInfo;
			initCitys(expressInfo.AREANAME);
		}else if($(this).val() == '2'){//买家购买
			$('#recycleBtn').hide();
			$('#editExpressBtn').show();
			$('#sendBackBtn').show();
			expressInfo = outExpressInfo;
			initCitys(expressInfo.AREANAME);
		}else if($(this).val() == '3'){//平台回收
			$('#recycleBtn').show();
			$('#editExpressBtn').hide();
			$('#sendBackBtn').hide();
			expressInfo = {CONTACTS:'', CONTACTWAY:'', CONTACTADDRESS:''};
		}
		$('#contacts').val(expressInfo.CONTACTS);
		$('#contactWay').val(expressInfo.CONTACTWAY);
		$('#address').val(expressInfo.CONTACTADDRESS);
		
		//判断商品是否为空
		if($('#merName').val() == ''){
			$('#merName').val(expressInfo.MERNAME);
		}
	});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			contacts:{//联系人
				required:function(){
					var val = $('input[name="sendBackType"]:checked').val();
					return (val == '1' || val == '2');
				}
				,maxlength:20
			}
			,contactWay:{//电话
				required:function(){
					var val = $('input[name="sendBackType"]:checked').val();
					return (val == '1' || val == '2');
				}
				,maxlength:20
			}
			,address:{//地址
				required:function(){
					var val = $('input[name="sendBackType"]:checked').val();
					return (val == '1' || val == '2');
				}
				,maxlength:100
			}
			,merName:{//商品名称
				required:function(){
					var val = $('input[name="sendBackType"]:checked').val();
					return (val == '1' || val == '2');
				}
				,maxlength:50
			}
			,provinceId:{
				required:function(){
					var val = $('input[name="sendBackType"]:checked').val();
					return (val == '1' || val == '2');
				}
			}
			,cityId:{
				required:function(){
					var val = $('input[name="sendBackType"]:checked').val();
					return (val == '1' || val == '2');
				}
			}
			,districtId:{
				required:function(){
					var val = $('input[name="sendBackType"]:checked').val();
					return (val == '1' || val == '2');
				}
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

/**
 * 保存快递信息
 */
function updateExpressInfo(thisAttrId){
	$('.btnSaveInfo').unbind('click');
	if($("#addForm").valid()){
		var provinceName = $('#provinceId option:selected').text();;
		var cityName = $('#cityId option:selected').text();;
		var districtName = $('#districtId option:selected').text();;
		
		var areaName = provinceName+' '+cityName+' '+districtName;
		var params = {
				orderNo:$('#orderNo').val(),
				contacts:$('#contacts').val(),
				contactWay:$('#contactWay').val(),
				areaName:areaName,
				address:$('#address').val(),
				merName:$('#merName').val(),
				callId:$('#callId').val(),
				returnFlag:$('#returnFlag').val()
		};
		
		if(thisAttrId == 'editExpressBtn'){//只保存快递信息
			params.operType = '1';
		}else if(thisAttrId == 'sendBackBtn'){//保存并退回
			params.operType = '2';
		}
		
		//退回类型
		params.sendBackType = $('input[name="sendBackType"]:checked').val();
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/order/ordersendback" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:20000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					parent.reload();
				}else{
					alert('保存失败：'+data);
					$('.btnSaveInfo').bind('click', function(){updateExpressInfo($(this).attr('id'));});
				}
			}
		});
	}else{
		$('.btnSaveInfo').bind('click', function(){updateExpressInfo($(this).attr('id'));});
	}
}