var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"抽奖日期", dataIndex:'CREATEDATE', width:'140px',sortable:false}
			,{header:"奖品名称", dataIndex:'PRIZENAME', width:'160px',sortable:false}
			,{header:"合作商", dataIndex:'PARTNERNAME', width:'100px',sortable:false}
			,{header:"所属活动", dataIndex:'ACTIVENAME', width:'100px',sortable:false}
			,{header:"联系方式", dataIndex:'', width:'140px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"联系地址", dataIndex:'DIZHI', width:'180px',sortable:false}
			,{header:"奖品状态", dataIndex:'PRIZESTATUSNAME', width:'80px',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'140px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				var returnText = '<a href="javascript:void(0);" onclick="orderInfo(\''+data['ORDERNO']+'\')" class="a_link">查看</a>';
					var dingdanStatus = data['DINGDANSTATUS'];
					var prizeStatus = data['PRIZESTATUS'];
					var prizeName = data['PRIZENAME'];
					var orderNo = data['ORDERNO'];
					if(prizeStatus == '1' && (dingdanStatus == '5' || dingdanStatus=='66') && prizeName != '谢谢参与'){
						returnText += ' | <a href="javascript:void(0);" onclick="award(\''+orderNo+'\')" class="a_link">发奖</a>';
					}
					if(prizeStatus == '1' && dingdanStatus != '99' && dingdanStatus != '98' && prizeName != '谢谢参与'){
						returnText += ' | <a href="javascript:void(0);" onclick="stopWin(\''+orderNo+'\')" class="a_link">终止</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/system/prize/winpagelist'
	});
});

/**
 * 订单详情
 */
function orderInfo(orderNo){
	window.location.href = "/system/prize/wininfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

/**
 * 发奖
 */
function award(orderNo){
	$.layer({
		type:2,
		title:'添加所属规则',
		iframe:{src:'/system/prize/award?orderNo='+orderNo+'&backUrl='+backUrl},
		area:['400', '300'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 终止奖品
 */
function stopWin(orderNo){
	$.layer({
		type:2,
		title:'修改活动信息',
		iframe:{src:'/system/prize/stopwin?orderNo='+orderNo+'&backUrl='+backUrl},
		area:['500','300'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		orderNo:$('#orderNo').val(),
		contactWay:$('#contactWay').val(),
		prizeName:$('#prizeName').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		prizeStatus:$('#prizeStatus').val(),
		orderStatus:$('#orderStatus').val(),
		activeCode:$('#activeCode').val(),
		partnerCode:$('#partnerCode').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}
	});
}