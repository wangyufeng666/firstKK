var quoteAgainFlag = true;//品类二次加价标记

$().ready(function(){
	$('#btn_submit').bind('click', function(){assignOrder()});
	$('#btn_cancel').bind('click', function(){cancel()});
	$('#idlefishV2InspectionReport').bind('click', function(){idlefishV2Inspection()});
	$('#zhuanzhuanInspectionReport').bind('click', function(){zhuanzhuanInspection()});
	$('#consignmentInspection').bind('click', function(){consignmentInspection()});
	$('#stopAfterOrderBack').bind('click', function(){stopAfterOrderBack()});
	
	//保存备注
	$('#saveRemarkBtn').bind('click', function(){saveRemark();});
	
	//确认检测结果
	$('#inspectConfirm').bind('click', function(){inspectConfirm();});//确认检测
	
	document.onkeydown = function(oEvent){
		var oEvent = window.event;
		//control+shift+Z
		if(oEvent.keyCode == 90 && oEvent.ctrlKey && oEvent.shiftKey) {
			$('.owner').toggle();
		}
	};

	//废旧手机一键下单
	$('#scrapPhone').click(function(){
		var num = $('#scrapPhoneNo').val();
		if($('#scrapPhoneNo').val() != "" && Number(num) >= 1 && Number(num) <= 10){
			var load1 = layer.msg('加载中...', {time:10000});
			$.ajax({
				type:'POST'//请求方式
				,url:"/order/order/scrapphone" //请求路径
				,data:{orderNo:orderNo,num:num} //发送到服务器的数据
				,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
				,async:false //同步请求
				,timeout :60000//默认超时60秒
				,dataType:'json' //预期服务器返回的数据类型
				,success:function(data){
					if('OK' == data['flag']){
						layer.close(load1);
						alert(data['successNum']+'个成功，'+(num-data['successNum'])+'个失败');
					}else{
						layer.close(load1);
						alert("失败");
					}
				}
			});
		}else{
			alert('请输入大于等于1且小于10的整数');
		}
	});
	
	//修改联系人
	$("#btnEditContacts").click(function(){
		$("#newUserName").show();
	});

	//品类二次加价
	$("#btn_quotation").click(function(){
		if(sourceCode == ''){
			alert('信息不全，请重新加载');
			return false;
		}
		$.post('/order/inspectquote/getquotationinfo',{orderNo:orderNo},function(data){
			if(data == "N"){
				window.location.reload()
			}else{
				if(quoteAgainFlag){
					quoteAgainFlag = false;
					var quotation = $("#savePrice").val();
					var addPrice = parseInt(quotation) - parseInt(testingPrice);

					if(parseInt(quotationsPrice) < parseInt(quotation) || parseInt(testingPrice) > parseInt(quotation)){
						alert('价格不正确');
						return false;
					}

					if(sourceCode == '71' || sourceCode == '73'){
						var rule = '';
						$.ajaxSettings.async = false;
						$.post('/idlefishv2/recyorder/getcouponrule', {partnerOrder:yhdBillCode,sourceCode:sourceCode}, function(data){
							if(data){
								rule = data.percent;
							}
						});
						$.ajaxSettings.async = true;
						if(channel != 'tmall-service'){
							addPrice = Math.ceil(addPrice/(1+rule));
						}else{
							if(payType == '2'){
								alert(Math.ceil(parseInt(quotation)/(1+rule)))
								addPrice = Math.ceil(parseInt(quotation)/(1+rule)) - parseInt(testingPrice);
							}
						}
						var thisParams = {orderNo:orderNo,
								addPrice:addPrice,
								inspectionID:yhdInspectionId,
								inspectionPrice:testingPrice,
								partnerOrder:yhdBillCode};
						$.post('/idlefishv2/recyorder/saveaddprice', thisParams, function(data){
							if(data == "Y"){
								saveQuotation(quotation);
							}
						});
					}else{
						$.post('/order/inspectquote/updatesettle',{orderNo:orderNo,settlePrice:quotation,inspectionID:yhdInspectionId},function(data){
							if(data == "Y"){
								saveQuotation(quotation);
							}
						});
					}
				}
			}
		});
	});
	
	//获取验证码
	$('#qrcodeBtn').click(function(){
		var url = '/order/order/qrcode?orderNo='+orderNo;
		layer.open({
			type:2,
			title:'二维码打印',
			shadeClose:false,
			content:url,
			area:['350px','380px'],
			close:function(index){
				layer.close(index);
			}
		});
	});

	//内部投诉
	$('#internalComplain').click(function(){
		var url = '/order/incomplain/index?orderNo='+orderNo;
		layer.open({
			type:2,
			title:'内部投诉',
			shadeClose:false,
			content:url,
			area:['350px','380px'],
			close:function(index){
				layer.close(index);
			}
		});
	});
	

	/**
	 * 判断当前是否参与活动
	 * author ：zhuhaili
	 */
	$("#activityImg").click(function(){
		var eventNo = $(this).attr('eventNo');
		layer.open({
			type:2,
			title:'参与活动',
			shadeClose:false,
			content:'/recycle/activity/activityinfos?eventcode='+eventNo,
			area:['700px','500px'],
			close:function(index){
				layer.close(index);
			}
		});
	});

	/**
	 * 检测图片
	 * author ：zhuhaili
	 */
	$(".jc_btn").click(function(){
		layer.open({
			type:2,
			title:'检测图片',
			shadeClose:false,
			content:'/order/order/orderimgs/orderNo/'+orderNo,
			area:['600px','400px'],
			close:function(index){
				layer.close(index);
			}
		});
	});
	
	//查询是否完成代扣,如果完成则修改支付和代扣状态
	$("#selectWith").click(function() {
		var orderNo1 = orderNo;
		$.post('/order/device/selectwithinfo', {orderNo: orderNo1}, function (data) {
			if (data == "Y") {
				alert('已经完结,状态修改成功');
				window.location.reload()
			} else {
				alert(data);
			}
		});
	});
	
	$('#btnReinspect').click(function(){
		 window.location.href = '/order/order/orderinspection?orderNo='+orderNo;
	});
	
	//图片放大功能
	$('.zoomImg').click(function(){
		var url = $(this).attr('zoom_src');
		window.open(url, '图片查看');
	});
});


/**
 * 确认检测
 */
function inspectConfirm(){
	var sendMsgCheckFlag = $('input:checkbox[name="sendmessage"]').attr('checked');
	
	//快递交易
	if(tradeType == '2' && orderStatus == '3'){
		var params = {orderNo:orderNo,
				sendMsgCheckFlag:sendMsgCheckFlag,
				orderSource:sourceCode,
				identifyFlag:identifyFlag
		};
		layer.open({
			type:2,
			title:'请选择库位',
			content:'/order/order/boxinfos?'+$.param(params),
			shadeClose:false,
			area:['800px' , '500px'],
			close:function(index){
				layer.close(index);
			}
		});
	}else{
		if(confirm('确认检测后，订单不能复检。是否已确认检测结果？')){
			$('#inspectConfirm').unbind('click');
			var params = {orderNo:orderNo,sendMsgCheckFlag:sendMsgCheckFlag, identifyFlag:identifyFlag};
			$.post('/order/order/confirminspection', params, function(data){
				if(data == 'Y'){
					window.location.reload();
				}else{
					layer.msg('确认检测失败：'+data);
					$('#inspectConfirm').bind('click', function(){inspectConfirm();});
				}
			});
		}
	}
}

//修改联系人及联系方式
function updateContacts(){
	var newContacts = $("#newUserName").val();
	if(newContacts != ''){
		var thisParams = {orderNo:orderNo, newContacts:newContacts, contacts:contacts};
		$.post('/order/order/updateordercontacts', thisParams, function(data){
			if(data == 'Y'){
				window.location.reload();//刷新
			}else{
				alert(data);
			}
		});
	}else{
		alert('请输入新名字！');
	}
}

/**
 * 添加知识库
 * @returns
 */
function addKnowLedge() {
	layer.open({
		type:2,
		title:'添加知识库',
		content:'/inspect/knowledge/addknowledge',
		shadeClose:false,
		area:['80%' , '80%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 查看知识库 
 * @param category
 * @param brand
 * @param type
 * @returns
 */
function showKnowLedge(category, brand, type) {
	layer.open({
		type:2,
		title:'查看相关知识库',
		content:'/inspect/knowledge/knowledgelist?category='+category+'&brand='+brand+"&type="+type,
		shadeClose:false,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

//特殊备注
function specialRemarks(){
	layer.open({
		type:2,
		title:'特殊备注',
		shadeClose:false,
		content:'/order/order/specialremarks?orderNo='+orderNo+'&v=1',
		area:['700px','500px'],
		close:function(index){
			layer.close(index);
		}
	});
}

//修改交易方式
function changeTradeType(){
	layer.open({
		type:2,
		title:'修改交易方式',
		shadeClose:false,
		content:'/order/order/changetradetype?orderNo='+orderNo,
		area:['500px','400px'],
		close:function(index){
			layer.close(index);
		},
		end:function(index){
//			window.location.reload();
		}
	});
}

//修改预约时间
function serverDatePage(){
	layer.open({
		type:2,
		title:'预约时间修改',
		shadeClose:false,
		content:'/order/order/serverdate?orderNo='+orderNo,
		area:['500px','400px'],
		close:function(index){
			layer.close(index);
		},
		end:function(index){
			window.location.reload();
		}
	});
}

//订单详情
function getOrderInfo(){
	layer.open({
		type:2,
		title:'客户订单详情',
		shadeClose:false,
		content:'/order/order/getorderinfo?contactWay='+contactWay,
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
	});
}

//关联订单信息
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'关联订单详情',
		shadeClose:false,
		content:'/order/order/orderinfo?orderNo='+orderNo+'&layer=Y',
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
	});
}

//保存备注
function saveRemark(){
	var orderRemark = $.trim($('#orderRemark').val());
	$('#saveRemarkBtn').html('保存中');
	if(orderRemark != ''){
		$('#saveRemarkBtn').unbind('click');
		$.post('/order/order/insertremark',{orderNo:orderNo, orderRemark:orderRemark},function(data){
			$('#saveRemarkBtn').bind('click', function(){saveRemark();});
			$('#saveRemarkBtn').html('保存备注');
			if(data == 'Y'){
				$('#orderRemark').val('');
				$('#orderRemarkSpan').append('<br/>['+nowtime+']：'+orderRemark);
			}else{
				alert(data);
			}
		});
	}else{
		$('#saveRemarkBtn').html('保存备注');
		alert('请输入备注信息');
	}
}

//商品退回
function fillReturnExpress(){

	layer.open({
		type:2,
		title:'快递寄回',
		shadeClose:false,
		content:'/order/order/expressnum?orderNo='+orderNo+'&statusFlag=1',
		area:['500px','400px'],
		close:function(index){
			layer.close(index);
		},
		end:function(index){
//			window.location.reload();
		}
	});
}

//废弃手机一键到待入库
function finishWaste(){
	$.post('/order/order/finishwasteorder',{orderNo:orderNo},function(data){
		if(data == 'Y'){
			window.location.reload();//刷新
		}
	});
}

//订单取消
function stopOrder(zhimaPayFlag){

	var titletext = '订单终止';
	var stopurl = '/order/order/tostoporder?orderNo='+orderNo;
	// 根据订单来源查询合作商businesscode，如果是11 则为设备回收机回收
	var businesscode = getBusinesscodeBySource(sourceCode);
	
	if(sourceCode == '66'){
		stopurl = '/zhima/recyorder/tostoporder?orderNo='+orderNo;
		titletext = '芝麻信用订单终止';
	}else if(sourceCode == '70'){	//闲鱼信用回收
		stopurl = '/idlefish/recyorder/tostoporder?orderNo='+orderNo;
		titletext = '闲鱼信用回收订单终止';
	}else if(sourceCode == '71'){	//闲鱼二期信用回收
		stopurl = '/idlefishv2/recyorder/tostoporder?orderNo='+orderNo;
		titletext = '闲鱼信用回收订单终止';
	}else if(sourceCode == '73'){	//闲鱼三期信用回收
		stopurl = '/idlefishv3/recyorder/tostoporder?orderNo='+orderNo;
		titletext = '闲鱼信用回收订单终止';
	}else if(creditCouponFlag == 'Y'){//支付宝天猫店
		stopurl = '/zhima/offlinemall/tostoporder?orderNo='+orderNo;
		titletext = '天猫店信用回收订单终止';
	}else if(sourceCode == '175' && zhimaPayFlag == 'Y'){
		stopurl = '/zhima/recyorder/tostoporder?orderNo='+orderNo;
		titletext = '线下信用订单终止';
	}else if(sourceCode == '74'){
		stopurl = '/zhimaapp/recyorder/tostoporder?orderNo='+orderNo;
		titletext = '线下信用订单终止';
	}else if(sourceCode == '92'){	//百川信用回收
		stopurl = '/zhima/baichuanorder/tostoporder?orderNo='+orderNo;
		titletext = '百川信用回收订单终止';
	}else if(businesscode == '11'){//设备回收
		stopurl = '/order/device/tostoporder?orderNo='+orderNo;
		titletext = '设备回收订单终止';
	}
	layer.open({
		type:2,
		title:titletext,
		shadeClose:false,
		content:stopurl,
		area:['700px','500px'],
		close:function(index){
		layer.close(index);
		}
	});
}

//打印检测报告
function printReport(orderNo){
	layer.open({
		type:2,
		title:'打印检测报告',
		shadeClose:false,
		content:'/order/order/printreport?orderNo='+orderNo,
		area:['700px','800px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getBusinesscodeBySource(source) {
	var businesscode = "";
	$.ajax({
		type : "post",
		url : "/order/order/getbusinesscodebysource",
		data : {source:source},
		async : false,
		success : function(result){
			businesscode = result.BUSINESSCODE;
		}
	});
	return businesscode;
}

//顺丰运单号查询
function checkExpMailNo(){
	$.ajax({
		type:'POST'//请求方式
		,url:"/order/order/sfydcheck" //请求路径
		,data:{orderNo:orderNo,contactWay:contactWay}//发送到服务器的数据
		,cache:false
		,async:false
		,timeout:10000
		,dataType:'json'
		,success:function(data){
			if(data){
				window.location.reload();
			}else{
				alert('不存在该订单号对应的订单信息');
			}
		}
	});
}

//发送未接通订单的短信
function sendMsg(){
	if(tradeType == '1' || tradeType == '5'){
		sendFlag = 2;
	}else if(tradeType == '2'){
		sendFlag = 3;
	}else if(tradeType == '9'){
		sendFlag = 4;
	}
	if(confirm('是否确认发送短信？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/zhima/recyorder/sendsms" //请求路径
			,data:{mobile:contactWay, sendFlag:sendFlag, sourceCode:sourceCode, orderNo:orderNo}//发送到服务器的数据
			,cache:false
			,async:false
			,timeout:10000
			,dataType:'json'
			,success:function(data){
				if(data == 'Y'){
					alert('短信发送成功');
					window.location.reload();
				}else{
					alert('短信发送失败：'+data);
				}
			}
		});
	}
}

//发送议价未接通订单的短信
function sendyjMsg(){
	if(confirm('是否确认发送短信？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/zhima/recyorder/sendsms" //请求路径
			,data:{mobile:contactWay, sendFlag:1, sourceCode:sourceCode, orderNo:orderNo}//发送到服务器的数据
			,cache:false
			,async:false
			,timeout:10000
			,dataType:'json'
			,success:function(data){
				if(data == 'Y'){
					alert('短信发送成功');
					window.location.reload();
				}else{
					alert('短信发送失败：'+data);
				}
			}
		});
	}
}


//顺丰一键叫快递
function sfexpress(){
	layer.open({
		type:2,
		title:'顺丰代叫快递',
		shadeClose:false,
		content:'/order/order/sfexpress?orderNo='+orderNo,
		area:['600px','400px'],
		close:function(index){
			layer.close(index);
		}
	});
}

//刷新
function doSearch(){
	window.location.href = window.location.href;//刷新
}

//购买新机
function buyNewmachine(){
	layer.open({
		type:2,
		title:'预购新机',
		shadeClose:false,
		content:'/order/newmachine/buynewmachine?orderNo='+orderNo+'&source=orderinfo',
		area:['500px','350px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 获取地图
 */
function getmap(){
	var address = $("#address").text();
	window.open('/order/order/ydmmap?address='+address);
}

/**
 * 查看戴尔门店信息
 * added by wangbo
 */
function storeInfo(storeNo, partnerCode){
	var url = "/recycle/agreement/storeinfo?storeNo="+storeNo+'&partnerCode='+partnerCode;
	layer.open({
		type:2,
		title:'门店签约信息',
		shadeClose:false,
		content:url,
		area:['700px','510px'],
		close:function(index){
			layer.close(index);
		}
	});
}

//推送闲鱼二期检测报告
function idlefishV2Inspection(){
	var url = '/order/callcenter/idlefishv2inspectionreport';//默认闲鱼二期
	if(sourceCode=='73'){//闲鱼三期
		url = '/idlefishv3/recyorder/idlefishv3inspectionreport';
	}else if(sourceCode=='293'){//闲鱼帮卖
		url = '/idlefishpai/consignmentorder/idleconsignmentinspectionreport';
	}
	$('#idlefishV2InspectionReport').unbind("click");
	$.ajax({
		type:'POST'//请求方式
		,url:url	//请求路径
		,data:{orderNo:orderNo}//发送到服务器的数据
		,cache:false
		,async:false
		,timeout:10000
		,dataType:'json'
		,success:function(data){
			if(data == 'Y'){
				if(orderStatus=='20' && Number(realPrice) >= Number(orderPrice)){
					if(sourceCode == '71'){
						idlefishV2Pay();//质检价格大于预估价格直接去打款，闲鱼到已确认（交易成功）状态
					}
				}else{
					layer.load('检测报告推送成功...', 2);
					$('#idlefishV2InspectionReport').bind('click', function(){idlefishV2Inspection()});
					window.location.href="/order/order/orderinfo?orderNo="+orderNo;
				}
			}else{
				alert('检测报告推送成功失败，请重试！');
			}
		}
	});
}

//推送转转二期检测报告
function zhuanzhuanInspection(){
	var url='/order/callcenter/zhuanzhuaninspectionreport';
	$('#zhuanzhuanInspectionReport').unbind("click");
	$.ajax({
		type:'POST'//请求方式
		,url:url //请求路径
		,data:{orderNo:orderNo}//发送到服务器的数据
		,cache:false
		,async:false
		,timeout:10000
		,dataType:'json'
		,success:function(data){
			if(data == 'Y'){
				layer.load('检测报告推送成功...', 2);
				$('#zhuanzhuanInspectionReport').bind('click', function(){zhuanzhuanInspection()});
				window.location.href="/order/order/orderinfo?orderNo="+orderNo;
			}else{
				alert('检测报告推送成功失败，请重试！');
			}
		}
	});
}

//推送转转寄卖检测报告
function consignmentInspection(){
	var url='/order/callcenter/zhuanzhuanconsignmentreport';
	$('#consignmentInspection').unbind("click");
	if(confirm('确认发送质检报告？')){
		$.ajax({
			type:'POST'//请求方式
			,url:url //请求路径
			,data:{orderNo:orderNo}//发送到服务器的数据
			,cache:false
			,async:false
			,timeout:10000
			,dataType:'json'
			,success:function(data){
				if(data == 'Y'){
					layer.load('检测报告推送成功...', 2);
					$('#consignmentInspection').bind('click', function(){consignmentInspection()});
					window.location.href="/order/order/orderinfo?orderNo="+orderNo;
				}else{
					alert('检测报告推送成功失败，请重试！');
					$('#consignmentInspection').bind('click', function(){consignmentInspection()});
				}
			}
		});
	}else{
		$('#consignmentInspection').bind('click', function(){consignmentInspection()});
	}
}

function idlefishV2Pay(){
	$.ajax({
	type:'POST'//请求方式
		,url:"/idlefishv2/recyorder/pay" //请求路径
		,data:{orderNo:orderNo}//发送到服务器的数据
		,cache:false
		,async:false
		,timeout:10000
		,dataType:'json'
		,success:function(data){
			if(data == 'Y'){
				layer.load('检测报告推送成功,打款成功！', 4);
				$('#idlefishV2InspectionReport').bind('click', function(){idlefishV2Inspection()});
				window.location.href="/order/order/orderinfo?orderNo="+orderNo;
			}else{
				alert('检测报告推送成功，打款失败！');
			}
		}
	});
}

function stopAfterOrderBack(){
	$.ajax({
		type:'POST'//请求方式
		,url:"/idlefishv2/recyorder/stopafterorderback" //请求路径
		,data:{orderNo:orderNo}//发送到服务器的数据
		,cache:false
		,async:false
		,timeout:10000
		,dataType:'json'
		,success:function(data){
			if(data == 'Y'){
				layer.load('修改成功！', 4);
				$('#stopAfterOrderBack').bind('click', function(){stopAfterOrderBack()});
				window.location.href="/order/order/orderinfo?orderNo="+orderNo;
			}else{
				alert('修改失败！状态不允许修改');
			}
		}
	});
}

/**
 * 功能描述：异常订单警示
 */
var abnormalTxt = ''; // 异常描述
var abnormalHtml = ''; // 异常html
var abnormalImg = '/images/warny40.png'; // 默认黄色图标
var abnormalCN = 'Y'; // 自动检测冷门订单标识
var abnormalUN = 'Y'; // 自动检测异常用户标识
var abnormalMN = 'Y'; // 自动检测短时间多单标识
if(abnormalFlag != '' && abnormalFlag != null){ // 标识字段不为空
	var str = abnormalFlag.split(",");
	for (var i in str){
		abnormalHtml = '';
		if(str[i] == 'C'){
			abnormalCN = 'N';
			abnormalTxt = '异常冷门订单';
		}else if(str[i] == 'U'){
			abnormalUN = 'N';
			abnormalTxt = '异常用户';
		}else if(str[i] == 'M'){
			abnormalMN = 'N';
			abnormalTxt = '短时间多单';
		}else if(str[i] == 'CN'){ //禁止 冷门订单标识
			abnormalCN = 'N';
		}else if(str[i] == 'UN'){ //禁止 异常用户标识
			abnormalUN = 'N';
		}else if(str[i] == 'MN'){ //禁止 短时间多单标识
			abnormalMN = 'N';
		}
		if(str[i] == 'C' || str[i] == 'U' || str[i] == 'M'){
			abnormalHtml += '<div class="a_warn" id="abnormalFlag_'+str[i]+'"><div><img src="'+abnormalImg+'" alt="'+abnormalTxt+'" title="'+abnormalTxt+'"></div>';
			abnormalHtml += '<div title="'+abnormalTxt+'" class="abnormalTxt">'+abnormalTxt+'</div></div>';
			$('#abnormalFlag').append(abnormalHtml);
		}
	}
	// 获取用户异常
	if($("#abnormalFlag_U").length>0){
		$.post('/yonghu/level/warnuser',{mobile:contactWay,merType:merType},function(result){
			if(typeof result.flag != "undefined"){
				if(result.flag == 'Y'){
					abnormalTxt = result.userDesc;
					if(result.userLevel == '2'){
						$('#abnormalFlag_U').find('img').attr('src','/images/warnr40.png'); //红色图标
					}
					$('#abnormalFlag_U').find('img').attr('alt',abnormalTxt);
					$('#abnormalFlag_U').find('img').attr('title',abnormalTxt);
					$('#abnormalFlag_U').find('.abnormalTxt').attr('title',abnormalTxt);
					$('#abnormalFlag_U').find('.abnormalTxt').text(abnormalTxt);
				}
			}
		})
	}
}

//
if(abnormalCN == 'Y'){
	$.post('/analyze/orderwarn/coldorder',{orderNo:orderNo},function(result){
		if(result == 'Y'){
			abnormalTxt = '异常冷门订单';
			abnormalHtml = '<div class="a_warn" id="abnormalFlag_C"><div><img src="'+abnormalImg+'" alt="'+abnormalTxt+'" title="'+abnormalTxt+'"></div>';
			abnormalHtml += '<div title="'+abnormalTxt+'" class="abnormalTxt">'+abnormalTxt+'</div></div>';
			$('#abnormalFlag').append(abnormalHtml);
		}
	});
}
if(abnormalMN == 'Y'){
	$.post('/analyze/orderwarn/timemoreorder',{mobile:contactWay},function(result){
		if(result == 'Y'){
			abnormalTxt = '短时间多单';
			abnormalHtml = '<div class="a_warn" id="abnormalFlag_M"><div><img src="'+abnormalImg+'" alt="'+abnormalTxt+'" title="'+abnormalTxt+'"></div>';
			abnormalHtml += '<div title="'+abnormalTxt+'" class="abnormalTxt">'+abnormalTxt+'</div></div>';
			$('#abnormalFlag').append(abnormalHtml);
		}
	});
}
if(abnormalUN == 'Y'){
	$.post('/yonghu/level/warnuser',{mobile:contactWay,merType:merType},function(result){
		if(typeof result.flag != "undefined"){
			if(result.flag == 'Y'){
				abnormalTxt = result.userDesc;
				if(result.userLevel == '2'){
					abnormalHtml = '<div class="a_warn" id="abnormalFlag_U"><div><img src="/images/warnr40.png" alt="'+abnormalTxt+'" title="'+abnormalTxt+'"></div>';
				}else{
					abnormalHtml = '<div class="a_warn" id="abnormalFlag_U"><div><img src="'+abnormalImg+'" alt="'+abnormalTxt+'" title="'+abnormalTxt+'"></div>';
				}

				abnormalHtml += '<div title="'+abnormalTxt+'" class="abnormalTxt">'+abnormalTxt+'</div></div>';
				$('#abnormalFlag').append(abnormalHtml);
			}
		}
	});
}

//保存二次报价
function saveQuotation(quotation){
	$.post('/order/inspectquote/saveprice',{orderNo:orderNo, quotation:quotation},function(data){
		if(data == "Y"){
			window.location.reload()
		}else{
			quoteAgainFlag = true;
			alert(data)
		}
	});
}

/**
 * 功能描述：更新快递单号
 * @author: zhuhaili
 * @date: 2018年9月30日
 */
function updateExpressNo(){
	layer.open({
		type:2,
		title:'更新快递单号',
		shadeClose:false,
		content:'/order/order/updateorderexpressno?orderNo='+orderNo,
		area:['450px','240px'],
		close:function(index){
			layer.close(index);
		}
	});
}

//重新补单
function reCreateOrder(){
	layer.open({
		type:2,
		title:'重新下单',
		shadeClose:false,
		content:'/order/recreate/recreateorder?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

//同步通话记录
function callAiSyn(moblie) {
	$.post('http://inspection.youdemai.com/callai/callai/calltaskcustomer',{orderNo:orderNo,mobile:moblie},function(data) {
		if(data['code'] == 200) {
			var html = "<table><tr><th>拨打时间</th><th>拨打状态</th><th>关键词</th></tr>";
			for(var i=0;i < data.data.length;i++) {
				var outtime = format(data.data[i].callOutTime);
				var state = '';
				var keyword = data.data[i].keyword;
				if(keyword == null) {
					keyword = '';
				}
				switch(data.data[i].callStatus) {
					case '1':
						state='待呼叫';
						break;
					case '2':
						state ='呼叫中';
						break;
					case '3':
						state = '呼叫成功';
						break;
					case '4':
						state = '用户忙线';
						break;
					case '5':
						state = '未接通';
						break;
					case '6':
						state = '空号';
						break;
					case '7':
						state = '停机';
						break;
					case '8':
						state = '关机';
						break;
				}
				html +="<tr><td>"+outtime+"</td><td>"+state+"</td><td>"+keyword+"</td></tr>";
			}
			html += '</table>';
			$('.callaiBody').html(html);
		}else {
			
		}
	})
}

function add0(m){
	return m < 10 ? '0' + m : m;
}

function format(shijianchuo){
	//shijianchuo是整数，否则要parseInt转换
	var time = new Date(shijianchuo);
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

function reload(){
	window.location.reload();
}

//素材下载
function materialDownload(){
	layer.open({
		type:2,
		title:'素材下载',
		shadeClose:false,
		content:'/idlefishpai/recyorder/downloadindex?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		},
		end:function(index){
			//window.location.reload();
		}
	});
}

//打印质检报告
function inspectionReport(){
	layer.open({
		type:2,
		title:'打印检测报告',
		shadeClose:false,
		content:'/idlefishpai/recyorder/inspectionreport?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		},
		end:function(index){
			//window.location.reload();
		}
	});
}

/**
 *订单详情跳转检测中心
 */
function gotoInspection() {
	window.location.href = '/order/order/orderinspection?orderNo='+orderNo+'&layer=Y';
}


//添加鉴定单
function gotoIndentify(){
	layer.open({
		type:2,
		title:'添加鉴定单',
		shadeClose:false,
		content:'/order/order/orderidentify?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		},
		end:function(index){
			//window.location.reload();
		}
	});
}


/**
 * 鉴定信息查看
 */
function identifyOrderInfo(){
	layer.open({
		type:2,
		title:'帮卖订单查看',
		shadeClose:false,
		content:'/idlefishpai/recyorder/taborderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 拆分订单列表详情
 */
function splitOrders(){
	layer.open({
		type:2,
		title:'订单拆分详情',
		shadeClose:false,
		content:'/order/ordersplit/splitorders?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 订单拆分
 */
function orderSplit(){
	layer.open({
		type:2,
		title:'订单拆分详情',
		shadeClose:false,
		content:'/order/ordersplit/createpage?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}
