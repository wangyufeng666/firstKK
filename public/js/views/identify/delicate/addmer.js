var choosePinpaiList=[],    //已选择品牌列表
  chooseProductList=[],     // 已选择产品列表
  click_frequency = true;   //频率点击限制
$().ready(function(){

	//------------------------------筛选条件-------------------------------------
	$('#condition').change(function () {
		var condition = $(this).val();
		if(condition == 1 ) {
			$('.condition_product_mertype').show();
			$('.condition_product_pinpai').hide();
			$('.condition_product_spid').hide();
		}else if(condition == 2){
			$('.condition_product_mertype').hide();
			$('.condition_product_pinpai').show();
			$('.condition_product_spid').hide();
		}else {
			$('.condition_product_mertype').hide();
			$('.condition_product_pinpai').hide();
			$('.condition_product_spid').show();
		}
	})
	//------------------------------筛选条件-------------------------------------

	//------------------------------商品品牌 全选---------------------------------
    //全选
	$("#pinpai_all").click(function(){
        $('input[name="pinpai[]"]').each(function(){
            $(this).prop("checked",true);
        });
		refreshChoosePinpai();
	});

    //全不选
    $("#pinpai_not").click(function(){
        $('input[name="pinpai[]"]').each(function(){
            $(this).prop("checked",false);
        });
		refreshChoosePinpai();
    });
    //反选
    $("#pinpai_reverse").click(function () {
        $("input[name='pinpai[]']").each(function(){
            if($(this).prop("checked")){
                $(this).prop("checked",false);
            }else {
                $(this).prop("checked",true);
            }
        });
		refreshChoosePinpai();
    })
	//------------------------------商品品牌 全选---------------------------------

	//------------------------------商品型号全选----------------------------------
	//全选
	$("#product_all").click(function(){
		$('input[name="product[]"]').each(function(){
			$(this).prop("checked",true);
		});
		refreshChooseProduct();
	});

	//全不选
	$("#product_not").click(function(){
		$('input[name="product[]"]').each(function(){
			$(this).prop("checked",false);
		});
		refreshChooseProduct();
	});
	//反选
	$("#product_reverse").click(function () {
		$("input[name='product[]']").each(function(){
			if($(this).prop("checked")){
				$(this).prop("checked",false);
			}else {
				$(this).prop("checked",true);
			}
		});
		refreshChooseProduct();
	})
	//------------------------------商品型号全选----------------------------------

	//----------------------------分类 品类change品牌的列表------------------------
	$("#merType").change(function(){
		var merType = $(this).val();
		merTypeChange( merType);
	});
	$("#category").change(function(){
		var merType = $('#merType').val();
		merTypeChange( merType);
	});
	//----------------------------分类 品类change品牌的列表-------------------------
});

	//------------------------------商品品牌--------------------------------------
	//商品品牌  checkbox 事件动态变化绑定
	function bindInput(){
		$('.pinpai_input').each(function () {
			$(this).click(function () {
				refreshChoosePinpai();
			})
		})
	}

	//商品品牌 重新获取已选择品牌数据
	function refreshChoosePinpai(){
		var lableText="<table class='choose_change_pinpai'><tr>";
		choosePinpaiList=[];
		$(".already_choose_pinpai_div").html('');
		var choose_count = 0;
		$('.pinpai_input').each(function () {
			if(this.checked){
				if( (choose_count%pinpai_checkbox_choose_count) == 0 ) lableText +="</tr><tr>";
				choose_count++;
				var this_name = $(this).next().html();
				lableText +="<td> <span class='already_choose_pinpai_span'> "+this_name+" </span></td>";
				var pinpai_text = {};
				pinpai_text.pinpai_id = $(this).val();
				pinpai_text.pinpai_name = this_name;
				choosePinpaiList.push(pinpai_text);
			}
		})
		lableText+="</tr></table>";
		$(".already_choose_pinpai_div").html(lableText);
		refreshChoosePinpaiPrice()//刷新单独设置选项
	}

	//商品品牌 价格单选change
	$('.condition_product_pinpai_set_price').each(function () {
		$(this).click(function () {
			if($(this).val() == 1) {
				$('.condition_product_pinpai_all_set').show();
				$('.condition_product_pinpai_single_set').hide();
			}else if($(this).val() == 2) {
				$('.condition_product_pinpai_all_set').hide();
				$('.condition_product_pinpai_single_set').show();
				//需要获取商品信息
				refreshChoosePinpaiPrice();//刷新单独价格设置的品牌列表
			}
		})
	})

	//商品品牌 刷新单独价格设置的品牌列表
	function refreshChoosePinpaiPrice(){
		//已选择品牌列表
		var lableText='';
		$(".condition_product_pinpai_single_set_table").html('');
		lableText = "<tr><td>品牌</td><td>规则</td><td>数值</td></tr>";
		for(var i=0;i<choosePinpaiList.length;i++) {
			var _price = judgePinpaiPrice(choosePinpaiList[i].pinpai_id);
			lableText += '<tr><td>'+choosePinpaiList[i].pinpai_name+'</td><td>大于等于</td><td> <input type="number" class="condition_product_pinpai_single_input" value="'+_price+'" name="choosePinpaiPrice[]"><input type="hidden" style="display: none" value="'+choosePinpaiList[i].pinpai_id+'"></input></td></tr>';
		}
		$(".condition_product_pinpai_single_set_table").append(lableText);
	}

	//商品品牌 update查询 单独设置的价格
	function judgePinpaiPrice(pinpai_id){
		var pinpailistTmp = _pinpailist;
		if(pinpailistTmp.length > 0 ) {
			for(var j=0;j < pinpailistTmp.length;j++){
				if(pinpai_id == pinpailistTmp[j].PCODE ){
					return pinpailistTmp[j].LIMIT_AMOUNT;
				}
			}
		}
		return 0;
	}

	//------------------------------商品品牌--------------------------------------

	//------------------------------商品型号--------------------------------------
	//商品型号 update查询 单独设置的价格
	function judgeProductPrice(merid){
		if(_productlist.length >0 ) {
			for(var j=0;j < _productlist.length;j++){
				if(merid == _productlist[j].MERID ){
					return _productlist[j].LIMIT_AMOUNT;
				}
			}
		}
		return 0;
	}

	//商品型号 价格单选change
	$('.condition_product_set_price').each(function () {
		$(this).click(function () {
			if($(this).val() == 1) {
				$('.condition_product_spid_all_set').show();
				$('.condition_product_spid_single_set').hide();
			}else if($(this).val() == 2) {
				$('.condition_product_spid_all_set').hide();
				$('.condition_product_spid_single_set').show();
				refreshChooseProductPrice();//刷新单独价格设置的商品列表
			}
		})
	})

	//------------------------------提交数据--------------------------------------
	$('.addsubmit').click(function () {

		if(!click_frequency) {
			layer.alert('操作失败：'+'点击频繁请2秒后重试', {skin:'layui-layer-lan',closeBtn:0,anim:2});
			return false;
		}
		//提交初始化参数
		var delicate_id = $('#delicate_id').val(),
			condition = $('#condition').val(),
			merType = $('#merType').val(),
			checkCode = true,
			checkMsg='';

		log('delicate_id',delicate_id);
		if (condition == 1) {
			var condition_product_mertype_price = $('.condition_product_mertype_price').val();// 1 2 3
			//数值不能为空
			if( isnull(merType) || condition_product_mertype_price <= 0 ) {
				checkMsg = '商品子品类 或者 检测价格不能为空'
				checkCode = false;
			}
			var postData = {
				"delicate_id":delicate_id,
				"merType":merType,
				"condition_product_mertype_price":condition_product_mertype_price,
				"condition":condition,
			};
		} else if (condition == 2) {
			var pinpaiList = [];//pinpai_input
			$('input[name="pinpai[]"]:checked').each(function(){//遍历每一个名字为interest的复选框，其中选中的执行函数
				pinpaiList.push($(this).val());//将选中的值添加到数组chk_value中
			});
			var pinpai_price_setting =$("input[name='condition_product_pinpai_set_price']:checked").val(); // 1  2
			if( isnull(merType) || pinpaiList.length <= 0 ) {
				checkMsg = '商品子品类 或者 已选择品牌不能为空'
				checkCode = false;
			}
			var postData = {
				"delicate_id":delicate_id,
				"condition":condition,
				"merType":merType,
				"pinpaiList":pinpaiList,
				"pinpai_price_setting":pinpai_price_setting,
				"condition_product_pinpai_price":0,
				"pinpaiSingleList":[],
			};
			if( pinpai_price_setting == 1 ){
				var condition_product_pinpai_price = $('.condition_product_pinpai_price_all').val();
				if( condition_product_pinpai_price<=0 ){
					checkMsg = '商品品牌 价格设置--统一设置--非法 (>0)'
					checkCode = false;
				}
				postData.condition_product_pinpai_price = condition_product_pinpai_price;
			} else {
				// 获取分开设置品牌的值
				var pinpaiSingleList = [];
				$('input[name="choosePinpaiPrice[]"]').each(function(){//遍历每一个名字为interest的复选框，其中选中的执行函数
					var tmpSingle ={
						"pinpai_price":$(this).val(),
						"pinpai_id": $(this).next().val(),
					};
					pinpaiSingleList.push( tmpSingle );
					if( $(this).val()<=0 ){
						checkMsg = '商品品牌 价格设置--单独设置-->非法 (>0)';
						checkCode = false; return false
					}
				});
				postData.pinpaiSingleList = pinpaiSingleList;
			}
		} else if (condition == 3) {
			//具体商品添加
			var brandCode = $('#brandcode_spid').val();
			var product_price_setting =$("input[name='condition_product_set_price']:checked").val(); // 1  2
			if( isnull(merType) || chooseProductList.length <= 0 || isnull(brandCode)) {
				checkMsg = '商品子品类 或者 已选择类型不能为空';
				checkCode = false;
			}
			var postData = {
				"delicate_id":delicate_id,
				"condition": condition,
				"merType":merType,
				"brandcode":brandCode,
				"productList":chooseProductList,
				"product_price_setting":product_price_setting,
				"condition_product_product_price":0,
				"productSingleList":[],
			};

			if( product_price_setting == 1 ){
				var condition_product_product_price = $('.condition_product_spid_price_all').val();
				if( condition_product_product_price<=0 ){
					checkMsg = '商品品牌 价格设置 -- 统一设置 -- 非法 (>0)';
					checkCode = false;
				}
				postData.condition_product_product_price = condition_product_product_price;
			}else{
				// 获取分开设置品牌的值
				var productSingleList = [];
				$('input[name="chooseProductPrice[]"]').each(function(){//遍历每一个名字为interest的复选框，其中选中的执行函数
					var tmpSingle ={
						"product_price":$(this).val(),
						"product_id": $(this).next().val(),
					};
					productSingleList.push( tmpSingle );
					if( $(this).val()<=0 ){
						checkMsg = '商品品牌 价格设置--单独设置-->非法 (>0)';
						checkCode = false;   return false;
					}
				});
				postData.productSingleList = productSingleList;
			}
		}

		if (!checkCode) {
			layer.alert('操作失败：'+checkMsg, {skin:'layui-layer-lan',closeBtn:0,anim:2});
			return false;
		}

		log('postData',postData);

		//2秒内防止重复点击
		click_frequency = false;
		setTimeout(function () {click_frequency = true;}, 2000);
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/delicate/save" //请求路径
			,data:postData //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data.code == "Y"){
					layer.alert('保存成功', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
					setTimeout("parent.reload()", 2000);
				}else {
					layer.alert('操作失败：'+data.errorMsg, {skin:'layui-layer-lan',closeBtn:0,anim:6});
				}
			}
		});
	})
	//------------------------------辅助函数--------------------------------------
	function isnull(A) {
		if (A == null || A == undefined || A == "") {
			return true;
		}else {
			return  false;
		}
	}

	function goBack(){
		parent.closeLayer();
	}

	//切割数组
	function chunk(arr, size) {
		var objArr = new Array();
		var index = 0;
		var objArrLen = arr.length/size;
		for(var i=0;i<objArrLen;i++){
			var arrTemp = new Array();
			for(var j=0;j<size;j++){
				arrTemp[j] = arr[index++];
				if(index==arr.length){
					break;
				}
			}
			objArr[i] = arrTemp;
		}
		return objArr;
	}

	//enter触发事件
	document.onkeydown = function(e){
		var ev =document.all ? window.event : e;
		if(ev.keyCode==13) {
			//$('#loginBtn').trigger("click");
			$('.addsubmit').trigger("click");
			return false
		}
	}
