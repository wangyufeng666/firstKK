
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'40PX',sortable:false}
			,{header: "创建时间", dataIndex: 'CREATEDATE', width:'150px',sortable:false}
            ,{header: "客户昵称", dataIndex: 'NICKNAME', width:'100px',sortable:false}
            ,{header: "客户手机", dataIndex: 'MOBILE', width:'100px',sortable:false}
            ,{header: "身份证", dataIndex: 'IDCARD', width:'150px',sortable:false}
            ,{header: "操作人", dataIndex: 'USERNAME', width:'100px',sortable:false}
            ,{header: "异常描述", dataIndex: 'ABNORMAL_DESC', width:'150px',sortable:false}
            ,{header: "异常等级", dataIndex: 'LEVEL', width:'100px',sortable:false}
            ,{header: "是否开启", dataIndex: 'DELFLAGTXT', width:'100px',sortable:false}
            ,{header: "操作", dataIndex: '',  sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                	var level = data['ABNORMAL_LEVEL'];
                	var html = "<a class='a_link' href='javaScript:updatelevel(\"" + data['PKID'] + "\")'>修改</a> ";
                	if(data['DELFLAG'] == 'Y'){
                		html += " | <a class='a_link' href='javaScript:delwarn(\"" + data['PKID'] + "\",\"N\")'>开启</a> ";
                	}else if(data['DELFLAG'] == 'N'){
                		html += " | <a class='a_link' href='javaScript:delwarn(\"" + data['PKID'] + "\",\"Y\")'>关闭</a> ";
                	}
                    return html;
                }
            }
		]
		,url : '/rent/user/levelpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
	});
});


function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		var params = [];
		return params;
	}
}

function getParams(){
	return {
		mobile:$('#mobile').val(),
		level:$('#level').val(),
		sysname:$('#sysname').val(),
		delflag:$('#delflag').val()
	};
}


function doSearch(){
	layer.msg('加载中', {icon:16,shade:0.1});
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

$('#exportlist').on('click',function(){
	var mobile = $('#mobile').val();
	var level = $('#level').val();
	var sysname = $('#sysname').val();
	var delflag = $('#delflag').val();
	var param = '?mobile='+mobile+'&level='+level+'&sysname='+sysname+'&delflag='+delflag;
	window.location.href = '/rent/user/levelexportlist'+param;
});

/**
 * 添加异常用户
 */
function add(){
	layer.open({
		type:2,
		title:'添加用户警示',
		shadeClose:false,
		shade:0.8,
		content:'/rent/user/savewarn',
		area:['450px' , '350px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 修改用户等级
 */
function updatelevel(pkid){
	layer.open({
		type:2,
		title:'修改用户异常等级',
		shadeClose:false,
		shade:0.8,
		content:'/rent/user/updatelevel?pkid='+pkid,
		area:['450px' , '350px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function delwarn(pkid,status){
	if(status == 'Y'){
		var txt = "关闭";
	}else{
		var txt = "开启";
	}
	layer.confirm("确定"+txt+"该标识？", {
		  btn: ['确定','取消'] 
		}, function(){
			if(pkid !=''){
		        $.post("/rent/user/updatedelflag", {pkid:pkid,status:status}, function(data){
		            if(data == 'Y'){
		                layer.msg(txt+'成功');
		                setTimeout(function(){doSearch()}, 2000);
		            }else{
		            	layer.alert(txt+'失败稍后再试', {skin: 'layui-layer-lan',closeBtn: 0,anim: 6});
		            }
		        });
			}else{
				layer.alert('操作失败稍后再试', {skin: 'layui-layer-lan',closeBtn: 0,anim: 6});
			}
		}, function(){
		  
		});
}
