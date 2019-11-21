
//根据时间单位显示对应的选择项
function selectItem(timeUnit){
	if(timeUnit == 'W'){
		$('.spanWBox').show();
		$('.spanYBox').hide();
		$('.spanMBox').hide();
		$('.spanQBox').hide();
	}else if(timeUnit == 'M'){
		$('.spanWBox').hide();
		$('.spanYBox').show();
		$('.spanMBox').show();
		$('.spanQBox').hide();
	}else if(timeUnit == 'Q'){
		$('.spanWBox').hide();
		$('.spanYBox').show();
		$('.spanMBox').hide();
		$('.spanQBox').show();
	}
}

$().ready(function(){
	//时间单位切换时
	$('#timeUnit').change(function(){
		var timeUnit = $(this).val();
		selectItem(timeUnit);
	})
	
	selectItem(timeUnit);
	$("#timeUnit").val(timeUnit);
	$("#category").val(category);
	$("#merType").val(merType);
	// 重新定位选择项
	if(timeUnit == 'W'){
		$("#weekCount").val(weekCount);
	}else if(timeUnit == 'M'){
		$("#startYear").val(startYear);
		$("#endYear").val(endYear);
		$("#startMonth").val(startMonth);
		$("#endMonth").val(endMonth);
	}else if(timeUnit == 'Q'){
		$("#startYear").val(startYear);
		$("#endYear").val(endYear);
		$("#startQuarter").val(startQuarter);
		$("#endQuarter").val(endQuarter);
	}
	// 图表切换
	$('#btn_cut span').on('click',function(){
		$('#btn_cut span').removeClass('btn_ed');
		$(this).addClass('btn_ed');
		var value = $(this).attr('value');
		if(value == 'btn_column'){
			charsobj('column');
		}else if(value == 'btn_line'){
			charsobj('line');
		}
	});
	
	// 导出execl
	$('#exportlist').click(function(){
		tableToExcel();
	});
	
	//查询
	$('#doSearch').click(function(){
		doSearch();
	});
	// 初始化图表
	charsobj('column');
});


/**
 * 图表配置
 */
function charsobj(types){
	if(valueDatas.length == 0 && titles.length == 0 && percentDatas.length == 0){
		return;
	}
	
	var charss = Highcharts.chart('container', {
				title:{text:'品类品牌出货毛利'},// 标题
				subtitle:{text:'（查看一定时间内所有品类的毛利或某个品类各个品牌的毛利）'},//子标题
				// 图表基础配置
				chart:{
					plotBackgroundColor:null,
					plotBorderWidth:null,
					plotShadow:false,
					type:types, // 图表类型 默认：spline（走势），line(折线)，column（柱状图），pie(饼图)
					zoomType:'xy',
				},
				credits:{enabled:false},// 版权信息是否显示
				exporting:{enabled:true},// 打印导出配置
				// 图例参数
				legend:{
					//floating:true,
					backgroundColor:'#FFFFFF',
					align:'center',
					verticalAlign:'top',
					x:10,
					y:10,
					symbolHeight:15,
					//labelFormat:'<span style="{color}">{name} (click to hide or show)</span>'
				},
				// 数据颜色分布（默认样式这里可以重定义）
				colors:['#f7924e', '#24CBE5', '#64E572'],
				//数据提示框（默认样式这里可以重定义）
				tooltip:{
					//pointFormat:'{series.name}:<b>{point.percentage:.1f}%</b>'
				},
				// 图标参数
				plotOptions:{
					pie:{
						allowPointSelect:true,
						cursor:'pointer',
						dataLabels:{enabled:true},// 数据标题
						showInLegend:true, // 图例展示开关
					}
				},
				// y轴
				yAxis:[{ // Primary yAxis
					allowDecimals:false, // 不准出现小数点
					labels:{
						format:'{value} %',
						style:{
							color:Highcharts.getOptions().colors[1]
						}
					},
					title:{
						text:'毛 利 率',
						style:{
							color:Highcharts.getOptions().colors[1]
						}
					}
				}, { // Secondary yAxis
					title:{
						text:'毛 利 额',
						style:{
							color:Highcharts.getOptions().colors[0]
						}
					},
					labels:{
						format:'{value} 元',
						style:{
							color:Highcharts.getOptions().colors[0]
						}
					},
					opposite:true
				}],
				// x轴
				xAxis:{
					categories:titles, //x轴标签名称
					gridLineWidth:0, // 设置网格宽度为1
					lineWidth:1, // 基线宽度
					labels:{y:20} // x轴标签位置：距X轴下方26像素
				},
				// 数据列
				// 折线图、树状图可以多个数组
				series:[{
					name:'毛利率',
					data:percentDatas,
					tooltip:{valueSuffix:' %'},
					yAxis:0,
				},
				{name:'平均毛利额',
					data:valueDatas,
					tooltip:{valueSuffix:' 元'},
					yAxis:1,
				},
				],
			});
		}

/**
 * js 导出execl
 */
function tableToExcel(){
	//要导出的json数据
	var jsonDatas = [];
	$('#tableDate tr').each(function(i){
		var jsonData = {};
		var thisTd = $('td', $(this));
		thisTd.each(function(j){
			jsonData[j] = thisTd.eq(j).html();
		});
		jsonDatas.push(jsonData);
	});
	//列标题，逗号隔开，每一个逗号就是隔开一个单元格
	let str = '';
	//增加\t为了不让表格显示科学计数法或者其他格式
	for(let i = 0; i < jsonDatas.length; i++ ){
		for(let item in jsonDatas[i]){
			str += jsonDatas[i][item] + '\t'+',';
		}
		str += '\n';
	}
	//encodeURIComponent解决中文乱码
	let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
	//通过创建a标签实现
	let link = document.createElement("a");
	link.href = uri;
	//对下载的文件命名
	link.download =  "品类品牌出货毛利.csv";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

// 提交
function doSearch(){
	var timeUnit = $('#timeUnit').val();
	var weekCount = $('#weekCount').val();
	var startYear = $('#startYear').val();
	var endYear = $('#endYear').val();
	var startMonth = $('#startMonth').val();
	var endMonth = $('#endMonth').val();
	var startQuarter = $('#startQuarter').val();
	var endQuarter = $('#endQuarter').val();
	var category = $('#category').val();
	var merType = $('#merType').val();
	
	if(timeUnit == 'W'){//周
		
	}
	
		var param = '?timeUnit='+timeUnit+'&weekCount='+weekCount+'&startYear='+startYear+'&endYear='+endYear+'&startMonth='+startMonth;
		param += '&endMonth='+endMonth+'&startQuarter='+startQuarter+'&endQuarter='+endQuarter+'&category='+category+'&merType='+merType;
		window.location.href='/recycle/saleanalysis/categorybrandprofit'+param;
}