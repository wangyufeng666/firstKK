var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
	        	{header: "NO.", dataIndex: 'R', width:'3%',sortable:false} 
	           ,{header: "标题", dataIndex: 'BIAOTI', width:'8%',sortable:false}
	           ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'20%',sortable:false}
	           ,{header: "审批状态", dataIndex: 'SHENPIZT', width:'6%',sortable:false,
					renderer : function(value, data, rowIndex, colIndex, metadata){
	        	   return value == '1' ? '审核通过' : '待审核';
				}   
	           }        	  
           ,{header: "操作", dataIndex: '', width:'12%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="ExperienceInfo(\''+data['JINGYANHEZIID']+'\')">详情</a>';
				  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="approvalexperience(\''+data['JINGYANHEZIID']+'\')">审批</a>';
				  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="deleteThis(\''+data['JINGYANHEZIID']+'\')">删除</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/information/experience/pagelist'
	});
});

/**
 * 器材动态详情
 * @param orderId
 * @return
 */
function ExperienceInfo(Id){
	window.location.href = "/information/experience/experienceinfo?Id="+Id;
}


/**
 * 跳转到审核态页面
 * @param orderNo
 */
function approvalexperience(Id){

	
	window.location.href="/information/experience/approvalexperience?Id="+Id;
}

/**
 * 删除器材动态
 */
function deleteThis(Id){
	if(confirm("是否确认删除当前数据？")){
		$.ajax({
			type: "POST",
			dataType:"json",
			url:'/information/experience/delete',
			data:{Id:Id},
			success: function(data){
				if(data=='1'){
					//alert("删除成功");
					window.location.href='/information/experience/index';
				}else{
					alert("删除失败");
				}
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
        	} 
		}); 
	}
}


function getParams(){
    return {
    	biaoti:$('#biaoti').val(), 
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
    	shenpiZT:$('#shenpiZT').val()
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