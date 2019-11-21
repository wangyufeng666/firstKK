var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"订单日期", dataIndex:'CREATEDATE', width:'80px',sortable:false}
			,{header:"预约单号", dataIndex:'ORDERNO', width:'180px',sortable:false}
			,{header:"联系人", dataIndex:'CONTACTS', width:'80px',sortable:false}
			,{header:"联系电话", dataIndex:'CONTACTWAY', width:'130px',sortable:false}
			,{header:"联系地址", dataIndex:'ADDRESS', width:'180px',sortable:false}
			,{header:"预约品类", dataIndex:'types', sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'ORDERNO', width:'200px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var status = data['ORDERSTATUS'];
					var userId = data['USERID'];
					var returnText ='';

					//终止操作 94:退券终止；95:转现终止；96:自动终止；97:当地回收；98:终止退回；99:终止
					if(status == '1' || status == '2' ){
						returnText += '<a href="javascript:stopOrder(\''+orderNo+'\')" class="a_link">取消预约单</a>';
						returnText += ' ｜ <a href="javascript:goOrder(\''+orderNo+'\',\''+userId+'\')" class="a_link">去下单</a>';
						returnText += ' ｜ <a href="javascript:success(\''+orderNo+'\')" class="a_link">成功下单</a>';
					}

					return returnText;
				}
			}
		]
		,url:'/order/ririshun/pageappointmentlist'
		,pageSizeList:[15,30,50]
	});
});


function getParams(){
	return {
		orderNo:$('#orderNo').val(),
		contactWay:$('#contactWay').val(),
		orderStatus:$('#orderStatus').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	grid.query(getParams());
}

/**
 * 下载报表
 * @returns
 */
function download(){
	var	orderNo = $('#orderNo').val();
	var	contactWay = $('#contactWay').val();
	var	orderStatus = $('#orderStatus').val();
	var	startDate = $('#startDate').val();
	var	endDate = $('#endDate').val();
	var params = 'orderNo='+orderNo+'&contactWay='+contactWay+'&orderStatus='+orderStatus+'&startDate='+startDate+'&endDate='+endDate;
	window.location.href='/order/ririshun/exportappointmentorder?'+params;
}

/**
 * 取消预约订单
 * @returns
 */
function stopOrder(orderNo){
	if(confirm('确认终止预约订单？')){
		$.post('/order/ririshun/stoporder',{orderNo:orderNo},function(data){
			if(data == 'Y'){
				reload()
			}else{
				alert('取消失败')
			}
		})
	}
}

/**
 * 去下单订单
 * @returns
 */
function goOrder(orderNo,uid){
	layer.open({
		type:2,
		title:'订单详情',
		content:'/order/ririshun/goorder?orderNo='+orderNo+'&uid='+uid,
		shadeClose:false,
		shade:0.8,
		area:['378px', '780px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 *
 * @returns
 */
function success(orderNo){
	if(confirm('是否已经成功下单？')){
		$.post('/order/ririshun/success',{orderNo:orderNo},function(data){
			if(data == 'Y'){
				reload()
			}else{
				alert('取消失败')
			}
		})
	}
}

//回车事件
document.onkeypress = keypress;
function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}

function reload(){
	layer.closeAll();
	grid.reload();
}
