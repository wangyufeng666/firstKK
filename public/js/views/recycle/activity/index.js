var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "活动名称", dataIndex: 'EVENTNAME', sortable:false}
			,{header: "活动编号", dataIndex: 'EVENTCODE', width:'100px',sortable:false}
			,{header: "渠道商", dataIndex: 'PARTNERNAME',width:'180px',sortable:false}
			,{header: "开始时间", dataIndex: 'STARTDATE',width:'150px',sortable:false}
			,{header: "结束时间", dataIndex: 'ENDDATE',width:'150px',sortable:false}
			,{header: "发布时间", dataIndex: 'CREATEDATE', width:'150px',sortable:false}
			,{header: "发布状态", dataIndex: 'EVENTSTATUS', width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['EVENTSTATUS'] == 1){
						var returnText = '未发布';
					}else if(data['EVENTSTATUS'] == 2){
						var returnText = '已发布';
					}
					return returnText;
				}
			}
			,{header: "活动状态", dataIndex: '', width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['STARTDATE'] <= $('#nowdate').val() && $('#nowdate').val()<= data['ENDDATE']){
						var returnText = '<font color="#0024D8">进行中</font>';
					}else if(data['STARTDATE'] > $('#nowdate').val()){
						var returnText = '未开始';
					}else if($('#nowdate').val() > data['ENDDATE']){
						var returnText = '<font color="#555">已结束</font>';
					}
					return returnText;
				}
			}
			,{header: "是否启用", dataIndex: 'TYPES', width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['TYPES'] == 'Y'){
						var returnText = '已启用';
					}else if(data['TYPES'] == 'N'){
						var returnText = '<font color="red">已停用</font>';
					}
					return returnText;
				}
			}
			,{header: "操作", dataIndex: '', width:'200px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="info(\''+data['EVENTCODE']+'\')">详情</a>';
				  	if(data['EVENTSTATUS'] == 1){
				  		returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="releases(\''+data['EVENTCODE']+'\')">发布</a>';
				  	}
				  	if(data['TYPES'] == 'Y'){
				  		returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="offs(\''+data['EVENTCODE']+'\')">停用</a>';
				  	}else if(data['TYPES'] == 'N'){
				  		returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="opens(\''+data['EVENTCODE']+'\')">开启</a>';
				  	}
				  	if(data['EVENTSTATUS'] == 1){
				  		returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="edit(\''+data['EVENTCODE']+'\')">修改</a>';
					  	returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="del(\''+data['EVENTCODE']+'\')">删除</a>';
				  	}
				  	return returnText;
				}
           	}
        ]
        ,url : '/recycle/activity/pagelist'
        ,baseParams:{eventsdates:$('#eventsdates').val(),eventname:$('#eventname').val(), partnercode:$('#partnercode').val(),eventstatus:$('#eventstatus').val(),eventtype:$('#eventtype').val(),
        	startdate1:$('#startdate1').val(),startdate2:$('#startdate2').val(),enddate1:$('#enddate1').val(),enddate2:$('#enddate2').val()}
	});
});

/**
 * 端口活动详情
 */
function info(eventcode){
	window.location.href = "/recycle/activity/activityinfo/eventcode/"+eventcode;
}

/**
 * 新增端口活动
 */
function addActivity(){
	window.location.href="/recycle/activity/activitysave";
}

/**
 * 跳转到修改页面
 */
function edit(eventcode){
	window.location.href = "/recycle/activity/activityupdate/eventcode/"+eventcode;
}

/**
 * 删除
 */
function del(eventcode){
	if(confirm('确定删除选中的商品？？？')){
		$.post('/recycle/activity/activitydel/', {eventcode:eventcode}, function(data){
			if(data == 'Y'){
				doSearch();
			}
		});
	}
}
/**
 * 停用
 */
function offs(eventcode){
	updatetypes(eventcode,'N');
}
/**
 * 开启
 */
function opens(eventcode){
	updatetypes(eventcode,'Y');
}

function updatetypes(eventcode,types){
	if(confirm('确定开启当前活动？？？')){
		$.post('/recycle/activity/updateeventtypes/', {eventcode:eventcode,types:types,go:'1'}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				alert('操作失败，稍后再试');
				window.locahost.href='/recycle/activity/index';
			}
		});
	}
}
/**
 * 发布
 */
function releases(eventcode){
	if(confirm('确定发布当前活动？？？发布后不能修改、删除！！！')){
		$.post('/recycle/activity/updateeventstatus/', {eventcode:eventcode,go:'1'}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				alert('操作失败，稍后再试');
				window.locahost.href='/recycle/activity/index';
			}
		});
	}
}

function getParams(){
    return {
    	eventsdates:$('#eventsdates').val(), 
    	eventname:$('#eventname').val(), 
    	partnercode:$('#partnercode').val(),
    	eventstatus:$('#eventstatus').val(),
    	eventtype:$('#eventtype').val(),
    	startdate1:$('#startdate1').val(),
    	startdate2:$('#startdate2').val(),
    	enddate1:$('#enddate1').val(),
    	enddate2:$('#enddate2').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}