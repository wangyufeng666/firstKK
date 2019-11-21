var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'60px',sortable:false}
			,{header: "商品品牌", dataIndex: 'PNAME', width:'60px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "询价编码", dataIndex: 'INQUIRYBILLID', width:'60px',sortable:false}
			,{header: "联系方式", dataIndex: '', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
			,{header: "操作", dataIndex: '', width:'60px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					
					if(!data['INSPECTFLAG'] || data['INSPECTFLAG'] == null){
						returnText += ' | <a href="javascript:void(0);" onclick="orderInspection(\''+orderNo+'\')" class="a_link">检测</a>';
					}else if(data['INSPECTFLAG'] == 'N'){
						returnText += ' | <a href="javascript:void(0);" onclick="orderInspection(\''+orderNo+'\')" class="a_link">复检</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/order/videoinspect/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
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

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/offline/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

function getParams(){
	return {
		merName:$('#merName').val(),
		inquirybillId:$('#inquirybillId').val(),
		tradeType:$('#tradeType').val(),
		contactWay:$('#contactWay').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		category:$('#category').val(),
		merType:$('#merType').val()
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

/**
 * 检测操作
 * @param orderId
 * @return
 */
function orderInspection(orderNo){
	var nextStatus = '2';
	if(accountStatus && jobnum){
		updateBusyStatus(nextStatus, accountStatus, jobnum);
		window.location.href = "/order/videoinspect/orderinspection?orderNo="+orderNo+'&backUrl='+backUrl;
	}else{
		alert('您不是视频检测师，无法进行视频检测推送');
	}
}

//更改检测师状态
function updateStatus(val){
	var nextStatus = val.attr('data-Id');
	if(accountStatus && jobnum){
		updateBusyStatus(nextStatus, accountStatus, jobnum);
	}else{
		alert('您不是视频检测师，无法更改检测师状态');
	}
}

function updateBusyStatus(nextStatus, accountStatus, jobnum){
	if(nextStatus && accountStatus && jobnum){
        $.ajax({
            type:'POST'//请求方式
            ,url:"/order/videoinspect/updatestatus"  //请求路径
            ,data:{nextStatus:nextStatus, accountStatus:accountStatus, jobnum:jobnum}
            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async:false //同步请求
            ,timeout:60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success:function(data){
              if(data == "Y"){
            	  location.reload();
              }
            }
        });
	}else{
		layer.alert('请完善信息再保存',1);
	}
}
