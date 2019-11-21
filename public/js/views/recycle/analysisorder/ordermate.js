var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"下单时间", dataIndex:'ORDERDATE', width:'100px',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'120px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'150px',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'50px',sortable:false}
			,{header:"结算价格", dataIndex:'SETTLEPRICE', width:'50px',sortable:false}
			,{header:"导入时间", dataIndex:'CREATEDATE', width:'100px',sortable:false}
			,{header:"备注", dataIndex:'REMARK', width:'150px',sortable:false}
			,{header:"操作", dataIndex:'', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var returnText = '';
					    returnText = ' <a href="javascript:void(0);" onclick="updateremark(\''+pkid+'\')" class="a_link">修改备注</a> ';
					    returnText += ' | <a href="javascript:void(0);" onclick="del(\''+pkid+'\')" class="a_link">删除</a> ';
					return returnText;
				}
			}
		]
		,url:'/recycle/analysisorder/ordermatepage'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[15,20,30,50]
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
		start:start,
		orderNo:$('#orderNo').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

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

/**
 * 删除
 */
function del(pkid){
	var url = '/recycle/analysisorder/ordermatedel';
	if(confirm('确定永久删除该条记录吗？删除后无法恢复！')){
		$.post(url,{pkid:pkid},function(data){
			if(data == 'Y'){
				alert('删除成功');
				doSearch();
			}else{
				alert('删除失败');
			}
		});
	}
}

/**
 *导出
 */
function exports(){
	var orderNo = $('#orderNo').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var param = '?orderNo='+orderNo+'&startDate='+startDate+'&endDate='+endDate;
	window.location.href = '/recycle/analysisorder/exportordermate'+param;
}

/**
 *修改备注
 */
function updateremark(pkid){
	var title = '修改备注';
	var url = '/recycle/analysisorder/ordermateremark?pkid='+pkid;
	var x = '500px';
	var y = '450px';
	layeriframe(title,url,x,y,1);
}

/**
 * csv导入
 */
$('#doadd').change(function(){
	$('#add_csv').submit();
});
