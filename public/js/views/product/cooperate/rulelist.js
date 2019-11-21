var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"商品分类", dataIndex:'MERTYPE', width:'100px', sortable:false}
			,{header:"规则名称", dataIndex:'RULENAME', width:'260px', sortable:false}
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
			,{header:"操作", dataIndex:'RULEID', width:'60px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	return '<a class="a_link" href="javascript:getSelectRule(\''+value+'\', '+JSON.stringify(data).replace(/"/g, '&quot;')+')">选择</a>';
				}
		   	}
		]
		,url:'/recycle/merrule/pagelist'
		,baseParams:getParams()
		,pageSizeList:[15,30,50]
	});
});

function getParams(){
	return {
		ruleName:$('#ruleName').val(), 
		merType:$('#merType').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}

document.onkeypress = keypress;

/**
 * 选中商品
 * @returns
 */
function getSelectRule(ruleId, ruleInfo){
	parent.getSelectRule(ruleId, ruleInfo);
}
