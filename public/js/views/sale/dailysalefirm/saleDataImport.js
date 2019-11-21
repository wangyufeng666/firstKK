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
			}else if(orderDataList.length > 202){
				alert('单次导入销售明细数量不允许超过200个，请分批次导入');
				return;
			}
			for(var i in orderDataList){
				if(i == 0){//销售单号
					continue;
				}

				var saleDetail = {A:'',B:'',C:'',D:'',E:'',F:'',G:'',H:'',I:'',J:'',K:'',L:'',M:'',N:'',O:'',P:'',Q:'',R:''};
				$.each(orderDataList[i], function(k, v){
					if(k in saleDetail){
						tempText = $.trim(v);
						tempText = tempText.replaceAll(/\n/g, "");
						tempText = tempText.replaceAll(/\r\n/g, "");
						console.log(v)
						if(k){
							saleDetail[k] = tempText;
						}else {
							saleDetail[T] = tempText;
						}
					}
				});


				if(saleDetail.A === '' || saleDetail.B === '' || saleDetail.E === '' || saleDetail.F === ''
					|| saleDetail.G === '' || saleDetail.H === '' || saleDetail.J === ''|| saleDetail.K === ''){
					dataErrMsgs.push('第'+(Number(i)+1)+'行的完成日期,客户名称,客户省份,客户城市,所属BD,品类,数量,销售总价,回收总价不能为空，请重新整理后再操作');
					dataErrFlag = true;
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
					if(index < 25){
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
		var saledetailkey = [
			"SALEDATE",
			"FIRM_NAME",
			"CONTACTS",
			"MOBILE",
			"PROVINCE",
			"CITY",
			"SPONSOR",
			"CATEGORYNAME",
			"SALE_COUNT",
			"SALE_PRICE",
			"RECY_PRICE",
			"RECY_PROFIT",
			"EXPRESS_PRICE",
			"BROKERAGE_PRICE",
			"OTHER_PRICE",
			"TAX_FEE",
			"FIRM_PROFIT",
			"REMARK",
		];
		$.each(saledetailkey, function(k, value){
			saleDetail[value] = thisTd.eq(k+1).html();
		})
        saleDetails.push(saleDetail);
    });
    
    if(saleDetails.length < 1){
    	alert('无效的销售数据，请重新上传..');
    	return;
    }
    
    var saleDetailsJson = JSON.stringify(saleDetails);
    
    //$('#BtnsaveData').html('正在上传中，请稍后');
	$('#BtnsaveData').unbind('click');
    
    $.post('/sale/dailysalefirm/saveimport', {saleBillInfo:saleBillInfo, saleDetails:saleDetailsJson}, function(data){
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
