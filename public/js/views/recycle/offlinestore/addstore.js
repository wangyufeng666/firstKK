$(document).ready(function(){
	initProvinces();
	$('#saveButton').bind('click', function(){saveStore();});
	
	$("#provinceId").change(function(){
		var provinceId = $('#provinceId').val();
		if(provinceId != ""){
			$.ajax({type:'GET', dataType:'jsonp', jsonp:'jsonp_callback',
				data:{pid:provinceId},
				url:openApiDomain+'/recycle/area/citys',
				success:function(data){
					var optionsText = "<option value=''>请选择城市</option>";
					for(i in data){
						optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
					}
					$('#cityId').html(optionsText);
				}
			});
		}else{
			$('#cityId').html("<option value=''>请选择城市</option>");
			$('#districtId').html("<option value=''>请选择县区</option>");
		}
	});
	
	$("#cityId").change(function(){
		var cityId = $('#cityId').val();
		if(cityId != ""){
			$.ajax({type:'GET', dataType:'jsonp', jsonp:'jsonp_callback',
				data:{cid:cityId},
				url:openApiDomain+'/recycle/area/districts',
				success:function(data){
					var optionsText = "<option value=''>请选择县区</option>";
					for(i in data){
						optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
					}
					$('#districtId').html(optionsText);
				}
			});
		}else{
			$('#districtId').html("<option value=''>请选择县区</option>");
		}
	});
	
	//表单验证
	$('#addStoreForm').validate({
		rules:{
			storeType:{//门店类型
				required:true
			}
			,storeNo:{//门店编码
				required:true
				,remote:{
					url:"/recycle/offlinestore/validstoreno",
					type:"post",
					data:{
						storeNo:function(){return $("#storeNo").val();}
					}
				}
				,maxlength:20
			}
			,districtId:{//县区
				required: true
			}
			,storeName:{//门店名称
				required:true
				,maxlength:50
			}
			,storeAddress:{//门店地址
				required: true
				,maxlength:100
			}
			,contacts:{//联系人
				required:true
				,maxlength:20
			}
			,mobile:{//联系电话
				required:true
				,mobile:true
				,maxlength:11
			}
		}
		,messages:{
			storeType:{required:"请选择门店类型"}
			,storeNo:{//电子邮箱
				required:"请输入门店编码"
				,remote:"门店编码已存在"
				,maxlength:"门店编码最多20个字符"
			}
			,storeAddress:{//门店地址
				required: "请输入门店地址"
				,maxlength:"地址最多100字符"
			}
			,districtId:{required:"请选择所在县区"}
			,storeName:{//门店名称
				required: "请输入门店名称"
				,maxlength:"地址最多50字符"
			}
			,contacts:{//联系人
				required: "请输入门店联系人"
				,maxlength:"门店联系人最多20个字符"
			}
			,mobile:{//手机号码
				required:"请输入手机号码"
				,maxlength:"手机号码最多11字符"
				,mobile:"请输入有效手机号码"
			}
		}
	});	
});

/**
 * 省份初始化
 * @return
 */
function initProvinces(){
	$.ajax({type:'POST', dataType:'jsonp', jsonp:'jsonp_callback',
		url:openApiDomain+'/recycle/area/provinces',
		success:function(data){
			var optionsText = "<option value=''>请选择省份</option>";
			for(i in data){
				optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
			}
			$('#provinceId').html(optionsText);
		}
	});
}

function saveStore(){
	$('#saveButton').unbind('click');
	var storeNo = $("#storeNo").val();
	var storeName = $("#storeName").val();
	var cityId = $("#cityId").val();
	var districtId = $("#districtId").val();
	var storeAddress = $("#storeAddress").val();
	var storeType = $("#storeType").val();
	var contacts = $('#contacts').val();
	var mobile = $('#mobile').val();
	var storePrefix = $("#storeType option:selected").attr("data-prefix");
	
	if($("#addStoreForm").valid()){
		var params = {
				storeNo:storeNo	,storeName:storeName
				,cityId:cityId ,districtId:districtId
				,remark:$("#remark").val()
				,storeAddress:storeAddress
				,storeType:storeType, storePrefix:storePrefix
				,contacts:contacts ,mobile:mobile
		};
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/offlinestore/savestore"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:10000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(confirm("是否继续添加")){
						window.location.href = window.location.href;
					}else{
						goBack();
					}
				}
			}
			,fail:function(data){
				alert('失败'+data);
			}
		});
	}else{
		$('#saveButton').bind('click', function(){saveStore();});
	}
}

function goBack(){
	window.location.href = backUrl;
}