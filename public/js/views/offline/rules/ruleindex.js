var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX', sortable:false} 
			,{header:"商品分类", dataIndex:'MERTYPE', width:'100px', sortable:false}
			,{header:"规则名称", dataIndex:'RULENAME', sortable:false}
			,{header:"利润率", dataIndex:'PROFIT', width:'100px', sortable:false}
			,{header:"商品数量", dataIndex:'MERCOUNTS', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var ruleId = data['RULEID'];
					var ruleName = data['RULENAME'];
					return '<a class="a_link" href="javascript:showRuleMers(\''+ruleId+'\',\''+ruleName+'\')">'+data['MERCOUNTS']+'</a>';
				}
			}
			,{header:"启用状态", dataIndex:'ENABLED', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '';
					if(data['ENABLED'] == 'Y'){
						returnText = '<font color="green">已启用</font>';
					}else if(data['ENABLED'] == 'N'){
						returnText = '<font color="red">已禁用</font>';
					}else if(data['ENABLED'] == 'C'){
						returnText = '<font>未启用</font>';
					}else{
						returnText = '<font color="red">未知'+data['ENABLED']+'</font>';
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'', width:'240px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var ruleId = data['RULEID'];
					var enableFlag = data['ENABLED'];
					var returnText = '<a href="javascript:ruleInfo(\''+ruleId+'\')" class="a_link">查看</a>';
					if(enableFlag == 'Y'){
						returnText += ' | <a href="javascript:stopRule(\''+ruleId+'\')" class="a_link">停用</a>';
					}else{
						returnText += ' | <a href="javascript:useRule(\''+ruleId+'\')" class="a_link">启用</a>';
						returnText += ' | <a href="javascript:editRule(\''+ruleId+'\')" class="a_link">修改</a>';
						returnText += ' | <a href="javascript:deleteRule(\''+ruleId+'\')" class="a_link">删除</a>';
					}
					returnText += ' | <a href="javascript:copyRule(\''+ruleId+'\')" class="a_link">复制</a>';
					if(enableFlag == 'Y'){
						returnText += ' | <a href="javascript:syncRedis(\''+ruleId+'\')" class="a_link">同步缓存</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/recycle/merrule/pagelist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
	}else{
		var params = getParams();
	}
	return params;
}

/**
 * 停用规则
 * @param ruleId
 * @returns
 */
function stopRule(ruleId){
	if(confirm('是否停用该商品规则？')){
		$.post('/recycle/merrule/stoprule',{ruleId:ruleId},function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert(data);
			}
		});
	}
}

/**
 * 添加商品规则
 * @return
 */
function addRule(){
    window.location.href = '/recycle/merrule/addrule?backUrl='+backUrl;
}

/**
 * 规则详情
 * @param orderNo
 * @return
 */
function ruleInfo(ruleId){
	window.location.href = "/recycle/merrule/ruleinfo?ruleId="+ruleId+'&backUrl='+backUrl;
}

/**
 * 修改规则
 * @param ruleId
 * @return
 */
function editRule(ruleId){
	layer.open({
		type:2,
		title:'修改商品规则',
		content:'/recycle/merrule/editrule?ruleId='+ruleId+'&backUrl='+backUrl,
		area:['400px', '300px']
	});
}

/**
 * 启用规则
 */
function useRule(ruleId){
	if(confirm('是否启用该商品规则？')){
		$.post('/recycle/merrule/jsonuserule',{ruleId:ruleId},function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				alert(data);
			}
		});
	}
}

/**
 * 复制规则
 * @param ruleId
 * @return
 */
function copyRule(ruleId){
	layer.open({
		type:2,
		title:'复制商品规则',
		content:'/recycle/merrule/copyrule?ruleId='+ruleId+'&backUrl='+backUrl,
		area:['400px','300px']
	});
}

/**
 * 同步规则到redis
 * @param ruleId
 * @return
 */
function syncRedis(ruleId){
	$.ajax({
		type:'POST'//请求方式
		,url:"/redis/recycle/syncrule"  //请求路径
		,data:{ruleId:ruleId} //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			if(data == "Y"){
				layer.msg('同步成功', {icon:6}, function(){
					window.location.href = backUrl;
				});
			}else{
				alert("同步失败");
			}
		}
	});
}

function deleteRule(ruleId){
	if(confirm('是否确认删除该规则？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merrule/deleterule"  //请求路径
			,data:{ruleId:ruleId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					grid.reload();
				}else{
					alert("删除失败");
				}
			}
		});
	}
}

function getParams(){
	return {
		merType:$('#merType').val(),
		ruleName:$('#ruleName').val(),
		sysFlag:2
	};
}

function showRuleMers(ruleId, ruleName){
	layer.open({
		type:2,
		title:ruleName+'|商品列表',
		content:'/recycle/merrule/rulemers?ruleId='+ruleId+'&ruleName='+ruleName,
		area:['80%', '375px']
	});
}

function doSearch(){
	grid.query(getParams());
}