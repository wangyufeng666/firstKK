var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :15,
    height:375
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
      ,{header: "商品分类", dataIndex: 'MERTYPE', width:'100px',sortable:false}
      ,{header: "规则名称", dataIndex: 'RULENAME',sortable:false}
      ,{header: "利润率", dataIndex: 'PROFIT', width:'100px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'270px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText = '<a href="javascript:ruleInfo(\''+data['RULEID']+'\')" class="a_link">查看</a> | ';
    	  returnText += '<a href="javascript:editRule(\''+data['RULEID']+'\')" class="a_link">修改</a> | ';
    	  returnText += '<a href="javascript:deleteRule(\''+data['RULEID']+'\')" class="a_link">删除</a> | ';
    	  returnText += '<a href="javascript:copyRule(\''+data['RULEID']+'\')" class="a_link">复制</a> | ';
    	  returnText += '<a href="javascript:syncRedis(\''+data['RULEID']+'\')" class="a_link" title="同步到redis">同步</a>  | ';
    	  returnText += '<a href="javascript:addRuleOption(\''+data['RULEID']+'\')" class="a_link" title="新增规则分类">新增规则分类</a>';
          return returnText;
        }
      }
    ]
    ,url : '/rule/rule/pagelist'
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
        title:'添加所属规则',
        content:'/rule/rule/addrule?backUrl='+backUrl,
        area : ['400px', '300px']
    });
}

/**
 * 规则详情
 * @param orderNo
 * @return
 */
function ruleInfo(ruleId){
	window.location.href = "/rule/rule/ruleinfo?ruleId="+ruleId+"&backUrl="+backUrl;
}

/**
 * 修改规则
 * @param ruleId
 * @return
 */
function editRule(ruleId){
	layer.open({
		type:2,
		title:'修改所属规则',
		content:'/rule/rule/editrule?ruleId='+ruleId+'&backUrl='+backUrl,
		area:['500px','350px']
	});
}

/**
 * 复制规则
 * @param ruleId
 * @return
 */
function copyRule(ruleId){
	layer.open({
		type:2,
		title:'复制所属规则',
		content:'/rule/rule/copyrule?ruleId='+ruleId+'&backUrl='+backUrl,
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
    			alert('同步成功');
    			grid.reload();
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
	        ,url:"/rule/rule/deleterule"  //请求路径
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

//功能描述：新增规则分类
function addRuleOption(ruleId){
   layer.open({
        type:2,
        title:'新增规则分类',
        content:'/rule/ruleclassify/addruleoptions?ruleId='+ruleId,
        area:['500px','350px']
   });
}

function getParams(){
    return {
        ruleName:$('#ruleName').val(),
        merType:$('#merType').val()
    };
}

function doSearch(){
    grid.query(getParams());
}
