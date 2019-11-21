var thisOrderTabId = null;
$().ready(function(){
	
	//初始化拆分单
	var orderSize = $('#orderBox .orderInfo').length;
	if(orderSize < 2){
		for(var i = 0; i <(2-orderSize); i++){
			addMerTab();
		}
	}else{
        //选择商品按钮
        $('.btnChooseMer').bind('click', function(){selectMer($(this));});
    }
	
	//获取验证码
	$('#qrcodeBtn').click(function(){
		var url = '/order/order/qrcode?orderNo='+orderNo;
		layer.open({
			type:2,
			title:'二维码打印',
			shadeClose:false,
			shade:0.8,
			content:url,
			area:['350px','380px'],
			close:function(index){
				layer.close(index);
			}
		});
	});
	
	//删除按钮
	$('#orderBox .del').bind('click', function(){delOrderTab($(this));});
	
	//指定个数按钮
	$('#btnArea .btn_count').click(function(){
		var addCount = parseInt($(this).attr('data_count'), 10);
		console.log(addCount);
		var totalCount = $('#orderBox .orderInfo').size();
		if(addCount <= totalCount){
			return;
		}else{
			for(var i = 0; i < (addCount-totalCount); i++){
				addMerTab();
			}
		}
	});
	
	//保存拆分单
	$('#btnSaveSplitOrders').bind('click', function(){saveSplitOrders()});
});

/**
 * 添加拆分商品
 * @returns
 */
function addMerTab(){
	var tabLength = $('#orderBox .orderInfo').size();
	if(tabLength >= 12){
		layer.msg('拆分个数不允许超过12个');
		return;
	}
	timeSleep(10);//休眠10毫秒，防止ID重复
	var tabId = new Date().getTime();
	tabId = tabId+'_'+parseInt(Math.random() * 10000 + 1, 10);
	var html = '<div class="orderInfo">';
		html += ' <table id="tab_'+tabId+'" class="tab_order" data_index="'+(tabLength+1)+'">';
		html += '   <thead><td colspan="2"><span class="tab_title">拆分单（'+(tabLength+1)+'）</span><div class="del">x</div></td></thead>';
		html += '   <tr><th>机器型号：</th><td><input type="button" class="btnChooseMer" value="请选择商品"/></td></tr>';
		html += '   <tr><th>机器编码：</th><td><input type="text" name="machineCode" class="machineCode"></td></tr>';
		html += '   <tr><th>检测价格：</th><td><input type="text" name="settlePrice" class="settlePrice" oninput="changeNum(this)"></td></tr>';
		html += '   <tr><th>订单备注：</th><td><textarea name="orderRemark" class="orderRemark" rows="3" cols="32"></textarea></td></tr>';
		html += '</table></div>';
	$('#orderBox').append(html);
	
	//选择商品
	$('.btnChooseMer').unbind('click');
	$('.btnChooseMer').bind('click', function(){selectMer($(this));});
	
	//删除按钮
	$('#orderBox .del').unbind('click');
	$('#orderBox .del').bind('click', function(){delOrderTab($(this));});
}

//删除tab
function delOrderTab($this){
	if($('#orderBox .orderInfo').size() <= 2){
		layer.msg('最少保留2个拆分单');
		return;
	}
	if(!confirm('是否确认删除该拆分单？')){
		return;
	}
	$this.parents('.orderInfo').remove();
	$('#orderBox .orderInfo').each(function(index){
		$(this).find('.tab_order').attr('data_index', (index+1));
		$(this).find('.tab_title').html('拆分单（'+(index+1)+'）');
	});
}

/**
 * 选择商品
 * @returns
 */
function selectMer($this){
	thisOrderTabId = $this.parents('.tab_order').attr('id');
	console.log(thisOrderTabId);
	layer.open({
		type:2,
		title:'商品搜索',
		shadeClose:true,
		content:'/product/cooperate/merlist',
		area:['650px','400px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 获取layer页面传回的商品信息
 * @param merId
 * @param p_merInfo
 * @returns
 */
function getSelectMer(merId, p_merInfo){
	var merName = p_merInfo['PNAME']+' '+p_merInfo['MERNAME'];
	layer.closeAll('iframe');
	$('#'+thisOrderTabId).attr('data_merid', merId);
	$('#'+thisOrderTabId).attr('data_mertype', p_merInfo['MERTYPE']);
	$('#'+thisOrderTabId+' .btnChooseMer').val(merName);
}

function goBack(){
	parent.reload();
}

/**
 * 保存拆分单信息
 * @returns
 */
function saveSplitOrders(){
	var splitOrders = [];
	var sumitFlag = true;
	var allSettlePrice = 0;
	$('#orderBox .orderInfo').each(function(){
		var splitOrder = {};
		splitOrder.index = $.trim($(this).find('.tab_order').attr('data_index'));
		splitOrder.merId = $.trim($(this).find('.tab_order').attr('data_merid'));
		splitOrder.merType = $.trim($(this).find('.tab_order').attr('data_mertype'));
		splitOrder.machineCode = $.trim($(this).find('.machineCode').val());
		splitOrder.settlePrice = parseInt($.trim($(this).find('.settlePrice').val()), 10);
		splitOrder.orderRemark = $.trim($(this).find('.orderRemark').val());
        
        allSettlePrice += splitOrder.settlePrice;
		if(splitOrder.merId === ''){
			sumitFlag = false;
			layer.msg('请选择完整的商品信息');
		}
		
		if(splitOrder.machineCode === ''){
			sumitFlag = false;
			$(this).find('.machineCode').addClass('error').attr('title','不允许为空');
		}
		
		if(splitOrder.settlePrice === ''){
			sumitFlag = false;
			$(this).find('.settlePrice').addClass('error').attr('title','不允许为空');
		}
		
		if(splitOrder.orderRemark.length > 100){
			sumitFlag = false;
			$(this).find('.orderRemark').addClass('error').attr('title','备注不能超过100个字符');
		}
		
		splitOrders.push(splitOrder);
	});
	if(!sumitFlag){
		return;
	}
	
	if(settlePrice !== allSettlePrice){
	   layer.msg('拆分金额总和必须和原订单成交金额保持一致');
	   return;
    }
	
	$('#btnSaveSplitOrders').unbind('click');
	var params = {orderNo:orderNo, splitOrders:splitOrders};
	
	$.post('/order/ordersplit/saveorders',params, function(data){
		if(data === 'Y'){
			layer.msg('订单拆分成功',{icon:1});
			window.location.href = '/order/ordersplit/splitorders?orderNo='+orderNo;
		}else{
			$('#btnSaveSplitOrders').bind('click', function(){saveSplitOrders()});
			alert('保存失败：'+data);
		}
	});
	
	console.log(splitOrders);
}

/**
 * 毫秒休眠
 * @param delay
 * @returns
 */
function timeSleep(delay) {
	var start = (new Date()).getTime();
	while ((new Date()).getTime() - start < delay){
		continue;
	}
}

/**
 * 数字验证
 */
function changeNum(obj){
	//如果用户第一位输入的是小数点，则重置输入框内容
	if (obj.value !== '' && obj.value.substr(0, 1) === '.') {
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
	if (obj.value.indexOf(".") < 0 && obj.value !== ""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
		if (obj.value.substr(0, 1) === '0' && obj.value.length === 2) {
			obj.value = obj.value.substr(1, obj.value.length);
		}
	}
}