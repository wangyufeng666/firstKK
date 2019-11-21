var ruleData = '';
var basePrice = 0;
var plusPrice = 0;

$().ready(function(){
	$.get('/'+merType+'.xml?v=2', {}, function(data){
		ruleData = $(':first-child', data);
		loadNextNode(data, 'rootNode');
	});
});

//器材询价
function getMerQuote(){
    var eventCode = $('#eventCode').val();
	$('#addPriceArea').show();
	var load1 = layer.load('加载中...');
	var price = basePrice + plusPrice;
	var htmlActives = "<label><input name='events' type='radio' checked='checked' value='"+eventCode+"'/>京东E卡("+price+")</label>&nbsp;&nbsp;";
	$('#eventLabel').html(htmlActives);
	layer.close(load1);
}

/**
 * 保存检测结果
 */
function saveInspection(){
	$('#save').unbind('click');
	//所选活动
	var eventCode = $('input[name="events"]:checked').val();
	if($('#eventLabel').html() == '' || eventCode == ''){
		errorBox("请先询价，询价后选择兑换的活动");
		$('#save').bind('click', function(){saveInspection();});
		return;
	}
	
	//检测人
	var workerId = $("#worker").val();
	var workerName = $("#worker option:selected").text();
	var addPrice = $('#addPrice').val();
	if(workerId == ''){
		errorBox("请选择检测员");
		$('#save').bind('click', function(){saveInspection();});
		return;
	}
	var reg = /^(-)?\d+$/;
	if(!reg.test(addPrice)){
		errorBox('用户补贴非法输入');
		$('#save').bind('click', function(){saveInspection();});
		return;
	}
	
	//器材描述
	var oper = true;
    var radioIds = [];
    var multiIds = [];
    var attrsArray = [];
    
	var attrItems = [];
	
	$('#inspectArea .item').each(function(){
		var attrItem = {};
		var pn = $('.pn', $(this));
		var pv = $('.gzlx', $(this));
		
		attrItem.pnid = pn.attr('data-pnid');
		attrItem.pn = pn.html();
		
		attrItem.pvid = pv.val();
		attrItem.pv = $('option:selected', pv).attr('title');
		
		if(attrItem.pnid == '' || attrItem.pvid == ''){
			oper = false;
			$('.remind', $(this)).show();
		}
		
		radioIds.push(attrItem.pvid);
		attrsArray.push(attrItem.pn+':'+attrItem.pv);
		
		attrItems.push(attrItem);
//		console.log(attrItems);
	});
    
    if(!oper){
    	errorBox("请选择器材描述。");
    	$('#save').bind('click', function(){saveInspection();});
    	return;
    }
    var orderNo = $('#orderNo').val();
    var merSequence = $('#merSequence').val();
	var price = basePrice + plusPrice;
	
	if(price <= 0){
		alert('检测金额不能低于0元');
		$('#save').bind('click', function(){saveInspection();});
		return;
	}
	
    var params = {orderNo:orderNo, workerId:workerId, workerName:workerName, merSequence:merSequence, addPrice:addPrice,attrItems:attrItems,
    		radioIds:radioIds.join('#'), multiIds:multiIds.join('#'), eventCode:eventCode, merPrice:price, attrTexts:attrsArray.join(';')};
    
    var load1 = layer.load('保存检测信息，请稍后');
    $.post('/order/jdorder/saveinspection', params, function(data){
    	if(data == 'Y'){
    		alert('检测信息保存成功');
    		window.location.href = '/order/jdorder/orderinspection?orderNo='+orderNo+'&backUrl='+backUrl;
    	}else{
    		alert('检测信息保存失败');
    		$('#save').bind('click', function(){saveInspection();});
    	}
    });
}

/**
 * 订单复检，跳转到订单复检页面
 * @return
 */
function reinspectOrder(){
    var orderNo = $('#orderNo').val();
	window.location.href = '/order/jdorder/orderinspection?orderNo='+orderNo+'&inspectFlag=Y'+'&backUrl='+backUrl;
}

/**
 * 确认检测
 */
function inspectConfirm(){
    var orderNo = $('#orderNo').val();	
    var sendmessage = $('#sendmessage').val();
    var sendMsgCheckFlag = $('input:checkbox[name="sendmessage"]').attr('checked');
	
	if(confirm('确认检测后，订单不能复检。是否已确认检测结果？')){
		$('#inspectConfirm').unbind('click');
		var orderNo = $('#orderNo').val();
		$.post('/order/jdorder/confirminspection', {orderNo:orderNo,sendMsgCheckFlag:sendMsgCheckFlag}, function(data){
			if(data == 'Y'){
				messagesBox("订单已确认检测");
				window.location.reload();
			}else{
				alert('确认检测失败：'+data);
				$('#inspectConfirm').bind('click', function(){inspectConfirm();});
			}
		});
	}
}

/**
 * 错误对话框
 * @param msg
 * @return
 */
function errorBox(msg){
    $.layer({
        title:'错误',
        area:['280px','auto'],
        dialog:{msg:msg, type:8}    
    });
}
/**
 * 通知对话框
 * @param msg
 * @return
 */
function messagesBox(msg){
    $.layer({
        title:'提示',
        area:['280px','auto'],
        dialog:{msg:msg, type:8}    
    });
}

$().ready(function(){
	$('#save').bind('click', function(){saveInspection();});
	$('#btn-search').bind('click', function(){getMerQuote();});
	$('#reinspect').bind('click', function(){reinspectOrder();});
	$('#inspectConfirm').bind('click', function(){inspectConfirm();});
	$('.gzlx').focus(function(){$(this).next().hide();});
	$('.st-no').bind('click', function(){
		$('.st-no').removeClass('selected');
		$(this).addClass('selected');
		getboxdetail($(this).attr('no-data'));
	});
	$('.det-location').delegate("li","click",function(){
		$('.det-no').removeClass('selected');
		$(this).addClass('selected');
		selectLocation($(this).attr('no-data'),orderNo);
	});
});
function goBack(){
	window.location.href = '<?php echo $this->backUrl?>';
}
function saveRemark(orderNo){
	var orderRemark = $.trim($('#orderRemark').val());
	if(orderRemark != ''){
		$.post('/order/order/insertremark',{orderNo:orderNo, orderRemark:orderRemark},function(data){
			if(data == 'Y'){
				window.location.reload();//刷新
			}else{
				alter(data);
			}
		});
	}else{
		alert('请输入备注信息');
	}
}

function selectLocation(boxdetailcode,orderNo){
	$('.det-no').unbind('click');
	if(boxdetailcode != '' && orderNo != ''){
		$.ajax({
			type:'POST'
			,url:"/order/order/saveboxloc"
			,data:{orderNo:orderNo,merLoc:boxdetailcode}
		    ,cache:false
		    ,async:false
		    ,timeout:60000
		    ,dataType:'json'
		    ,success:function(data){
		    	if('Y' != data){
		    		errorBox(data);
		    		$('.det-no').removeClass('selected');
		    	}
		    }
		});
	}
}

function getboxdetail(boxcode){
	if(boxcode != ""){
        $.ajax({
        	type:'POST'//请求方式
            ,url:"/order/order/boxdetail"  //请求路径
            ,data:{boxcode:boxcode}  //发送到服务器的数据
            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async:true //同步请求
            ,timeout:60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success:function(data){
            	$(".det-location").html('');
                for(i in data){
                	$(".det-location").append("<li class='det-no' no-data='"+data[i]['BOXDETAILCODE']+"'>"+data[i]['BOXDETAILCODE']+"</li>");
                }
            }
        });
	}else{
		alert("请先选择货箱");
    }
}

function loadNextNode(dataSource, id){
	var thisRuleData = $('#'+id, dataSource);
	if(thisRuleData){
		if(thisRuleData.children().size() > 0){
			var items = thisRuleData.children()[0];
			var nodeData = foreachData($(items));
			if(nodeData.list.length > 0){
				var selectHtml = '<select class="gzlx" id="'+nodeData.id+'" class="standard-demo radio" data-text="'+nodeData.name+'">';
				selectHtml += '<option value="">请选择'+nodeData.name+'</option>';
				var list = nodeData.list;
				for(var i = 0; i < list.length; i++){
					var priceHtml = '';
					if(list[i].basePrice != undefined){
						priceHtml = ' basePrice="'+list[i].basePrice+'"';
					}
					if(list[i].plusPrice != undefined){
						priceHtml += ' plusPrice="'+list[i].plusPrice+'"';
					}
					selectHtml += '<option title="'+list[i].name+'" '+priceHtml+' value="'+list[i].id+'">'+list[i].name+'</option>';
				}
				selectHtml += '</select><span class="remind" style="display:none;color:red;"><strong>×</strong></span>';
			}
			var html = '';
			html +='<tr class="item">';
			html +='<td width="100" class="pn" data-pnId="'+nodeData.id+'">'+nodeData.name+'</td>';
			html += '<td>'+selectHtml+'</td>';
			$('#inspectArea').append(html);
			$('.gzlx').unbind('change');
			$('.gzlx').bind('change', function(){
				var thisVal = $(this).val();
				//change event remove all tr
				$(this).parent().parent().nextAll().remove();
				$('#inspectionTr').hide();
				
				if(thisVal != ''){
					var nextNodeId = $(this).val();
					if($('option:selected', $(this))){
						var text = $('option:selected', $(this)).attr('basePrice');
						var price = parseInt(text, 10);
						if(price > 0){
							basePrice = price;
						}
					}
					if($('option:selected', $(this))){
						var text = $('option:selected', $(this)).attr('plusPrice');
						if(text){
							plusPrice = parseInt(text, 10);
						}
					}
					console.log(basePrice+'__'+plusPrice);
					loadNextNode(ruleData, nextNodeId);
				}else{
					basePrice = 0;
					plusPrice = 0;
				}
			});
		}else{
			$('#inspectionTr').show();
			$('#btn-search').trigger('click');
		}
	}
}

function foreachData(dataSource){
	var childList = [];
	var dataInfo = {id:'', name:'', basePrice:0, list:childList};
	dataInfo.id = dataSource.attr('id');
	dataInfo.name = dataSource.attr('name');
	
	if(dataSource.attr('basePrice')){
		dataInfo.basePrice = dataSource.attr('basePrice');
	}
	
	if(dataSource){
		var childrenNodes = '';
		var optionFlag = 'item';
		if(dataSource[0].tagName == 'items'){
			childrenNodes = dataSource.children('item');
		}else if(dataSource[0].tagName == 'additions'){
			childrenNodes = dataSource.children('options');
			optionFlag = 'options';
		}
		
		if(childrenNodes.size() > 0){
			childrenNodes.each(function(){
				var item = {};
				item.id = $(this).attr('id');
				item.name = $(this).attr('name');
				item.flag = optionFlag;
				if(optionFlag == 'item'){
					var basePriceStr = $(this).attr('basePrice') ? $(this).attr('basePrice'):'0';
					item.basePrice = parseInt(basePriceStr, 10);
				}else if(optionFlag == 'options'){
					item.plusPrice = parseInt($(this).attr('value'), 10);
				}
				childList.push(item);
			});
		}
	}
	dataInfo.list = childList;
	return dataInfo;
}
