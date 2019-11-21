$().ready(function(){
	$('#BtnsaveData').bind('click', function(){submitData();});
	
	$('#excelFile').change(function(e){
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
			var saleOrderInfo = {}, detailList = [], tempText='';
			//销售单信息
			if(orderDataList.length > 0){
				for(var i in orderDataList){
					if(i == 0){//销售单号
						saleOrderInfo.orderNo = orderDataList[i].B;
					}else if(i == 1){//销售部门
						saleOrderInfo.deptName = orderDataList[i].B;
					}else if(i == 2){//销售人
						saleOrderInfo.saler = orderDataList[i].B;
					}else if(i == 3){//商品数量
						saleOrderInfo.counts = orderDataList[i].B;
					}else if(i == 4){//采购价
						saleOrderInfo.costAmount = orderDataList[i].B;
					}else if(i == 5){//销售总价
						saleOrderInfo.saleAmount = orderDataList[i].B;
					}else if(i == 6){//其他费用
						saleOrderInfo.otherAmount = orderDataList[i].B;
					}else if(i == 7){//收款方式
						saleOrderInfo.payType = orderDataList[i].B;
					}else if(i == 8){//销售时间
						saleOrderInfo.saleDate = orderDataList[i].B;
					}else if(i == 9){//备注
						saleOrderInfo.remark = orderDataList[i].B;
					}else if(i > 10){//二级表头
						var saleDetail = {A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:''};
						$.each(orderDataList[i], function(k, v){
							tempText = $.trim(v);
							tempText = tempText.replaceAll(/\n/g, "");
							saleDetail[k] = tempText.replaceAll(/\r\n/g, "");
						});
						detailList.push(saleDetail);
					}
				}
			}
			
			if(detailList.length > 0){
				//清空表格
				$("#excelBody").html("");
				var tdHtml = '';
				for(var j = 0; j < detailList.length; j++){
					var detail = detailList[j], tdHtml = '<td>'+(j+1)+'</td>';
					for(var i in detail){
						tdHtml += "<td>"+($.trim(detail[i]))+"</td>";
					}
					$("#excelBody").append('<tr class="tr">'+tdHtml+'</tr>');
				}
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
	
	/**
	 *  选择csv文件获取信息

	$('#excelFile').change(function(e){
		$("input[name=excelFile]").csv2arr(function(arr){
			var tblStr = "";
			$.each(arr, function(i, line){
				if(i != 0){
					tblStr += "<tr>";
					tblStr += "<td>"+i+"</td>";
					tblStr += "<td>"+line[0]+"</td>";
					tblStr += "<td>"+line[1]+"</td>";
					tblStr += "<td>"+line[2]+"</td>";
					tblStr += "<td>"+line[3]+"</td>";
					tblStr += "<td>"+line[4]+"</td>";
					tblStr += "<td>"+line[5]+"</td>";
					tblStr += "<td>"+line[6]+"</td>";
					tblStr += "<td>"+line[7]+"</td>";
					tblStr += "<td>"+line[8]+"</td>";
					tblStr += "<td>"+line[9]+"</td>";
					tblStr += "<td>"+line[10]+"</td>";
					tblStr += "<td>"+line[11]+"</td>";
					tblStr += "</tr>";
				}
			});
			$("#excelBody").html(tblStr);
			$("#excelFile").val(''); // 选择同个文件内容重新加载
		});
	});*/
});

function submitData(){
	var businessType = $('#businessType').val();
	$('#BtnsaveData').unbind('click');
    var params = [];
    $('#excelBody tr').each(function(i){
        var param = {}, thisTd = $('td', $(this));
        param.saleNo = thisTd.eq(1).html();
        param.saleBranch = thisTd.eq(2).html();
        param.salesperson = thisTd.eq(3).html();
        param.commoditySum = thisTd.eq(4).html();
        param.purchasePrices = thisTd.eq(5).html();
        param.salePrices = thisTd.eq(6).html();
        param.otherPrices = thisTd.eq(7).html();
        param.profitRates = thisTd.eq(8).html();
        param.receivablesType = thisTd.eq(9).html();
        param.saleDate = thisTd.eq(10).html();
        param.remark1 = thisTd.eq(11).html();
        param.remark2 = thisTd.eq(12).html();
        //params.push(param);
        params[i] = param;
    });

    var paramsJson = JSON.stringify(params);
    if(businessType == '' || businessType == null){
		alert('请选择业务类型');
		$('#BtnsaveData').bind('click', function(){submitData();});
	}else if(params.length > 0){
        $('#BtnsaveData').html('正在上传中，请稍后');
        $.post('/recycle/salebill/saveimport?businessType='+businessType+'&classify='+classify+'&xsspost='+xsspost, {params:paramsJson}, function(data){
            if(data.code == 'Y'){
                $('#BtnsaveData').html('保存');
                alert('数据提交成功');
                parent.reload();
            }else{
                $('#BtnsaveData').html('保存');
                var msg = '<div style="text-align:center;font-size:14px;margin:15px 0px;color:red;">'+data.msg+'</div>';
                if(data.data != 0){
                	msg += '<div style="border-bottom:1px dotted #999">';
        			msg += '<span style="display:inline-block;width:100px;margin-right:20px">序号</span>';
        			msg += '<span style="display:inline-block;width:150px;margin-right:20px">订单编号</span>';
        			msg += '<span style="display:inline-block;width:150px;margin-right:20px;">销售时间</span></div>';
        			for(var i in data.data){
        				msg += '<div style="border-bottom:1px dotted #999">';
        				msg += '<span style="display:inline-block;width:100px;margin-right:20px">'+data.data[i].NUMBER+'</span>';
        				msg += '<span style="display:inline-block;width:150px;margin-right:20px">'+data.data[i].ORDERNO+'</span>';
        				msg += '<span style="display:inline-block;width:150px;margin-right:20px;">'+data.data[i].SALEDATE+'</span>';
        				msg += '</div>';
        			}
                }
        		var layerIndex = layer.open({
        			type:1, shade:false, title:false, area:['480px', 'auto'],
        			content:'<div class="layer_notice">'+msg+'</div>'
        		});
            	$('#BtnsaveData').bind('click', function(){submitData();});
            }
        },'json');
    }else{
        alert('无效的数据信息，请重新选择数据文件');
    	$('#BtnsaveData').bind('click', function(){submitData();});
    }
}
String.prototype.replaceAll = function(s1, s2){ 
	return this.replace(new RegExp(s1, "gm"), s2); 
}