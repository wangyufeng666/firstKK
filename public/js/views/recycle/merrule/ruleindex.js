var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX', sortable:false} 
			,{header:"商品分类", dataIndex:'MERTYPE', width:'100px', sortable:false}
			,{header:"规则名称", dataIndex:'RULENAME', width:'260px', sortable:false}
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
						returnText = '<font color="red">已停用</font>';
					}else if(data['ENABLED'] == 'C'){
						returnText = '<font>未启用</font>';
					}else{
						returnText = '<font color="red">未知'+data['ENABLED']+'</font>';
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var ruleId = data['RULEID'];
					var enableFlag = data['ENABLED'];
					var ruleName = data['RULENAME'];
					var returnText = '<a href="javascript:ruleInfo(\''+ruleId+'\', \''+ruleName+'\')" class="a_link">查看</a>';
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
					returnText += ' | <a href="javascript:addRuleOption(\''+data['RULEID']+'\')" class="a_link" title="新增规则分类">新增规则分类</a>';
					return returnText;
				}
			}
		]
		,url:'/recycle/merrule/pagelist'
		,pageSizeList:[15,30,50]
	});
});

function initParams(){
	return getParams();
}

/**
 * 添加商品规则
 * @return
 */
function addRule(){
	layer.open({
		type:2,
		title:'添加规则模板',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/merrule/addrule',
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
   });
}

/**
 * 规则详情
 * @param orderNo
 * @return
 */
function ruleInfo(ruleId, ruleName){
	layer.open({
		type:2,
		title:'回收规则详情-'+ruleName,
		shadeClose:false,
		shade:0.8,
		content:"/recycle/merrule/ruleinfo?ruleId="+ruleId+'&ruleName='+ruleName,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
   });
}

/**
 * 修改规则
 * @param ruleId
 * @return
 */
function editRule(ruleId){
	layer.open({
		type:2,
		shadeClose:false,
		shade:0.8,
		title:'修改商品规则',
		content:'/recycle/merrule/editrule?ruleId='+ruleId,
		area:['400px', '300px']
	});
}

function showRuleMers(ruleId, ruleName){
	layer.open({
		type:2,
		shadeClose:false,
		shade:0.8,
		title:'规则商品列表',
		content:'/recycle/merrule/rulemers?ruleId='+ruleId+'&ruleName='+ruleName,
		area:['90%', '90%']
	});
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

//功能描述：新增规则分类
function addRuleOption(ruleId){
	layer.open({
		type:2,
		shadeClose:false,
		shade:0.8,
		title:'新增规则分类',
		content:'/rule/ruleclassify/addruleoptions?ruleId='+ruleId,
		area:['500px','400px']
	});
}

/**
 * 启用规则
 */
function useRule(ruleId){
	if(confirm('是否启用该商品规则？')){
		$.post('/recycle/merrule/jsonuserule',{ruleId:ruleId},function(data){
			if(data == 'Y'){
				grid.reload();
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
		shadeClose:false,
		shade:0.8,
		title:'复制商品规则',
		content:'/recycle/merrule/copyrule?ruleId='+ruleId,
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
				layer.msg('同步成功', {icon:6});
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
		sysFlag:1
	};
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}
