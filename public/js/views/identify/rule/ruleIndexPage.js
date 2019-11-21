var grid, layerIndex=0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"商品分类", dataIndex:'TYPENAME', width:'100px',sortable:false}
			,{header:"规则ID", dataIndex:'RULEID', width:'100px',sortable:false}
			,{header:"规则名称", dataIndex:'RULENAME',sortable:false}
			,{header:"模板类型", dataIndex:'MODELFLAG', width:'100px',sortable:false,
				renderer :function(value, data, rowIndex, colIndex, metadata){
					if(value == 'Y'){
						return '通用模板';
					}else if(value == 'S'){
						return '简单模板';
					}else if(value == 'C'){
						return '复杂模板';
					}else{
						return value;
					}
				}
			}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'120px',sortable:false}
			,{header:"状态", dataIndex:'RULESTATUS', width:'100px',sortable:false,
				renderer :function(value, data, rowIndex, colIndex, metadata){
					if(value == '2'){
						return '<span class="green">已启用</span>';
					}else if(value == '3'){
						return '<span class="red">已停用</span>';
					}else if(value == '1'){
						return '<span class="blue">未启用</span>';
					}else{
						return value;
					}
				}
			}
			,{header:"所属业务", dataIndex:'BUSINESSNAME', width:'100px',sortable:false}
			,{header:"操作", dataIndex:'RULEID', width:'200px', sortable:false,
				renderer :function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a href="javascript:ruleInfo(\''+value+'\')" class="a_link">查看</a>';
					var status = data['RULESTATUS'];
					if(status == '1'){
						returnText += ' | <a href="javascript:editRule(\''+value+'\')" class="a_link">修改</a>';
						returnText += ' | <a href="javascript:enableRule(\''+value+'\')" class="a_link">启用</a>';
						//returnText += ' | <a href="javascript:enableAllRule(\''+value+'\')" class="a_link">一键启用</a>';
					}else if(status == '2'){
						returnText += ' | <a href="javascript:disableRule(\''+value+'\')" class="a_link">停用</a>';
					}
					returnText += ' | <a href="javascript:deleteRule(\''+value+'\')" class="a_link">删除</a>';
					returnText += ' | <a href="javascript:copyRule(\''+value+'\')" class="a_link">复制</a>';
					return returnText;
				}
			}
		]
		,url :'/identify/rule/pagelist'
		,pageSizeList:[15,30,50]
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});
});

/**
 * 新增鉴定规则
 * @return
 */
function addRule(){
	layer.open({
		type:2,
		title:'添加鉴定规则',
		shadeClose:false,
		shade:0.8,
		content:'/identify/rule/addrule',
		area :['500px', '350px'],
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
function ruleInfo(ruleId){
	layer.open({
		type:2,
		title:'规则详情',
		shadeClose:false,
		shade:0.8,
		content:"/identify/rule/ruleinfo?ruleId="+ruleId,
		area :['100%', '100%'],
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
		title:'修改鉴定规则',
		shadeClose:false,
		shade:0.8,
		content:'/identify/rule/editrule?ruleId='+ruleId,
		area:['500px','350px'],
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
function copyRule(ruleId){
	layer.open({
		type:2,
		title:'复制鉴定规则',
		shadeClose:false,
		shade:0.8,
		content:'/identify/rule/copyruleindex?ruleId='+ruleId,
		area:['500px','350px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function enableRule(ruleId){
	if(confirm('是否确认启用规则？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/enablerule"  //请求路径
			,data:{ruleId:ruleId}  //发送到服务器的数据
			,cache:false  //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false  //同步请求
			,timeout:60000  //默认超时60秒
			,dataType:'json'  //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					grid.reload();
				}else{
					alert("启用失败："+data);
				}
			}
		});
	}
}

function disableRule(ruleId){
	if(confirm('是否确认停用规则？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/disablerule"  //请求路径
			,data:{ruleId:ruleId}  //发送到服务器的数据
			,cache:false  //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false  //同步请求
			,timeout:60000  //默认超时60秒
			,dataType:'json'  //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					grid.reload();
				}else{
					alert("停用失败："+data);
				}
			}
		});
	}
}

function deleteRule(ruleId){
	if(confirm('是否确认删除该规则？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/deleterule"  //请求路径
			,data:{ruleId:ruleId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					alert('删除成功');
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
		ruleId:$('#ruleId').val(),
		ruleName:$('#ruleName').val(),
		category:$('#category').val(),
		businessCode:$('#businessCode').val(),
		merType:$('#merType').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}