
$().ready(function() {
	$('#btnSubmit').bind('click', function(){saveInfo();});
	$('#btnCancel').bind('click', function(){cancel();});

	//保存代叫快递内容
	function saveInfo(){
		var params = {orderNo:orderNo};
		params.merId = $.trim($('#merId').val());//商品ID
		params.province = $.trim($("#province").val());//省份
		params.city = $.trim($("#city").val());//城市
		params.county = $.trim($("#county").val());//县区
		params.contacts = $.trim($('#contacts').val());//联系人
		params.mobile = $.trim($('#mobile').val());//联系电话
		params.date = $.trim($("#sfServerDate").val());//预约日期
		params.time = $.trim($("#timesel input:checked").val());//预约时间
		params.detailAddress = $("#detailAddress").val();//详细地址
		
		if ($.trim(params.province) == '') {
			layer.msg('请输入省份！');
			return;
		}

		if ($.trim(params.city) == '') {
			layer.msg('请输入城市！');
			return;
		}

		if ($.trim(params.county) == '') {
			layer.msg('请输入区！');
			return;
		}

		if ($.trim(params.detailAddress) == '') {
			layer.msg('请输入详细地址！');
			return;
		}

		var loadindex = layer.load();
		$.ajax({
			type:'POST',//请求方式
			url:"/order/order/createsfexpressorder",//请求路径
			data:params, //发送到服务器的数据
			cache: false, //设置为 false 将不会从浏览器缓存中加载请求信息
			async: false, //同步请求
			timeout: 60000,//默认超时60秒
			dataType: 'json', //预期服务器返回的数据类型
			success: function (data) {
				layer.close(loadindex);
				if (data == 'Y') {
					layer.msg('该订单叫顺丰快递成功...');
					var parentLayer = parent.layer.getFrameIndex(window.name);
					parent.layer.close(parentLayer);
				} else {
					layer.msg('操作失败：'+data);
				}
			}
		});
	}

	//修改顺丰预约时间
	$("#sfServerDate").change(function(){
		var date = $(this).val();
		$.post('/order/order/sfservertime',{date:date},function(data){
			var text = '';
			for(i in data){
				if(i == '1'){
					text += '<label><input type="radio" name="sfServerTime" value="'+data[i].time+'" checked="checked"/>'+data[i].time+'</label>';
				}else{
					text += '<label><input type="radio" name="sfServerTime" value="'+data[i].time+'"/>'+data[i].time+'</label>';
				}
			}
			$("#timesel").html(text);
		});
	});
	
	function autocomplete(){ //地址联想
		var city = $("#city").val();
		var auto = new AMap.Autocomplete({city:city,input:"address1"});
	}
	
	function autoAddressComplete(val){   //地址联想
		var val = '';
		if(val == ''){
			val = '021';
		}
		var autoObj = new AMap.Autocomplete({
			city:val, //城市
			input:"address"
		});
		AMap.event.addListener(autoObj, "detailAddress", function(data){
			console.log(data);
			if(data && data.type == 'select' && data.poi){
				var poi = data.poi;
				$('#AMapAddress').val(poi.district+' '+poi.address+' '+poi.name);
			}
		}); 
	}
})

//取消操作
function cancel() {
	var parentLayer = parent.layer.getFrameIndex(window.name);
	parent.layer.close(parentLayer);
}

