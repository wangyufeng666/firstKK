var grid, layerIndex = 0;
var merName,buyPrice,imei,invoiceNum,invoiceUrl;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "订单单号", dataIndex: 'ORDERNO', width:'120px',sortable:false}
			,{header: "所属分部", dataIndex: 'COMPANYNAME', width:'100px',sortable:false}
			,{header: "所属门店", dataIndex: 'PARTNERNAME', width:'100px',sortable:false}
			,{header: "客户信息", dataIndex: '', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIREN']+'('+data['LIANXIDH']+')';
				}
			}
			,{header: "奖品名称", dataIndex: 'PRIZENAME', width:'70px',sortable:false}
			,{header: "奖品状态", dataIndex: 'PRIZESTATUSNAME', width:'70px',sortable:false}
			,{header: "下单金额", dataIndex: 'DINGDANPRICE', width:'60px',sortable:false}
			,{header: "应发奖品", dataIndex: 'PRIZESHOWNAME', width:'80px',sortable:false}
			,{header: "奖品兑换码", dataIndex: 'PRIZECODE', width:'100px',sortable:false}
			,{header: "订单日期", dataIndex: 'DINGDANSHIJ', width:'90px',sortable:false}
			,{header: "中奖时间", dataIndex: 'WINDATE', width:'90px',sortable:false}
			,{header: "店员", dataIndex: '', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['NAME']+'('+data['OPMOBILE']+')';
				}
			}
			,{header: "操作", dataIndex:'ORDERNO', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var prizeStatus = data['PRIZESTATUS'];
					var returnText ='<a title="'+value+'" href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
					returnText +=' | <a title="'+value+'" href="javascript:prizeInfo(\''+value+'\')" class="a_link">新机信息</a>';
					if(prizeStatus == '1'){
						returnText +=' | <a href="javascript:updatePrizeSatus(\''+value+'\')" class="a_link">发送奖品</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/order/gomestore/pageprizelist'
		,baseParams:initParams()
		,afterRender:function(){
			layer.close(layerIndex);
		}
		,pageSizeList:[15,30,50]
	});
	

	$('#startDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});

	$('#endDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
});

function initParams(){
	return getParams();
}

/**
 * 修改奖品状态
 * @returns
 */
function updatePrizeSatus(orderNo){
	if(confirm('是否确定奖品已发放？')){
		$.post('/order/gomestore/updateprizestatus',{orderNo:orderNo},function(data){
			if(data == 'Y'){
				alert('状态更改成功');
				grid.reload();
			}else{
				alert('状态更改失败');
			}
		})
	}
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		content:"/order/offline/orderinfo?orderNo="+orderNo,
		shadeClose:false,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 奖品详情
 * @param orderNo
 * @return
 */
function prizeInfo(orderNo){
	var url = '/order/gomestore/prizeinfo?orderNo='+orderNo;
	layer.open({
		type:2,
		title:'新机详情',
		content:url,
		shadeClose:false,
		area:['50%' , '50%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		orderNo:$('#orderNo').val(),
		contactWay:$('#contactWay').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		partnerName:$('#partnerName').val(),
		companyName:$('#companyName').val(),
		eventCode:$('#eventCode').val(),
		prizeStatus:$('#prizeStatus').val(),
		prizeCode:$('#prizeCode').val()
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}

function exprotOfflineOrder(){
	var param = {};
	param.orderNo = $('#orderNo').val();
	param.contactWay = $('#contactWay').val();
	param.startDate = $('#startDate').val();
	param.endDate = $('#endDate').val();
	param.partnerName = $('#partnerName').val();
	param.companyName = $('#companyName').val();
	param.eventCode = $('#eventCode').val();
	param.prizeStatus = $('#prizeStatus').val();
	param.prizeCode = $('#prizeCode').val();
	window.location.href = '/order/gomestore/exprotprize?'+$.param(param);
	return false; //截取返回false就不会保存网页了
}
