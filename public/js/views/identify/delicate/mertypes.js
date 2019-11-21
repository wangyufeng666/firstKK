var categorys = [];
//$().ready(function(){
	getMerTypes();//加载数据
	//品类change事件
	$('#category').change(function(){
		var thisId = $(this).val();
		resetMerTypes(thisId);
	});
//});

/**
 * 接口获取回收品类列表
 * @returns
 */
function getMerTypes(){
	$.ajax({
		type:'GET',
		url:'/redis/recycle/recymercatetypes',
		async:false,//同步请求
		timeout:30000,
		success:function(data){
			categorys = data;
			$('#category').html('<option value="">请选择品类</option>');
			var optionHtml = '';
			for(i in data){
				optionHtml += '<option value="'+data[i]['cateCode']+'">'+data[i]['cateName']+'</option>';
			}
			$('#category').append(optionHtml);
			resetMerTypes('');//初始化
			if(typeof categoryed != "undefined"){
				$('#category').val(categoryed);
				if(categoryed != '请选择品类' && categoryed !='' && categoryed != null){
					resetMerTypes(categoryed);
				}
			}
		}
	});
}

//品牌的列表change获取商品信息
$("#brandcode_spid").change(function(){
	brandcode_spidChange($(this).val());
});

//商品型号-- 商品型号选中
function brandcode_spidChange(brandCode,_productlistids=[]) {
	var merType = $('#merType').val();
	$.post('/identify/delicate/getproductlist', {brandCode:brandCode,merType:merType}, function(data){
		$("#product_spid_all").html('');
		var chunkProductData = chunk(data,product_checkbox_all_count);

		log('brandcode_spidChange_chunkProductData',chunkProductData);

		var lableText = "<table class='change_all_product'>";
		for(i in chunkProductData) {
			lableText+= "<tr>";
			for(j in chunkProductData[i]) {
				var selected='';
				if(_productlistids.indexOf( chunkProductData[i][j]['MERID'].toString()) > 0 ) {
					selected = 'checked="checked"';
				}
				 lableText += '<td><label class="product_input_lable"><input name="product[]" '+selected+'type="checkbox" class="product_input" value="'+chunkProductData[i][j]['MERID']+'" /><span>'+chunkProductData[i][j]['MERNAME']+'</span> </label></td>';
			}
			lableText+= "</tr>";
		}
		lableText += "</table>";
		$("#product_spid_all").html(lableText);
		bindInputProduct();//绑定品牌checkbox点击事件
		refreshChooseProduct(); //刷新商品信息
	}, 'json');
}

//商品型号  动态变化商品事件绑定
function bindInputProduct(){
	$('.product_input').each(function () {
		$(this).click(function () {
			refreshChooseProduct();
		})
	})
}


//商品商品型号  重新获取已选择商品数据
function refreshChooseProduct(){
	var lableText="<table class='choose_change_pinpai'><tr>";
	var brandcode = $('#brandcode_spid').val();
	var mertype = $('#mertype').val();
	chooseProductList=[];
	$(".already_choose_product_div").html('');
	var choose_count = 0;
	$('.product_input').each(function () {
		if(this.checked){
			if( choose_count%product_checkbox_choose_count == 0 ) lableText +="</tr><tr>";
			choose_count++;
			var this_name = $(this).next().html();
			lableText +=" <td><span class='already_choose_product_span'> "+this_name+" </span></td>";
			var product_text = {};
			product_text.merid = $(this).val();
			product_text.mername = this_name;
			product_text.mertype = mertype;
			product_text.brandcode = brandcode;
			chooseProductList.push(product_text);
		}
	})
	lableText+="</tr></table>";
	$(".already_choose_product_div").html(lableText);
	refreshChooseProductPrice()//刷新单独设置选项
}

//商品商品型号 刷新单独价格设置的商品列表
function refreshChooseProductPrice(){
	////已选择品牌列表
	var lableText='';
	$(".condition_product_spid_single_set_table").html('');
	lableText = "<tr><td>品牌</td><td>规则</td><td>数值</td></tr>";
	for(var i=0;i< chooseProductList.length;i++) {
		var _product_price = judgeProductPrice(chooseProductList[i].merid);
		lableText += '<tr><td>'+chooseProductList[i].mername+'</td><td>大于等于</td><td> <input type="number" class="chooseProductList" value="'+_product_price+'" name="chooseProductPrice[]"><input type="hidden" style="display: none" value="'+chooseProductList[i].merid+'"></input></td></tr>';
	}
	$(".condition_product_spid_single_set_table").append(lableText);
}

function merTypeChange(merType,_choosePinpaiList=[],singlePcode=''){
	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
		$("#brandCode").html('');
		$("#brandcode_spid").html('');
		$('#brandcode_spid').append('<option value="">请选择品牌</option>');
		var chunkData = chunk(data,pinpai_checkbox_all_count);
		log('merTypeChange_chunkData',chunkData);
		var lableText = "<table class='change_all_pinpai'>";
		for(i in chunkData) {
			lableText+= "<tr>";
			for(j in chunkData[i]) {
				var selected = '';
				if(_choosePinpaiList.indexOf(chunkData[i][j]['PCODE']) > 0 ) {
					selected = 'checked="checked"';
				}

				if(singlePcode == chunkData[i][j]['PCODE'] ){
					selected = 'selected = "selected"';
				}
				lableText += '<td><label class="pinpai_input_lable"><input name="pinpai[]" '+selected+'type="checkbox" class="pinpai_input" value="'+chunkData[i][j]['PCODE']+'" /><span>'+chunkData[i][j]['PNAME']+'</span> </label></td>';
				$("#brandcode_spid").append("<option "+selected+"value='"+chunkData[i][j]['PCODE']+"'>"+chunkData[i][j]['PNAME']+"</option>");
			}
			lableText+= "</tr>";
		}
		lableText += "</table>";
		$("#brandCode").html(lableText);
		bindInput();//绑定品牌checkbox点击事件
		choosePinpaiList=[];//刷新已选择品牌列表
		refreshChoosePinpaiPrice()//刷新单独设置选项
		refreshChoosePinpai();//刷新品牌列表
		//brandcode_spidChange();
	}, 'json');
}

/**
 * 重置商品分类
 * @returns
 */
function resetMerTypes(cateCode){
	$('#merType').html('<option value="">请选择分类</option>');
	var merTypeList = [], thisMerType = '', thisMerTypeName = '', thisRemark = '';
	if(categorys){
		var flag = false;
		for(i in categorys){
			if(cateCode != ''){
				flag = categorys[i].cateCode == cateCode;
			}else{
				flag = true;
			}
			if(flag){
				merTypeList = categorys[i].list;
				var optionHtml = '';
				if(merTypeList.length == 1 && cateCode){
					thisMerType = merTypeList[0]['merType'];
					thismerTypeName = merTypeList[0]['merTypeName'];
					thisRemark = thismerTypeName+'_'+merTypeList[0]['remark'];
					optionHtml += '<option value="'+thisMerType+'" title="'+thisRemark+'" selected>'+thisRemark+'</option>';
				}else{
					optionHtml = '<optgroup label="'+categorys[i].cateName+'">';
					for(j in merTypeList){
						thisMerType = merTypeList[j]['merType'];
						thismerTypeName = merTypeList[j]['merTypeName'];
						thisRemark = thismerTypeName+'_'+merTypeList[j]['remark'];
						optionHtml += '<option value="'+thisMerType+'" title="'+thisRemark+'">'+thisRemark+'</option>';
					}
					optionHtml += '</optgroup>';
				}
				$('#merType').append(optionHtml);
				if(typeof mertypeed != "undefined"){
					$('#merType').val(mertypeed);
				}
			}
		}
	}
}

// 页面元素高亮展示
$('.search_product_text').on('input propertychange',function () {
	var search_product_text = $('.search_product_text').val();
	$('.product_input_lable').css("background","");
	if(search_product_text == ''){
		$('.product_input_lable').css("background","");
	}else{
		$('.product_input_lable').filter(":contains('"+search_product_text+"')").css("background","#AEDD81");
	}
})

$('.search_pinpai_text').on('input propertychange',function () {
	var search_pinpai_text = $(this).val();
	$('.pinpai_input_lable').css("background","");
	if(search_pinpai_text == ''){
		$('.pinpai_input_lable').css("background","");
	}else
	{
		$('.pinpai_input_lable').filter(":contains('"+search_pinpai_text+"')").css("background","#AEDD81");
	}
})


//log
function log( logName,logData ) {
	if( debugFlag == 1 ) {
		console.log(' typeof = '+typeof(logData) + logName + ' = '+ JSON.stringify(logData));
	}
}

