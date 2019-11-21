String.prototype.replaceAll = function(s1, s2){ 
	return this.replace(new RegExp(s1, "gm"), s2); 
}

var saleBillInfo = {}, detailList = [], tempText = '', recyOrderList = [];
$().ready(function(){
	$('#BtnsaveData').bind('click', function(){submitData();});
	$('#excelFile').change(function(e){
		detailList = [];
		recyOrderList = [];
		saleBillInfo = {};
		tempText = '';
		
		var files = e.target.files;
		var fileReader = new FileReader();
		var orderDataList = [];
		fileReader.onload = function(ev){
			try{
				var data = ev.target.result, workbook = XLSX.read(data, {type: 'binary'}), persons = [];// 以二进制流方式读取得到整份excel表格对象
			}catch(e){
				alert('文件类型不正确');
				return;
			}
			
			// 表格的表格范围，可用于判断表头数量是否正确
			// 遍历每张表读取
			for(var sheet in workbook.Sheets){
				if(workbook.Sheets.hasOwnProperty(sheet)){
					orderDataList = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
					break;
				}
			}
			//销售单信息
			if(orderDataList.length > 0){
				for(var i in orderDataList){
					if(i == 0){//销售单号
						saleBillInfo.saleBillNo = $.trim(orderDataList[i].B);
						$('#saleBillInfo .td_saleBillNo').html(orderDataList[i].B);
					}else if(i == 1){//销售部门
						saleBillInfo.saleBranch = $.trim(orderDataList[i].B);
						$('#saleBillInfo .td_saleBranch').html(orderDataList[i].B);
					}else if(i == 2){//销售人
						saleBillInfo.saler = $.trim(orderDataList[i].B);
						$('#saleBillInfo .td_saler').html(orderDataList[i].B);
					}else if(i == 3){//商品数量
						saleBillInfo.totalCount = $.trim(orderDataList[i].B);
						$('#saleBillInfo .td_totalCount').html(orderDataList[i].B);
					}else if(i == 4){//采购价
						saleBillInfo.costAmount = $.trim(orderDataList[i].B);
						$('#saleBillInfo .td_costAmount').html(orderDataList[i].B);
					}else if(i == 5){//销售总价
						saleBillInfo.saleAmount = $.trim(orderDataList[i].B);
						$('#saleBillInfo .td_saleAmount').html(orderDataList[i].B);
					}else if(i == 6){//其他费用
						saleBillInfo.otherAmount = $.trim(orderDataList[i].B);
						$('#saleBillInfo .td_otherAmount').html(orderDataList[i].B);
					}else if(i == 7){//收款方式
						saleBillInfo.payType = $.trim(orderDataList[i].B);
						$('#saleBillInfo .td_payType').html(orderDataList[i].B);
					}else if(i == 8){//销售时间
						saleBillInfo.saleDate = $.trim(orderDataList[i].B);
						$('#saleBillInfo .td_saleDate').html(orderDataList[i].B);
					}else if(i == 9){//备注
						saleBillInfo.remark = $.trim(orderDataList[i].B);
						$('#saleBillInfo .td_remark').html(orderDataList[i].B);
					}else if(i > 10){//二级表头
						var saleDetail = {A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:''},
						dataValidFlag = false, dataErrFlag = false, dataErrMsgs = [];
						$.each(orderDataList[i], function(k, v){
							if(k in saleDetail){
								dataValidFlag = true;
								tempText = $.trim(v);
								tempText = tempText.replaceAll(/\n/g, "");
								tempText = tempText.replaceAll(/\r\n/g, "");
								
								if(k != 'L' && k != 'C' && tempText.indexOf(' ') > -1){
									dataErrMsgs.push('第'+(Number(i)+3)+'行的第'+k+'列，数据存在空格，请重新整理后再操作');
									dataErrFlag = true;
								}
								
								switch(k){
									case 'A'://回收单
										break;
									case 'D'://数量
										tempText = parseInt(tempText);
										console.log(tempText);
										if(isNaN(tempText)){
											dataErrMsgs.push('第'+(Number(i)+3)+'行的第'+k+'列，数据不符合条件，请重新整理后再操作');
											dataErrFlag = true;
										}
										break;
									case 'E'://采购价
									case 'F'://销售价
									case 'G'://其他费用
										tempText = parseFloat(tempText);
										tempText = tempText.toFixed(2);
										
										if(isNaN(tempText)){
											dataErrMsgs.push('第'+(Number(i)+3)+'行的第'+k+'列，数据不符合条件，请重新整理后再操作');
											dataErrFlag = true;
										}
										break;
									default:
										break;
								}
								saleDetail[k] = tempText;
							}
						});
						
						if(saleDetail.D == '' || saleDetail.E == '' || saleDetail.F == '' || saleDetail.G == ''){
							dataErrMsgs.push('第'+(Number(i)+3)+'行的商品数量、采购价、销售价格、其他费用不能为空，请重新整理后再操作');
							dataErrFlag = true;
						}
						
						var businessType = $('#businessType').val();
						//二手电商和品类销售，回收单号不允许为空
						if(businessType == '1' || businessType == '2'){
							if(saleDetail.A == ''){
								dataErrMsgs.push('第'+(Number(i)+3)+'行的回收单号不允许为空，请重新整理后再操作');
								dataErrFlag = true;
							}
							if($.inArray(saleDetail.A, recyOrderList) > -1){
								dataErrMsgs.push('第'+(Number(i)+3)+'行的回收单号不允许重复，请重新整理后再操作');
								dataErrFlag = true;
							}
							recyOrderList.push(saleDetail.A);
							if(saleDetail.D != 1){
								dataErrMsgs.push('第'+(Number(i)+3)+'行的商品数量必须是1，请重新整理后再操作');
								dataErrFlag = true;
							}
							
							if(businessType == '1' && saleDetail.H != '仓库' && saleDetail.H != '品类采购'){//二手电商
								alert('商品来源异常：二手电商销售商品来源必须是【仓库】或【品类采购】');
								return;
							}
							
							if(partnerType == '1' && saleDetail.I == ''){//个人销售，并且销售渠道为空
								alert('销售类型为【个人】时，销售渠道不允许为空');
								return;
							}
						}
						
						if(businessType == '2'){//品类销售，商品来源默认是仓库
							saleDetail.H = '仓库';
						}else if(businessType == '3'){//自采
							saleDetail.H = '自采';
						}else if(businessType == '3'){//企业回收
							saleDetail.H = '企业';
						}
						var partnerType = $('input[type="radio"][name="partnerType"]:checked').val();
						if(partnerType == '2'){
							saleDetail.I = '回收商';
						}
						
						if(dataErrFlag){
							var msg = '<div style="text-align:center;font-size:16px;color:red;">数据校验错误</div>';
			                if(dataErrMsgs){
			        			for(var i in dataErrMsgs){
			        				msg += '<div style="padding:2px;">'+dataErrMsgs[i]+'</div>';
			        			}
			                }
			        		layer.open({
			        			type:1, shade:false, title:false, area:['480px', 'auto'],
			        			content:'<div class="layer_notice">'+msg+'</div>'
			        		});
			        		return;
						}
						
						if(dataValidFlag){
							detailList.push(saleDetail);
						}
					}
				}
			}
			
			//金额判断
			if(saleBillInfo.otherAmount == '' || saleBillInfo.saleAmount == ''
				||saleBillInfo.costAmount == '' || saleBillInfo.totalCount == ''){
				alert('商品数量、采购价、销售总价、其他费用都不能为空');
				return;
			}
			
			if(detailList.length < 1){
				alert('导入数据格式不正确，请下载统一格式模板');
				return;
			}
			
			//清空表格
			$("#excelBody").empty();
			var tdHtml = '', index = 0;
			for(var j = 0; j < detailList.length; j++){
				var detail = detailList[j], tdHtml = '<td>'+(j+1)+'</td>';
				index = 0;
				for(var i in detail){
					index++;
					if(index < 13){
						tdHtml += "<td>"+($.trim(detail[i]))+"</td>";
					}
				}
				$("#excelBody").append('<tr class="tr">'+tdHtml+'</tr>');
			}
		};
		//以二进制方式打开文件
		if(typeof files[0]!=="undefined"){
			fileReader.readAsBinaryString(files[0]);
		}else{
			alert('你没有选择文件，请选择文件');
		}
		$("#excelFile").val(''); // 选择同个文件内容重新加载
	});
	
	$('input[type="radio"][name="partnerType"]').change(function() {
		$('#excelBody').html('<tr><td colspan="14" class="center">暂无数据</td></tr>');
		$('#saleBillInfo .saleTd').html('');
		
		saleBillInfo = {};
		detailList = [];
		tempText = '';
		recyOrderList = [];
		
        if(this.value == '1'){//个人
        	$('#tr_partner').hide();
        }else if (this.value == '2') {
        	$('#tr_partner').show();
        }
    });
});

function loadPartner(){
	$.post('/sale/recycler/jsonlist',{},function(data){
		
		if(data){
			var optionHtmls = '<option value="">请选择回收商</option>';
			for(var i in data){
				optionHtmls += '<option value="'+data[i].PROVIDERID+'">'+data[i].PROVIDERNAME+'</option>';
			}
			$('#providerId').html(optionHtmls);
		}
	});
}

function submitData(){
	
	if($.isEmptyObject(saleBillInfo)){
		alert('无效的销售数据，请重新上传.');
		return;
	}
	
    var saleDetails = [];
    $('#excelBody tr').each(function(i){
    	var saleDetail = {};
        var param = {}, thisTd = $('td', $(this));
        saleDetail.recyOrderNo = thisTd.eq(1).html();
        saleDetail.categoryName = thisTd.eq(2).html();
        saleDetail.productName = thisTd.eq(3).html();
        saleDetail.count = thisTd.eq(4).html();
        saleDetail.costAmount = thisTd.eq(5).html();
        saleDetail.saleAmount = thisTd.eq(6).html();
        saleDetail.otherAmount = thisTd.eq(7).html();
        saleDetail.sourceName = thisTd.eq(8).html();
        saleDetail.saleChannel = thisTd.eq(9).html();
        saleDetail.contacts = thisTd.eq(10).html();
        saleDetail.mobile = thisTd.eq(11).html();
        saleDetail.remark = thisTd.eq(12).html();
        saleDetails.push(saleDetail);
    });
    
    if(saleDetails.length < 1){
    	alert('无效的销售数据，请重新上传..');
    }
    
    var saleDetailsJson = JSON.stringify(saleDetails);
    
    saleBillInfo.businessType = $('#businessType').val();
    saleBillInfo.partnerType = $('input[type="radio"][name="partnerType"]:checked').val();
    
    if(saleBillInfo.partnerType == '1'){//个人
        saleBillInfo.partnerId = '';
    }else if(saleBillInfo.partnerType == '2'){//回收商
        saleBillInfo.partnerId = $("#partnerId").val();
        if(saleBillInfo.partnerId == ''){
        	alert('请选择回收商');
        	return;
        }
    }
    
    if(saleBillInfo.businessType == '1' && saleBillInfo.saleBranch != '二手电商'){
    	alert('销售部门与当前业务不符，请选择【二手电商】销售单模板');
    	return;
    }

    if(saleBillInfo.businessType == '2' && saleBillInfo.saleBranch != '品类销售'){
    	alert('销售部门与当前业务不符，请选择【品类销售】销售单模板');
    	return;
    }
    
    if(saleBillInfo.businessType == '3' && saleBillInfo.saleBranch != '自采销售'){
    	alert('销售部门与当前业务不符，请选择【自采销售】销售单模板');
    	return;
    }
    
    if(saleBillInfo.businessType == '4' && saleBillInfo.saleBranch != '企业销售'){
    	alert('销售部门与当前业务不符，请选择【企业销售】销售单模板');
    	return;
    }

    $('#BtnsaveData').html('正在上传中，请稍后');
	$('#BtnsaveData').unbind('click');
    
    $.post('/recycle/salebill/saveebsimport', {saleBillInfo:saleBillInfo, saleDetails:saleDetailsJson}, function(data){
    	console.log(data);
    	$('#BtnsaveData').html('保存');
        if(data.result == 'Y'){
            alert('数据提交成功');
            parent.reload();
        }else{
        	$('#BtnsaveData').bind('click', function(){submitData();});
            var msg = '<div style="text-align:center;font-size:16px;color:red;">数据校验错误</div>';
            if(data.errMsg){
            	var errMsgs = data.errMsg;
    			for(var i in errMsgs){
    				msg += '<div style="padding:2px;">'+(parseInt(i)+1)+'、'+errMsgs[i]+'</div>';
    			}
            }
    		var layerIndex = layer.open({
    			type:1, shade:false, title:false, area:['480px', 'auto'],
    			content:'<div class="layer_notice">'+msg+'</div>'
    		});
        }
    },'json');
}


/**
 * 添加合作商
 */
function addRecycler(){
//	window.location.href = '/provider/party/addprovider?layer=Y&fromUri='+encodeURIComponent(window.location.href);
    layer.open({
        type:2,
        title:'添加销售商',
        shadeClose:true,
        content:'/sale/recycler/addrecycler',
        area:['600px','450px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 重新加载
 * @returns
 */
function reload(){
    layer.closeAll();
    window.location.reload();
}
