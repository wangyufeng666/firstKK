var orderParams = { districtId:'', submitFlag:false};

var documentWidth = document.documentElement.clientWidth;
var bodyWidth = document.body.clientWidth;
var left = (documentWidth-bodyWidth)/2;
var clientHeight = parseInt(document.documentElement.clientHeight, 10);
var sidebarHeight = clientHeight*0.6;
sidebarHeight = sidebarHeight > bodyWidth ? bodyWidth : sidebarHeight;
$().ready(function(){
	$('.btm_submit').bind("click",function(){saveAddress();});
	initSideBar();
	initProvinces();
});

function initProvinces(){
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
		data:{flag:''},
		url:openApiDomain+'/recycle/area/provinces',
		success:function(data){
			var name = '', ulHtml = '';
			for(i in data){
				name = data[i]['NAME'];
				ulHtml += '<li id="'+data[i]['ID']+'" title="'+name+'"><div class="title">'+name+'</div></li>';
			}
			$('#provinceCard').html(ulHtml);
		}
	});
}

//sidebar init
function initSideBar(){
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
			data:{pid:provinceId},
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

//市动态改变
$("#cityCard").delegate("li[id]","click",function(){
	$('#cityCard li').removeClass('checked');
	$(this).addClass('checked');
	var cityId = $(this).attr('id');
	var cityName = $(this).attr('title');
	var flag = $(this).attr('flag');
	if(orderParams.cityId == undefined || orderParams.cityId != cityId){
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
			data:{cid:cityId},
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
	$('#districtId').val(districtId);
	$('#addressBack').trigger('click');
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
	$('#mainContent').css({height:clientHeight+'px',overflow:'hidden'});
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
$('.go_select, #addressText').click(function(){
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
        
        $('#address').val(orderParams.provinceName+" "+orderParams.cityName+" "+orderParams.districtName);
        $('.go_select').html(orderParams.provinceName+"    "+orderParams.cityName+"    "+orderParams.districtName);
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

function saveAddress(){
	var contacts = $('#contacts').val();
	var contactWay = $('#contactWay').val();
	var addrDetail = $('#address').val()+$('#addrDetail').val();
	var districtId = $('#districtId').val();
	var submitFlag = true;
	var mobileReg = /^1[34578]\d{9}$/;//手机号
	if(contacts == ''){
		layerTips('要填写您的姓名哦～');
		submitFlag = false;
	}else if(contactWay == ''){
		layerTips('要填写手机号哦～');
		submitFlag = false;
	}else if(!mobileReg.test(contactWay)){
		layerTips('手机号码格式错误');
		submitFlag = false;
	}else if(districtId == ''){
		layerTips('要选择所在地区哦～');
		submitFlag = false;
	}else if($('#addrDetail').val() == ''){
		layerTips('请填写详细地址');
		submitFlag = false;
	}
	if(submitFlag){
		$.ajax({
			type:"get",
			url:"/zzy/user/modifyaddress",
			data:{contacts:contacts,contactWay:contactWay,addrDetail:addrDetail,districtId:districtId},
			async:false,
			success:function(data){
				window.location.href = returnUrl;
			},error:function(){
				layerTips('网络异常');
			}
		});
	}
}

function layerTips(val){
    layer.open({
      style: 'border:none; background-color:#666; color:#fff;padding:0.3rem 0'
      ,content: val
      ,skin: 'msg'
      ,time: 3 //3秒后自动关闭
    });
}
