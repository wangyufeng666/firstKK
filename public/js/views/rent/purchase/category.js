var backUrl = '/rent/purchase/index';
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'5%',sortable:false}
			,{header: "创建时间", dataIndex: 'CREATEDATE', width:'15%',sortable:false}
            ,{header: "采购品类编号", dataIndex: 'TYPECODE', width:'10%',sortable:false}
            ,{header: "采购品类名称", dataIndex: 'TYPENAME', width:'10%',sortable:false}
            ,{header: "排序", dataIndex: 'SEQ', width:'10%',sortable:false}
            ,{header: "状态", dataIndex: 'STATUSTXT', width:'10%',sortable:false}
            ,{header:"操作", dataIndex:'', width:'20%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var html = "<a class='a_link' href='javaScript:update(\""+pkid+"\")'>修改</a>";
					    html += "&nbsp;|&nbsp;<a class='a_link' href='javaScript:dels(\""+pkid+"\")'>删除</a>";
				    return html;
				}
			}
		]
		,url : '/rent/purchase/categorypage'
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
		typeCode:$('#typeCode').val(),
		typeName:$('#typeName').val(),
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
	var typeCode = $('#typeCode').val();
	var typeName = $('#typeName').val();
	var status = $('#status').val();
	var param = '?typeCode='+typeCode+'&typeName='+typeName+'&status='+status;
	window.location.href = '/rent/purchase/exportcategory'+param;
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
	var url = '/rent/purchase/savecategory';
	var x = '450px';
	var y = '350px';
	layeriframe(title,url,x,y,1);
}

//修改
function update(pkid){
	var title = '修改采购商';
	var url = '/rent/purchase/updatecategory?pkid='+pkid;
	var x = '450px';
	var y = '350px';
	layeriframe(title,url,x,y,1);
}

//删除
function dels(pkid){
	if(pkid){
		var txt = '确定要删除吗？';
		layer.confirm(txt, {
			  btn: ['确定','取消'] //按钮
			}, function(){
				$.post('/rent/purchase/delcategory',{pkid:pkid},function(data){
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

