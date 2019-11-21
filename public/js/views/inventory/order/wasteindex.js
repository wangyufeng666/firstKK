var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :15
		,height:375
		,cm : [
			{header: "No.", dataIndex: 'R', width:'40px',sortable:false}
			,{header: "订单编码", dataIndex: 'ORDERNO', width:'170px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:orderInfo(\''+value+'\')" title="'+value+'" class="a_link">'+value+'</a>';
				}
			}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "商品名称", dataIndex: 'MERNAME', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+"  "+value;
				}
			}
			,{header: "订单价格", dataIndex: 'DINGDANPRICE', width:'70px',sortable:false}
			,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'70px',sortable:false}
			,{header: "入库日期", dataIndex: 'STRINWAREDATE', width:'100px',sortable:false}
			,{header: "出库日期", dataIndex: 'STROUTWAREDATE', width:'100px',sortable:false}
			,{header: "订单来源", dataIndex: 'ORDERTYPE', width:'100px',sortable:false}
			,{header: "结算方式", dataIndex: 'EVENTNAME', width:'100px',sortable:false}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'80px',sortable:false}
			,{header: "库存状态", dataIndex: 'INVENTORYSTATUSNAME', width:'90px',sortable:false}
		]
		,url : '/inventory/order/wasteorderlist'
		,pageSizeList:[15, 30, 50]
	});
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		content:"/order/order/orderinfo?orderNo="+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

//废弃一键出库
function outwastes(){
	var num = $('#scrapPhoneNo').val();
	if(Number(num) >= 1 && Number(num) <= 50){
		var load1 = layer.load('加载中...');
		$.ajax({
			type : 'POST'//请求方式
			,url : "/inventory/order/outwastes"//请求路径
			,data : {num:num} //发送到服务器的数据
			,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async : false //同步请求
			,timeout :60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success : function(data){
				if( data > 0){
					layer.close(load1);
					alert(data+'个成功，'+(num-data)+'个失败');
					window.location.reload();//刷新
				}else{
					layer.close(load1);
					alert("失败");
				}
			}
		});
	}else{
		alert('请输入1到50的整数');
	}
}

function getParams(){
	return {
		orderNo:$('#orderNo').val(), //商品名称
		category:$('#category').val(),//品类
		startCreateDate:$('#startCreateDate').val(),
		endCreateDate:$('#endCreateDate').val(),
		inventoryStatus:$('#inventoryStatus').val()//库存状态
	};
}

function doSearch(){
	layer.msg('正在查询，请稍后...', 2, 16);
	var s = grid.query(getParams());
}

//监听回车键
$('html').keydown(function(e){
	if(e.which == '13'){
		doSearch();
	}
});