var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
        	{header: "属性编号", dataIndex: 'ATTRID', width:'60px',sortable:false} 
           ,{header: "属性名称", dataIndex: 'ATTRNAME', width:'150px',sortable:false}
           ,{header: "属性类型", dataIndex: 'ATTRTYPE', width:'150px',sortable:false}
           ,{header: "备注", dataIndex: 'REMARK', width:'150px',sortable:false}
           ,{header: "价格", width:'150px',sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
        		   var returnText;
        		   if(data['GROUPNAME']){
        			   returnText = data['PRICES']+"("+data['GROUPNAME']+")";
        		   }else{
        			   returnText = '暂无';
        		   }
        		   return returnText;
        	   } 
           }
           ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'150px',sortable:false}
           ,{header: "操作",width:'150px',sortable:false, 
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
        		   var returnText = "<a href ='#' class='a_link' onclick='attrAlter("+data['ATTRID']+");'>修改</a>";
        		   returnText += "&nbsp|&nbsp<a href ='#' class='a_link' onclick='attrDelete("+data['ATTRID']+");'>删除</a>";
        		   return returnText;
        	   }
           }
        ]
        ,url : '/notebook/attributes/attributepagelist'
	});
});

function attrAlter(attrId){

	window.location.href = '/notebook/attributes/alterattributes?attrId='+attrId;
}

function attrDelete(attrId){
	if(confirm("确定删除？")){
		$.ajax({
	        type : 'POST'//请求方式
	        ,url : "/notebook/attributes/deleteattributes"  //请求路径
	        ,data : {attrId:attrId}  //发送到服务器的数据
	        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async : false //同步请求
	        ,timeout :60000//默认超时60秒
	        ,dataType:'json' //预期服务器返回的数据类型
	        ,success : function(data){
	            if('Y' == data){
	            	window.location.href ='/notebook/attributes';
	            }else if('N' == data){
	                alert("属性正在使用不能删除"); 
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

function addAttribute(attrId){
	window.location.href = "/notebook/attributes/addattributes";
}

function getParams(){
    return {
    	attrName:$('#attrName').val(), 
    	attrType:$('#attrType').val(),
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val()
    	
    };
}