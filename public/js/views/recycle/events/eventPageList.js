var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"合作商", dataIndex:'PARTNERNAME', width:'120PX',sortable:false}
			,{header:"活动名", dataIndex:'EVENTNAME', width:'120PX',sortable:false}
			,{header:"活动码", dataIndex:'EVENTCODE', width:'140PX',sortable:false}
			,{header:"开始时间", dataIndex:'STARTDATE', width:'140PX',sortable:false}
			,{header:"结束时间", dataIndex:'STOPDATE', width:'140PX',sortable:false}
			,{header:"加价类型", dataIndex:'PLUSPRICETYPENAME', width:'70PX',sortable:false}
			,{header:"支付类型", dataIndex:'PAYTYPENAME', width:'70PX',sortable:false}
			,{header:"活动状态", dataIndex:'EVENTSTATUSNAME', width:'70PX',sortable:false}
			,{header:"操作", dataIndex:'EVENTCODE', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var html = "<a class='a_link' href='javaScript:eventInfo(\"" + value + "\")'>详情</a> | ";
					if(data['EVENTSTATUS'] == '1'){
						html += "<a class='a_link' href='javaScript:editEvent(\"" + value + "\")'>修改</a> | ";
						html += "<a class='a_link' href='javaScript:delEvent(\"" + value + "\")'>删除</a> | ";
					}
					
					if(data['EVENTSTATUS'] == '2'){
						html += "<a class='a_link' href='javaScript:closeEvent(\"" + value + "\")'>停用</a> ";
					}
					
					if(data['EVENTSTATUS'] == '1' || data['EVENTSTATUS'] == '3'){
						html += "<a class='a_link' href='javaScript:useEvent(\"" + value + "\")'>启用</a> ";
					}
					return html;
				}
			}
		]
		,url:'/recycle/events/pagelist'
		,baseParams:initParams()
	});
	
	//日期验证
	$('#startDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			startDate:'%y-{%M-1}-%d'
		});
	});
});

function initParams(){
	return getParams();
}

function getParams(){
	return {
		partnerCode:$('#partnerCode').val(),
		eventType:$('#eventType').val(),
		eventCode:$('#eventCode').val(),
		eventName:$('#eventName').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		payType:$('#payType').val(),
		tickeType:$('#tickeType').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}

function addEvent(){
	layer.open({
		type:2,
		title:'新增活动',
		content:'/recycle/events/addevent',
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function addYdzEvent(){
	layer.open({
		type:2,
		title:'新增活动',
		content:'/recycle/events/addydzevent',
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 活动详情
 */
function eventInfo(eventCode){
	layer.open({
		type:2,
		title:'新增活动',
		content:"/recycle/events/eventinfo?eventCode="+eventCode,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function editEvent(eventCode){
	layer.open({
		type:2,
		title:'修改活动',
		content:"/recycle/events/editydzevent?eventCode="+eventCode,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除活动
 */
function delEvent(eventCode){
	if(confirm('是否确认删除当前活动？')){
		$.ajax({
			type:"POST",
			url:'/recycle/events/deleteevent',
			data:{eventCode:eventCode},
			dataType:"json",
			timeout:30000,
			cache:false,
			success:function(data){
				if(data == 'Y'){
					grid.reload();
				}else{
					layer.msg('删除失败');
				}
			},
			error:function(){
				layer.msg('网络错误');
			}
		});
	}
}

/**
 * 停用活动
 */
function closeEvent(eventCode){
	if(confirm('是否确认停用当前活动？')){
		$.ajax({
			type:"POST",
			url:'/recycle/events/closeevent',
			data:{eventCode:eventCode},
			dataType:"json",
			timeout:10000,
			cache:false,
			success:function(data){
				if(data == 'Y'){
					grid.reload();
				}else{
					layer.msg('停用失败：'.data);
				}
			},
			error:function(){
				layer.msg('网络错误');
			}
		});
	}
}

/**
 * 启用活动
 */
function useEvent(eventCode){
	if(confirm('是否确认删除当前活动？')){
		$.ajax({
			type:"POST",
			url:'/recycle/events/startevent',
			data:{eventCode:eventCode},
			dataType:"json",
			timeout:10000,
			cache:false,
			success:function(data){
				if(data == 'Y'){
					grid.reload();
				}else{
					layer.msg('启用失败');
				}
			},
			error:function(){
				layer.msg('网络错误');
			}
		});
	}
}
