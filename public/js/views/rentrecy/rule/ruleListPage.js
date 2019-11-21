var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"鉴定规则ID", dataIndex:'RULEID', width:'100px',sortable:false}
			,{header:"所属来源", dataIndex:'SOURCENAME', width:'80px', sortable:false}
			,{header:"规则品类", dataIndex:'MERTYPENAME', width:'80px', sortable:false}
			,{header:"鉴定规则名称", dataIndex:'RULENAME', sortable:false}
			,{header:"状态", dataIndex:'RULESTATUS',width:'80px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == '2'){
						var returnText = '<span class="green">已启用</span>';
					}else if(value == '1'){
						var returnText = '<span class="blue">未启用</span>';
					}else if(value == '3'){
						var returnText = '<span class="red">已停用</span>';
					}else{
						var returnText = value;
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'RULEID', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	return '<a class="a_link" href="javascript:selectRule(\''+value+'\', '+JSON.stringify(data).replace(/"/g, '&quot;')+')">选择</a>';
				}
		   	}
		]
		,url:'/rentrecy/rule/pagelist'
		,baseParams:getParams()
		,pageSizeList:[15,30,50]
	});
});

function getParams(){
	return {
		category:$('#category').val(),
		merType:$('#merType').val(),
		ruleName:$('#ruleName').val()
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
function selectRule(ruleId, ruleInfo){
	parent.getSelectIdentifyRule(ruleId, ruleInfo);
}
