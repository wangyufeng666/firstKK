String.prototype.replaceAll = function(s1, s2){ 
	return this.replace(new RegExp(s1, "gm"), s2); 
}

function saleBillInfoInit(){
	return {saleDate:'',saler:'', totalCount:0, recyAmount:0, expressAmount:0, otherAmount:0, costAmount:0, saleAmount:0};
}

var saleBillInfo = saleBillInfoInit(),
    detailList = [], tempText = '', recyOrderList = [], partners = [], dataErrFlag = false, dataErrMsgs = [];
$().ready(function(){
	
	//同步加载回收商
    $.ajaxSettings.async = false;
	$.post('/sale/recycler/jsonlist',{},function(data){
		if(data){
			for(var i in data){
				partners.push(data[i].PROVIDERNAME);
			}
		}
	});
	$.ajaxSettings.async = true;
	
	$('#BtnsaveData').bind('click', function(){submitData();});
	$('#excelFile').change(function(e){
		detailList = [];
		recyOrderList = [];
		tempText = '';
		dataErrFlag = false;
		dataErrMsgs = [];
		
		var files = e.target.files;
		var fileReader = new FileReader();
		var orderDataList = [];
		fileReader.onload = function(ev){
			try{
				//以二进制流方式读取得到整份excel表格对象
				var data = ev.target.result, workbook = XLSX.read(data, {type: 'binary'}), persons = [];
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
			if(orderDataList.length < 1){
				alert('无效的销售数据');
				return;
			}else if(orderDataList.length > 1002){
				alert('单次导入销售明细数量不允许超过1000个，请分批次导入');
				return;
			}
			
			for(var i in orderDataList){
				if(i == 0){//销售单号
					continue;
				}
				
				var saleDetail = {A:'',B:'',C:'',D:'',E:0,F:0,G:0,H:0,I:0,J:0,K:0,L:'',M:0,N:'',O:'',P:'',Q:'',R:'',S:''};
				
				$.each(orderDataList[i], function(k, v){
					if(k in saleDetail){
						
						tempText = $.trim(v);
						tempText = tempText.replaceAll(/\n/g, "");
						tempText = tempText.replaceAll(/\r\n/g, "");
						
						if(k != 'D' && k != 'Q' && k !='R' && k !='S' && tempText.indexOf(' ') > -1){
							dataErrMsgs.push('第'+(Number(i)+1)+'行的第'+k+'列，数据存在空格，请重新整理后再操作');
							dataErrFlag = true;
						}
						
						switch(k){
							case 'A'://回收单
								break;
							case 'E'://订单价格
							case 'F'://快递费用
							case 'G'://其他费用
							case 'H'://总成本
							case 'I'://销售价格
							case 'K'://毛利率
							case 'M'://提成金额
								tempText = Math.round(Number(tempText) * 10000)/10000;
								if(isNaN(tempText)){
									dataErrMsgs.push('第'+(Number(i)+1)+'行的第'+k+'列，数据不符合条件，请重新整理后再操作');
									dataErrFlag = true;
								}
								if(k != 'K' && tempText < 0){
									dataErrMsgs.push('第'+(Number(i)+1)+'行的第'+k+'列，数据不能小于0，请重新整理后再操作');
									dataErrFlag = true;
								}
								break;
							case 'J'://数量
								tempText = parseInt(tempText);
								if(isNaN(tempText)){
									dataErrMsgs.push('第'+(Number(i)+1)+'行的第'+k+'列，数据不符合条件，请重新整理后再操作');
									dataErrFlag = true;
								}
								break;
							default:
								break;
						}
						saleDetail[k] = tempText;
					}
				});
				
				if(saleDetail.E === '' || saleDetail.F === '' || saleDetail.G === '' || saleDetail.H === ''
					|| saleDetail.I === '' || saleDetail.J === '' || saleDetail.K === ''){
					dataErrMsgs.push('第'+(Number(i)+1)+'行的订单价格、快递费用、其他费用、总成本、销售金价格、商品数量、毛利率不能为空，请重新整理后再操作');
					dataErrFlag = true;
				}
				
				if(saleDetail.A == ''){
					dataErrMsgs.push('第'+(Number(i)+1)+'行的回收单号不允许为空，请重新整理后再操作');
					dataErrFlag = true;
				}
				if($.inArray(saleDetail.A, recyOrderList) > -1){
					dataErrMsgs.push('第'+(Number(i)+1)+'行的回收单号不允许重复，请重新整理后再操作');
					dataErrFlag = true;
				}
				//临时数组保存回收单
				recyOrderList.push(saleDetail.A);
				
				//商品数量
				if(saleDetail.J != 1){
					dataErrMsgs.push('第'+(Number(i)+1)+'行的商品数量必须是1，请重新整理后再操作');
					dataErrFlag = true;
				}
				
				if(saleDetail.P != '个人' && saleDetail.P != '回收商'){//销售渠道
					alert('销售渠道异常：必须是【个人】或【回收商】');
					dataErrFlag = true;
					return;
				}
				
				if(saleDetail.Q == ''){//购买方不能为空
					alert('购买方姓名不允许为空');
					dataErrFlag = true;
					return;
				}
				
				if(saleDetail.P == '回收商' && $.inArray(saleDetail.Q, partners) < 0){
					dataErrMsgs.push('第'+(Number(i)+1)+'行的回收商无效，请重新整理后再操作');
					dataErrFlag = true;
				}
				
				//商品来源
				saleDetail.N = '仓库';

				//金额判断
//				if((Number(saleDetail.E)*100 + Number(saleDetail.F)*100 + Number(saleDetail.G)*100) != Number(saleDetail.H)*100){
//					alert(Number(saleDetail.E)*100+Number(saleDetail.F)*100+Number(saleDetail.G)*100 == Number(saleDetail.H)*100);
//					dataErrMsgs.push('第'+(Number(i)+1)+'行总成本异常，请重新整理后再操作'+'_'+(Number(saleDetail.E)*100+Number(saleDetail.F)*100+Number(saleDetail.G)*100)+'_'+Number(saleDetail.H)*100);
//					dataErrFlag = true;
//				}
				
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
				detailList.push(saleDetail);
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
					if(index < 20){
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
});

/**
 * 提交数据
 * @returns
 */
function submitData(){
	saleBillInfo = saleBillInfoInit();
	if(dataErrFlag){
		alert('导入数据不规范，请重新整理后再保存');
		return;
	}
	
    var saleDetails = [];
    $('#excelBody tr.tr').each(function(i){
    	var saleDetail = {};
        var param = {}, thisTd = $('td', $(this));
        saleDetail.recyOrderNo = thisTd.eq(1).html();//回收单号
        saleDetail.saleDate = thisTd.eq(2).html();//销售日期
        saleDetail.categoryName = thisTd.eq(3).html();//品类名称
        saleDetail.productName = thisTd.eq(4).html();//产品名称
        saleDetail.recyPrice = thisTd.eq(5).html();//回收金额
        saleDetail.expressPrice = thisTd.eq(6).html();//快递费用
        saleDetail.otherPrice = thisTd.eq(7).html();//其他费用
        saleDetail.costPrice = thisTd.eq(8).html();//总成本
        saleDetail.salePrice = thisTd.eq(9).html();//销售价格
        saleDetail.saleCount = thisTd.eq(10).html();//数量
        saleDetail.profitRate = thisTd.eq(11).html();//毛利率
        saleDetail.brokerageWay = thisTd.eq(12).html();//提成方式
        saleDetail.brokeragePrice = thisTd.eq(13).html();//提成金额
        saleDetail.productSource = thisTd.eq(14).html();//商品来源
        saleDetail.sponsor = thisTd.eq(15).html();//负责人
        saleDetail.saleChannel = thisTd.eq(16).html();//销售渠道
        saleDetail.contacts = thisTd.eq(17).html();//联系人
        saleDetail.mobile = thisTd.eq(18).html();//联系电话
        saleDetail.remark = thisTd.eq(19).html();//备注
        
    	if(i == 0){
    		saleBillInfo.saleDate = saleDetail.saleDate;
    		saleBillInfo.saler = saleDetail.sponsor;
    	}
    	saleBillInfo.totalCount = Number(saleBillInfo.totalCount) + Number(saleDetail.saleCount);
    	saleBillInfo.recyAmount = Number(saleBillInfo.recyAmount) + Number(saleDetail.recyPrice);
    	saleBillInfo.expressAmount = Number(saleBillInfo.expressAmount) + Number(saleDetail.expressPrice);
    	saleBillInfo.otherAmount = Number(saleBillInfo.otherAmount) + Number(saleDetail.otherPrice);
    	saleBillInfo.costAmount = Number(saleBillInfo.costAmount) + Number(saleDetail.costPrice);
    	saleBillInfo.saleAmount = Number(saleBillInfo.saleAmount) + Number(saleDetail.salePrice);
        
        saleDetails.push(saleDetail);
    });
    
    if(saleDetails.length < 1){
    	alert('无效的销售数据，请重新上传..');
    	return;
    }
    
    var saleDetailsJson = JSON.stringify(saleDetails);
    
    $('#BtnsaveData').html('正在上传中，请稍后');
	$('#BtnsaveData').unbind('click');
    
    $.post('/sale/dailysale/saveimport', {saleBillInfo:saleBillInfo, saleDetails:saleDetailsJson}, function(data){
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
    			type:1, shade:false, title:false, area:['600px', '400px'],
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
