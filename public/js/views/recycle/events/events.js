var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"合作商", dataIndex:'PARTNERNAME', width:'80PX',sortable:false}
			,{header:"活动类型", dataIndex:'EVENTTYPE', width:'80PX',sortable:false}
			,{header:"活动名", dataIndex:'EVENTNAME', width:'80PX',sortable:false}
			,{header:"活动码", dataIndex:'EVENTCODE', width:'80PX',sortable:false}
			,{header:"开始时间", dataIndex:'STARTDATE', width:'80PX',sortable:false}
			,{header:"结束时间", dataIndex:'STOPDATE', width:'80PX',sortable:false}
			,{header:"劵类型", dataIndex:'TICKETTYPE', width:'55PX',sortable:false}
			,{header:"支付类型", dataIndex:'PAYTYPE', width:'55PX',sortable:false}
			,{header:"活动状态", dataIndex:'EVENTSTATUS', width:'50PX',sortable:false}
			,{header:"操作", dataIndex:'', width:'180px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var html = "<a class='a_link' href='javaScript:void(0)' onclick='eventdetail(\"" + data['EVENTCODE'] + "\")'>详情</a> | ";
					html += "<a class='a_link' href='javaScript:void(0)' onclick='delEvent(\"" + data['EVENTCODE'] + "\")'>删除</a> | ";
					if( data['ISVALID']=='1'){
						html += "<a class='a_link' href='javaScript:void(0)' onclick='downEvent(\"" + data['EVENTCODE'] + "\")'>关闭活动</a> ";
					}
					if( data['EVENTSTRATEGY']=='Y'){
						html += "<a class='a_link' href='javaScript:void(0)' onclick='startEvent(\"" + data['EVENTCODE'] + "\")'>开启活动</a> ";
					}
					return html;
				}
			}
		]
		,url:'/recycle/events/pagelist'
		,baseParams:initParams()
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
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
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}
	});
}

function addEvent(){
	$.layer({
		type:2,
		title:'新增活动',
		iframe:{src:'/recycle/events/addevent'},
		area:['500','580'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

function eventdetail(eventCode){
	window.location.href ="/recycle/events/eventdetail?eventCode="+eventCode;
}

function delEvent(eventCode){
	var index = layer.load();
	$.ajax({
		type:"POST",
		url:'/recycle/events/delevent',
		data:{eventCode:eventCode},
		dataType:"json",
		timeout:30000,
		cache:false,
		success:function(data){
			if(data == 'Y'){
				layer.alert("删除成功",1);
				window.location.href = window.location.href;
			}else{
				layer.close(index);
				layer.alert('删除失败');
			}
		},
		error:function(){
			 layer.close(index);
			 layer.alert('网络错误');
		}
	});
}

function onBrand(pid){
	var index = layer.load();
	$.ajax({
		type:"POST",
		url:"/recycle/brand/onbrand",
		data:{pid:pid},
		dataType:"json",
		timeout:30000,
		cache:false,
		success:function(data){
			if(data == 'Y'){
				layer.alert("成功");
				window.location.href = window.location.href;
			}else{
				layer.close(index);
				layer.alert('失败');
			}
		},
		error:function(){
			layer.close(index);
			layer.alert('网络错误');
		}
	});
}

