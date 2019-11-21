var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"订单时间", dataIndex:'ORDERDATE', width:'70px',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'120px',sortable:false}
			,{header:"产品名称", dataIndex:'MERNAME', width:'100px',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'50px',sortable:false}
			,{header:"结算价格", dataIndex:'SETTLEPRICE', width:'50px',sortable:false}
			,{header:"券价格", dataIndex:'COUPONPRICE', width:'70px',sortable:false}
			,{header:"批次", dataIndex:'BATCHCODE', width:'70px',sortable:false}
			,{header:"是否删除", dataIndex:'ISDEL', width:'50px',sortable:false}
			,{header:"导入时间", dataIndex:'CREATEDATE', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var isdel = data['ISDEL'];
					var returnText = '';
					    returnText = ' <a href="javascript:void(0);" onclick="del(\''+pkid+'\')" class="a_link">删除</a> ';
					return returnText;
				}
			}
		]
		,url:'/recycle/analysisorder/orderpage'
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
		merName:$('#merName').val(),
		batchCode:$('#batchCode').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		isDel:$('#isDel').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

/**
 * 删除
 */
function del(pkid){
	var url = '/recycle/analysisorder/analysisdel?pkid='+pkid;
	if(confirm('确定永久删除该条记录吗？删除后无法恢复！')){
		window.location.href = url;
	}
}

/**
 * 批量删除
 */
function batchDel(){
	var isDel = $('#isDel').val();
	var html = '<div class="alert_txt">确定删除当前所展示的记录吗？删除后无法还原！</div><div class="alert_btn">';
	if(isDel == 'N'){
	    html += '<button id="nodel">逻辑删除</button>';
	}
	    html += '<button id="yesdel">物理删除</button>';
	    html += '</div>';
	var index = layer.open({
	  type: 1,
	  skin: 'layui-layer-rim', //加上边框
	  area: ['420px', '240px'], //宽高
	  content: html
	});
	$('#nodel').on('click',function(){
		var types = 'N';
		if(confirm('确定当前所以展示的订单生成历史批次？')){
			moreDel(types);
		}
	});
	$('#yesdel').on('click',function(){
		var types = 'Y';
		if(confirm('确定永久删除当前所展示的订单？')){
			moreDel(types);
		}
	});
}

function moreDel(types){
	var datas = getParams();
	datas['types'] = types;
	$.post('/recycle/analysisorder/analysisdels',datas,function(msg){
		if(msg == 'Y'){
			alert('操作成功');
		}else{
			alert('操作失败');
		}
		window.location.href = "/recycle/analysisorder/index?backFlag=Y";
	})
}
/**
 *导出
 */
function exports(){
	var orderNo = $('#orderNo').val();
	var merName = $('#merName').val();
	var batchCode = $('#batchCode').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var isDel = $('#isDel').val();
	var param = '?orderNo='+orderNo+'&merName='+merName+'&batchCode='+batchCode+'&startDate='+startDate+'&endDate='+endDate+'&isDel='+isDel;
	window.location.href = '/recycle/analysisorder/analysisexport'+param;
}

/**
 * csv导入
 */
$('#doadd').change(function(){
	$('#add_csv').submit();
});
