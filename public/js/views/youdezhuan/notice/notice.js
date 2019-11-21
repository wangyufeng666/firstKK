var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm : [
        	{header: "NO.", dataIndex: 'R', width:'3%',sortable:false} 
           ,{header: "标题", dataIndex: 'TITLE', width:'10%',sortable:false}
           ,{header: "内容简介", dataIndex: 'TITLEEXT', width:'10%',sortable:false}
			,{header: "公告时间", dataIndex: 'VIEWDATE', width:'9%',sortable:false}
           ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'12%',sortable:false}
           ,{header: "状态", dataIndex: 'STATUSNAME', width:'5%',sortable:false,}
			,{header: "排序", dataIndex: 'SEQ', width:'5%',sortable:false,}
           ,{header: "操作", dataIndex: '', width:'20%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
           			var returnText = '';
						returnText += '<a class="a_link" href="javascript:void(0);" onclick="edit(\''+data['PKID']+'\')">编辑</a>';
						returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="del(\''+data['PKID']+'\')">停用</a>';
					return returnText
				}
           	}
        ]
        ,url : '/youdezhuan/notice/pagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	var params = getParams();
	params['start'] = 0;
	params['limit'] = 10;
	return params;
}

function getParams(){
    return {
		title:$('#title').val(),
    	startDate:$('#startDate').val(),
    	endDate:$('#endDate').val(),
		startViewDate:$('#startViewDate').val(),
		endViewDate:$('#endViewDate').val(),
    	status:$('#status').val(),
		source:3
    };
}

function doSearch(){
	layer.msg('数据加载中...');
    grid.query(getParams());
}

/**
 * 新增公告
 * @returns
 */
function addNotice(){
	layer.open({
		type:2,
		title:'新增公告',
		content:'/youdezhuan/notice/addnotice',
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

//编辑公告
function edit(pkId) {
	layer.open({
		type:2,
		title:'新增公告',
		content:'/youdezhuan/notice/editnotice?pkId='+pkId,
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除行业新闻
 */
function del(pkId) {
	if (confirm('是否停用该公告!')){
		var params = {};
		params.pkId = pkId;
		$.ajax({
			type:'POST'//请求方式
			,url:"/youdezhuan/notice/updatestatus"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if (data.code == '200'){
					layer.msg('操作成功');
				}else{
					layer.msg('操作失败');
				}
				setTimeout("window.location.reload();",2000);
			}
		});
	}else{
		return false;
	}
}

/**
 * 清除接口新闻缓存
 */
function delRedis() {
	if (confirm('是否清楚缓存!')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/youdezhuan/notice/delredis"  //请求路径
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if (data.code == '200'){
					layer.msg('操作成功');
				}else{
					layer.msg('操作失败');
				}
				setTimeout("window.location.reload();",2000);
			}
		});
	}else{
		return false;
	}
}