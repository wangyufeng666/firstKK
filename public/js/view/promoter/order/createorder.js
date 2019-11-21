var orderParams = {subwayFlag:false, visitFlag:false, expressFlag:(applianceFlag == 'N'), diyFlag:(diyFlag == 'Y'),
		tradeType:tradeType, districtId:'', submitFlag:false, serverDateText:'请选择预约回收时间', serverDate:''};

var documentWidth = document.documentElement.clientWidth;
var bodyWidth = document.body.clientWidth;
var left = (documentWidth-bodyWidth)/2;
var clientHeight = parseInt(document.documentElement.clientHeight, 10);
var sidebarHeight = clientHeight*0.6;
sidebarHeight = sidebarHeight > bodyWidth ? bodyWidth : sidebarHeight;

$().ready(function(){
	$('#btn_submit').bind("click",function(){orderSubmit();});
	var _ua = navigator.userAgent;
	_ua = _ua.toLowerCase();
	if(_ua.indexOf('iphone') > -1 && _ua.indexOf('safari') > -1){
		$('#mainContent').removeClass('androidFlag');
	}
	
	$('.serverdate').click(function(){
		$('input').blur();
	});
	initProvince();
	initSideBar();
	
	//3C上门区域
	visitArea();
});

function visitArea(){
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
		url:openApiDomain+'/recycle/area/visitcitys',
		success:function(data){
			if(data){
				var visit3cCitys = data.visit3cCitys;
				var subwayCitys = data.subwayCitys;
				var applianceCitys = data.applianceCitys;
				
				$('#appAreaTexts').html(applianceCitys);
				$('#subwayAreaTexts').html(subwayCitys);
				$('#visit3cAreaTexts').html(visit3cCitys);
			}
		}
	});
}

//省份初始化
function initProvince(){
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
		data:{flag:applianceFlag},
		url:openApiDomain+'/recycle/area/provinces',
		success:function(data){
			var ulHtml = '';
        	for(i in data){
        		ulHtml += '<li id="'+data[i]['ID']+'" title="'+data[i]['NAME']+'"><div class="title">'+data[i]['NAME']+'</div></li>';
        	}
        	$('#provinceCard').html(ulHtml);
//        	$('#provinceCard').show();
		}
	});
}

function initSideBar(){
	//sidebar init
	$('#menu-sidebar').css({height:sidebarHeight+'px'});
	//地区初始化
	$('.area-list').height(sidebarHeight-$('#area-header').height());
	$('.subway-list').height(sidebarHeight-$('#subway-header').height());
	$('.server-list').height(sidebarHeight-$('#server-header').height());
	
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
 * 地铁线card显示初始化
 * @return
 */
function sublineCardInit(){
	orderParams.lineId = '';
	orderParams.lineName = '';
	orderParams.stationId = '';
	orderParams.stationName = '';
	
	$('.subway-wrapper>ul').hide();
	//$('#subwayCard').show();
	$('.subway-nav li').removeClass('current');
	$('.subway-nav>[for="subwayCard"]').addClass('current');
	$('.subway-nav>[for="subwayCard"]').html('地铁线');
	$('.subway-nav>[for="stationCard"]').html('地铁站');
	$('#stationCard').html('<li><div class="title" style="text-align:center;">请先选择地铁线</div></li>');
	$('#subwayText').html('请选择地铁站点<div class="go"></div>');
}

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
		
		if(flag == '5'){//提供地铁交易
			orderParams.subwayFlag = true;
			
			$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
				data:{cid:cityId},
				url:openApiDomain+'/recycle/area/subwaylines',
	    		success:function(data){
	    			if(data != '0'){
	    				var liHtml = '';
	                	for(i in data){
	                		liHtml += "<li id='"+data[i]['LINEID']+"' title='"+data[i]['LINENAME']+"'><div class='title'>"+data[i]['LINENAME']+"</div></li>";
	                	}
	                	$('#subwayCard').html(liHtml);
	            	}
	    		}
	    	});
			//地铁线card初始化
			sublineCardInit();
		}else{
			orderParams.subwayFlag = false;
		}
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
	if(districtId != ''){
		if(applianceFlag == 'N'){//非大家电
			orderParams.visitFlag = (flag == '1' || flag == '2');
		}else{//大家电
			$('#btn_submit').unbind('click');
			if(flag == '1' || flag == '3'){//大家电上门
				$('#errorTip').hide();
				$('#btn_submit').removeClass('reset_btn').addClass('next_btn');
				$('#btn_submit').bind("click",function(){orderSubmit();});
			}else{
				$('#btn_submit').removeClass('next_btn').addClass('reset_btn');
				errorTip('当前地区暂不支持大家电上门服务');
			}
			orderParams.submitFlag = (flag == '1' || flag == '3');
			orderParams.visitFlag = (flag == '1' || flag == '3');
		}
	}
	orderParams.districtId = districtId;
	orderParams.districtName = districtName;
	$('#addressBack').trigger('click');
});


//地区sidebar返回点击事件
$('#addressBack').click(function(){
	if(orderParams.districtId != ''){
		$("#tradeTab .item").removeClass('checked');
		$("#tradeDesc .item").removeClass('checked');
		if(orderParams.visitFlag){//上门
			$("#tradeTab .item[for='1']").css({display:'block'});
			$("#tradeDesc .item[for='1']").addClass('checked');
		}else{
			$("#tradeTab .item[for='1']").hide();
		}
		
		if(orderParams.subwayFlag){//地铁
			$("#tradeTab .item[for='5']").css({display:'block'});
		}else{
			$("#tradeTab .item[for='5']").hide();
		}
		
		if(orderParams.expressFlag){//快递
			$("#tradeTab .item[for='2']").css({display:'block'});
		}else{
			$("#tradeTab .item[for='2']").hide();
		}
		var tradeType = '';
		if(orderParams.diyFlag){//快递
			tradeType = '2';
		}else if(orderParams.visitFlag){//上门
			tradeType = '1';
		}else if(orderParams.subwayFlag){//地铁
			tradeType = '5';
		}else if(orderParams.expressFlag){//快递
			tradeType = '2';
		}
		orderParams.tradeType = tradeType;
		$("#tradeTab .item[for='"+tradeType+"']").trigger('click');
		$('#addressText .text').html(orderParams.provinceName+"    "+orderParams.cityName+"    "+orderParams.districtName);
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

//预约时间选择
$('#serverDateText, #serverDateSubwayText').click(function(){
	sidebarShow();
	$('.server-wrapper').parent().show();
	tranformTo('#serverSidebar', left, '0');
});

//上门时间选择sidebar返回点击事件
$('#serverDateBack').click(function(){
	tranformTo('#serverSidebar', left, '2000');
	$('.server-wrapper').parent().hide();
	sidebarHide();
	$('.serverdate').html(orderParams.serverDateText+'<div class="go"></div>');
	$('body').animate({scrollTop:280}, 1);
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


$('#orderForm input').focus(function(){
	$('#errorTip').hide();
});

//提交订单
function orderSubmit(){
	var index = layer.open({type: 2});
	$('#errorTip').hide();
	$('#btn_submit').unbind('click');
	var contacts = $.trim($('#contacts').val());
	var contactWay = $.trim($('#contactWay').val());
	var address = '';
	
	var submitFlag = true;
	var mobileReg = /^1[34578]\d{9}$/;//手机号
	if(isNull(orderParams.districtId)){
		errorTip('要选择所在地区哦～');
  	  	submitFlag = false;
	}
	
	if(submitFlag){
		if(orderParams.tradeType == '1'){//上门
			address = $("#addrDetail1").val();
		}
	}
	
	if(submitFlag){//详细地址
		if(orderParams.tradeType != '2'){
			if(address == ''){
				errorTip('没写详细地址哦～');
				submitFlag = false;
			}else{
				address = orderParams.provinceName+" "+orderParams.cityName+" "+orderParams.districtName+" "+address;
			}
		}else{
			address = orderParams.provinceName+" "+orderParams.cityName+" "+orderParams.districtName;
		}
	}else{
		address = orderParams.provinceName+" "+orderParams.cityName+" "+orderParams.districtName+" "+address;
	}
	
	if(submitFlag){
		$('#tradeType').val(orderParams.tradeType);
		$('#serverDate').val(orderParams.serverDate);
		$('#contactAddress').val(address);
		$('#orderForm').submit();
	}else{
		layer.close(index);
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

function errorTip(errText){
	layer.open({content:'<div class="tiptext">'+errText+'</div>',time:3});
}