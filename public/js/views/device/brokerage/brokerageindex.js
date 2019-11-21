var grid;
$().ready(function(){
	initProvinces();
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
			,{header:"代理商名称", dataIndex:'COMPANYNAME', width:'120px',sortable:false}
			,{header:"代理商编码", dataIndex:'TYPECODE', width:'120px',sortable:false}
			,{header:"佣金策略名称", dataIndex:'STRATEGYNAME', width:'120px',sortable:false}
			,{header:"佣金策略描述", dataIndex:'STRATEGYDESC', width:'120px',sortable:false}
			,{header:"开始日期", dataIndex:'STRSTARTDATE', width:'130px',sortable:false}
			,{header:"结束日期", dataIndex:'STRENDDATE', width:'130px',sortable:false}
			,{header:"是否有效", dataIndex:'ISVALID', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ISVALID'] == 'Y'){
						return '<font color="green">有效</font>';
					}else if (data['ISVALID'] == 'N'){
						return '无效';
					}
				}
			}
			,{header:"策略状态", dataIndex:'STRATEGYSTATUS', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['STRATEGYSTATUS'] == '1'){
						return '未启用';
					}else if(data['STRATEGYSTATUS'] == '2'){
						return '<font color="green">已启用</font>';
					}
				}
			}
			,{header:"状态提醒", dataIndex:'STATUSREMIND', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'180px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var strategyCode = data['STRATEGYCODE'];//策略编码
					var strategyStatus = data['STRATEGYSTATUS'];//策略状态
					var strstartDate = data['STRSTARTDATE'];//策略开始时间
					var strendDate = data['STRENDDATE'];//策略开始时间
					var isValid = data['ISVALID'];
					var returnText ='<a href="javascript:void(0);" onclick="strategyInfo(\''+strategyCode+'\')" class="a_link">详情</a>';
					
					if(strategyStatus == '1'){//未启用
						returnText+=' | <a href="javascript:void(0);" onclick="editstrategy(\''+strategyCode+'\')" class="a_link">修改</a>';
						
						if(isValid == 'Y'){//有效
							returnText+=' | <a href="javascript:void(0);" onclick="disableStrategy(\''+strategyCode+'\')" class="a_link">置为无效</a>';
							returnText+=' | <a href="javascript:void(0);" onclick="useStrategy(\''+strategyCode+'\')" class="a_link">启用</a>';
							
						}else if(isValid == 'N'){//无效
							returnText+=' | <a href="javascript:void(0);" onclick="enableStrategy(\''+strategyCode+'\')" class="a_link">置为有效</a>';
						}
						
					}else if(strategyStatus == '2' && strendDate > currentdate){//已启用
						returnText+=' | <a href="javascript:void(0);" onclick="stopstrategy(\''+strategyCode+'\' ,\''+strstartDate+'\',\''+currentdate+'\')" class="a_link">终止</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/device/brokerage/pagelist'
		,baseParams:initParams()
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
 * @param strategyCode
 * @return
 */
function strategyInfo(strategyCode){
	window.location.href = "/device/brokerage/brokerageinfo?strategyCode="+strategyCode+"&backUri="+backUri;
}

/**
 * 将活动置为无效
 * @param strategyCode
 */
function disableStrategy(strategyCode){
	if(confirm('是否将活动置为无效？')){
		$.post('/recycle/brokeragestrategy/disablestrategy', {strategyCode:strategyCode}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				
			}
		});
	}
}

/**
 * 修改策略
 * @param eventCode
 */
function editstrategy(strategyCode){
	$.layer({
		type:2,
		title:'修改策略信息',
		iframe:{src:'/device/brokerage/editstrategyinfo?strategyCode='+strategyCode+'&backUri='+backUri},
		area:['750','550'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 将活动置为有效
 * @param strategyCode
 */
function enableStrategy(strategyCode){
	if(confirm('是否将活动置为有效？')){
		$.post('/recycle/brokeragestrategy/enablestrategy', {strategyCode:strategyCode}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				
			}
		});
	}
}

/**
 * 终止策略
 * @param strategyCode
 */
function stopstrategy(strategyCode,strstartDate,currentdate){
    if(confirm('是否将活动置为终止？')){
    	if(strstartDate>currentdate){
    		$.post('/recycle/brokeragestrategy/stopstrategytostatus', {strategyCode:strategyCode}, function(data){
    			if(data == 'Y'){
    				layer.alert("终止成功",1);
    				parent.location.href = parent.location.href;
    			}else{
    				alert('终止失败,请重试。');
    			}
    		});
    	}else{
    		$.layer({
    			type:2,
    			title:'终止佣金策略',
    			iframe:{src:'/recycle/brokeragestrategy/stopstrategyinfo?strategyCode='+strategyCode+'&backUri='+backUri},
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
			$('#provinceId').val(provinceId);
			$('#cityId').val(cityId);
		}
	});
}

/**
 * 省份change
 */
$("#provinceId").change(function(){
	var provinceId = $('#provinceId').val();
	if(provinceId != ""){
		var optionsText = "<option value=''>请选择城市</option>";
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
		}
});

/**
 * 将活动置为有效
 * @param strategyCode
 */
function useStrategy(strategyCode){
	if(confirm('启用后将无法修改操作，是否确认启用该佣金策略？')){
		$.post('/recycle/brokeragestrategy/usestrategy', {strategyCode:strategyCode}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				
			}
		});
	}
}

/**
 * 添加互动策略
 */
function addBrokerageStrategy(){
	window.location.href = '/device/brokerage/addbrokerage?backUri='+backUri;
}

function getParams(){
	return {
		strategyName:$('#strategyName').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
		agents:$('#agents').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

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
