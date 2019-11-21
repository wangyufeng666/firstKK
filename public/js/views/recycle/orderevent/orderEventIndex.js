var grid;
$().ready(function(){
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    var currentdate = year + seperator1 + month + seperator1 + strDate + " " + hour + ":" + minute + ":" +second;
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"合作商名称", dataIndex:'PARTNERNAME', width:'120px',sortable:false}
			,{header:"活动名称", dataIndex:'EVENTNAME', width:'120px',sortable:false}
			,{header:"活动编码", dataIndex:'EVENTCODE', width:'120px',sortable:false}
			,{header:"开始时间", dataIndex:'STRSTARTDATE', width:'130px',sortable:false}
			,{header:"结束时间", dataIndex:'STRSTOPDATE', width:'130px',sortable:false}
			,{header:"是否有效", dataIndex:'ISVALID', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ISVALID'] == '1'){
						return '<font color="green">有效</font>';
					}else if (data['ISVALID'] == '0'){
						return '无效';
					}
				}
			}
			,{header:"活动状态", dataIndex:'EVENTSTATUS', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['EVENTSTATUS'] == '1'){
						return '未启用';
					}else if(data['EVENTSTATUS'] == '2'){
						return '<font color="green">已启用</font>';
					}
				}
			}
			,{header:"状态提醒", dataIndex:'STATUSREMIND', width:'80px',sortable:false}
			,{header:"结算类型", dataIndex:'PAYTYPE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['PAYTYPE'] == '1'){
						return '现金';
					}else if(data['PAYTYPE'] == '2'){
						return '券+现金';
					}else if(data['PAYTYPE'] == '3'){
						return '券';
					}
				}
			}
			,{header:"操作", dataIndex:'', width:'180px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var eventCode = data['EVENTCODE'];
					var eventStatus = data['EVENTSTATUS'];
					var startDate = data['STRSTARTDATE'];
					var strstopDate = data['STRSTOPDATE'];
					var isValid = data['ISVALID'];
					var detailId = data['DETAILID'];
					var returnText ='<a href="javascript:void(0);" onclick="eventInfo(\''+detailId+'\')" class="a_link">详情</a>';
					
					if(eventStatus == '1'){//未启用
						returnText+=' | <a href="javascript:void(0);" onclick="editEventInfo(\''+detailId+'\')" class="a_link">修改</a>';
						
						if(isValid == '1'){//有效
							returnText+=' | <a href="javascript:void(0);" onclick="disableEventInfo(\''+detailId+'\')" class="a_link">置为无效</a>';
							returnText+=' | <a href="javascript:void(0);" onclick="useEventInfo(\''+eventCode+'\')" class="a_link">启用</a>';
							
						}else if(isValid == '0'){//无效
							returnText+=' | <a href="javascript:void(0);" onclick="enableEventInfo(\''+detailId+'\')" class="a_link">置为有效</a>';
						}
					}else if(eventStatus == '2' && strstopDate>currentdate){//已启用
						returnText+=' | <a href="javascript:void(0);" onclick="stopEventInfo(\''+detailId+'\',\''+startDate+'\',\''+strstopDate+'\')" class="a_link">终止</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/recycle/orderevent/pagelist'
		,baseParams:initParams()
	});
	
	$('#businessCode').change(function(){
		var businessCode = $('#businessCode').val();
		$.post('/system/partner/recycle',{businessCode:businessCode},function(data){
			if(data.length > 0){
				var html = '<option value="">全部</option>';
				for(i in data){
					html += '<option value="'+data[i]["PARTNERCODE"]+'">'+data[i]["PARTNERNAME"]+'</option>';
				}
				$('#partnerCode').html(html);
			}
		})
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params.start = start;
		params.limit = limit;
		return params;
	}else{
		return {};
	}
}

/**
 * 活动详情
 * @param eventCode
 * @return
 */
function eventInfo(detailId){
	window.location.href = "/recycle/orderevent/ordereventinfo?detailId="+detailId+"&backUri="+backUri;
}

/**
 * 将活动置为无效
 * @param eventCode
 */
function disableEventInfo(detailId){
	if(confirm('是否将活动置为无效？')){
		$.post('/recycle/orderevent/disableorderevent', {detailId:detailId}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				alert(data);
			}
		});
	}
}

/**
 * 将活动置为有效
 * @param eventCode
 */
function enableEventInfo(detailId){
	if(confirm('是否将活动置为有效？')){
		$.post('/recycle/orderevent/enableorderevent', {detailId:detailId}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				alert(data);
			}
		});
	}
}

/**
 * 修改活动
 * @param eventCode
 */
function editEventInfo(detailId){
	$.layer({
		type:2,
		title:'修改活动',
		iframe:{src:'/recycle/orderevent/editeventinfo?detailId='+detailId+'&backUri='+backUri},
		area:['750','700'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 终止活动
 * @param eventCode
 */
function stopEventInfo(detailId,startDate,currentdate){
    if(confirm('是否将活动置为终止？')){
    	if(startDate>currentdate){
    		$.post('/recycle/orderevent/stopeventtostatus', {detailId:detailId}, function(data){
    			if(data == 'Y'){
    				layer.alert("终止成功",1);
    				window.location.href ='/recycle/orderevent/index ';
    			}else{
    				alert('终止失败,请重试。');
    			}
    		});
    	}else{
    		$.layer({
    			type:2,
    			title:'终止活动',
    			iframe:{src:'/recycle/orderevent/stopeventinfo?detailId='+detailId+'&backUri='+backUri},
    			area:['550','300'],
    			offset:['50px',''],
    			close:function(index){
    				layer.close(index);
    			}
    		});
    	}
    }
}

/**
 * 启用活动
 * @param eventCode
 */
function useEventInfo(eventCode){
	if(confirm('是否将活动置为有效？')){
		$.post('/recycle/orderevent/useorderevent', {eventCode:eventCode}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				alert(data);
			}
		});
	}
}

/**
 * 添加活动策略
 */
function addEvent(){
	window.location.href = '/recycle/orderevent/addorderevent?backUri='+backUri;
}

function getParams(){
	return {
		eventCode:$('#eventCode').val(),
		eventName:$('#eventName').val(),
		businessCode:$('#businessCode').val(),
		partnerCode:$('#partnerCode').val(),
		partnerName:$('#partnerName').val(),
		startDate:$('#startDate').val(),
		stopDate:$('#endDate').val()
	};
}

initProvince();
//省份初始化
function initProvince(){
	$("#sheng").html("<option value=''>请选择省份</option>");
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,url:openapiUrl+'/util/util/getprovince',
		success:function(data){
			var optionHtml = "", name = "";
			for(i in data){
				name = data[i]['NAME'];
				optionHtml += "<option value='"+data[i]['ID']+"' title='"+name+"'>"+name+"</option>";
			}
			$("#sheng").append(optionHtml);
		}
	});
}

//省动态改变
$('#sheng').change(function(){
	$("#shi").html("<option value='' flag='N'>请选择城市</option>");
	$("#partnerCode").html("<option value='' flag='N'>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,data:{provinceId:thisVal},url:openapiUrl+'/util/util/getcity',
			success:function(data){
				var optionHtml = '', id = '', name = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#shi").append(optionHtml);
			}
		});
	}
});

//合作商动态改变
$('#shi').change(function(){
	$("#partnerCode").html("<option flag='' value=''>请选择合作商</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'json',jsonp:'jsonp_callback',cache:false,data:{cityId:thisVal},url:'/system/brokerage/getpartners',
			success:function(data){
				var optionHtml = '',id = '',name = '';
				for(i in data){
					id = data[i]['PARTNERCODE'];
					name = data[i]['PARTNERNAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#partnerCode").append(optionHtml);
			}
		});
	}
});

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}
	});
}
