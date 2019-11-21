var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
        	{header: "No.", dataIndex: 'R', width:'40px',sortable:false} 
           ,{header: "集中报价组名称", dataIndex: 'GROUPNAME', sortable:false}
           ,{header: "报价组属性类型", dataIndex: 'ATTRTYPENAME', width:'150px',sortable:false}
           ,{header: "价格", dataIndex: 'PRICE', width:'150px',sortable:false}
           ,{header: "创建日期", dataIndex: 'STRCREATEDATE', width:'150px',sortable:false}
           ,{header: "操作",width:'150px',sortable:false, 
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
        		   var returnText = "<a href ='#' class='a_link' onclick='quoteGroupInfo(\""+data['GROUPID']+"\");'>详情</a>";
        		   returnText += " | <a href ='#' class='a_link' onclick='editQuoteGroup(\""+data['GROUPID']+"\");'>修改</a>";
        		   returnText += " | <a href ='#' class='a_link' onclick='deleteThis(\""+data['GROUPID']+"\");'>删除</a>";
        		   return returnText;
        	   }
           }
        ]
        ,url : '/notebook/attrquote/pagelist'
	});
});

/**
 * 属性报价组详情
 * @param groupId
 * @return
 */
function quoteGroupInfo(groupId){
	window.location.href = "/notebook/attrquote/quotegroupinfo?groupId="+groupId;
}

/**
 * 修改属性报价组信息
 * @param groupId
 * @return
 */
function editQuoteGroup(groupId){
	window.location.href = "/notebook/attrquote/editquotegroup?groupId="+groupId;
}

/**
 * 删除属性报价组
 * @param groupId
 * @return
 */
function deleteThis(groupId){
	if(confirm("确定删除？")){
		$.ajax({
	        type:'POST'//请求方式
	        ,url:"/notebook/attrquote/deletequotegroup"  //请求路径
	        ,data:{groupId:groupId}  //发送到服务器的数据
	        ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async:false //同步请求
	        ,timeout:60000//默认超时60秒
	        ,dataType:'json' //预期服务器返回的数据类型
	        ,success:function(data){
	            if('Y' == data){
	            	window.location.href ='/notebook/attrquote/index';
	            }else{
	                alert("数据有误 "); 
	            }
	        }
	    });
	}
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function addQuoteGroup(){
	window.location.href = "/notebook/attrquote/addquotegroup";
}

function getParams(){
    return {
    	groupName:$('#groupName').val(), 
    	attrType:$('#attrType').val()
    };
}