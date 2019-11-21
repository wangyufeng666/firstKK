var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
        	{header: "NO.", dataIndex: 'R', width:'3%',sortable:false} 
           ,{header: "动态标题", dataIndex: 'BIAOTI', width:'8%',sortable:false}
           ,{header: "品牌", dataIndex: 'PINGPAINAME', width:'8%',sortable:false}
           ,{header: "创建日期", dataIndex: 'CHUANGJIANRQ', width:'16%',sortable:false}
           ,{header: "动态状态", dataIndex: 'ZHUANGTAI', width:'12%',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
        	   return value == '1' ? '启用' : '停用';
			}   
           }        	   
           ,{header: "审批状态", dataIndex: 'SHENPIZT', width:'16%',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
        	   return value == '1' ? '审核通过' : value == '-1' ? '审核未通过' : '待审核';
			}   
           }        	   
           ,{header: "操作", dataIndex: '', width:'20%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="DynamicInfo(\''+data['DONGTAIID']+'\')">详情</a>';
				  	if(data['SHENPIZT'] == '1'){
				  	}else if(data['SHENPIZT'] == '0'){
				  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="edit(\''+data['DONGTAIID']+'\')">修改</a>';
				  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="approval(\''+data['DONGTAIID']+'\',\''+data['ZHUANGTAI']+'\')">审批</a>';
				  	}
				  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="deleteThis(\''+data['DONGTAIID']+'\')">删除</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/information/dynamic/pagelist'
	});
});

/**
 * 器材动态详情
 * @param orderId
 * @return
 */
function DynamicInfo(Id){
	window.location.href = "/information/dynamic/dynamicinfo?Id="+Id;
}

/**
 * 新增器材动态
 * @return
 */
function addDynamic(){
	window.location.href = "/information/dynamic/adddynamic";
}

/**
 * 跳转到审核态页面
 * @param orderNo
 */
function approval(Id, zhuangtai){

	if(zhuangtai!='1'){
		alert('当前动态不是启用状态，不能进行审批操作');
		return;
	}
	
	window.location.href="/information/dynamic/approval?dongtaiId="+Id;
}

/**
 * 跳转到修改器材动态页面
 * @param orderNo
 */
function edit(Id){
	window.location.href = "/information/dynamic/editdynamic?Id="+Id;
}

/**
 * 删除器材动态
 */
function deleteThis(Id){
	if(confirm("是否确认删除当前数据？")){
		$.ajax({
			type: "POST",
			dataType:"json",
			url:'/information/dynamic/deletedynamic',
			data:{Id:Id},
			success: function(data){
				if(data=='1'){
					//alert("删除成功");
					window.location.href='/information/dynamic/index';
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

//function deleteThis(Id){
//	if(confirm('是否确认删除选中的商品？')){
//		$.post('/information/dynamic/deletedynamic', {Id:Id}, function(data){
//			if(data == 'Y'){
//				doSearch();
//			}
//		});
//	}
//}

function getParams(){
    return {
    	biaoti:$('#biaoti').val(), 
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
    	dongtaiZT:$('#dongtaiZT').val(),
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