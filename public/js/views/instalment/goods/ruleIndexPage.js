var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'60PX',sortable:false}
			,{header:"规则ID", dataIndex:'RULEID', width:'100px',sortable:false}
			,{header:"规则名称", dataIndex:'RULENAME',sortable:false}
			,{header:"操作", dataIndex:'RULEID', width:'200px', sortable:false, 
				renderer :function(value, data, rowIndex, colIndex, metadata){
                    return returnText = '<a href="javascript:relationRule(\''+value+'\')" class="a_link">关联</a>';
				}
			}
		]
		,url :'/instalment/product/recyrulelist'
		,baseParams:{}
		,pageSizeList:[15,30,50]
  });
});


function relationRule(ruleId){
	if(confirm('是否关联该规则？')){
		$.ajax({
	        type:'POST'//请求方式
	        ,url:"/instalment/product/relationrule"  //请求路径
	        ,data:{ruleId:ruleId,productId:productId}  //发送到服务器的数据
	        ,cache:false  //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async:false  //同步请求
	        ,timeout:60000  //默认超时60秒
	        ,dataType:'json'  //预期服务器返回的数据类型
			,success:function(data){
	    		if(data == "Y"){
	    			alert('关联成功');
                    goBack();
	            }else{
					alert("关联失败："+data);
	            }
			}
		});
	}
}

function getParams(){
    return {
        ruleId:$('#ruleId').val(),
        ruleName:$('#ruleName').val()
    };
}



function doSearch(){
    grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function goBack() {
    window.history.back(-1);
    grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}