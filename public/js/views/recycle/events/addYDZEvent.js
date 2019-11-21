var attrs = [];
$().ready(function(){
	
	//数字验证
	checkNumber();
	
	//品类、品牌初始化
	resetAddArea();
	
	$("#saveForm").validate({
		rules:{
			eventName:{
				required:true,
				maxlength:50
			},
			nickName:{
				required:true,
				maxlength:20
			},
			startDate:{
				required:true
			},
			stopDate:{
				required:true
			},
			codePoint:{
				required:true,
				min:0,
				max:200
			},
			eventDesc:{
				required:true,
				maxlength:280
			},
			eventMark:{
				required:true,
				maxlength:100
			}
		},
		messages:{
            eventName:{
            	required:"请输入活动名称",
            	maxlength:"最多输入50个字符"
            },
            nickName:{
            	required:"请输入活动别名",
            	maxlength:"最多输入20个字符"
            },
            startDate:{
            	required:"请输入开始时间"
            },
            stopDate:{
            	required:"请输入结束时间"
            },
            codePoint:{
            	required:"请输入基准率",
            	min:"必须大于0",
            	max:"必须小于200"
            },
            eventDesc:{
            	required:"请输入活动规则",
            	maxlength:"最多输入280个字符"
            },
            eventDesc:{
            	required:"请输入活动高亮推广词",
            	maxlength:"最多输入100个字符"
            }
		}
	});
	$("#saveBtn").bind("click", function(){saveEventInfo()});
	
	//添加品类
	$('#btnAddMerType').click(function(){
		var ids = [];
		$('#merTypeArea .labelBox .label').each(function(){
			ids.push($(this).attr('data_code'));
		});
	    layer.open({
	        type:2,
	        title:'添加品类',
	        shadeClose:false,
	        shade:0.8,
	        content:'/recycle/events/addmertypes?ids='+ids.join(','),
	        area:['520px','500px'],
	        close:function(index){
	            layer.close(index);
	        }
	    });
	});
	
	//添加品牌
	$('#btnAddBrand').click(function(){
		var merTypes = [];
		$('#merTypeArea .labelBox .label').each(function(){
			if($(this).attr('data_code') != 'ALL'){
				merTypes.push($(this).attr('data_code'));
			}
		});
		if(merTypes.length < 1){
			alert('请添加参与活动的品类');
			return;
		}
		
		var checkedBrands = [];
		$('#brandArea .labelBox .label').each(function(){
			if($(this).attr('data_code') == 'ALL'){
				checkedBrands.push($(this).attr('data_type')+'-'+$(this).attr('data_code'));
			}else{
				checkedBrands.push($(this).attr('data_code'));
			}
		});
		
	    layer.open({
	        type:2,
	        title:'添加品牌',
	        shadeClose:false,
	        shade:0.8,
	        content:'/recycle/events/addbrands?merTypes='+merTypes.join(',')+'&checkedBrands='+checkedBrands.join(','),
	        area:['300px','500px'],
	        close:function(index){
	            layer.close(index);
	        }
	    });
	});
	
	//加价类型
	$('.radioPlusType').change(function(){
		var plusType = $('input[name="plusType"]:checked').val();
		$('.levelBox .levelItem').removeClass('plusType1').removeClass('plusType2').addClass('plusType'+plusType);
	});

	//图片上传点击
	$('.imgArea .addImg').click(function(){
		$(this).next('.uploadImg').click();
	});

	//图片删除
	$('.imgArea .delImg').click(function(){
		var imgBox = $(this).parent();
		imgBox.find('input').val('');
		imgBox.find('img.preview').attr("src", "");
		//IE9以下
		imgBox.find('img.preview').css("filter", "");
		$(this).hide();
		imgBox.find('.addImg').show();
	});
	
	//活动配图类型
	$('input[name="bannerType"]').change(function(){
		
		var thisVal = $(this).val();
		var imgItem = thisVal == '1' ? 'mainImgItem' : 'themeImgItem';
		
		if($(this).is(':checked')){
			$('#'+imgItem).show();
		}else{
			$('#'+imgItem).hide();
			$('#'+imgItem).find('.uploadImg').val('');
			$('#'+imgItem).find('.addImg').show();
			$('#'+imgItem).find('.preview').attr('src', '').hide();
			$('#'+imgItem).find('.delImg').hide();
		}
	});
	
	//日期验证
	$('#startDate').click(function(){
		WdatePicker({
			onpicked:function(){$('#stopDate').trigger('click');},
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			minDate:'%y-%M-%d',
			maxDate:'#F{$dp.$D(\'stopDate\')}',
			startDate:'%y-{%M}-%d'
		});
	});
	$('#stopDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			minDate:'#F{$dp.$D(\'startDate\')||%y-%M-%d}',
			startDate:'%y-{%M+1}-%d'
		});
	});
});

function addLevel(){
	var index = $('.levelBox .levelItem').size();
	if(index > 9){
		alert('不允许超过10级');
		return;
	}
	var plusType = $('input[name="plusType"]:checked').val();
	var html = '';
	html += '<div class="levelItem plusType'+plusType+' clearfix">';
    html += '  <div class="span span1">'+(index+1)+'级</div>';
    html += '  <div class="span span2">';
    html += '     <input type="number" min="0" maxval="999999" name="minPrice" class="minPrice checkVal"/>';
	html += '     &nbsp;至&nbsp;<input type="number" min="0" maxval="999999" name="maxPrice" class="maxPrice checkVal"/>元</div>';
	html += '  <div class="span span3">加价比例<input type="number" min="0" maxval="100" name="percentVal" class="percentVal checkVal"/>%</div>';
	html += '  <div class="span span4">加价金额<input type="number" min="0" maxval="999999" name="absoluteVal" class="absoluteVal checkVal">元</div>';
	html += '  <div><button type="button" class="removeLevel">&nbsp;-&nbsp;</button></div>';
	html += '</div>';
	$('.levelBox').append(html);
	
	//注册文本框验证事件
	checkNumber();
	
	//注册加价阶梯删除事件
	$('.removeLevel').unbind('click');
	$('.removeLevel').bind('click', function(){

		$(this).parents('.levelItem').remove();
		
		$('.levelBox .levelItem').each(function(i){
			$('.span1', $(this)).html((i+1)+'级');
		});
	});
	
	//注册事件
	$('.levelBox .levelItem .maxPrice').unbind('blur');
	$('.levelBox .levelItem .maxPrice').blur(function(){
		var thisVal = $(this).val();
		var reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/;
		if(!reg.test(thisVal)){
			$(this).val('');
			return;
		}
		
		var nextItem = $(this).parents('.levelItem').next();
		if(nextItem){
			$('.minPrice', nextItem).val(thisVal);
		}
	});
}

//验证数字
function checkNumber(){
	$('.checkVal').unbind('input');
	$('.checkVal').bind('input', function(){
		changeNum(this);
	});
}

//

function saveEventInfo(){

	//表单验证
	if(!$('#saveForm').valid()){
		return;
	}
	
	var params = {};
	params.partnerCode = $('#partnerCode').val();
	params.eventName = $('#eventName').val();
	params.nickName = $('#nickName').val();
	params.startDate = $('#startDate').val();
	params.stopDate = $('#stopDate').val();
	params.codePoint = $('#codePoint').val();
	params.eventDesc = $('#eventDesc').val();
	params.eventMark = $('#eventMark').val();
	
	var errMsgs = [];

	var priceLevels = [];
	var reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/;

	//加价类型
	var plusType = $('input[name="plusType"]:checked').val();
	
	params.plusPriceType = plusType;//加价方式
	
	$('.levelBox .levelItem').each(function(index){
		var minPrice = $('.minPrice', $(this)).val();
		var maxPrice = $('.maxPrice', $(this)).val();
		var percentVal = $('.percentVal', $(this)).val();
		var absoluteVal = $('.absoluteVal', $(this)).val();
		
		if(!reg.test(minPrice) || !reg.test(maxPrice)){
			errMsgs.push('加价最小值或最大值设置错误。请填写正数，最多保留2位小数。错误行数：'+(index+1));
		}
		
		if(plusType == '1'){//百分比加价
			if(!reg.test(percentVal)){
				errMsgs.push('加价百分比设置错误，请填写正数，最多保留2位小数。错误行数：'+(index+1));
			}
		}else if(plusType == '2'){//绝对值加价
			if(!reg.test(absoluteVal)){
				errMsgs.push('加价绝对值设置错误，请填写正数，最多保留2位小数。错误行数：'+(index+1));
			}
		}else if(plusType == '3'){//百分比+绝对值加价
			if(!reg.test(percentVal) || !reg.test(absoluteVal)){
				errMsgs.push('加价百分比或绝对值设置错误，请填写正数，最多保留2位小数。错误行数：'+(index+1));
			}
		}
		
		if(minPrice > maxPrice){
			errMsgs.push('加价最小金额必须小于最大金额。错误行数：'+(index+1));
		}
		priceLevels.push({
				minPrice:$('.minPrice', $(this)).val(),
				maxPrice:$('.maxPrice', $(this)).val(),
				percentVal:$('.percentVal', $(this)).val(),
				absoluteVal:$('.absoluteVal', $(this)).val()
		});
	});
	
	if(errMsgs.length > 0){
		alert(errMsgs.join("\n"));
		return;
	}
	params.priceLevels = priceLevels;
	//上传图片验证
	if($('input[name="bannerType"][value="1"]').is(':checked')){
		if($('#mainBannerImg').val() == ''){
			alert('请上传首页banner图片');
			return;
		}
	}
	if($('input[name="bannerType"][value="2"]').is(':checked')){
		if($('#themeBannerImg').val() == ''){
			alert('请上传主题活动banner图片');
			return;
		}
	}
	
	if($('#detailBannerImg').val() == ''){
		alert('请上传活动详情banner图片');
		return;
	}
	
	//品类验证
	if($('#merTypeArea .label').size() == 0){
		alert('请添加参与活动的品类');
		return;
	}
	
	//品牌验证
	if($('#brandArea .label').size() == 0){
		alert('请添加品牌');
		return;
	}
	
	var merTypes = [];
	$('#brandArea .label').each(function(){
		if($(this).attr('data_code') == 'ALL-ALL'){
			merTypes.push({type:'1', value:'#'});
		}else if($(this).attr('data_code') == 'ALL'){
			merTypes.push({type:'2', value:$(this).attr('data_type')});
		}else{
			merTypes.push({type:'3', value:$(this).attr('data_code')});
		}
	});
	
	if(merTypes.length == 0){
		alert('请选择品类和品牌');
		return;
	}
	
	params.merTypes = merTypes;
	
	$('#saveBtn').unbind('click');
	var index = layer.load();
	
	var eventImgs = [];
	//上传图片到远程服务器
	if($('input[name="bannerType"][value="1"]').is(':checked')){
		//上传主图
		var imgData = $('#mainBannerImg').next().attr('src');
		var result = imgUpload(imgData, 1);
		console.log('1 over');
		console.log(result);
		if(result.code = '200'){
			eventImgs.push({src:result.src, type:'1'});//主图
		}else{
			alert(result.msg);
            $('#saveBtn').bind('click', function(){saveEventInfo()});
			return;
		}
	}
	
	if($('input[name="bannerType"][value="2"]').is(':checked')){
		//上传副图
		var imgData = $('#themeBannerImg').next().attr('src');
		var result = imgUpload(imgData,2);
		console.log('2 over');
		console.log(result);
		if(result.code = '200'){
			eventImgs.push({src:result.src, type:'2'});//副图
		}else{
			alert(result.msg);
            $('#saveBtn').bind('click', function(){saveEventInfo()});
			return;
		}
	}
	
	//上传活动详情页banner
	var imgData = $('#detailBannerImg').next().attr('src');
	var result = imgUpload(imgData,4);
	console.log('4 over');
	console.log(result);
	if(result.code = '200'){
		eventImgs.push({src:result.src, type:'4'});//副图
	}else{
		alert(result.msg);
        $('#saveBtn').bind('click', function(){saveEventInfo()});
		return;
	}
	
	params.eventImgs = eventImgs;
    $.ajax({
        type:"POST",
        url:"/recycle/events/savepartnerevent",
        data:params,
        dataType:"json",
        timeout:30000,
        cache:false,
        success:function(data){
        	layer.close(index);
            if(data.result == 'Y'){
                layer.alert("保存成功", 1);
                parent.reload();
            }else{
                $('#saveBtn').bind('click', function(){saveEventInfo()});
                layer.alert(data.errMsg);
            }
        },
        error:function(){
        	$('#saveBtn').bind('click', function(){saveEventInfo()});
          	layer.alert('网络错误,请重试！');
        }
    });
}

function imgUpload(imgData, id){
	var data = {code:404, msg:'网络错误。。。'};
	$.ajax({
        type:"POST",
        url:uploadDomain+"/image/upload/base64",
        data:{imgData:imgData},
        async:false,//设置为同步操作
        dataType:"json",
        timeout:10000,
        cache:false,
        success:function(val){
        	data = val;
        	console.log(id);
        	console.log(data);
        }
    });
	console.log(id+'___gogogo');
	return data;
}

/**
 * 获取品类子页面回传的数据
 * @param datas
 * @returns
 */
function getMerTypes(datas){
	var merTypeHtml = '', brandHtml='';
	if(datas.length > 0){
		for(var i in datas){
			merTypeHtml += '<div class="label" data_code="'+datas[i].value+'"><span>'+datas[i].title+'</span><i>x</i></div>';
			brandHtml += '<div class="label" data_type="'+datas[i].value+'" data_code="ALL"><span>'+datas[i].title+'-全品牌</span><i>x</i></div>';
		}
		$('#merTypeArea .labelBox').empty().append(merTypeHtml);
		$('#brandArea .labelBox').empty().append(brandHtml);//初始化品牌列表
		
		//初始化品类和品牌
		resetAddArea();
	}
	closeLayer();
}

//全品类
function allCategorys(){
	var datas = [{id:'ALL', title:'全品类', children:[{id:'ALL-ALL', title:'全品牌'}]}];
	getBrands(datas);
}

/**
 * 获取品牌子页面回传的数据
 * @param datas
 * @returns
 */
function getBrands(datas){
	var brandHtml = '', merTypeHtml = '', merTypes = [];
	if(datas.length > 0){
		for(var i in datas){
			var brands = datas[i].children;
			
			if(datas[i].size == brands.length){
				brandHtml += '<div class="label" data_type="'+datas[i].id+'" data_code="ALL" title="'+datas[i].title+'-全品牌"><span>'+datas[i].title+'-全品牌</span><i>x</i></div>';
			}else{
				for(var j in brands){
					brandHtml += '<div class="label" data_type="'+datas[i].id+'" data_code="'+brands[j].id+'" title="'+datas[i].title+'-'+brands[j].title+'"><span>'+brands[j].title+'</span><i>x</i></div>';
				}
			}
			merTypeHtml += '<div class="label" data_code="'+datas[i].id+'"><span>'+datas[i].title+'</span><i>x</i></div>';;
		}
		$('#brandArea .labelBox').empty().append(brandHtml);
		
		//品类重新绑定
		$('#merTypeArea .labelBox').empty().append(merTypeHtml);
		
		//初始化品类和品牌
		resetAddArea();
	}
	closeLayer();
}

/**
 * 初始化添加品类和品牌区域
 * @returns
 */
function resetAddArea(){
	//品类删除重新绑定
	$('#merTypeArea .labelBox .label').unbind('click');
	$('#merTypeArea .labelBox .label i').delegate('', 'click', function(){
		var merType = $(this).parent().attr('data_code');
		$(this).parent().remove();
		$('[data_type="'+merType+'"]', $('#brandArea .labelBox')).remove();
	});
	
	//品牌删除重新绑定
	$('#brandArea .labelBox .label').unbind('click');
	$('#brandArea .labelBox .label i').delegate('', 'click', function(){
		var merType = $(this).parent().attr('data_type');
		$(this).parent().remove();
		
		if($('[data_type="'+merType+'"]', $('#brandArea .labelBox')).size() == 0){
			$('[data_code="'+merType+'"]', $('#merTypeArea .labelBox')).remove();
		}
	});
}

function closeLayer(){
	layer.closeAll();
}

function changeNum(obj){
	//如果用户第一位输入的是小数点，则重置输入框内容
	if (obj.value != '' && obj.value.substr(0, 1) == '.') {
		obj.value = '';
	}
	
	if($(obj).attr('maxval') && Number(obj.value) > Number($(obj).attr('maxval'))){
		obj.value = obj.value.substr(0, obj.value.length-1);
	}
	
	obj.value = obj.value.replace(/^0*(0\.|[1-9])/, '$1');//粘贴不生效
	obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
	obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
	obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
	if (obj.value.indexOf(".") < 0 && obj.value != ""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
		if (obj.value.substr(0, 1) == '0' && obj.value.length == 2) {
			obj.value = obj.value.substr(1, obj.value.length);
		}
	}
}

//选择图片
function change(file){
	
	var ext = file.value.substring(file.value.lastIndexOf(".")+1).toLowerCase();
	
	// gif在IE浏览器暂时无法显示
	if(ext != 'png' && ext != 'jpg' && ext != 'jpeg'){
		if (ext != '') {
			alert("图片的格式必须为png或者jpg或者jpeg格式！"); 
		}
		return;
	}
	//判断IE版本
	var isIE = navigator.userAgent.match(/MSIE/)!= null,
	isIE6 = navigator.userAgent.match(/MSIE 6.0/)!= null;
	isIE10 = navigator.userAgent.match(/MSIE 10.0/)!= null;
	if(isIE && !isIE10){
		file.select();
		var reallocalpath = document.selection.createRange().text;
		// IE6浏览器设置img的src为本地路径可以直接显示图片
		if (isIE6){
			$(file).siblings(".preview").attr("src", reallocalpath);
		}else{
			// 非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现             
			$(file).siblings(".preview").css("filter","progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + reallocalpath + "\")");
			// 设置img的src为base64编码的透明图片 取消显示浏览器默认图片
			$(file).siblings(".preview").attr('src','data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');             
		}
		$(file).siblings('.addImg').hide();
		$(file).siblings('.delImg').show();
	}else{
		html5Reader(file);
	}
}

//H5渲染
function html5Reader(thisId){
	var file = thisId.files[0];
	
	if(file.type != 'image/jpeg' && file.type != 'image/png'){
		alert('无效的文件类型'+file.type+'，必须删除jpg或png图片');
		return;
	}
	
    var byteSize = file.size / 1024 / 1024;
    if(byteSize > 2){
    	alert('单个图片不允许超过2M');
		return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function(ev){
        var txt = ev.target.result, img = new Image();
        console.log(txt);
        img.src = txt;
        
        var thisWidth = $(thisId).attr('i_width'), thisHeight = $(thisId).attr('i_height');
        
        if(img.width != thisWidth || img.height != thisHeight){
        	alert('图片尺寸必须是'+thisWidth+'px * '+thisHeight+'px');
        	console.log(img.width+'__'+img.height);
        	var imgBox = $(thisId).parent();
    		imgBox.find('input').val('');
    		imgBox.find('img.preview').attr("src", "");
    		imgBox.find('img.preview').css("filter", "");//IE9以下
    		imgBox.find('.addImg').show();
        	
        }else{
        	$(thisId).siblings('.preview').attr("src", txt).show();
        	$(thisId).siblings('.addImg').hide();
        	$(thisId).siblings('.delImg').show();
        }
    }
}


