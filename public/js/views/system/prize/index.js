var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"活动名称", dataIndex:'ACTIVENAME',sortable:false}
			,{header:"渠道商", dataIndex:'PARTNERNAME',sortable:false}
			,{header:"活动开始时间", dataIndex:'STARTDATE',sortable:false}
			,{header:"活动结束时间", dataIndex:'ENDDATE' ,sortable:false}
			,{header:"操作", dataIndex:'', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
				var returnText = '<a href="javascript:void(0);" onclick="activeInfo(\''+data['ACTIVECODE']+'\')" class="a_link">查看</a> | ';
				returnText += '<a href="javascript:void(0);" onclick="editActive(\''+data['ACTIVECODE']+'\')" class="a_link">修改</a> | ';
				returnText += '<a href="javascript:void(0);" onclick="deleteActive(\''+data['ACTIVECODE']+'\')" class="a_link">删除</a>	';
					return returnText;
				}
			}
		]
		,url:'/system/prize/pagelist'
	});
});

/**
 * 活动详情
 */
function activeInfo(activeCode){
	window.location.href = "/system/prize/activeinfo?activeCode="+activeCode+"&backUrl="+backUrl;
}

/**
 * 现在所属规则
 * @return
 */
function addActive(){
	layer.open({
		type:2,
		title:'添加所属规则',
		content:'/system/prize/addactive?backUrl='+backUrl,
		area:['400px', '300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 修改活动信息
 */
function editActive(activeCode){
	layer.open({
		type:2,
		title:'修改活动信息',
		content:'/system/prize/editactive?activeCode='+activeCode+'&backUrl='+backUrl,
		area:['500px','350px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function deleteActive(activeCode){
	if(confirm('是否确认删除该活动？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/system/prize/deleteactive"//请求路径
			,data:{activeCode:activeCode} //发送到服务器的数据
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
		activeName:$('#activeName').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		partnerCode:$('#partnerCode').val()
	};
}

function doSearch(){
	grid.query(getParams());
}
