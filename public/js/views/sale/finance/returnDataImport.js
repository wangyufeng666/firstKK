String.prototype.replaceAll = function(s1, s2){ 
	return this.replace(new RegExp(s1, "gm"), s2); 
}
var returnBillInfo = {}, detailList = [], tempText='', recyOrderList = [];
$().ready(function(){
	$('#BtnsaveData').bind('click', function(){submitData();});
	$('#excelFile').change(function(e){
		detailList = [];
		recyOrderList = [];
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
						returnBillInfo.saleBillNo = $.trim(orderDataList[i].B);
						$('#returnBillInfo .td_saleBillNo').html(orderDataList[i].B);
					}else if(i == 1){//退货单号
						returnBillInfo.returnBillNo = $.trim(orderDataList[i].B);
						$('#returnBillInfo .td_returnBillNo').html(orderDataList[i].B);
					}else if(i == 2){//退货时间
						returnBillInfo.returnDate = $.trim(orderDataList[i].B);
						$('#returnBillInfo .td_returnDate').html(orderDataList[i].B);
					}else if(i == 3){//备注
						returnBillInfo.remark = $.trim(orderDataList[i].B);
						$('#returnBillInfo .td_remark').html(orderDataList[i].B);
					}else if(i > 4){//二级表头
						var returnDetail = {A:'', B:''}, dataErrFlag = false, dataErrMsgs = [];
						$.each(orderDataList[i], function(k, v){
							if(k in returnDetail){
								tempText = $.trim(v);
								tempText = tempText.replaceAll(/\n/g, "");
								tempText = tempText.replaceAll(/\r\n/g, "");
								
								if(tempText.indexOf(' ') > -1){
									dataErrMsgs.push('第'+(Number(i)+3)+'行的第'+k+'列，数据存在空格，请重新整理后再操作');
									dataErrFlag = true;
								}
								returnDetail[k] = tempText;
							}
						});
						
						//二手电商和品类销售，回收单号不允许为空
						if(returnDetail.A == ''){
							dataErrMsgs.push('第'+(Number(i)+3)+'行的回收单号不允许为空，请重新整理后再操作');
							dataErrFlag = true;
						}
						if($.inArray(returnDetail.A, recyOrderList) > -1){
							dataErrMsgs.push('第'+(Number(i)+3)+'行的回收单号不允许重复，请重新整理后再操作');
							dataErrFlag = true;
						}
						recyOrderList.push(returnDetail.A);
						
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
						
						detailList.push(returnDetail);
					}
				}
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
					if(index < 3){
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

function submitData(){
	if($.isEmptyObject(returnBillInfo)){
		alert('无效的销售数据，请重新上传.');
		return;
	}
	
    var returnDetails = [];
    $('#excelBody tr').each(function(i){
    	var returnDetail = {};
        var param = {}, thisTd = $('td', $(this));
        returnDetail.recyOrderNo = thisTd.eq(1).html();
        returnDetail.remark = thisTd.eq(2).html();
        returnDetails.push(returnDetail);
    });
    
    if(returnDetails.length < 1){
    	alert('无效的销售数据，请重新上传..');
    }
    
    $('#BtnsaveData').html('正在上传中，请稍后');
	$('#BtnsaveData').unbind('click');

    var returnDetailsJson = JSON.stringify(returnDetails);
    
    $.post('/recycle/salebill/savereturnimport', {returnBillInfo:returnBillInfo, returnDetails:returnDetailsJson}, function(data){
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
    				msg += '<div style="padding:2px;">'+errMsgs[i]+'</div>';
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
