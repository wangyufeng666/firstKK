

function getParams(){
	return {
		types:$('#types').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	var types = $('#types').val();
	$.ajax({
		url:'/youdezhuan/statistics/statistics',
		type:'post',
		data:getParams(),
		dataType:'json',
		success:function(data){
			var categories = new Array();
			var series = new Array();
			for(var i = 0;i<data.categories.length;i++) {
				categories[i] = "'"+data.categories[i]+"'";
				series[i] = parseInt(data.data[i]);
			}
			var title = '数据统计';
			switch(types){
				case '1':
					title = '访问人数统计';
					break;
				case '2':
					title = '访问次数统计';
					break;
				case '3':
					title = '打开次数统计';
					break;
				case '4':
					title = '打开人数统计';
					break;
				case '5':
					title = '分享次数统计';
					break;
				case '6':
					title = '分享人数统计';
					break;
			}
			var options = {
				chart: {
					type: 'line'                          //指定图表的类型，默认是折线图（line）
				},
				title: {
					text: title                 // 标题
				},
				xAxis: {
					categories:categories  // x 轴分类
				},
				yAxis: {
					title: {
						text: '数量'                // y 轴标题
					}
				},
				series: [{
					name:'数量',// 数据列名
					data: series                     // 数据
				}]
			};
			// 图表初始化函数
			var chart = Highcharts.chart('container', options);
		}
	})
}

//回车事件
document.onkeypress = keypress;
function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}

//新增分销成员
function addMember(parentId) {
	layer.open({
		type:2,
		title:'新增成员',
		content:'/youdezhuan/distribute/addmember?parent='+parentId+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['40%' , '30%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function edit(userId) {
	layer.open({
		type:2,
		title:'编辑成员',
		content:'/youdezhuan/distribute/editmember?userid='+userId+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['40%' , '30%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function memberInfo(userId) {
	layer.open({
		type:2,
		title:'分销成员详情',
		content:'/youdezhuan/distribute/memberinfo?userid='+userId+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}


/**
 * 审核用户真实信息
 * @param userId
 */
function verify(userId) {
	layer.open({
		type:2,
		title:'审核信息',
		content:'/youdezhuan/distribute/usertureinfo?userid='+userId+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['50%' , '50%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function thawFunds(userId) {
	var index = layer.load();
	$.ajax({
		url:'/youdezhuan/distribute/thawfunds',
		type:'post',
		data:{userid:userId},
		dataType:'json',
		success:function(res) {
			layer.close(index);
			if(res == 'Y') {
				doSearch();
			}else {
				alert(res);
			}
		}
	})
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(userId, userName, orderPrice){
	layer.close(layerIndex);
	$.post('/youdezhuan/distribute/jsonremark',{userId:userId}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', 'auto'],
			content:'<div class="layer_notice">用户备注： <br/>'+data+'</div>'
		});
	});
}

//下载
function exportMember() {
	var name = $('#name').val();
	var	mobile = $('#mobile').val();
	var	parentName = $('#parentName').val();
	var	startDate = $('#startDate').val();
	var	endDate = $('#endDate').val();
	var url = "/youdezhuan/distribute/exportmember?name="+name+"&mobile="+mobile+"&parentNmae="+parentName;
		  url	+= "&startDate="+startDate+"&endDate="+endDate;
	 window.location.href = url;

}
