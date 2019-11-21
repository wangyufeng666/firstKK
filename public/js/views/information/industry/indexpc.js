var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
        	{header: "NO.", dataIndex: 'R', width:'3%',sortable:false} 
           ,{header: "标题", dataIndex: 'TITLE', width:'13%',sortable:false}
			,{header: "位置", dataIndex: 'PCIMGPOSITIONNAME', width:'9%',sortable:false}
			,{header: "资讯时间", dataIndex: 'VIEWDATE', width:'9%',sortable:false}
           ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'12%',sortable:false}
           ,{header: "状态", dataIndex: 'STATUSNAME', width:'5%',sortable:false,}
			,{header: "排序", dataIndex: 'SEQ', width:'5%',sortable:false,}
           ,{header: "操作", dataIndex: '', width:'20%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
           			var returnText = '';
						returnText += '<a class="a_link" href="javascript:void(0);" onclick="edit(\''+data['PKID']+'\')">编辑</a>';
						returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="del(\''+data['PKID']+'\')">删除</a>';
					return returnText
				}
           	}
        ]
        ,url : '/information/industry/pagelist'
		,baseParams:initParams()
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
		pcImgPosition:$('#pcImgPosition').val(),
    	status:$('#status').val(),
		source:2
    };
}

function doSearch(){
	layer.msg('数据加载中...');
    grid.query(getParams());
}

/**
 *  新增行业资讯
 */
function addIndustry(){
	window.location.href='/information/industry/addnews?newsSource=2';
}

function edit(pkId) {
	window.location.href='/information/industry/updatenews?newsSource=2&pkId='+pkId;
}

/**
 * 删除行业新闻
 */
function del(pkId) {
	if (confirm('是否删除该新闻!')){
		var params = {};
		params.pkId = pkId;
		$.ajax({
			type:'POST'//请求方式
			,url:"/information/industry/delindustry"  //请求路径
			,data:params  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if (data.code == 1000){
					layer.msg('删除成功');
					setTimeout("window.location.reload();",2000);
				}else{
					layer.msg('删除失败');
					$('#btn_submit').bind('click', function(){editIndustry();});
				}
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
	var source = 2;
	if (confirm('是否清楚缓存!')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/information/industry/delnewsredis"  //请求路径
			,data:{source:source}  //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if (data.code == 1000){
					layer.msg('清除成功');
					setTimeout("window.location.reload();",2000);
				}else{
					layer.msg('清除失败,请稍后刷新页面重新清除');
					$('#btn_submit').bind('click', function(){editIndustry();});
				}
			}
		});
	}else{
		return false;
	}
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}