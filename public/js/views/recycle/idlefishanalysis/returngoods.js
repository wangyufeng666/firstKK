var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'80px',sortable:false}
			,{header:"品类", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"品牌", dataIndex:'PNAME', width:'80px',sortable:false}
			,{header:"商品型号", dataIndex:'MERNAME', width:'80px',sortable:false}
			,{header:"检测时间", dataIndex:'CREATEDATE', width:'80px',sortable:false}
			,{header:"订单金额", dataIndex:'ORDERPRICE', width:'80px',sortable:false}
			,{header:"检测师", dataIndex:'NAME', width:'80px',sortable:false}
			,{header:"检测金额", dataIndex:'SETTLEPRICE', width:'80px',sortable:false}
			,{header:"退货推送时间", dataIndex:'PUSHDATE', width:'80px',sortable:false}
			,{header:"订单来源", dataIndex:'', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var sourceName ='';
					if(data['EXT2']=='71'){
						sourceName = '闲鱼二期';
					}else if(data['EXT2']=='73'){
						sourceName = '闲鱼三期';
					}
					return sourceName;
				}
			}
			,{header:"渠道", dataIndex:'', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var channel ='';
					if(data['CHANNEL']=='idle'){
						channel = '闲鱼';
					}else if(data['CHANNEL']=='tmall'){
						channel = '天猫';
					}else if(data['CHANNEL']=='alipay'){
						channel = '支付宝';
					}else if(data['CHANNEL']=='taobao'){
						channel = '淘宝';
					}else if(data['CHANNEL']=='tmall-service'){
						channel = '天猫以旧换新';
					}
					return channel;
				}
			}
		]
		,url:'/recycle/idlefishanalysis/returnpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});

	/**
	 * 获取分类下的品牌
	 */
	$("#merType").change(function(){
		var merType = $(this).val();
		brand(merType);
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

function brand(merType){
	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
		$("#brandCode").html("<option value=''>全部</option>");
		for(i in data){
			$("#brandCode").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
		}
	}, 'json');
}

function getParams(){
	return {
		merType:$('#merType').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		orderSource:$('#orderSource').val(),
		channel:funcs.param.formSelects.value('channel', 'valStr'),
		brandCode:$('#brandCode').val()
	};
}


/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	grid.paras.start = '1';
	grid.query(getParams());
}

//回车事件
document.onkeypress = keypress;
function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}

function download(){
	var param = getParams();
	var params = 'startDate='+param.startDate+'&endDate='+param.endDate+'&merType='+param.merType+'&brandCode='+param.brandCode+'&channel='+param.channel+'&orderSource='+param.orderSource+'&flag=3';
	window.location.href='/recycle/idlefishanalysis/exportinfo?'+params;
}
