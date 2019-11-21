var backUrl = '/rent/purchase/index';
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "采购时间", dataIndex: 'CREATEDATE', width:'15%',sortable:false}
			,{header:"采购单号", dataIndex:'', width:'10%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pucode = data['PUCODE'];
					if(pucode){
						return "<a class='a_link' href='javaScript:purchaseinfo(\""+pucode+"\")'>"+pucode+"</a>";
					}
				}
			}
			,{header: "采购单昵称", dataIndex: 'PUNAME', width:'15%',sortable:false}
			,{header:"采购商品", dataIndex:'', width:'15%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pucode = data['PUCODE'];
					var merName = data['MERNAME'];
					if(merName){
						return merName+"…<a class='a_link' href='javaScript:purchaseinfo(\""+pucode+"\")'>详情</a>";
					}
				}
			}
			,{header: "采购总数量", dataIndex: 'MERCOUNT', width:'7%',sortable:false}
            ,{header: "采购人", dataIndex: 'USERNAME', width:'8%',sortable:false}
            ,{header: "状态", dataIndex: 'STATUSTXT', width:'7%',sortable:false},
            {header: "打款状态", dataIndex: 'PAYSTATUSTXT', width:'7%',sortable:false}
            ,{header:"操作", dataIndex:'', width:'20%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pucode = data['PUCODE'];
					var html = "<a class='a_link' href='javaScript:putinto(\""+pucode+"\")'>入库</a>";
					html += " | <a class='a_link' href='javaScript:yesputinto(\""+pucode+"\")'>确认入库</a>";
				    return html;
				}
			}
		]
		,url : '/rent/purchase/purchasepage'
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
		params['status'] = 345;
		return params;
	}else{
		var params = [];
		params['status'] = 345;
		return params;
	}
}

function getParams(){
	return {
		puCode:$('#puCode').val(),
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
	var puCode = $('#puCode').val();
	var puName = $('#puName').val();
	var userName = $('#userName').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var param = '?puCode='+puCode+'&puName='+puName+'&userName='+userName+'&startDate='+startDate+'&endDate='+endDate+'&status=345';
	window.location.href = '/rent/purchase/exportpurchase'+param;
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

//入库
function putinto(puCode){
	if(puCode){
		var title = '采购待入库';
		var url = '/rent/warehouse/purchasemer?puCode='+puCode;
		var x = '800px';
		var y = '600px';
		layeriframe(title,url,x,y,0);
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}

//确认入库
function yesputinto(puCode){
	if(puCode){
		layer.confirm('你确定当前批次商品全部已入库？？？', {
			  btn: ['确定','取消'] //按钮
		}, function(){
			$.post('/rent/purchase/updatestatus',{puCode:puCode,status:6},function(data){
				var msg = '';
				if(data == 'Y'){
					msg = '操作成功';
				}else{
					msg = '操作失败';
				}
				layer.alert(msg, {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
				setTimeout('doSearch()',3000); 
			})
		}, function(){
			
		});
		
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}

//详情
function purchaseinfo(puCode){
	if(puCode){
		var title = '采购单详情';
		var url = '/rent/purchase/info?flag=Y&puCode='+puCode;
		var x = '800px';
		var y = '600px';
		layeriframe(title,url,x,y,0);
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}