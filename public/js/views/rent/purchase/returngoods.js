var backUrl = '/rent/purchase/index';
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'5%',sortable:false}
			,{header: "退货时间", dataIndex: 'CREATEDATE', width:'15%',sortable:false}
			,{header:"退货单号", dataIndex:'', width:'15%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var reCode = data['RECODE'];
					if(reCode){
						return "<a class='a_link' href='javaScript:infos(\""+reCode+"\")'>"+reCode+"</a>";
					}
				}
			}
			,{header: "退货昵称", dataIndex: 'RE_NAME', width:'15%',sortable:false}
			,{header:"采购单号", dataIndex:'', width:'15%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pucode = data['PUCODE'];
					if(pucode){
						return "<a class='a_link' href='javaScript:purchaseinfo(\""+pucode+"\")'>"+pucode+"</a>";
					}
				}
			}
			,{header: "采购昵称", dataIndex: 'PUNAME', width:'15%',sortable:false}
            ,{header: "退货人", dataIndex: 'USERNAME', width:'10%',sortable:false}
            ,{header: "状态", dataIndex: 'STATUSTXT', width:'10%',sortable:false}
            ,{header:"操作", dataIndex:'', width:'15%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var recode = data['RECODE'];
					var html = "<a class='a_link' href='javaScript:update(\""+recode+"\")'>修改</a>";
					    html += "&nbsp;|&nbsp;<a class='a_link' href='javaScript:updates(\""+recode+"\")'>确认</a>";
					    html += "&nbsp;|&nbsp;<a class='a_link' href='javaScript:dels(\""+recode+"\")'>删除</a>";
				    return html;
				}
			}
		]
		,url : '/rent/purchase/returngoodspage'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		},
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
		reCode:$('#reCode').val(),
		puCode:$('#puCode').val(),
		reName:$('#reName').val(),
		puName:$('#puName').val(),
		userName:$('#userName').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
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
	var reCode = $('#reCode').val();
	var puCode = $('#puCode').val();
	var reName = $('#reName').val();
	var puName = $('#puName').val();
	var userName = $('#userName').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var param = '?reCode='+reCode+'&puCode='+puCode+'&reName='+reName+'&puName='+puName+'&userName='+userName;
		param += '&startDate='+startDate+'&endDate='+endDate+'&status=1';
	window.location.href = '/rent/purchase/exportpurchasereturn'+param;
});

//layer iframe
function layeriframe(title,url,x,y,s){
	var index = layer.open({
		type:2,
		title:title,
		shadeClose:false,
		shade:0.8,
		content:url,
		area:[x , y],
		close:function(index){
			layer.close(index);
		},
		end: function () {
			if(s == 1){
				location.reload();
			}
        }
	});
}

//新增
function add(){
	var title = '采购单可退货列表';
	var url = '/rent/purchase/returns';
	var x = '1000px';
	var y = '600px';
	layeriframe(title,url,x,y,1);
}

//修改
function update(reCode){
	if(reCode){
		var title = '修改退货单';
		var url = '/rent/purchase/updatereturn?flag=Y&reCode='+reCode;
		var x = '800px';
		var y = '600px';
		layeriframe(title,url,x,y,0);
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}

//确认
function updates(reCode){
	if(reCode){
		var txt = '确认后等待审核，确定操作？';
		var status = 2;
		updateStatus(reCode,txt,status);
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}

//删除
function dels(reCode){
	if(reCode){
		var txt = '确定要删除吗？';
		var status = 7;
		layer.confirm(txt, {
			  btn: ['确定','取消'] //按钮
			}, function(){
				$.post('/rent/purchase/delreturn',{reCode:reCode},function(data){
					var msg = '';
					if(data == 'Y'){
						msg = '操作成功';
					}else{
						msg = '操作失败';
					}
					layer.alert(msg, {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
					setTimeout("location.reload()", 3000);
				},'json');
			}, function(){
			 
			});
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}

//修改状态
function updateStatus(reCode,txt,status){
	layer.confirm(txt, {
	  btn: ['确定','取消'] //按钮
	}, function(){
		$.post('/rent/purchase/updatereturnstatus',{reCode:reCode,status:status},function(data){
			var msg = '';
			if(data == 'Y'){
				msg = '操作成功';
			}else{
				msg = '操作失败';
			}
			layer.alert(msg, {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
			setTimeout("location.reload()", 3000);
		},'json');
	}, function(){
	 
	});
}

//详情
function infos(reCode){
	if(reCode){
		var title = '退货单详情';
		var url = '/rent/purchase/inforeturn?flag=N&reCode='+reCode;
		var x = '800px';
		var y = '600px';
		layeriframe(title,url,x,y,0);
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}
//采购单详情
function purchaseinfo(puCode){
	if(puCode){
		var title = '采购单详情';
		var url = '/rent/purchase/info?flag=Y&puCode='+puCode;
		var x = '800px';
		var y = '550px';
		layeriframe(title,url,x,y,0);
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}