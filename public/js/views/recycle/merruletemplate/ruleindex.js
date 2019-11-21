var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX', sortable:false} 
			,{header:"商品分类", dataIndex:'MERTYPE', width:'100px', sortable:false}
			,{header:"规则名称", dataIndex:'RULENAME', width:'260px', sortable:false}
			,{header:"规则标记", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<span class="green">线上规则</span>';
					if(data['SYSFLAG'] == '2'){
						returnText = '<span class="red">线下规则</span>';
					}
					return returnText;
				}
			}
			,{header:"利润率", dataIndex:'PROFIT', width:'100px', sortable:false}
			,{header:"操作", dataIndex:'', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var ruleId = data['RULEID'];
					var returnText = '<a href="javascript:ruleInfo(\''+ruleId+'\')" class="a_link">查看</a>';
                    returnText += ' | <a href="javascript:editRule(\''+ruleId+'\')" class="a_link">修改</a>';
                    returnText += ' | <a href="javascript:deleteRule(\''+ruleId+'\')" class="a_link">删除</a>';
					return returnText;
				}
			}
		]
		,url:'/recycle/merruletemplate/pagelist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		return params;
	}else{
		return {};
	}
}

/**
 * 现在所属规则
 * @return
 */
function addRule(){
	layer.open({
		type:2,
		title:'添加通用规则模板',
		content:'/recycle/merruletemplate/addrule',
		area:['400px', '300px']
	});
}


/**
 * 删除所属规则
 * @return
 */
function deleteRule(ruleId){
	if(confirm('是否确认删除该模板规则？')){
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
		title:'修改通用规则模板',
		content:'/recycle/merrule/editrule?ruleId='+ruleId+'&backUrl='+backUrl,
		area:['400px', '300px'],
	});
}

function getParams(){
	return {
		merType:$('#merType').val(),
		sysFlag:$('#sysFlag').val(),
		ruleName:$('#ruleName').val()
	};
}

function doSearch(){
	grid.query(getParams());
}