var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"编号", dataIndex:'INSPECTORID', width:'15%',sortable:false}
			,{header:"姓名", dataIndex:'NAME', width:'6%',sortable:false}
			,{header:"电话", dataIndex:'PHONE', width:'10%',sortable:false}
			,{header:"工号", dataIndex:'JOBNUM', width:'15%',sortable:false}
			,{header:"地区", dataIndex:'AREA_NAME', width:'8%',sortable:false}
			,{header:"检测人分组", dataIndex:'INSPECTGROUP', width:'8%',sortable:false}
			,{header:"派单总数", dataIndex:'COUNTS', width:'8%',sortable:false}
			,{header:"操作", dataIndex:'', width:'12%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:taskInfo(\''+data['JOBNUM']+'\')">任务详情</a>';
					returnText +='&nbsp;|&nbsp;<a class="a_link" href="javascript:editInspector(\''+data['INSPECTORID']+'\')">修改</a>';
					returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:deleteInspector(\''+data['INSPECTORID']+'\')">删除</a>';
					return returnText;
				}
			}
		]
		,url:'/system/inspector/pagelist'
		,baseParams:{isAll:'all'}
	});
});

/**
 * 新增检测人员
 */
function addInspector(){
	layer.open({
		type:2,
		title:'新增检测人员',
		shadeClose:false,
		shade:0.8,
		content:"/system/inspector/addinspector",
		area:['600px','400px'],
		close:function(index){
			layer.close(index);
		}
   });
}

/**
 * 任务详情
 */
function taskInfo(inspectorId){
	layer.open({
		type:2,
		title:'检测人员派单任务列表',
		shadeClose:false,
		shade:0.8,
		content:"/system/inspector/taskinfo?inspectorId="+inspectorId,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
   });
}

/**
 * 删检测人员
 */
function deleteInspector(inspectorId){
	if(confirm('是否确认删除该检测员？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/system/inspector/deleteinspector"  //请求路径
			,data:{inspectorId:inspectorId}  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.href = "/system/inspector/";
				}
			}
		});
	}
}

/**
 * 修改检测人员信息
 */
function editInspector(inspectorId){
	layer.open({
		type:2,
		title:'新增检测人员',
		shadeClose:false,
		shade:0.8,
		content:"/system/inspector/editinspector?inspectorId="+inspectorId,
		area:['600px','400px'],
		close:function(index){
			layer.close(index);
		}
   });
}

function getParams(){
	return {};
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

function doSearch(){
	grid.query(getParams());
}
