
$(document).ready(function () {

	formSelects.data('merTypeOpt', 'server', {
		url: '/recycle/warehouse/mertypes'
	});//品类
	formSelects.btns('merTypeOpt', ['select', 'remove', 'reverse']);
	//品牌
	formSelects.btns('merBrandOpt', ['select', 'remove', 'reverse']);
	//型号
	formSelects.btns('merNameOpt', ['select', 'remove', 'reverse']);

	//监听品类事件
	var onMerType;
	formSelects.on('merTypeOpt', function(){
		onMerType = formSelects.value('merTypeOpt', 'val');
		if(onMerType.length == 0){
			getBrandsInit();
		}else{
			getMerBrandOpt(onMerType);
		}
		getModelInit();
	}, true);
	//监听品牌事件
	var onMerBrands;
	formSelects.on('merBrandOpt', function(){
		onMerBrands = formSelects.value('merBrandOpt', 'val');
		if(onMerBrands.length == 0){
			getModelInit();
		}else{
			getMerNameOpt(onMerType,onMerBrands)
		}
	}, true);

});
//联动获取品牌
function getMerBrandOpt(onMerType){
	formSelects.data('merBrandOpt', 'server', {
		url: '/recycle/warehouse/merbrands?merTypes='+onMerType
	});//品牌
	formSelects.btns('merBrandOpt', ['select', 'remove', 'reverse']);
}
//联动获取型号
function getMerNameOpt(onMerType,onMerBrands){
	formSelects.data('merNameOpt', 'server', {
		url: '/recycle/warehouse/mermodels?merTypes='+onMerType+'&merBrand='+onMerBrands
	});//型号
	formSelects.btns('merNameOpt', ['select', 'remove', 'reverse']);
}

//品牌初始化为空值
function getBrandsInit(){
	formSelects.data('merBrandOpt', 'local', {
		arr: []
	});
}

//型号初始化为空值
function getModelInit(){
	formSelects.data('merNameOpt', 'local', {
		arr: []
	});
}

//列数据
$('.set-td-nav span').click(function(){
	var id = $(this).attr('data-id');
	id--;
	$('.set-td-nav2').css('display','none');
	$('.set-td-nav2').eq(id).css('display','block');
	$('.set-td-nav div').removeClass('selected');
	$(this).parent('div').addClass('selected');
});
//列数据二级
$('.set-td-nav2 input:checkbox').click(function(){
	var text = '';
	if($(this).is(':checked')){
		$('.set-tr-nav2').find('input:checkbox').removeAttr('checked');
		$('.set-td-nav2').find('input:checkbox').removeAttr('checked');
		$(this).attr('checked','checked');
		text = $(this).siblings('label').text();
	}
	var index = $(this).parents('.set-td-nav2').index();
	index--;
	if(text){
		$('.set-td-nav span').removeClass('nav-on-blue');
		$('.set-td-nav span').eq(index).addClass('nav-on-blue');
	}else{
		if(index == '0'){
			text = '商品 ▼';
		}else if(index == '1'){
			text = '渠道来源 ▼';
		}else if(index == '2'){
			text = '日期时间 ▼';
		}
		$('.set-td-nav span').removeClass('nav-on-blue');
	}
	$('.set-tr-nav span').removeClass('nav-on-blue');
	$('.set-td-nav span').eq(index).text(text);
});

//行数据
$('.set-tr-nav span').click(function(){
	var id = $(this).attr('data-id');
	id--;
	$('.set-tr-nav2').css('display','none');
	$('.set-tr-nav2').eq(id).css('display','block');
	$('.set-tr-nav span').removeClass('selected');
	$(this).addClass('selected');
});
//行数据二级
$('.set-tr-nav2 input:checkbox').click(function(){
	var text = '';
	var val = '';
	if($(this).is(':checked')){
		$('.set-tr-nav2').find('input:checkbox').removeAttr('checked');
		$('.set-td-nav2').find('input:checkbox').removeAttr('checked');
		$(this).attr('checked','checked');
		text = $(this).siblings('label').text();
	}
	var index = $(this).parents('.set-tr-box').index();
	index--;
	if(text){
		$('.set-tr-nav span').removeClass('nav-on-blue');
		$('.set-tr-nav span').eq(index).addClass('nav-on-blue');
	}else{
		if(index == '0'){
			text = '商品 ▼';
		}else if(index == '1'){
			text = '渠道来源 ▼';
		}else if(index == '2'){
			text = '日期时间 ▼';
		}
		$('.set-tr-nav span').removeClass('nav-on-blue');
	}
	$('.set-td-nav span').removeClass('nav-on-blue');
	$('.set-tr-nav span').eq(index).text(text);
});


var paramData = [];
var totalNum = [];
// 搜索ifbox
var param = {};
var params = '';
$('#search_btn').click(function(){
	// 数据展示类型

	var chartType = $('input[name^="chartType"]:checked').val();

	// 时间段
	param.startDate = $('#startDate').val();
	param.endDate = $('#endDate').val();
	if(!param.startDate || !param.endDate){
		alert('起止时间不能为空');
		return false;
	}
	// 品类
	param.merTypeOpt = [];
	param.merTypeOpt = formSelects.value('merTypeOpt', 'val');
	// 品牌
	param.merBrandOpt = [];
	param.merBrandOpt = formSelects.value('merBrandOpt', 'val');
	// 型号
	param.merNameOpt = [];
	param.merNameOpt = formSelects.value('merNameOpt', 'val');
	// 回收商-来源
	// param.merSourceOpt = [];
	param.type = $('#merSourceOpt option:selected').val();


	var trtdFlag = '';
	// 列数据
	param.tdnav2 = [];
	$('input[name^="td_nav2"]:checked').each(function(i) {
		param.tdnav2[i] = $(this).val();
		trtdFlag = '2';
	});
	if(param.tdnav2.length == 0){
		//alert('请选择列数据');
		//return false;

	}
	//param['tdnav2'] = tdnav2;
	// 行数据
	param.trnav2 = [];
	$('input[name^="tr_nav2"]:checked').each(function(i) {
		param.trnav2[i] = $(this).val();
		trtdFlag = '1';
	});
	if(param.trnav2.length == 0){
		//alert('请选择行数据');
		//return false;

	}
	//版本一：
	if(param.tdnav2.length == 0 && param.trnav2.length == 0){
		alert('请选择行或者列数据');
		return false;
	}
	//param['trnav2'] = trnav2;
	// 指标
	param.norm = [];
	$('input[name^="ele_nav"]:checked').each(function(i) {
		param.norm[i] = $(this).val();
	});
	if(param.norm.length == 0){
		alert('请选择数据指标');
		return false;
	}
	params =encodeURIComponent(JSON.stringify(param));

	$.ajax({
		type: "POST",
		url: "/recycle/warehouse/warehousedata",
		data: {param:param},
		dataType: "json",
		timeout: 30000,
		cache: false,
		async: false,
		success: function (data) {
			paramData = data.result;
			totalNum = data.totalNum;
			chartShow(chartType, paramData, trtdFlag, param.norm,totalNum);
		}
	});
});

// 图表样式
$('input[name="chartType"]').click(function(){
	var chartType = $(this).val();
	var trtdFlag = '';
	// 列数据
	$('input[name^="td_nav2"]:checked').each(function(i) {
		trtdFlag = '2';
	});
	// 行数据
	$('input[name^="tr_nav2"]:checked').each(function(i) {
		trtdFlag = '1';
	});
	// 指标
	var norm = [];
	$('input[name^="ele_nav"]:checked').each(function(i) {
		norm[i] = $(this).val();
	});
	chartShow(chartType,paramData, trtdFlag, norm,totalNum);
})
function chartShow(chartType, paramData, trtdFlag, norm,totalNum){
	if(chartType == '1'){
		dataTable(paramData, trtdFlag, norm,totalNum);
	}else if(chartType == '2'){
		dataLine(paramData, trtdFlag, norm);
	}else if(chartType == '3'){
		dataColumn(paramData, trtdFlag, norm);
	}else if(chartType == '4'){
		dataPie(paramData, trtdFlag, norm);
	}else if(chartType == '5'){
		dataPies(paramData, trtdFlag, norm);
	}else if(chartType == '6'){
		dataMap(paramData, trtdFlag, norm);
	}
}
//表格
function dataTable(paramData, trtdFlag, norm,totalNum){
	var html ='';
	if(trtdFlag == '1'){
		// trSum = getTrTotalSum(paramData);
		html += '<div id="tablecon"><table class="form-table"  cellpadding="0" cellspacing="0" id="tableDate" >';
		html += '<thead class="fixed-thead"><tr class="th_title">';
		html += '<th> </th>';
		if($.inArray("1", norm) >= '0'){
			html += '<th>入库数</th>';
		}
		if($.inArray("2", norm) >= '0'){
			html += '<th>入库金额</th>';
		}
		if($.inArray("3", norm) >= '0'){
			html += '<th>出库数</th>';
		}
		if($.inArray("4", norm) >= '0'){
			html += '<th>出库金额</th>';
		}
		if($.inArray("5", norm) >= '0'){
			html += '<th>库存数</th>';
		}
		if($.inArray("6", norm) >= '0'){
			html += '<th>库存金额</th>';
		}
		if($.inArray("7", norm) >= '0'){
			html += '<th>超时在库数</th>';
		}
		if($.inArray("8", norm) >= '0'){
			html += '<th>超时在库金额</th>';
		}
		if($.inArray("9", norm) >= '0'){
			html += '<th>销售周转率%</th>';
		}
		if($.inArray("10", norm) >= '0'){
			html += '<th>销售周转天数</th>';
		}
		if($.inArray("11", norm) >= '0'){
			html += '<th>库存周转率%</th>';
		}
		if($.inArray("12", norm) >= '0'){
			html += '<th>库存周转天数</th>';
		}
		html += '</tr></thead><tbody class="scroll-tbody">';
		for(var i in paramData){
			if (paramData[i].key != '总计') {
				html += '<tr>';
				html += '<td class="right" title='+paramData[i].key+'>'+paramData[i].key+'</td>';
				if($.inArray("1", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].INSTOCKNUM+' onclick="trToDetail(\''+paramData[i].key+'\',1)" >'+paramData[i].INSTOCKNUM+'</td>';
				}
				if($.inArray("2", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].INSTOCKAMOUNT+' onclick="trToDetail(\''+paramData[i].key+'\',2)" >'+paramData[i].INSTOCKAMOUNT+'</td>';
				}
				if($.inArray("3", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].OUTSTOCKNUM+' onclick="trToDetail(\''+paramData[i].key+'\',3)" >'+paramData[i].OUTSTOCKNUM+'</td>';
				}
				if($.inArray("4", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].OUTSTOCKAMOUNT+' onclick="trToDetail(\''+paramData[i].key+'\',4)" >'+paramData[i].OUTSTOCKAMOUNT+'</td>';
				}
				if($.inArray("5", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].ATSTOCKNUM+' onclick="trToDetail(\''+paramData[i].key+'\',5)" >'+paramData[i].ATSTOCKNUM+'</td>';
				}
				if($.inArray("6", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].ATSTOCKAMOUNT+' onclick="trToDetail(\''+paramData[i].key+'\',6)" >'+paramData[i].ATSTOCKAMOUNT+'</td>';
				}
				if($.inArray("7", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].OVERSTOCKNUM+' onclick="trToDetail(\''+paramData[i].key+'\',7)" >'+paramData[i].OVERSTOCKNUM+'</td>';
				}
				if($.inArray("8", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].OVERSTOCKAMOUNT+' onclick="trToDetail(\''+paramData[i].key+'\',8)" >'+paramData[i].OVERSTOCKAMOUNT+'</td>';
				}
				if($.inArray("9", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].STOCKTURNOVERRATE+'>'+paramData[i].STOCKTURNOVERRATE+'</td>';
				}
				if($.inArray("10", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].STOCKTURNOVERNUM+' onclick="trToDetail(\''+paramData[i].key+'\',10)" >'+paramData[i].STOCKTURNOVERNUM+'</td>';
				}
				if($.inArray("11", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].TURNOVERRATE+'>'+paramData[i].TURNOVERRATE+'</td>';
				}
				if($.inArray("12", norm) >= '0'){
					html += '<td class="right pointer" title='+paramData[i].TURNOVERNUM+' >'+paramData[i].TURNOVERNUM+'</td>';
				}
				html += '</tr>';
			}
		}
		html += '</tbody><tfoot class="fixed-tfoot"><tr class="th_title">';
		html += '<td class="right">'+totalNum.COUNT.key+'</td>';
		if($.inArray("1", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.INSTOCKNUM+'>'+totalNum.COUNT.INSTOCKNUM+'</td>';
		}
		if($.inArray("2", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.INSTOCKAMOUNT+'>'+totalNum.COUNT.INSTOCKAMOUNT+'</td>';
		}
		if($.inArray("3", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.OUTSTOCKNUM+'>'+totalNum.COUNT.OUTSTOCKNUM+'</td>';
		}
		if($.inArray("4", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.OUTSTOCKAMOUNT+'>'+totalNum.COUNT.OUTSTOCKAMOUNT+'</td>';
		}
		if($.inArray("5", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.ATSTOCKNUM+'>'+totalNum.COUNT.ATSTOCKNUM+'</td>';
		}
		if($.inArray("6", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.ATSTOCKAMOUNT+'>'+totalNum.COUNT.ATSTOCKAMOUNT+'</td>';
		}
		if($.inArray("7", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.OVERSTOCKNUM+'>'+totalNum.COUNT.OVERSTOCKNUM+'</td>';
		}
		if($.inArray("8", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.OVERSTOCKAMOUNT+'>'+totalNum.COUNT.OVERSTOCKAMOUNT+'</td>';
		}
		if($.inArray("9", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.STOCKTURNOVERRATE+'>'+totalNum.COUNT.STOCKTURNOVERRATE+'</td>';
		}
		if($.inArray("10", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.STOCKTURNOVERNUM+'>'+totalNum.COUNT.STOCKTURNOVERNUM+'</td>';
		}
		if($.inArray("11", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.TURNOVERRATE+'>'+totalNum.COUNT.TURNOVERRATE+'</td>';
		}
		if($.inArray("12", norm) >= '0'){
			html += '<td title='+totalNum.COUNT.TURNOVERNUM+'>'+totalNum.COUNT.TURNOVERNUM+'</td>';
		}

		html += '</tr></tfoot>';
		html += '</table></div>';
	}else if(trtdFlag == '2'){
		html += '<div id="tablecon"><table class="table table-con" id="tableDate" >';
		var j = 0;
		for(var s in paramData){
			j ++;
			if(j == 1){
				html += '<tr class="th_title">';
				html += '<td class="right" width="100"> </td>';
				for(var ss in paramData[s]){
					html += '<td class="td center" title='+ss+'>'+ss+'</td>';
				}
				html += '</tr>';
			}
		}
		var c = 0;

		for(var i in paramData){
			c ++;
			var d = c;
			d = d.toString();
			if($.inArray(d, norm) >= '0'){
				html += '<tr >';
				var iTxt = '';
				if(i == 'INSTOCKNUM'){
					iTxt = '入库数';
				}else if(i == 'INSTOCKAMOUNT'){
					iTxt = '入库金额';
				}else if(i == 'OUTSTOCKNUM'){
					iTxt = '出库数';
				}else if(i == 'OUTSTOCKAMOUNT'){
					iTxt = '出库金额';
				}else if(i == 'ATSTOCKNUM'){
					iTxt = '库存数';
				}else if(i == 'ATSTOCKAMOUNT'){
					iTxt = '库存金额';
				}else if(i == 'OVERSTOCKNUM'){
					iTxt = '超时在库数';
				}else if(i == 'OVERSTOCKAMOUNT'){
					iTxt = '超时在库金额';
				}else if(i == 'STOCKTURNOVERRATE'){
					iTxt = '销售周转率%';
				}else if(i == 'STOCKTURNOVERNUM'){
					iTxt = '销售周转天数';
				}else if(i == 'TURNOVERRATE'){
					iTxt = '库存周转率%';
				}else if(i == 'TURNOVERNUM'){
					iTxt = '库存周转天数';
				}else{
					iTxt = '总计';
				}
				html += '<td class="right">'+iTxt+'</td>';
				for(var ii in paramData[i]){
					if ( ii == '总计' || i == 'STOCKTURNOVERRATE' || i == 'TURNOVERRATE' || i == 'TURNOVERNUM'){
						html += '<td class="td center" title='+paramData[i][ii]+'>'+paramData[i][ii]+'</td>';
					}else{
						html += '<td class="td center pointer" title='+paramData[i][ii]+' onclick="tdToDetail(\''+ii+'\',\''+i+'\')" >'+paramData[i][ii]+'</td>';
					}
				}
				html += '</tr>';
			}
		}
		html += '</table></div>';
	}

	$('#container').html(html);
}

//折线图X坐标
function lineX(trtdFlag){
	var lineX = [];
	if(trtdFlag == '1'){
		for(var i in paramData){
			lineX[i] = lineX.push(i);
		}
	}else if(trtdFlag == '2'){
		for(var i in paramData){
			for(var j in paramData[i]){
				lineX[i] = lineX.push(j);
			}
		}
	}
	return lineX;
}
// 折线图
function dataLine(paramData, trtdFlag, norm){
	// Build the chart
	var chart1 = Highcharts.chart('container', {
		// 标题
		title: {
			text: ''
		},
		// 小标题/注释等
		subtitle: {
			text: '' // 小标题
		},
		// 版权信息
		credits: {
			enabled: false
		},
		// 打印导出配置
		exporting:{
			enabled:true, //导出安按钮
		},
		// 图表基础配置
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'line' // 图表类型 默认：spline（走势），line(折线)，column（柱状图），pie(饼图)
		},
		// 图例参数
		legend: {
			//floating:true,
			backgroundColor: '#FFFFFF',
			align: 'left',
			verticalAlign: 'top',
			x: 100,
			y: 0,
			//labelFormat: '<span style="{color}">{name} (click to hide or show)</span>'
		},
		// 数据颜色分布（默认样式这里可以重定义）
		colors: ['#7CB5EC','#ED561B','#FF9655',  '#DDDF00','#50B432','#F564ED',
			'#03F2E3','#17A0FA',  '#7648FF',  '#AAAAAA', '#604c4c' ,'#571616'],
		//数据提示框（默认样式这里可以重定义）
		tooltip: {
			//pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		// 图标类型参数
		plotOptions: {
			pie: {
				allowPointSelect: true,
				//cursor: 'pointer',
				dataLabels: {
					enabled: true   // 数据标题
				},
				showInLegend: true, // 图例展示开关
			}
		},
		// y轴
		yAxis: {
			title: {
				text: ''
			}
		},
		//x轴
		xAxis: {
			categories: lineX(trtdFlag), //x轴标签名称
			gridLineWidth: 0, //设置网格宽度为1
			lineWidth: 1,  //基线宽度
			labels:{y:26}  //x轴标签位置：距X轴下方26像素
		},
		// 数据列
		series: [
			{
				name: '入库数',
				data: []
			},{
				name: '入库金额',
				data:[],
				tooltip: {
					valueSuffix: ' 元' // 弹层value+制定字符串
				},
			},{
				name: '出库数',
				data:[]
			},{
				name: '出库金额',
				data:[],
				tooltip: {
					valueSuffix: '元' // 弹层value+制定字符串
				},
			},{
				name: '库存数',
				data:[]
			},{
				name: '库存金额',
				data:[],
			},{
				name: '超时在库数',
				data:[]
			},{
				name: '超时在库金额',
				data:[],
				tooltip: {
					valueSuffix: ' 元' // 弹层value+制定字符串
				},
			},{
				name: '销售周转率',
				data:[],
				tooltip: {
					valueSuffix: ' %' // 弹层value+制定字符串
				},
			},{
				name: '销售周转天数',
				data:[],
				tooltip: {
					valueSuffix: ' 天' // 弹层value+制定字符串
				},
			},{
				name: '库存周转率',
				data:[],
				tooltip: {
					valueSuffix: ' %' // 弹层value+制定字符串
				},
			},{
				name: '库存周转天数',
				data:[],
				tooltip: {
					valueSuffix: ' 天' // 弹层value+制定字符串
				},
			}
		],
	});

	// 动态更新数据
	var INSTOCKNUM = [];
	var INSTOCKAMOUNT = [];
	var OUTSTOCKNUM = [];
	var OUTSTOCKAMOUNT = [];
	var ATSTOCKNUM = [];
	var ATSTOCKAMOUNT = [];
	var OVERSTOCKNUM = [];
	var OVERSTOCKAMOUNT = [];
	var STOCKTURNOVERRATE = [];
	var STOCKTURNOVERNUM = [];
	var TURNOVERRATE = [];
	var TURNOVERNUM = [];
	if(trtdFlag == '1'){
		for(var i in paramData){
			var eData = {name:'入库数',y: parseInt(paramData[i].INSTOCKNUM),};
			INSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'入库金额',y: parseInt(paramData[i].INSTOCKAMOUNT),};
			INSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'出库数',y: parseInt(paramData[i].OUTSTOCKNUM),};
			OUTSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'出库金额',y: parseInt(paramData[i].OUTSTOCKAMOUNT),};
			OUTSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存数',y: parseInt(paramData[i].ATSTOCKNUM),};
			ATSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存金额',y: parseInt(paramData[i].ATSTOCKAMOUNT),};
			ATSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'超时在库数',y: parseInt(paramData[i].OVERSTOCKNUM),};
			OVERSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'超时在库金额',y: parseInt(paramData[i].OVERSTOCKAMOUNT),};
			OVERSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'销售周转率',y: parseInt(paramData[i].STOCKTURNOVERRATE),};
			STOCKTURNOVERRATE.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'销售周转天数',y: parseInt(paramData[i].STOCKTURNOVERNUM),};
			STOCKTURNOVERNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存周转率',y: parseInt(paramData[i].TURNOVERRATE),};
			TURNOVERRATE.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存周转天数',y: parseInt(paramData[i].TURNOVERNUM),};
			TURNOVERNUM.push(eData);
		}
	}else if(trtdFlag == '2'){
		for(var j in paramData['INSTOCKNUM']){
			var eData = {name:'入库数',y: parseInt(paramData['INSTOCKNUM'][j]),};
			INSTOCKNUM.push(eData);
		}
		for(var j in paramData['INSTOCKAMOUNT']){
			var eData = {name:'入库金额',y: parseInt(paramData['INSTOCKAMOUNT'][j]),};
			INSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['OUTSTOCKNUM']){
			var eData = {name:'出库数',y: parseInt(paramData['OUTSTOCKNUM'][j]),};
			OUTSTOCKNUM.push(eData);
		}
		for(var j in paramData['OUTSTOCKAMOUNT']){
			var eData = {name:'出库金额',y: parseInt(paramData['OUTSTOCKAMOUNT'][j]),};
			OUTSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['ATSTOCKNUM']){
			var eData = {name:'库存数',y: parseInt(paramData['ATSTOCKNUM'][j]),};
			ATSTOCKNUM.push(eData);
		}
		for(var j in paramData['ATSTOCKAMOUNT']){
			var eData = {name:'库存金额',y: parseInt(paramData['ATSTOCKAMOUNT'][j]),};
			ATSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['OVERSTOCKNUM']){
			var eData = {name:'超时在库数',y: parseInt(paramData['OVERSTOCKNUM'][j]),};
			OVERSTOCKNUM.push(eData);
		}
		for(var j in paramData['OVERSTOCKAMOUNT']){
			var eData = {name:'超时在库金额',y: parseInt(paramData['OVERSTOCKAMOUNT'][j]),};
			OVERSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['STOCKTURNOVERRATE']){
			var eData = {name:'销售周转率',y: parseInt(paramData['STOCKTURNOVERRATE'][j]),};
			STOCKTURNOVERRATE.push(eData);
		}
		for(var j in paramData['STOCKTURNOVERNUM']){
			var eData = {name:'销售周转天数',y: parseInt(paramData['STOCKTURNOVERNUM'][j]),};
			STOCKTURNOVERNUM.push(eData);
		}
		for(var j in paramData['TURNOVERRATE']){
			var eData = {name:'库存周转率',y: parseInt(paramData['TURNOVERRATE'][j]),};
			TURNOVERRATE.push(eData);
		}
		for(var j in paramData['TURNOVERNUM']){
			var eData = {name:'库存周转天数',y: parseInt(paramData['TURNOVERNUM'][j]),};
			TURNOVERNUM.push(eData);
		}

	}

	chart1.series[0].update({
		name: '入库数',
		data: INSTOCKNUM,
		yAxis:0,
	});
	chart1.series[1].update({
		name: '入库金额',
		data: INSTOCKAMOUNT,
		//yAxis:1,
	});
	chart1.series[2].update({
		name: '出库数',
		data: OUTSTOCKNUM,
		//yAxis:1,
	});
	chart1.series[3].update({
		name: '出库金额',
		data: OUTSTOCKAMOUNT,
		//yAxis:1,
	});
	chart1.series[4].update({
		name: '库存数',
		data: ATSTOCKNUM,
		//yAxis:1,
	});
	chart1.series[5].update({
		name: '库存金额',
		data: ATSTOCKAMOUNT,
		//yAxis:1,
	});
	chart1.series[6].update({
		name: '超时在库数',
		data: OVERSTOCKNUM,
		//yAxis:1,
	});
	chart1.series[7].update({
		name: '超时在库金额',
		data: OVERSTOCKAMOUNT,
		//yAxis:1,
	});
	chart1.series[8].update({
		name: '销售周转率',
		data: STOCKTURNOVERRATE,
		//yAxis:1,
	});
	chart1.series[9].update({
		name: '销售周转天数',
		data: STOCKTURNOVERNUM,
		//yAxis:1,
	});
	chart1.series[10].update({
		name: '库存周转率',
		data: TURNOVERRATE,
		//yAxis:1,
	});
	chart1.series[11].update({
		name: '库存周转天数',
		data: TURNOVERNUM,
		//yAxis:1,
	});
}

//柱形图
function dataColumn(paramData, trtdFlag, norm){
	// Build the chart
	var chart1 = Highcharts.chart('container', {
		// 标题
		title: {
			text: ''
		},
		// 小标题/注释等
		subtitle: {
			text: '' // 小标题
		},
		// 版权信息
		credits: {
			enabled: false
		},
		// 打印导出配置
		exporting:{
			enabled:true, //导出安按钮
		},
		// 图表基础配置
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'column' // 图表类型 默认：spline（走势），line(折线)，column（柱状图），pie(饼图)
		},
		// 图例参数
		legend: {
			//floating:true,
			backgroundColor: '#FFFFFF',
			align: 'left',
			verticalAlign: 'top',
			x: 100,
			y: 0,
			//labelFormat: '<span style="{color}">{name} (click to hide or show)</span>'
		},
		// 数据颜色分布（默认样式这里可以重定义）
		colors: ['#7CB5EC','#ED561B','#FF9655',  '#DDDF00','#50B432','#F564ED',
			'#03F2E3','#17A0FA',  '#7648FF',  '#AAAAAA', '#604c4c' ,'#571616'],
		//数据提示框（默认样式这里可以重定义）
		tooltip: {
			//pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		// 图标类型参数
		plotOptions: {
			pie: {
				allowPointSelect: true,
				//cursor: 'pointer',
				dataLabels: {
					enabled: true   // 数据标题
				},
				showInLegend: true, // 图例展示开关
			}
		},
		// y轴
		yAxis: {
			title: {
				text: ''
			}
		},
		//x轴
		xAxis: {
			categories: lineX(trtdFlag), //x轴标签名称
			gridLineWidth: 0, //设置网格宽度为1
			lineWidth: 1,  //基线宽度
			labels:{y:26}  //x轴标签位置：距X轴下方26像素
		},
		// 数据列
		series: [
			{
				name: '入库数',
				data: []
			},{
				name: '入库金额',
				data:[],
				tooltip: {
					valueSuffix: ' 元' // 弹层value+制定字符串
				},
			},{
				name: '出库数',
				data:[]
			},{
				name: '出库金额',
				data:[],
				tooltip: {
					valueSuffix: '元' // 弹层value+制定字符串
				},
			},{
				name: '库存数',
				data:[]
			},{
				name: '库存金额',
				data:[],
			},{
				name: '超时在库数',
				data:[]
			},{
				name: '超时在库金额',
				data:[],
				tooltip: {
					valueSuffix: ' 元' // 弹层value+制定字符串
				},
			},{
				name: '销售周转率',
				data:[],
				tooltip: {
					valueSuffix: ' %' // 弹层value+制定字符串
				},
			},{
				name: '销售周转天数',
				data:[],
				tooltip: {
					valueSuffix: ' 天' // 弹层value+制定字符串
				},
			},{
				name: '库存周转率',
				data:[],
				tooltip: {
					valueSuffix: ' %' // 弹层value+制定字符串
				},
			},{
				name: '库存周转天数',
				data:[],
				tooltip: {
					valueSuffix: ' 天' // 弹层value+制定字符串
				},
			}
		],
	});

	// 动态更新数据
	var INSTOCKNUM = [];
	var INSTOCKAMOUNT = [];
	var OUTSTOCKNUM = [];
	var OUTSTOCKAMOUNT = [];
	var ATSTOCKNUM = [];
	var ATSTOCKAMOUNT = [];
	var OVERSTOCKNUM = [];
	var OVERSTOCKAMOUNT = [];
	var STOCKTURNOVERRATE = [];
	var STOCKTURNOVERNUM = [];
	var TURNOVERRATE = [];
	var TURNOVERNUM = [];
	if(trtdFlag == '1'){
		for(var i in paramData){
			var eData = {name:'入库数',y: parseInt(paramData[i].INSTOCKNUM),};
			INSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'入库金额',y: parseInt(paramData[i].INSTOCKAMOUNT),};
			INSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'出库数',y: parseInt(paramData[i].OUTSTOCKNUM),};
			OUTSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'出库金额',y: parseInt(paramData[i].OUTSTOCKAMOUNT),};
			OUTSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存数',y: parseInt(paramData[i].ATSTOCKNUM),};
			ATSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存金额',y: parseInt(paramData[i].ATSTOCKAMOUNT),};
			ATSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'超时在库数',y: parseInt(paramData[i].OVERSTOCKNUM),};
			OVERSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'超时在库金额',y: parseInt(paramData[i].OVERSTOCKAMOUNT),};
			OVERSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'销售周转率',y: parseInt(paramData[i].STOCKTURNOVERRATE),};
			STOCKTURNOVERRATE.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'销售周转天数',y: parseInt(paramData[i].STOCKTURNOVERNUM),};
			STOCKTURNOVERNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存周转率',y: parseInt(paramData[i].TURNOVERRATE),};
			TURNOVERRATE.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存周转天数',y: parseInt(paramData[i].TURNOVERNUM),};
			TURNOVERNUM.push(eData);
		}
	}else if(trtdFlag == '2'){
		for(var j in paramData['INSTOCKNUM']){
			var eData = {name:'入库数',y: parseInt(paramData['INSTOCKNUM'][j]),};
			INSTOCKNUM.push(eData);
		}
		for(var j in paramData['INSTOCKAMOUNT']){
			var eData = {name:'入库金额',y: parseInt(paramData['INSTOCKAMOUNT'][j]),};
			INSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['OUTSTOCKNUM']){
			var eData = {name:'出库数',y: parseInt(paramData['OUTSTOCKNUM'][j]),};
			OUTSTOCKNUM.push(eData);
		}
		for(var j in paramData['OUTSTOCKAMOUNT']){
			var eData = {name:'出库金额',y: parseInt(paramData['OUTSTOCKAMOUNT'][j]),};
			OUTSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['ATSTOCKNUM']){
			var eData = {name:'库存数',y: parseInt(paramData['ATSTOCKNUM'][j]),};
			ATSTOCKNUM.push(eData);
		}
		for(var j in paramData['ATSTOCKAMOUNT']){
			var eData = {name:'库存金额',y: parseInt(paramData['ATSTOCKAMOUNT'][j]),};
			ATSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['OVERSTOCKNUM']){
			var eData = {name:'超时在库数',y: parseInt(paramData['OVERSTOCKNUM'][j]),};
			OVERSTOCKNUM.push(eData);
		}
		for(var j in paramData['OVERSTOCKAMOUNT']){
			var eData = {name:'超时在库金额',y: parseInt(paramData['OVERSTOCKAMOUNT'][j]),};
			OVERSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['STOCKTURNOVERRATE']){
			var eData = {name:'销售周转率',y: parseInt(paramData['STOCKTURNOVERRATE'][j]),};
			STOCKTURNOVERRATE.push(eData);
		}
		for(var j in paramData['STOCKTURNOVERNUM']){
			var eData = {name:'销售周转天数',y: parseInt(paramData['STOCKTURNOVERNUM'][j]),};
			STOCKTURNOVERNUM.push(eData);
		}
		for(var j in paramData['TURNOVERRATE']){
			var eData = {name:'库存周转率',y: parseInt(paramData['TURNOVERRATE'][j]),};
			TURNOVERRATE.push(eData);
		}
		for(var j in paramData['TURNOVERNUM']){
			var eData = {name:'库存周转天数',y: parseInt(paramData['TURNOVERNUM'][j]),};
			TURNOVERNUM.push(eData);
		}

	}

	chart1.series[0].update({
		name: '入库数',
		data: INSTOCKNUM,
		yAxis:0,
	});
	chart1.series[1].update({
		name: '入库金额',
		data: INSTOCKAMOUNT,
		//yAxis:1,
	});
	chart1.series[2].update({
		name: '出库数',
		data: OUTSTOCKNUM,
		//yAxis:1,
	});
	chart1.series[3].update({
		name: '出库金额',
		data: OUTSTOCKAMOUNT,
		//yAxis:1,
	});
	chart1.series[4].update({
		name: '库存数',
		data: ATSTOCKNUM,
		//yAxis:1,
	});
	chart1.series[5].update({
		name: '库存金额',
		data: ATSTOCKAMOUNT,
		//yAxis:1,
	});
	chart1.series[6].update({
		name: '超时在库数',
		data: OVERSTOCKNUM,
		//yAxis:1,
	});
	chart1.series[7].update({
		name: '超时在库金额',
		data: OVERSTOCKAMOUNT,
		//yAxis:1,
	});
	chart1.series[8].update({
		name: '销售周转率',
		data: STOCKTURNOVERRATE,
		//yAxis:1,
	});
	chart1.series[9].update({
		name: '销售周转天数',
		data: STOCKTURNOVERNUM,
		//yAxis:1,
	});
	chart1.series[10].update({
		name: '库存周转率',
		data: STOCKTURNOVERRATE,
		//yAxis:1,
	});
	chart1.series[11].update({
		name: '库存周转天数',
		data: STOCKTURNOVERNUM,
		//yAxis:1,
	});

}

//饼图
function dataPie(paramData, trtdFlag, norm){
	var titleTxt = '';
	if($.inArray("1", norm) >= '0'){
		titleTxt = '入库数';
	}
	if($.inArray("2", norm) >= '0'){
		titleTxt = '入库金额';
	}
	if($.inArray("3", norm) >= '0'){
		titleTxt = '出库数';
	}
	if($.inArray("4", norm) >= '0'){
		titleTxt = '出库金额';
	}
	if($.inArray("5", norm) >= '0'){
		titleTxt = '库存数';
	}
	if($.inArray("6", norm) >= '0'){
		titleTxt = '库存金额';
	}
	if($.inArray("7", norm) >= '0'){
		titleTxt = '超时在库数';
	}
	if($.inArray("8", norm) >= '0'){
		titleTxt = '超时在库金额';
	}
	if($.inArray("9", norm) >= '0'){
		titleTxt = '销售周转率';
	}
	if($.inArray("10", norm) >= '0'){
		titleTxt = '销售周转天数';
	}
	if($.inArray("10", norm) >= '0'){
		titleTxt = '库存周转率';
	}
	if($.inArray("11", norm) >= '0'){
		titleTxt = '库存周转天数';
	}
	var chart3 = Highcharts.chart('container', {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: titleTxt
		},
		// 小标题/注释等
		subtitle: {
			text: '' // 小标题
		},
		// 数据颜色分布（默认样式这里可以重定义）
		colors: ['#7CB5EC','#ED561B','#FF9655',  '#DDDF00','#50B432','#F564ED',
			'#03F2E3','#17A0FA',  '#7648FF',  '#AAAAAA', '#604c4c' ,'#571616'],
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					style: {
						color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
					}
				}
			}
		},
		series: [{
			name: '占比',
			colorByPoint: true,
			data: [],
		}]
	});

	// 动态更新数据
	var INSTOCKNUM = [];
	var INSTOCKAMOUNT = [];
	var OUTSTOCKNUM = [];
	var OUTSTOCKAMOUNT = [];
	var ATSTOCKNUM = [];
	var ATSTOCKAMOUNT = [];
	var OVERSTOCKNUM = [];
	var OVERSTOCKAMOUNT = [];
	var STOCKTURNOVERRATE = [];
	var STOCKTURNOVERNUM = [];
	var TURNOVERRATE = [];
	var TURNOVERNUM = [];
	if(trtdFlag == '1'){
		for(var i in paramData){
			var eData = {name:'入库数',y: parseInt(paramData[i].INSTOCKNUM),};
			INSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'入库金额',y: parseInt(paramData[i].INSTOCKAMOUNT),};
			INSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'出库数',y: parseInt(paramData[i].OUTSTOCKNUM),};
			OUTSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'出库金额',y: parseInt(paramData[i].OUTSTOCKAMOUNT),};
			OUTSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存数',y: parseInt(paramData[i].ATSTOCKNUM),};
			ATSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存金额',y: parseInt(paramData[i].ATSTOCKAMOUNT),};
			ATSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'超时在库数',y: parseInt(paramData[i].OVERSTOCKNUM),};
			OVERSTOCKNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'超时在库金额',y: parseInt(paramData[i].OVERSTOCKAMOUNT),};
			OVERSTOCKAMOUNT.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'销售周转率',y: parseInt(paramData[i].STOCKTURNOVERRATE),};
			STOCKTURNOVERRATE.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'销售周转天数',y: parseInt(paramData[i].STOCKTURNOVERNUM),};
			STOCKTURNOVERNUM.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存周转率',y: parseInt(paramData[i].TURNOVERRATE),};
			TURNOVERRATE.push(eData);
		}
		for(var i in paramData){
			var eData = {name:'库存周转天数',y: parseInt(paramData[i].TURNOVERNUM),};
			TURNOVERNUM.push(eData);
		}
	}else if(trtdFlag == '2'){
		for(var j in paramData['INSTOCKNUM']){
			var eData = {name:'入库数',y: parseInt(paramData['INSTOCKNUM'][j]),};
			INSTOCKNUM.push(eData);
		}
		for(var j in paramData['INSTOCKAMOUNT']){
			var eData = {name:'入库金额',y: parseInt(paramData['INSTOCKAMOUNT'][j]),};
			INSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['OUTSTOCKNUM']){
			var eData = {name:'出库数',y: parseInt(paramData['OUTSTOCKNUM'][j]),};
			OUTSTOCKNUM.push(eData);
		}
		for(var j in paramData['OUTSTOCKAMOUNT']){
			var eData = {name:'出库金额',y: parseInt(paramData['OUTSTOCKAMOUNT'][j]),};
			OUTSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['ATSTOCKNUM']){
			var eData = {name:'库存数',y: parseInt(paramData['ATSTOCKNUM'][j]),};
			ATSTOCKNUM.push(eData);
		}
		for(var j in paramData['ATSTOCKAMOUNT']){
			var eData = {name:'库存金额',y: parseInt(paramData['ATSTOCKAMOUNT'][j]),};
			ATSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['OVERSTOCKNUM']){
			var eData = {name:'超时在库数',y: parseInt(paramData['OVERSTOCKNUM'][j]),};
			OVERSTOCKNUM.push(eData);
		}
		for(var j in paramData['OVERSTOCKAMOUNT']){
			var eData = {name:'超时在库金额',y: parseInt(paramData['OVERSTOCKAMOUNT'][j]),};
			OVERSTOCKAMOUNT.push(eData);
		}
		for(var j in paramData['STOCKTURNOVERRATE']){
			var eData = {name:'销售周转率',y: parseInt(paramData['STOCKTURNOVERRATE'][j]),};
			STOCKTURNOVERRATE.push(eData);
		}
		for(var j in paramData['STOCKTURNOVERNUM']){
			var eData = {name:'销售周转天数',y: parseInt(paramData['STOCKTURNOVERNUM'][j]),};
			STOCKTURNOVERNUM.push(eData);
		}
		for(var j in paramData['TURNOVERRATE']){
			var eData = {name:'库存周转率',y: parseInt(paramData['TURNOVERRATE'][j]),};
			TURNOVERRATE.push(eData);
		}
		for(var j in paramData['TURNOVERNUM']){
			var eData = {name:'库存周转天数',y: parseInt(paramData['TURNOVERNUM'][j]),};
			TURNOVERNUM.push(eData);
		}

	}

	if($.inArray("1", norm) >= '0'){
		chart3.series[0].update({
			name: '入库数',
			data: INSTOCKNUM,
		});
	}
	if($.inArray("2", norm) >= '0'){
		chart3.series[0].update({
			name: '入库金额',
			data: INSTOCKAMOUNT,
		});
	}
	if($.inArray("3", norm) >= '0'){
		chart3.series[0].update({
			name: '出库数',
			data: OUTSTOCKNUM,
		});
	}
	if($.inArray("4", norm) >= '0'){
		chart3.series[0].update({
			name: '出库金额',
			data: OUTSTOCKAMOUNT,
		});
	}
	if($.inArray("5", norm) >= '0'){
		chart3.series[0].update({
			name: '库存数',
			data: ATSTOCKNUM,
		});
	}
	if($.inArray("6", norm) >= '0'){
		chart3.series[0].update({
			name: '库存金额',
			data: ATSTOCKAMOUNT,
		});
	}
	if($.inArray("7", norm) >= '0'){
		chart3.series[0].update({
			name: '超时在库数',
			data: OVERSTOCKNUM,
		});
	}
	if($.inArray("8", norm) >= '0'){
		chart3.series[0].update({
			name: '超时在库金额',
			data: OVERSTOCKAMOUNT,
		});
	}
	if($.inArray("9", norm) >= '0'){
		chart3.series[0].update({
			name: '销售周转率',
			data: STOCKTURNOVERRATE,
		});
	}
	if($.inArray("10", norm) >= '0'){
		chart3.series[0].update({
			name: '销售周转天数',
			data: STOCKTURNOVERNUM,
		});
	}
	if($.inArray("10", norm) >= '0'){
		chart3.series[0].update({
			name: '库存周转率',
			data: TURNOVERRATE,
		});
	}
	if($.inArray("11", norm) >= '0'){
		chart3.series[0].update({
			name: '库存周转天数',
			data: TURNOVERNUM,
		});
	}

}

//旭日图
function dataPies(){

}

//地图
function dataMap(){

}

//导出execl
$('#exportlist').on('click',function(){
	$("#tableDate").table2excel({
		// 不被导出的表格行的CSS class类
		//exclude: ".noExl",
		// 导出的Excel文档的名称
		name: "仓库数据统计分析",
		// Excel文件的名称
		filename: "仓库数据统计分析.xls",
		//文件后缀名
		fileext: ".xls",
		//是否排除导出图片
		//exclude_img: false,
		//是否排除导出超链接
		//exclude_links: false,
		//是否排除导出输入框中的内容
		//exclude_inputs: false
	});
	//tableToExcel();
})

/*
 * js 导出execl
 */
function tableToExcel(){
	// 要导出的json数据
	var jsonDatas = [];
	$('#tableDate tr').each(function(i){
		var jsonData = {};
		var thisTd = $('td', $(this));
		thisTd.each(function(j){
			jsonData[j] = thisTd.eq(j).html();
		});
		jsonDatas.push(jsonData);
	});
	// 列标题，逗号隔开，每一个逗号就是隔开一个单元格
	let str = '';
	// 增加\t为了不让表格显示科学计数法或者其他格式
	for(let i = 0; i < jsonDatas.length; i++ ){
		for(let item in jsonDatas[i]){
			str += jsonDatas[i][item] + '\t'+',';
		}
		str += '\n';
	}
	// encodeURIComponent解决中文乱码
	let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
	// 通过创建a标签实现
	let link = document.createElement("a");
	link.href = uri;
	// 对下载的文件命名
	link.download =  "仓库数据统计分析.csv";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

//行仓库数据详情
function trToDetail(where,number) {
	toDetail(where,number);
}
//列仓库数据详情
function tdToDetail(where,num) {
	var n = '';
	switch (num) {
		case 'INSTOCKNUM':
			n = 1;break;
		case 'INSTOCKAMOUNT':
			n = 2;break;
		case 'OUTSTOCKNUM':
			n = 3;break;
		case 'OUTSTOCKAMOUNT':
			n = 4;break;
		case 'ATSTOCKNUM':
			n = 5;break;
		case 'ATSTOCKAMOUNT':
			n = 6;break;
		case 'OVERSTOCKNUM':
			n = 7;break;
		case 'OVERSTOCKAMOUNT':
			n = 8;break;
		case 'STOCKTURNOVERNUM':
			n = 10;break;
		default :
			break;
	}
	toDetail(where,n);
}
//仓库数据详情
function toDetail(where,number) {
	layer.open({
		type:2,
		title:'数据详情',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/warehouse/detailinfo?number='+number+'&where='+where+'&params='+params,
		area:['1050px','600px'],
		close:function(index){
			layer.close(index);
		}
	});
}