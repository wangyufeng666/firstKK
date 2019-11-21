var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
      ,{header: "商品分类", dataIndex: 'MERTYPE', width:'100px',sortable:false}
      ,{header: "规则名称", dataIndex: 'RULENAME',sortable:false}
      ,{header: "利润率", dataIndex: 'PROFIT', width:'100px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'200px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText = '<a href="javascript:void(0);" onclick="ruleInfo(\''+data['RULEID']+'\')" class="a_link">查看</a> | ';
//    	  returnText += '<a href="javascript:void(0);" onclick="addRuleType(\''+data['ORDERNO']+'\')" class="a_link">新增</a> | ';
    	  returnText += '<a href="javascript:void(0);" onclick="editRule(\''+data['RULEID']+'\')" class="a_link">修改</a> | ';
    	  returnText += '<a href="javascript:void(0);" onclick="deleteRule(\''+data['RULEID']+'\')" class="a_link">删除</a>';
          return returnText;
        }
      }
    ]
    ,url : '/guize/rule/pagelist'
    ,baseParams:initParams()
    ,pageSizeList:[10,15,20,30,50]
  });
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
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
	window.location.href = '/guize/rule/addrule?backUrl='+backUrl;
}

/**
 * 规则详情
 * @param orderNo
 * @return
 */
function ruleInfo(ruleId){
	window.location.href = "/guize/rule/ruleinfo?ruleId="+ruleId+"&backUrl="+backUrl;
}

/**
 * 修改规则
 * @param ruleId
 * @return
 */
function editRule(ruleId){
	window.location.href = '/guize/rule/editrule?ruleId='+ruleId+'&backUrl='+backUrl;
}

function deleteRule(ruleId){
	if(confirm('是否确认删除该规则？')){
		$.ajax({
	        type:'POST'//请求方式
	        ,url:"/guize/rule/deleterule"  //请求路径
	        ,data:{ruleId:ruleId} //发送到服务器的数据
	        ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async:false //同步请求
	        ,timeout:60000//默认超时60秒
	        ,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
	    		if(data == "Y"){
	    			window.location.href = backUrl;
	            }else{
					alert("删除失败");
	            }
			}
		});
	}
}

function getParams(){
    return {
        ruleName:$('#ruleName').val(),
        merType:$('#merType').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}