var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"No.", dataIndex:'R', width:'30PX',sortable:false} 
			,{header:"上传者", dataIndex:'USERNAME', width:'60px',sortable:false}
			,{header:"上传时间", dataIndex:'CREATEDATE', width:'100px',sortable:false}
			,{header:"开始时间", dataIndex:'STARTDATE', width:'80px',sortable:false}
			,{header:"结束时间", dataIndex:'ENDDATE', width:'80px',sortable:false}
			,{header:"banner顺序", dataIndex:'SORT', width:'30px',sortable:false}
			,{header:"是否有效", dataIndex:'ISVALID', width:'40px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['ISVALID'] == '1' ? '<font color="green">已开启</font>' : '<font color="red">未开启</font>';
				}
			}
			,{header:"banner来源", dataIndex:'IMGSOURCE', width:'40px',sortable:false}
			,{header:"banner路径", dataIndex:'BANNERURL', width:'150px',sortable:false}
			,{header:"跳转路径", dataIndex:'JUMPURL', width:'150px',sortable:false}
			,{header:"报错提示语", dataIndex:'IMGALT', width:'80px',sortable:false}
			,{header:"状态提醒", dataIndex:'STATUSREMIND', width:'80px',sortable:false}
			,{header:"活动名称", dataIndex:'EVENTNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var isvalid = data['ISVALID'];
					var pkid = data['PKID'];
					var isdel = data['ISDEL'];
					if(isdel == '0'){
						if(isvalid == '0'){
							var	returnText ='<a href="javascript:void(0);" onclick="openEvent(\''+pkid+'\')" class="a_link">开启</a>';
							returnText +=' | <a href="javascript:void(0);" onclick="editEvent(\''+pkid+'\')" class="a_link">修改</a>';
							returnText +=' | <a href="javascript:void(0);" onclick="stopEvent(\''+pkid+'\')" class="a_link">终止</a>';
						}else if(isvalid == '1'){
							var returnText ='<a href="javascript:void(0);" onclick="editEvent(\''+pkid+'\')" class="a_link">修改</a>';
							returnText +=' | <a href="javascript:void(0);" onclick="stopEvent(\''+pkid+'\')" class="a_link">终止</a>';
						}
					}else{
						 returnText = "已终止";
					}
					return returnText;
				}
			}
		]
		,url:'/system/banner/pagelist'
		,baseParams:initParams()
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params.start = start;
		params.limit = limit;
		return params;
	}else{
		return {};
	}
}

//开启活动
function openEvent(pkid){
	if(confirm("确认开启该活动吗？")){
		$.post('/system/banner/openevent',{pkid:pkid},function(data){
			if(data == 'Y'){
				alert("开启成功");
				location.reload();
			}else{
				alert("开启失败");
			}
		})
	}
}

//修改活动
function editEvent(pkid){
    $.layer({
        type:2,
        title:'修改活动banner',
        iframe:{src:'/system/banner/editevent?pkid='+pkid},
        area:['900' , '550'],
        offset:['50px',''],
        close:function(index){
            layer.close(index);
        }
    });
}

function stopEvent(pkid){
	if(confirm("确认终止该活动吗？")){
		$.post('/system/banner/stopevent',{pkid:pkid},function(data){
			if(data == 'Y'){
				alert("活动已终止");
				location.reload();
			}else{
				alert("终止失败");
			}
		})
	}
}

function addBanner(){
    $.layer({
        type:2,
        title:'新增活动banner',
        iframe:{src:'/system/banner/addbanner'},
        area:['900' , '550'],
        offset:['50px',''],
        close:function(index){
            layer.close(index);
        }
    });
}

function getParams(){
	return {
		userName:$('#userName').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		isvalid:$('#isvalid').val(),
		imgSource:$('#imgSource').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}
