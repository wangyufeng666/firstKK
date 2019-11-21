var backUrl = '/rent/purchase/index';
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'5%',sortable:false}
			,{header: "创建时间", dataIndex: 'CREATEDATE', width:'10%',sortable:false}
			,{header:"采购商编号", dataIndex:'', width:'10%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var partnerCode = data['PARTNERCODE'];
					var html = "<a class='a_link' href='javaScript:infos(\""+partnerCode+"\")'>"+partnerCode+"</a>";
				    return html;
				}
			}
            ,{header: "采购商名称", dataIndex: 'PARTNERNAME', width:'10%',sortable:false}
            ,{header: "开户行", dataIndex: 'BANK', width:'10%',sortable:false}
            ,{header: "银行帐号", dataIndex: 'BANKCODE', width:'10%',sortable:false}
            ,{header: "邮箱", dataIndex: 'EMAIL', width:'10%',sortable:false}
            ,{header: "联系电话", dataIndex: 'TEL', width:'8%',sortable:false}
            ,{header: "联系地址", dataIndex: 'ADDRESS', width:'10%',sortable:false}
            ,{header: "排序", dataIndex: 'SEQ', width:'5%',sortable:false}
            ,{header:"状态", dataIndex:'', width:'5%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var statustxt = data['STATUSTXT'];
					var status = data['STATUS'];
					var html = "";
					if(status == 1){
						html = '<font color="red">'+statustxt+'</font>';
					}else if(status == 2){
						html = '<font color="#333">'+statustxt+'</font>';
					}else{
						html = '<font color="#999">'+statustxt+'</font>';
					}
				    return html;
				}
			}
            ,{header:"操作", dataIndex:'', width:'7%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var status = data['STATUS'];
					var html = "";
					if(status == 1){
						html += "<a class='a_link' href='javaScript:update(\""+pkid+"\")'>修改</a>";
						html += "&nbsp;|&nbsp;<a class='a_link' href='javaScript:dels(\""+pkid+"\")'>删除</a>";
					}
				    return html;
				}
			}
		]
		,url : '/rent/purchase/partnerpage'
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
		partnerCode:$('#partnerCode').val(),
		partnerName:$('#partnerName').val(),
		bankCode:$('#bankCode').val(),
		tel:$('#tel').val(),
		email:$('#email').val(),
		status:$('#status').val()
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
	var partnerCode = $('#partnerCode').val();
	var partnerName = $('#partnerName').val();
	var bankCode = $('#bankCode').val();
	var tel = $('#tel').val();
	var email = $('#email').val();
	var status = $('#status').val();
	var param = '?partnerCode='+partnerCode+'&partnerName='+partnerName+'&status='+status+'&bankCode='+bankCode+'&tel='+tel+'&email='+email;
	window.location.href = '/rent/purchase/exportpartner'+param;
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
	var title = '新增采购商';
	var url = '/rent/purchase/savepartner?flag=N';
	var x = '450px';
	var y = '520px';
	layeriframe(title,url,x,y,1);
}

//修改
function update(pkid){
	var title = '修改采购商';
	var url = '/rent/purchase/updatepartner?flag=N&pkid='+pkid;
	var x = '450px';
	var y = '520px';
	layeriframe(title,url,x,y,1);
}

//删除
function dels(pkid){
	if(pkid){
		var txt = '确定要删除吗？';
		layer.confirm(txt, {
			  btn: ['确定','取消'] //按钮
			}, function(){
				$.post('/rent/purchase/delpartner',{pkid:pkid},function(data){
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

//详情
function infos(partnerCode){
	if(partnerCode){
		var title = '采购商详情';
		var url = '/rent/purchase/partnerinfo?partnerCode='+partnerCode;
		var x = '450px';
		var y = '500px';
		layeriframe(title,url,x,y,'');
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}
