var grid, layerIndex = 0;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'30px',sortable:false}
			,{header:"所属分部", dataIndex:'COMPANYNAME', width:'100px',sortable:false}
			,{header:"门店名称", dataIndex:'PARTNERNAME', width:'100px',sortable:false}
			,{header:"批次编号", dataIndex:'BATCHCODE', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var batchCode = data['BATCHCODE'];
					return '<a href="javascript:showRemark(\''+batchCode+'\')" class="a_link">'+batchCode+'</a>';
				}
			}
			,{header:"取件方式", dataIndex:'', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var text = '顺丰快递';
					var expressNum = data['EXPRESSNUM'];
					if(expressNum.length == '17'){
						text = '上门取件';
					}
					return text;
				}
			}
			,{header:"商品总数", dataIndex:'COUNTS', width:'30px',sortable:false}
			,{header:"出库单号", dataIndex:'MAILNO', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var batchCode = data['BATCHCODE'];
					var mailNo = data['MAILNO'] ? data['MAILNO'] : data['EXPRESSNUM'];
					return '<a href="javascript:showOperation(\''+batchCode+'\')" class="a_link">'+mailNo+'</a>';
				}
			}
			,{header:"快递单号", dataIndex:'EXPRESSNUM', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:searchSF(\''+data['EXPRESSNUM']+'\',\''+data['BATCHCODE']+'\')" class="a_link">'+data['EXPRESSNUM']+'</a>';
				}
			}
			,{header:"出库申请人", dataIndex:'CKNAME', width:'70px',sortable:false}
			,{header:"出库申请时间", dataIndex:'CREATEDATE', width:'80px',sortable:false}
			,{header:"出库日期", dataIndex:'OUTWAREDATE', width:'80px',sortable:false}
			,{header:"出库状态", dataIndex:'GOMESTORAGENAME', width:'70px',sortable:false}
			,{header:"收货人", dataIndex:'SHNAME', width:'70px',sortable:false}
			,{header:"实际收货数量", dataIndex:'SURECOUNTS', width:'50px',sortable:false}
			,{header:"收货日期", dataIndex:'SHDATE', width:'100px',sortable:false}
			,{header:"收货状态", dataIndex:'ISSURETXT', width:'60px',sortable:false}
			,{header:"操作", dataIndex:'', width:'180px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var batchcode = data['BATCHCODE'];
					var expressNum = data['EXPRESSNUM'];
					var counts = data['COUNTS'];
					var outWareDate = data['OUTWAREDATE'];
					var errorFlag = data['ERRORFLAG'];
					var visitFlag = data['VISITFLAG'];
					var sureCounts = data['SURECOUNTS'];
					var shDate = data['SHDATE'];
					var returnText = '<a href="javascript:getinfo(\''+expressNum+'\', \''+visitFlag+'\')" class="a_link">查看</a>';
					if(data['ISSURE'] == '1'){
						if(outWareDate){
							// returnText += ' | <a href="javascript:updateStatus(\''+batchcode+'\',\''+counts+'\')" class="a_link">收货</a>';
						}
						//if(errorFlag && !outWareDate && expressNum.length < '17'){
						if(expressNum.length < '17'){
							returnText += ' | <a href="javascript:cxkd(\''+batchcode+'\')" class="a_link">重叫快递</a>';
						}
						//outWareDate：出库日期 sureCounts：实际收货数量 shDate：收货时间 
						if(!outWareDate && !sureCounts && !shDate){
							returnText += ' | <a href="javascript:againPush(\''+batchcode+'\')" class="a_link">重推数据</a>';
						}
					}
					returnText += ' | <a href="javascript:addRemark(\''+batchcode+'\')" class="a_link">添加备注</a>';
					return returnText;
				}
			}
		]
		,url:'/order/gomestore/storagetempbcpage'
		,baseParams:initParams()
		,afterRender:function(){
			layer.close(layerIndex);
		}
		,pageSizeList:[15,30,50]
	});

	//出库申请日期
	$('#startDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	

	//出库日期
	$('#outStartDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#outEndDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});

	//收货日期
	$('#shDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endShDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
});


function initParams(){
	return getParams();
}

/**
 * 省份初始化
 * @return
 */
function initProvinces(){
	$.ajax({type:'POST', dataType:'jsonp', jsonp:'jsonp_callback',
		url:openApiDomain+'/recycle/area/provinces',
		success:function(data){
			var optionsText = "<option value=''>请选择省份</option>";
			for(i in data){
				optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
			}
			$('#provinceId').html(optionsText);
		}
	});
}

/**
 * 省份change
 */
$("#provinceId").change(function(){
	var provinceId = $('#provinceId').val();
	var optionsText = "<option value=''>请选择城市</option>";
	if(provinceId != ""){
		$.ajax({type:'GET', dataType:'jsonp', jsonp:'jsonp_callback',
			data:{pid:provinceId},
			url:openApiDomain+'/recycle/area/citys',
			success:function(data){
				for(i in data){
					optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
				}
				$('#cityId').html(optionsText);
			}
		});
	}else{
		$('#cityId').html(optionsText);
	}
});

function getParams(){
	return {
		pName:$('#pName').val(),
		bcCode:$('#bcCode').val(),
		expressNo:$('#expressNo').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		outStartDate:$('#outStartDate').val(),
		outEndDate:$('#outEndDate').val(),
		shDate:$('#shDate').val(),
		endShDate:$('#endShDate').val(),
		visitFlag:$('#visitFlag').val() ? $('#visitFlag').val() : '3',
		isSure:$('#isSure').val(),
		inventoryStatus:$('#inventoryStatus').val(),
		quJianFlag:$('#quJianFlag').val(),
		companyName:$('#companyName').val(),
		branchCode:$('#branchCode').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

/*
 * 修改状态
 */
function updateStatus(batchcode, counts){
	sureCounts = prompt("请输入实际收货数量");
	if(sureCounts && sureCounts != '' && sureCounts != null){
		if(sureCounts == counts){
			$.post('/order/gomestore/updatetempbc',{batchcode:batchcode, sureCounts:sureCounts,go:'1'},function(data){
				if(data == 'Y'){
					alert('操作成功');
					grid.reload();
				}else{
					alert('操作失败');
				}
			})
		}else{
			if(confirm('实际收货数量与出库数量不一致，是否确认收货')){
				$.post('/order/gomestore/updatetempbc',{batchcode:batchcode, sureCounts:sureCounts,go:'1'},function(data){
					if(data == 'Y'){
						alert('操作成功');
						grid.reload();
					}else{
						alert('操作失败');
					}
				})
			}
		}
	}else{
		alert('请输入实际收货数量');
	}
}

/**
 * 重新叫快递
 */
function cxkd(batchcode){
	if(batchcode){
		if(confirm('是否确认重新叫快递？')){
			$.post('/order/gomestore/cxkd',{batchCode:batchcode},function(data){
				if(data == 'Y'){
					alert('操作成功');
					grid.reload();
				}else{
					alert('操作失败');
				}
			})
		}
	}
}

/**
 * 重新推送出库记录
 * @returns
 */
function againPush(batchcode){
	if(confirm('是否确认重新推送？')){
		$.post('/order/gomestore/againpushinware',{batchCode:batchcode},function(data){
			if(data.code == '200'){
				alert(data.msg);
				grid.reload();
			}else{
				alert(data.msg);
			}
		})
	}	
}

/*
 * 导出数据
 */
function doExport(){
	var visitFlag = $('#visitFlag').val() ? $('#visitFlag').val() : '3';
	var param = {};
	param.pName = $('#pName').val();
	param.bcCode = $('#bcCode').val();
	param.expressNo =  $('#expressNo').val();
	param.startDate =  $('#startDate').val();
	param.endDate =  $('#endDate').val();
	param.outStartDate =  $('#outStartDate').val();
	param.outEndDate =  $('#outEndDate').val();
	param.shDate =  $('#shDate').val();
	param.endShDate =  $('#endShDate').val();
	param.isSure =  $('#isSure').val();
	param.inventoryStatus =  $('#inventoryStatus').val();
	param.visitFlag =  visitFlag;
	param.companyName =  $('#companyName').val();
	param.branchCode =  $('#branchCode').val();
	param.provinceId =  $('#provinceId').val();
	param.cityId =  $('#cityId').val();
	window.location.href = '/order/gomestore/storagetempbcexport?'+$.param(param);
	return false; //截取返回false就不会保存网页了
}

/*
 * 查看详情
 */
function getinfo(expressNum, visitFlag){
	var expressNum = expressNum ? expressNum : '';
	var url = visitFlag == 1 ? "/order/gomestore/orderstorage?expressNum="+expressNum+"&visitFlag=1" : "/order/gomestore/orderstorage?expressNum="+expressNum;
	layer.open({
		type:2,
		title:'查看信息',
		content:url,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 顺丰路由查询
 */
function searchSF(expressNum, batchCode){
	if(expressNum){
		var url = "/order/gomestore/searchsf?expressNum="+expressNum+'&batchCode='+batchCode;
		layer.open({
			type:2,
			title:'顺丰路由信息',
			content:url,
			area:['850px', '500px'],
			close:function(index){
				layer.close(index);
			}
		});
	}else{
		alert('快递单号不存在，无法查询');
	}
}

/**
 * 添加备注
 */
function addRemark(batchcode){
	var remark = prompt('请输入备注');
	if(remark && remark != null && remark != ''){
		$.post('/order/gomestore/addremark',{remark:remark, batchCode:batchcode},function(data){
			if(data == 'Y'){
				alert('保存成功');
				doSearch();
			}else{
				alert('操作错误，请重新备注');
			}
		})
	}else{
		alert('请输入备注');
	}
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(batchcode){
	layer.close(layerIndex);
	$.post('/order/gomestore/jsonremark',{batchCode:batchcode}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', '400px'],
			content:'<div class="layer_notice">'+batchcode+'<br/>'+data+'</div>'
		});
	});
}

/**
 * 展示操作人信息
 * @param batchcode
 */
function showOperation(batchcode){
    layer.close(layerIndex);
    $.post('/order/gomestore/showoperation',{batchCode:batchcode}, function(data){

        layerIndex = layer.open({
            type:1, shade:false, title:false, area:['650px', '400px'],
            content:'<div class="layer_notice">检测师信息<br/>'+data+'</div>'
        });
    });
}