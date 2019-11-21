var orderPage = {};
orderPage.orderModule = {
		orderPrice:0,
		couponPrice:0,
		couponCode:''
};

/**
 * 优惠劵模块
 * 1、优惠劵信息初始化 
 * 2、优惠劵展示、鼠标事件操作 
 * 3、下单数据组装，金额计算
 **/
orderPage.CouponModule = {
	couponDftText:'请输入加价券码或礼包券码',
	showCoupon:false,
	useFlag:false
};

$().ready(function(){
	//价格初始化
	orderPage.orderModule.orderPrice = parseFloat($('#orderPrice').val());
	
	$('#btn_submit').bind('click' ,function(){formSubmit();});
	initProvince();
	subwaycityShow();
	appvisitAreaShow();
	visitArea3CShow();
	$('#sheng, #shi, #qu').focus(function(){
		$('#area_msg').hide();
	});
	$('.tradeHelp .help, #help1').hover(function(){$('#helpInfo').slideToggle();});
});

//省份初始化
function initProvince(){
	$("#sheng").html("<option value=''>请选择省份</option>");
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
		data:{flag:applianceFlag},
		url:openApiDomain+'/recycle/area/provinces',
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
	$("#qu").html("<option value='' flag='N'>请选择区县</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,
			data:{pid:thisVal,flag:applianceFlag},
			url:openApiDomain+'/recycle/area/citys',
			success:function(data){
				var optionHtml = '', id = '', name = '', flag = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					flag = data[i]['FLAG'];
					optionHtml += "<option value='"+id+"' flag='"+flag+"' title='"+name+"'>"+name+"</option>";
				}
				$("#shi").append(optionHtml);
			}
		});
	}
});

//市动态改变
$('#shi').change(function(){
	$("#qu").html("<option value=''>请选择区县</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		loadDistrict(thisVal);
		var flag = $('#shi option:selected').attr('flag');
		if(applianceFlag == 'N'){//非大家电
			if(flag == '5'){//地铁
				$("#subway_box").show();//地铁显示
				getSubwayline();//加载地铁线
			}else{
				hideSubwayBox();//地铁隐藏
			}
		}
	}
});

//区县动态改变
$('#qu').change(function(){
	var thisVal = $(this).val();
	if(thisVal != ''){
		var flag = $('#qu option:selected').attr('flag');
		if(applianceFlag == 'N'){//非大家电
			if(flag == '1' || flag == '2'){//上门
				$("#visit_box").show();//上门显示
			}else{
				hideVisitBox();//上门隐藏
			}
		}else{//大家电
			$('#btn_submit').unbind('click');
			if(flag == '1' || flag == '3'){//大家电上门
				var visitObj = $("#visit_box");
				visitObj.show();//上门显示
				visitObj.addClass('selected');
				$(visitObj.attr('index')).removeClass('ydm-hide').addClass('ydm-show');
				$('#btn_submit').bind('click' ,function(){formSubmit();});
				$('#btn_submit').removeClass('reset-btn').addClass('next-btn');
				$('#tradeType').val(visitObj.attr('data'));
				$('#tradeTips').hide();
			}else{
				$("#visit_box").hide();//上门显示
				hideVisitBox();
			}
		}
	}
});

//地铁线
$('#subwayline').change(function(){
	$('#subwaystation').html("<option value=''>请选择地铁站</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,data:{lid:thisVal},
			url:openApiDomain+'/recycle/area/substations',
			success:function(data){
				if(data != '0'){
					var optionHtml = '';
					for(i in data){
						optionHtml += "<option value='"+data[i]['STATIONID']+"'>"+data[i]['STATIONNAME']+"</option>";
					}
					$('#subwaystation').append(optionHtml);
				}
			}
		});
	}
});

//区加载
function loadDistrict(cityId){
	$.ajax({type:'GET',dataType:'jsonp',cache:false,jsonp:'jsonp_callback',
		data:{cid:cityId,flag:applianceFlag},
		url:openApiDomain+'/recycle/area/districts',
		success:function(data){
			var optionHtml = '',id = '',name = '',flag = '';
			for(i in data){
				id = data[i]['ID'];
				name = data[i]['NAME'];
				flag = data[i]['FLAG'];
				optionHtml += "<option value='"+id+"' flag='"+flag+"' title='"+name+"'>"+name+"</option>";
			}
			$("#qu").append(optionHtml);
		}
	});
}

/**
 * 获取地铁线
 */ 
function getSubwayline(){
	$("#subwayline").html("<option value=''>请选择地铁线</option>");
	$("#subwaystation").html("<option value=''>请选择地铁站</option>");
	var cityId = $('#shi').val();
	if(cityId != ''){
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,data:{cid:cityId},
			url:openApiDomain+'/recycle/area/subwaylines',
			success:function(data){
				if(data != '0'){
					var optionHtml = '';
					for(i in data){
						optionHtml += "<option value='"+data[i]['LINEID']+"'>"+data[i]['LINENAME']+"</option>";
					}
					$('#subwayline').append(optionHtml);
				}
			}
		});
	}
}

//地铁隐藏
function hideSubwayBox(){
	$(".tradetype .tabhost .item").removeClass('selected');
	$(".tradetype .tabcontent .item").removeClass('ydm-show').addClass('ydm-hide');
	$('#subway_box').hide();
	var expressBoxObj = $('#express_box');
	expressBoxObj.show();
	expressBoxObj.addClass('selected');
	$(expressBoxObj.attr('index')).removeClass('ydm-hide').addClass('ydm-show');
	$('#tradeType').val(expressBoxObj.attr('data'));
}

//上门隐藏
function hideVisitBox(){
	$(".tradetype .tabhost .item").removeClass('selected');
	$(".tradetype .tabcontent .item").removeClass('ydm-show').addClass('ydm-hide');
	$('#visit_box').hide();
	if(applianceFlag == 'N'){
		var expressBoxObj = $('#express_box');
		expressBoxObj.show();
		expressBoxObj.addClass('selected');
		$(expressBoxObj.attr('index')).removeClass('ydm-hide').addClass('ydm-show');
		$('#tradeType').val(expressBoxObj.attr('data'));
	}else{
		$('#btn_submit').removeClass('next-btn').addClass('reset-btn');
		$('#tradeTips').show();
	}
}

/*表单验证*/
$('#orderForm').validate({
	rules:{
		contacts:{required:true,maxlength:20,specialChars:true},
		contactWay:{required:true,mobile:true,maxlength:20,specialChars:true},
		qu:{required:true},
		subwaystation:{required:function(){var type = $('#tradeType').val(); return type == '5';}},
		address:{required:true,maxlength:80,specialChars:true},
		readMe:{required:true},
		accountName1:{maxlength:20,specialChars:true},
		bankNumber1:{maxlength:50,specialChars:true},
		accountName2:{maxlength:20,specialChars:true},
		bankNumber2:{maxlength:50,specialChars:true}
	},
	messages:{
		contacts:{required:"请填写联系人",maxlength:"联系人长度最多为20个字"},
		contactWay:{required:"请填写手机号码",mobile:"手机号码填写不正确"},
		qu:{required:"请选择地区"},
		subwaystation:{required:'请选择地铁站'},
		address:{required:"请填写详细地址",maxlength:"详细地址长度最多为80个字"},
		accountName1:{maxlength:'最多20字符'},
		bankNumber1:{maxlength:'最多50字符'},
		accountName2:{maxlength:'最多20字符'},
		bankNumber2:{maxlength:'最多50字符'},
		readMe:{required:"请确认服务协议"}
	},
	focusInvalid:false
	,onkeyup:false
	,onclick:false
});

function formSubmit(){
	var layerId = layer.load(1, {shade:[0.2,'#000']});
	$('#btn_submit').unbind('click');
	if($('#orderForm').valid()){
		var tradeType = $('#tradeType').val();
		var shengText = $("#sheng option:selected").attr('title');
		var shiText = $("#shi option:selected").attr('title');
		var quText = $("#qu option:selected").attr('title');
		$('#contactAddress').val(shengText+' '+shiText+' '+quText+' '+$('#address').val());
		
		if($('#alipay_box').hasClass('selected')){
			$('#openBank').val('99');
			$('#bankNum').val($('#bankNumber2').val());
			$('#accountName').val($('#accountName2').val());
		}
		
		if($('#bankpay_box').hasClass('selected')){
			$('#openBank').val($('#openBank1').val());
			$('#bankNum').val($('#bankNumber1').val());
			$('#accountName').val($('#accountName1').val());
		}
		
		if(tradeType == '5'){//地铁
			$('#contactAddress').val($('#contactAddress').val()+'【'+$("#subwayline option:selected").text()+':'+$("#subwaystation option:selected").text()+'】');
			$('#serverDate').val($('#subway_serverDate').val());
			$('#serverTime').val($("[name='subway_serverTime']:checked").val());
		}else if(tradeType == '2'){//快递
			//
			if($('.expressbox .expitem.active').attr('index') == '1'){
				$('#sfAppointmentFlag').val('1');
			}
		}else{//上门
			$('#serverDate').val($('#visit_serverDate').val());
			$('#serverTime').val($("[name='visit_serverTime']:checked").val());
		}
		
		if($('#sfAppointmentFlag').val() == '1'){
			$('#serverDate').val($("#sfServerDate").val());
			$('#serverTime').val($("#timesel input:checked").val()); //获取小时
		}
		
		if(orderPage.CouponModule.useFlag){
			$('#riseCouponCode').val(orderPage.orderModule.couponCode);
		}
		
		document.orderForm.action="/product/order/saveorder";
		document.orderForm.submit();
	}else{
		layer.alert('请填写完交易信息',{icon:7, title:'提示'});
		layer.close(layerId);
		$('#btn_submit').bind('click',function(){formSubmit();});
	}
}

//交易方式改变事件
$(".tradetype .tabhost .item").click(function(event){
	if(!$(this).hasClass('disable')){
		$(".tradetype .tabhost .item").removeClass('selected');
		$(".tradetype .tabcontent .item").removeClass('ydm-show').addClass('ydm-hide');
		$($(this).attr("index")).removeClass('ydm-hide').addClass('ydm-show');
		$(this).addClass("selected");
		$($(this).attr("index")).show();
		$('#tradeType').val($(this).attr('data'));
	}
});

//交易方式改变事件
$(".payType .tabhost .item").click(function(event){
	if(!$(this).hasClass('disable')){
		$(".payType .tabhost .item").removeClass('selected');
		$(".payType .tabcontent .item").removeClass('ydm-show').addClass('ydm-hide');
		$($(this).attr("index")).removeClass('ydm-hide').addClass('ydm-show');
		$(this).addClass("selected");
		$($(this).attr("index")).show();
		$('#payType').val($(this).attr('data'));
	}
});

$('#linkToTerms').click(function(){
	$('#terms').show();
	$('html').css("overflow","hidden");
});

function closeFrame(){
	$('#terms').hide();
	$('#readMe').attr('checked', 'checked');
	$('html').css("overflow","auto");
}

/**
 * 3C上门地区显示
 * @return
 */
function visitArea3CShow(){
	if(applianceFlag != 'Y'){
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,
			url:openApiDomain+'/util/server/get3cvisitarea',
			success:function(data){
				var name = "", area = "", text = "";
				for(i in data){
					name = data[i]['name'];
					area = data[i]['text'];
					text += '<div class="area">'+name+'<div class="poptip">';
					text += '<span class="poptip-arrow poptip-arrow-top"><em>◆</em><i>◆</i></span>'+area+'</div></div>';
				}
				$("#visitarea3c").html(text);
			}
		});
	}
}

/**
 * 大家电上门区域展示
 * @return
 */
function appvisitAreaShow(){
	if(applianceFlag == 'Y'){
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,
			url:openApiDomain+'/util/server/getappvisitarea',
			success:function(data){
				var name = "", area = "", text1 = "", text2 = "";
				for(i in data){
					name = data[i]['name'];
					area = data[i]['text'];
					text2 += '<div class="area">'+name+'<div class="poptip">';
					text2 += '<span class="poptip-arrow poptip-arrow-top"><em>◆</em><i>◆</i></span>'+area+'</div></div>';
				}
				$("#appvisitarea_1").html(text2);
				$("#appvisitarea_2").html(text2);
			}
		});
	}
}

function subwaycityShow(){
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
		url:openApiDomain+'/util/server/getsubwaycitys',
		success:function(data){
			$(".subwaycityspan").html(data);
		}
	});
}

$().ready(function(){
	$('#js_coupon_change_btn .cptab').click(function(){
		$('#js_coupon_change_btn .cptab').removeClass('cur');
		$(this).addClass('cur');
		if($(this).attr('id') == 'enableCouponTab'){
			$('#enableCouponList').removeClass('hidden');
			$('#disableCouponList').addClass('hidden');
		}else{
			$('#enableCouponList').addClass('hidden');
			$('#disableCouponList').removeClass('hidden');
		}
		iframeHeightFixHash();
	});
	
	$(".coupon_yes_list .red_btn").click(function(){
		//取消使用
		if($(this).hasClass('checked')){
			$(this).parents('li').removeClass('cur').removeClass('one_li');
			$(this).html('<span>使用</span>').removeClass('checked');
			$('#js_selected_coupon .info_bg').html();
			$('#js_selected_coupon').addClass('hidden');
			orderPage.CouponModule.useFlag = false;
			orderPage.orderModule.couponCode = '';
			orderPage.orderModule.couponPrice = 0;
			orderPage.CouponModule.showCoupon = true;
			
			//价格显示处理
			$('#couponCount').html(0);
			$('#couponPrice').html('0.00');
			$('#totalPrice').html(orderPage.orderModule.orderPrice+'.00');
		}else{
			//如果当前有已使用优惠券，则不可再使用
			if(orderPage.CouponModule.useFlag){
				alert("每个订单只可以使用一次优惠券");
				return;
			}
			var thisCouponNo = $(this).attr("coupon-data");
			if (thisCouponNo) {
				var data = thisCouponNo.split('_');
				var couponNo = data[0];
				var couponPrice = parseFloat(data[1]);
				var floorMoney = parseFloat(data[2]);
				var orderPrice = parseFloat(data[3]);
				$("#useCouponLabel .cp_icon").removeClass("icopen").addClass("icoclose");
				$("#js_selet_coupon").addClass("hidden");
				if(orderPrice && floorMoney <= orderPrice){
					orderPage.orderModule.couponPrice = couponPrice;
				}
				$("#js_selected_coupon .info_bg").html('已选加价券：' + couponNo + '  加价额度：' + couponPrice + '元');
				$("#js_selected_coupon").removeClass("hidden");
				orderPage.CouponModule.useFlag = true;
				orderPage.orderModule.couponCode = couponNo;
				
				orderPage.CouponModule.showCoupon = false;
				$(this).parents('li').addClass('one_li').addClass('cur');
				$(this).addClass('checked');
				$(this).html('<span>取消使用</span>');
				
				$('#couponCount').html('1');
				$('#couponPrice').html(couponPrice+'.00');
				$('#totalPrice').html(orderPage.orderModule.orderPrice+couponPrice+'.00');
			}
		}
	}).mouseover(function(){
		$('.coupon_desc', $(this).parents('li')).show();
	}).mouseout(function(){
		$('.coupon_desc', $(this).parents('li')).hide();
	});
	
	$('#js_selected_coupon .closebtn').click(function(){
		$("#js_selected_coupon .info_bg").html('');
		$('#js_selected_coupon').addClass('hidden');
		
		orderPage.orderModule.couponPrice = 0;
		orderPage.CouponModule.showCoupon = false;
		orderPage.orderModule.couponCode = '';
		orderPage.CouponModule.useFlag = false;
		$('#enableCouponList li').removeClass('cur').removeClass('one_li');
		$('#enableCouponList .red_btn').removeClass('checked').html('<span>使用</span>');
		
		//价格显示处理
		$('#couponCount').html(0);
		$('#couponPrice').html('0.00');
		$('#totalPrice').html(orderPage.orderModule.orderPrice+'.00');
	});
	
	$('#useCouponLabel').click(function(){
		if(orderPage.CouponModule.showCoupon){
			orderPage.CouponModule.showCoupon = false;
			$('#useCouponLabel .cp_icon').removeClass('icopen').addClass('icoclose');
			$('#js_selet_coupon').addClass('hidden');
		}else{
			orderPage.CouponModule.showCoupon = true;
			$('#useCouponLabel .cp_icon').removeClass('icoclose').addClass('icopen');
			$('#js_selet_coupon').removeClass('hidden');
		}
		iframeHeightFixHash();
	});
	
	$('#couponCardNo').focus(function(){
		$("#couponCardNo").val("");
	}).blur(function(){
		if($("#couponCardNo").val()==""){
			$("#couponCardNo").val(orderPage.CouponModule.couponDftText);
		}
	});
	
	$('#btnBindConpon').click(function(){
		var coVal = $("#couponCardNo").val();
		if (coVal) {
			if(coVal == orderPage.CouponModule.couponDftText){
				alert("请输入优惠券码");
				return;
			}
			$.post('/api/risecoupon/bind',{couponNo:coVal, uid:uid},function(data){
				if(data){
					if(data.code !== '1'){
						alert(data.message);
						return;
					}else{
						alert('绑定成功');
						window.location.href = window.location.href;
					}
				}
			});
		}
	});
});