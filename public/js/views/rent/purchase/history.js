var backUrl = '/rent/purchase/index';
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'5%',sortable:false}
			,{header: "采购时间", dataIndex: 'CREATEDATE', width:'12%',sortable:false}
			,{header: "采购单号", dataIndex: 'PUCODE', width:'10%',sortable:false}
			,{header: "采购单昵称", dataIndex: 'PUNAME', width:'15%',sortable:false}
			,{header:"采购商品", dataIndex:'', width:'15%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pucode = data['PUCODE'];
					var merName = data['MERNAME'];
					if(merName){
						return merName+"…<a class='a_link' href='javaScript:info(\""+pucode+"\")'>详情</a>";
					}
				}
			}
			,{header: "采购总数量", dataIndex: 'MERCOUNT', width:'7%',sortable:false}
            ,{header: "采购人", dataIndex: 'USERNAME', width:'8%',sortable:false}
            ,{header: "状态", dataIndex: 'STATUSTXT', width:'7%',sortable:false},
            {header: "打款状态", dataIndex: 'PAYSTATUSTXT', width:'7%',sortable:false}
            /*,{header:"操作", dataIndex:'', width:'5%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pucode = data['PUCODE'];
					var html = "<a class='a_link' href='javaScript:info(\""+pucode+"\")'>详情</a>";
				    return html;
				}
			}*/
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
		params['status'] = 34568;
		return params;
	}else{
		var params = [];
		params['status'] = 34568;
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
	var param = '?puCode='+puCode+'&puName='+puName+'&userName='+userName+'&startDate='+startDate+'&endDate='+endDate+'&status=34568';
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



//详情
function info(puCode){
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


