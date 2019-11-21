var orderParams = {districtId:'', submitFlag:false};
var applianceFlag = 'N';

var documentWidth = document.documentElement.clientWidth;
var bodyWidth = document.body.clientWidth;
var left = (documentWidth-bodyWidth)/2;
var clientHeight = parseInt(document.documentElement.clientHeight, 10);
var sidebarHeight = clientHeight*0.6;
sidebarHeight = sidebarHeight > bodyWidth ? bodyWidth : sidebarHeight;

$().ready(function(){
	$('#btn_submit').bind("click",function(){orderSubmit();});
	initProvince();
	initSideBar();
});

//省份初始化
function initProvince(){
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
		url:openApiDomain+'/recycle/area/provinces',
		success:function(data){
			var ulHtml = '';
        	for(i in data){
        		ulHtml += '<li id="'+data[i]['ID']+'" title="'+data[i]['NAME']+'"><div class="title">'+data[i]['NAME']+'</div></li>';
        	}
        	$('#provinceCard').html(ulHtml);
		}
	});
}

function initSideBar(){
	//sidebar init
	$('#menu-sidebar').css({height:sidebarHeight+'px'});
	//地区初始化
	$('.area-list').height(sidebarHeight-$('#area-header').height());
	$('.menu-sidebar').css({height:sidebarHeight+'px'});
	$('.menu-sidebar').css({width:bodyWidth+'px'});
	
	tranformTo('.menu-sidebar', left, '2000');
}

//省动态改变
$("#provinceCard").delegate("li[id]","click",function(){
	$('#provinceCard li').removeClass('checked');
	$(this).addClass('checked');
	var provinceId = $(this).attr('id');
	var provinceName = $(this).attr('title');
	if(orderParams.provinceId == undefined || orderParams.provinceId != provinceId){
		
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
			data:{pid:provinceId,flag:applianceFlag},
			url:openApiDomain+'/recycle/area/citys',
			success:function(data){
				var name = '', ulHtml = '';
				for(i in data){
					name = data[i]['NAME'];
					ulHtml += '<li id="'+data[i]['ID']+'" flag="'+data[i]['FLAG']+'" title="'+name+'"><div class="title">'+name+'</div></li>';
				}
				$('#cityCard').html(ulHtml);
				$('.area-nav>[for="provinceCard"]').html(provinceName);
				orderParams.provinceId = provinceId;
				orderParams.provinceName = provinceName;
			}
		});
		//城市、县区初始化
		cityCardInit();
		districtCardInit();
	}
	$('.area-nav>[for="cityCard"]').trigger('click');
});

//市动态改变
$("#cityCard").delegate("li[id]","click",function(){
	$('#cityCard li').removeClass('checked');
	$(this).addClass('checked');
	var cityId = $(this).attr('id');
	var cityName = $(this).attr('title');
	var flag = $(this).attr('flag');
	if(orderParams.cityId == undefined || orderParams.cityId != cityId){
		
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
			data:{cid:cityId,flag:applianceFlag},
			url:openApiDomain+'/recycle/area/districts',
			success:function(data){
				var name = '', ulHtml = '';
				for(i in data){
					name = data[i]['NAME'];
					ulHtml += '<li id="'+data[i]['ID']+'" flag="'+data[i]['FLAG']+'" title="'+name+'"><div class="title">'+name+'</div></li>';
				}
				$("#districtCard").html(ulHtml);
				$('.area-nav>[for="cityCard"]').html(cityName);
			}
		});
		//县区初始化
		districtCardInit();
	}
	orderParams.cityId = cityId;
	orderParams.cityName = cityName;
	$('.area-nav>[for="districtCard"]').trigger('click');
});

//县区动态改变
$("#districtCard").delegate("li[id]","click",function(){
	$('#districtCard li').removeClass('checked');
	$(this).addClass('checked');
	var districtId = $(this).attr('id');
	var districtName = $(this).attr('title');
	var flag = $(this).attr('flag');
	$('.area-nav>[for="districtCard"]').html(districtName);
	orderParams.districtId = districtId;
	orderParams.districtName = districtName;
	$('#addressBack').trigger('click');
});

/**
 * 城市card显示初始化
 * @return
 */
function cityCardInit(){
	orderParams.cityId = '';
	orderParams.cityName = '';
	$('.area-nav>[for="cityCard"]').html('城市');
	$('#cityCard').html('<li><div class="title" style="text-align:center;">请先选择省份</div></li>');
}

/**
 * 县区card显示初始化
 * @return
 */
function districtCardInit(){
	orderParams.districtId = '';
	orderParams.districtName = '';
	$('.area-nav>[for="districtCard"]').html('县区');
	$('#districtCard').html('<li><div class="title" style="text-align:center;">请先选择城市</div></li>');
}

/**
 * sidebar 隐藏
 */
function sidebarHide(){
	$('#slideMask').hide();
	$('html,body').animate({scrollTop:0}, 1);
	$('#mainContent').css({height:'',overflow:'auto'});
}

/**
 * sidebar 展示
 */
function sidebarShow(){
	$('#slideMask').show();
	$('html,body').animate({scrollTop:0}, 1);
	$('#mainContent').css({height:'300px',overflow:'hidden'});
}
/**
 * 动画效果
 */
function tranformTo(documentId, left, top){
	$(documentId).css("-webkit-transform", "translate("+left+"px, "+top+"px)");
	$(documentId).css("-moz-transform", "translate("+left+"px, "+top+"px)");
	$(documentId).css("-ms-transform", "translate("+left+"px, "+top+"px)");
	$(documentId).css("-o-tranform", "translate("+left+"px, "+top+"px)");
	$(documentId).css("transform", "translate("+left+"px, "+top+"px)");
}

//省市区点击事件
$('#addrBox, #addressText').click(function(){
	sidebarShow();
	$('.area-wrapper').parent().show();
	tranformTo('#areaSidebar', left, '0');
	//省份显示
	$('.area-list').hide();//
	$('.subway-list').hide();//
	$('#provinceCard').show();
});

//地区省市区header选择点击事件
$('.area-nav li').click(function(){
	$('.area-nav li').removeClass('current');
	$(this).addClass('current');
	var forId = $(this).attr('for');
	var level = $(this).attr('level');
	$('.area-wrapper>ul').hide();
	$('#'+forId).show();
});

//地区sidebar返回点击事件
$('#addressBack').click(function(){
	if(orderParams.districtId != ''){
		$("#tradeTab .item").removeClass('checked');
		$("#tradeDesc .item").removeClass('checked');
		
		var tradeType = '';
		orderParams.tradeType = tradeType;
		$("#tradeTab .item[for='"+tradeType+"']").trigger('click');
		$('#addressText').val(orderParams.provinceName+"    "+orderParams.cityName+"    "+orderParams.districtName);
	}
	
	tranformTo('#areaSidebar', left, '2000');
	//地区隐藏
	$('.area-list').hide();
	$('.area-wrapper').parent().hide();
	sidebarHide();
	
	//区域初始化
	$('.area-nav li').removeClass('current');
	$('.area-nav>[for="provinceCard"]').addClass('current');
});

//提交订单
function orderSubmit(){
	var index = layer.open({type: 2});
	$('#btn_submit').unbind('click');
	var contacts = $.trim($('#contacts').val());
	var contactWay = $.trim($('#contactWay').val());
	var address = $.trim($('#address').val());
	var email = $.trim($('#email').val());
	var username = $.trim($('#username').val());
	var password = $.trim($('#password').val());
	var password1 = $.trim($('#password1').val());
	var partnerName = $.trim($('#partnerName').val());
	var person = $.trim($('#person').val());
	var personmobile = $.trim($('#personmobile').val());
	var licenseCode = $.trim($('#licenseCode').val());
	var addressText = $.trim($('#addressText').val());
	var idCard = $.trim($('#idCard').val());
	var businessType = $.trim($('.wt-item .checked').attr('businessType'));
	var registType = $.trim($('.regist .checked').attr('registType'));
	
	
	
	var submitFlag = true;
	var mobileReg = /^1[34578]\d{9}$/;//手机号
	var idcardReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;//身份证验证
	
	if(registType == '1'){
		if(isNull(contacts)){
			errorTip('输入联系人姓名');
			submitFlag = false;
		}else if(isNull(contactWay)){
			errorTip('输入联系人电话');
			submitFlag = false;
		}else if(isNull(email)){
			errorTip('输入常用邮箱');
			submitFlag = false;
		}else if(isNull(username)){
			errorTip('输入用户名');
			submitFlag = false;
		}else if(isNull(password)){
			errorTip('输入密码');
			submitFlag = false;
		}else if(isNull(password1)){
			errorTip('输入确认密码');
			submitFlag = false;
		}else if(maxLength(contacts) > 20){
			errorTip('姓名不能超过20个字符哦～');
			submitFlag = false;
		}else if(password != password1){
			errorTip('两次密码不一致');
			submitFlag = false;
		}else if(maxLength(username) <= 6 || maxLength(contacts) >= 20){
			errorTip('用户名6~20个字符');
			submitFlag = false;
		}else if(!mobileReg.test(contactWay)){
			errorTip('手机号码格式错误');
			submitFlag = false;
		}else if(isNull(partnerName)){
			errorTip('输入公司名称');
			submitFlag = false;
		}else if(isNull(person)){
			errorTip('输入法人姓名');
			submitFlag = false;
		}else if(isNull(personmobile)){
			errorTip('输入法人电话');
			submitFlag = false;
		}else if(isNull(licenseCode)){
			errorTip('输入营业执照');
			submitFlag = false;
		}else if(isNull(orderParams.districtId)){
			errorTip('选择地区');
			submitFlag = false;
		}else if(isNull(address)){
			errorTip('输入详细地址');
			submitFlag = false;
		}
	}else if(registType == '2'){
		if(isNull(contacts)){
			errorTip('输入联系人姓名');
			submitFlag = false;
		}else if(isNull(contactWay)){
			errorTip('输入联系人电话');
			submitFlag = false;
		}else if(isNull(email)){
			errorTip('输入常用邮箱');
			submitFlag = false;
		}else if(isNull(username)){
			errorTip('输入用户名');
			submitFlag = false;
		}else if(isNull(password)){
			errorTip('输入密码');
			submitFlag = false;
		}else if(isNull(password1)){
			errorTip('输入确认密码');
			submitFlag = false;
		}else if(maxLength(contacts) > 20){
			errorTip('姓名不能超过20个字符哦～');
			submitFlag = false;
		}else if(password != password1){
			errorTip('两次密码不一致');
			submitFlag = false;
		}else if(maxLength(username) <= 6 || maxLength(contacts) >= 20){
			errorTip('用户名6~20个字符');
			submitFlag = false;
		}else if(!mobileReg.test(contactWay)){
			errorTip('手机号码格式错误');
			submitFlag = false;
		}else if(isNull(idCard)){
			errorTip('身份证号不能为空');
			submitFlag = false;
		}else if(isNull(orderParams.districtId)){
			errorTip('选择地区');
			submitFlag = false;
		}else if(isNull(address)){
			errorTip('输入详细地址');
			submitFlag = false;
		}else if(!idcardReg.test(idCard)){
			errorTip('身份证号格式错误');
			submitFlag = false;
		}
	}
	
	
	if(submitFlag){//详细地址
		if(address == ''){
			errorTip('没写详细地址哦～');
			submitFlag = false;
		}else{
			address = orderParams.provinceName+" "+orderParams.cityName+" "+orderParams.districtName+" "+address;
		}
	}
	
	if(submitFlag){
		$('#contactAddress').val(address);
		$('#businessType').val(businessType);
		$('#registType').val(registType);
		$('#qu').val(orderParams.districtId);
	}else{
		layer.close(index);
		$('#btn_submit').unbind("click");
		$('#btn_submit').bind("click",function(){orderSubmit();});
	}
	
	if(submitFlag){
		$.post('/partner/regist/checknewpartner', {userName:username,contactWay:contactWay}, function(data){
			if(data == false){
				$('#addForm').submit();
			}else{
				errorTip('联系电话或登录名已存在，无法注册');
				layer.close(index);
				$('#btn_submit').unbind("click");
				$('#btn_submit').bind("click",function(){orderSubmit();});
			}
		});
	}else{
		layer.close(index);
		$('#btn_submit').unbind("click");
		$('#btn_submit').bind("click",function(){orderSubmit();});
	}
}

function isNull(value){
	return !notNull(value);
}

function notNull(value){
	if(value != null && value != '' && value != undefined){
		return true;
	}
	return false;
}

function maxLength(value){
	if(notNull(value)){
		return value.length;
	}else{
		return 0;
	}
}

$("#huishou").click(function(){
	$("#zulin").removeClass("checked");
	$("#huishou").addClass("checked");
})

$("#zulin").click(function(){
	$("#zulin").addClass("checked");
	$("#huishou").removeClass("checked");
})

$("#companyregist").click(function(){
	$("#personregist").removeClass("checked");
	$("#companyregist").addClass("checked");
	$("#companybox").show();
	$("#personbox").hide();
})

$("#personregist").click(function(){
	$("#personregist").addClass("checked");
	$("#companyregist").removeClass("checked");
	$("#companybox").hide();
	$("#personbox").show();
})

function errorTip(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}