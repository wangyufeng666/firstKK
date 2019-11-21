var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
	        	{header: "NO.", dataIndex: 'R', width:'3%',sortable:false} 
	           ,{header: "标题", dataIndex: 'BIAOTI', width:'8%',sortable:false}
	           ,{header: "品牌", dataIndex: 'PINGPAINAME', width:'8%',sortable:false}
	           ,{header: "创建日期", dataIndex: 'CHUANGJIANRQ', width:'12%',sortable:false}
	           ,{header: "活动开始日期", dataIndex: 'KAISHIRIQI', width:'12%',sortable:false}
	           ,{header: "活动结束日期", dataIndex: 'JIESHURIQI', width:'12%',sortable:false}
	           ,{header: "活动状态", dataIndex: 'HUODONGZT', width:'12%',sortable:false,
					renderer : function(value, data, rowIndex, colIndex, metadata){
	        	   return value == '1' ? '启用' : '停用';
				}   
	           }        	   
	           ,{header: "审批状态", dataIndex: 'SHENPIZT', width:'12%',sortable:false,
					renderer : function(value, data, rowIndex, colIndex, metadata){
	        	   return value == '1' ? '审核通过' : value == '-1' ? '审核未通过' : '待审核';
				}   
	           }        	  
           ,{header: "操作", dataIndex: '', width:'20%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="ActivityInfo(\''+data['HUODONGID']+'\')">详情</a>';
				  	if(data['SHENPIZT'] == '1'){
				  	}else if(data['SHENPIZT'] == '0'){
				  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="edit(\''+data['HUODONGID']+'\')">修改</a>';
				  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="approvalactivity(\''+data['HUODONGID']+'\',\''+data['HUODONGZT']+'\')">审批</a>';
				  	}
				  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="deleteThis(\''+data['HUODONGID']+'\')">删除</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/information/activity/pagelist'
	});
});

/**
 * 器材动态详情
 * @param orderId
 * @return
 */
function ActivityInfo(Id){
	window.location.href = "/information/activity/activityinfo?Id="+Id;
}

/**
 * 新增器材动态
 * @return
 */
function addActivity(){
	window.location.href = "/information/activity/addactivity";
}

/**
 * 跳转到审核态页面
 * @param orderNo
 */
function approvalactivity(Id, huodongzt){

	if(huodongzt!='1'){
		alert('当前动态不是启用状态，不能进行审批操作');
		return;
	}
	
	window.location.href="/information/activity/approvalactivity?huodongId="+Id;
}

/**
 * 跳转到修改器材动态页面
 * @param orderNo
 */
function edit(Id){
	window.location.href = "/information/activity/editactivity?Id="+Id;
}

/**
 * 删除器材动态
 */
function deleteThis(Id){
	if(confirm("是否确认删除当前数据？")){
		$.ajax({
			type: "POST",
			dataType:"json",
			url:'/information/activity/delete',
			data:{Id:Id},
			success: function(data){
				if(data=='1'){
					//alert("删除成功");
					window.location.href='/information/activity/index';
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
    	kaishiriqi:$('#kaishiriqi').val(),
    	jieshuriqi:$('#jieshuriqi').val(),
    	huodongZT:$('#huodongZT').val(),
    	shenpiZT:$('#shenpiZT').val(),
    	pinpai:$('#pinpai').val()
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