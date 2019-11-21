$('#saveButton').bind('click', function(){save();});
//表单验证
$('#addForm').validate({
	rules:{
		partnerName:{required:true}
		,passWord:{required:true,maxlength:15}
		,contacts:{required:true,maxlength:20}
		,mobile:{required:true, phoneOrMobile:true}
		,payType: { required: true,minlength: 1}
		,zhifubao:{required:true}
		,realName:{required:true,maxlength:20}
		,pattern:{required:true}
		,brokerageMax:{required:true,maxlength:3,number:true}
		,dividedMax:{required:true,maxlength:3,number:true}
		,qu:{required:true}
		,address:{required:true}
		,codePoint:{required:true,number:true}
		,eventMax:{required:true,maxlength:3,number:true}
		,settleTimeFlag:{required:true}
		,operation:{required:true}
		,rental:{required:true}
	}
	,messages:{
		partnerName:{required:"请输入商户名称"}
		,passWord:{required:"请输入登录密码",maxlength:"登录密码最大长度为15"}
		,contacts:{required:"请输入姓名",maxlength:"姓名上限最大长度为20"}
		,mobile:{required:"请输入手机号",phoneOrMobile:"手机号格式不对"}
		,payType:{required:"请选择结算类型"}
		,zhifubao:{required:"请支付宝账号"}
		,realName:{required:"请输入支付对应的真实姓名"}
		,pattern:{required:"请选择合作模式"}
		,brokerageMax:{required:"请输入佣金比例",maxlength:"佣金上限最大长度为3",number:"无效的数字"}
		,dividedMax:{required:"请输入分成比例",maxlength:"分成上限最大长度为3",number:"无效的数字"}
		,qu:{required:"请选择所在地区"}
		,address:{required:"请输入详细地址"}
		,codePoint:{required:"请输入基准率",number:"无效的数字"}
		,eventMax:{required:"请输入活动比例",maxlength:"分成上限最大长度为3",number:"无效的数字"}
		,settleTimeFlag:{required:"请选择是否关仓结算"}
		,operation:{required:"请选择运维人员"}
		,rental:{required:"请填写门店租金，无租金输入0"}
	}
});

function save(){
	$('#saveButton').unbind('click');
	var choseTemplete = checkTempleteChose();
	if(!choseTemplete) {
		//红包模板选择有误！
		alert('如果选择开启赠送红包模式，则必须选择对应的红包模板！');
		$('#saveButton').bind('click', function(){save();});
		return;
	}
	if($("#addForm").valid()){
		if(checkPayType()) {
			var mobile = $('#mobile').val();
			$.post('/device/business/checkbusiness', {mobile:mobile}, function(data){
				if(data == 'Y'){
					$('#addForm').submit();
				}else{
					alert('手机号已存在，请重新输入');
					$('#saveButton').bind('click', function(){save();});
				}
			});
		}else {
			alert('请选择结算方式！');
			$('#saveButton').bind('click', function(){save();});
		}
	}else{
		$('#saveButton').bind('click', function(){save();});
	}
}


function checkPayType(){
	var flag = false;
	$("input[name='payType[]']").each(function(){
		if($(this).get(0).checked){
			flag = true;
		}
	})
	return flag;
}
$("input[name='payType[]']").change(function(){
	$("input[name='payType[]']").each(function() {
		console.log($(this));
		if ($(this).val() == 6 && $(this).get(0).checked) {
			//如果模式为现金+红包
			$('.setCouponConfig').show();
		} else {
			$('.setCouponConfig').hide();
		}
	})
})



function goBack(){
	window.location.href = backUrl+'?backFlag=Y';
}

initProvince();
//省份初始化
function initProvince(){
	$("#sheng").html("<option value=''>请选择省份</option>");
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,url:openapiUrl+'/util/util/getprovince',
		success:function(data){
			var optionHtml = "", name = "";
			for(i in data){
				name = data[i]['NAME'];
				optionHtml += "<option value='"+data[i]['ID']+"' title='"+name+"'>"+name+"</option>";
			}
			$("#sheng").append(optionHtml);
		}
	});
}

//省动态改变
$('#sheng').change(function(){
	$("#shi").html("<option value='' flag='N'>请选择城市</option>");
	$("#qu").html("<option value='' flag='N'>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$('#shengName').val($(this).find("option:selected").text());
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,data:{provinceId:thisVal},url:openapiUrl+'/util/util/getcity',
			success:function(data){
				var optionHtml = '', id = '', name = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#shi").append(optionHtml);
			}
		});
	}
});

//市动态改变
$('#shi').change(function(){
	$("#qu").html("<option flag='' value=''>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$('#shiName').val($(this).find("option:selected").text());
		$.ajax({type:'GET',dataType:'jsonp',cache:false,jsonp:'jsonp_callback',data:{cityId:thisVal},url:openapiUrl+'/util/util/getdistrict',
			success:function(data){
				var optionHtml = '',id = '',name = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#qu").append(optionHtml);
			}
		});
	}
});

//市动态改变
$('#qu').change(function(){
	$('#quName').val($(this).find("option:selected").text());
});

$('input[name="pattern"]').change(function(){
	if($('input[name="pattern"]:checked').val() == '1'){
		$(".brokerageMax").show();
		$(".dividedMax").hide();
	}else if($('input[name="pattern"]:checked').val() == '2'){
		$(".brokerageMax").hide();
		$(".dividedMax").show();
	}else{
		$(".brokerageMax").show();
		$(".dividedMax").show();
	}
})

$('input[name="setCouponSwitch"]').change(function(){
	if($('input[name="setCouponSwitch"]:checked').val() == '1'){
		$(".templeteType").show();
		$(".templeteList").show();
	}else if($('input[name="setCouponSwitch"]:checked').val() == '2'){
		$(".templeteType").hide();
		$(".templeteList").hide();
	}else{
		$(".templeteType").hide();
		$(".templeteList").hide();
	}
})

checkFreeCoupon();
function checkFreeCoupon() {
	if($('input[name="setCouponSwitch"]:checked').val() == '1'){
		couponTemplete();
	}
}

function couponTemplete() {
	$.ajax({
		url:'/device/business/getcoupon',
		type:'post',
		dataType:'json',
		success:function(res) {
			var html = '<option value="">请选择红包模板</option>';
			if(res.length > 0) {
				for(var i=0;i<res.length;i++) {
					html +='<option value="'+res[i].ID+'">'+res[i].NAME+'</option>';
				}

			}else {
				alert('暂无红包模板，请添加红包模板');
			}
			$('#choseCoupon').html(html);
		}
	})
}

function checkTempleteChose() {
	//如果选择红包赠送模式，则必须要选择对应的红包模板，否则提醒有误
	if($('input[name="setCouponSwitch"]:checked').val() == '1') {
		if($('#choseCoupon').val() == '') {
			return false;
		}else {
			return true;
		}
	}else {
		return true;
	}
}
storeInfo();
function storeInfo() {
	var store = $('#alicoupon_store').val();
	if(partnerFlag == 'N') {
		$('.setPartner').hide();
	}
	if(store == '') {
		$('.setStore').hide();
	}
}

$('#alicoupon_store').blur(function(){
		if($.trim($(this).val()) == '') {
			$('.setStore').hide();
		}
		if(partnerFlag == 'N') {
			alert('请前往上级代理填写支付宝商户信息！');
			$('.setPartner').hide();
		}
		if(partnerFlag == 'Y' && $.trim($(this).val()) != '') {
			$('.setStore').show();
		}
});