
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "采购时间", dataIndex: 'PURCHASETIMEM', width:'10%',sortable:false}
			,{header: "采购单号", dataIndex: 'BATCHNO', width:'10%',sortable:false}
			,{header: "商品类型", dataIndex: 'TYPENAME', width:'5%',sortable:false}
			,{header: "商品名称", dataIndex: 'STOCKNAME', width:'10%',sortable:false}
			,{header: "机器码", dataIndex: 'MECHINENO', width:'10%',sortable:false}
            ,{header: "采购商", dataIndex: 'PARTNERNAME', width:'10%',sortable:false}
            ,{header: "采购金额", dataIndex: 'AMOUNT', width:'5%',sortable:false}
            ,{header: "入库时间", dataIndex: 'INTIME', width:'10%',sortable:false}
            ,{header: "入库人", dataIndex: 'INUSERNAME', width:'5%',sortable:false}
            ,{header: "状态", dataIndex: 'STATUSTXT', width:'5%',sortable:false}
            ,{header: "入库类型", dataIndex: 'TYPESTXT', width:'5%',sortable:false}
            ,{header:"操作", dataIndex:'', width:'5%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var html = "<a class='a_link' href='javaScript:outHouse(\""+pkid+"\")'>出库</a>";
				    return html;
				}
			}
            
		]
		,url : '/rent/warehouse/warehousepage'
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
		puCode:$('#puCode').val(),
		bizCode:$('#bizCode').val(),
		imei:$('#imei').val(),
		merName:$('#merName').val()
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
	var bizCode = $('#bizCode').val();
	var imei = $('#imei').val();
	var merName = $('#merName').val();
	var param = '?puCode='+puCode+'&bizCode='+bizCode+'&imei='+imei+'&merName='+merName+'&status=1';
	window.location.href = '/rent/warehouse/exportwarehouse'+param;
});

//出库
function outHouse(pkid){
	if(pkid){
		layer.confirm('该商品你确定要出库？', {
			  btn: ['确定','取消'] //按钮
			}, function(){
			  $.post('/rent/warehouse/outhouse',{pkid:pkid},function(data){
				  if(data == 'Y'){
					  msg = '出库成功';
				  }else{
					  msg = '出库失败';
				  }
				  layer.alert(msg, {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
				  setTimeout("doSearch()",2000);
			  })
			}, function(){
			  
			});
	}else{
		layer.alert('出错了，稍后再试', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
		setTimeout("doSearch()",2000);
	}
}