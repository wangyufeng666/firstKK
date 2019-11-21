var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:100,
		height:375
		,cm:[
			{header:"No.", dataIndex:'', width:'35PX',sortable:false}
			,{header:"品类", dataIndex:'merTypeName', width:'80px',sortable:false}
			,{header:"询价数", dataIndex:'inquiryNum', width:'80px',sortable:false}
			,{header:"成交数", dataIndex:'dealNum', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'deal\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"成交价", dataIndex:'dealPrice', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'deal\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"询价成交率", dataIndex:'dealRate', width:'80px',sortable:false}
			,{header:"检测数", dataIndex:'inspectionNum', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'bargaining\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"议价数", dataIndex:'diffNum', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'bargaining\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"议价率", dataIndex:'diffRate', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'bargaining\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"退货数", dataIndex:'returnNum', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'returngoods\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"退货率", dataIndex:'returnRate', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'returngoods\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"订单价", dataIndex:'orderPrice', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'bargaining\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"检测价", dataIndex:'settlePrice', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'bargaining\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"议价幅度", dataIndex:'bargainingRange', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'bargaining\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"好评数", dataIndex:'praiseNum', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'praise\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"中评数", dataIndex:'badNum', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'praise\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
			,{header:"好评率", dataIndex:'praiseRate', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var merType = data['merType'];
					if(merType == 'DNPJ' || merType == '' || merType == 'XJ'){
						return '<span >'+value+'</span>';
					}else{
						return '<span onclick="info(\'praise\',\''+merType+'\')" ><font color="blue">'+value+'</font></span>';
					}
				}
			}
		]
		,url:'/recycle/idlefishanalysis/pagelist'
		,baseParams:initParams()
	});

});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		return params;
	}else{
		return {};
	}
}


function getParams(){
	if($('#category').val() != '' && $('#merType').val() == ''){
		alert('请选择商品分类');
		return false;
	}
	return {
		startDate:$('#startDate').val(),
		orderSource:$('#orderSource').val(),
		channel:funcs.param.formSelects.value('channel', 'valStr'),
		endDate:$('#endDate').val()
	};
}

function info(url,merType){
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var orderSource = $('#orderSource').val();
	var channel = funcs.param.formSelects.value('channel', 'valStr');

	layer.open({
		type:2,
		title:'订单详情',
		content:'/recycle/idlefishanalysis/'+url+'?merType='+merType+'&startDate='+startDate+'&endDate='+endDate+'&channel='+channel+'&orderSource='+orderSource,
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
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
	var params = 'startDate='+param.startDate+'&endDate='+param.endDate+'&channel='+param.channel+'&orderSource='+param.orderSource;
	window.location.href='/recycle/idlefishanalysis/export?'+params;
}

