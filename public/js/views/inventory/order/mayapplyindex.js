var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10
		,height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"订单编码", dataIndex:'ORDERNO', width:'170px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:void(0)" onclick="orderInfo(\''+value+'\')" title="'+value+'" class="a_link">'+value+'</a>';
				}
			}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+"  "+value;
				}
			}
			,{header:"订单价格", dataIndex:'DINGDANPRICE', width:'70px',sortable:false}
			,{header:"成交价格", dataIndex:'SETTLEPRICE', width:'70px',sortable:false}
			,{header:"入库日期", dataIndex:'STRINWAREDATE', width:'100px',sortable:false}
			,{header:"出库日期", dataIndex:'STROUTWAREDATE', width:'100px',sortable:false}
			,{header:"订单来源", dataIndex:'ORDERTYPE', width:'100px',sortable:false}
			,{header:"结算方式", dataIndex:'EVENTNAME', width:'100px',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'80px',sortable:false}
			,{header:"库存状态", dataIndex:'INVENTORYSTATUSNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'80px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='';
					var orderNo = data['ORDERNO'];
					var applySource = data['APPLYSOURCE'];
					var status = data['INVENTORYSTATUS'];
					//1:已入库； 3:已出库； 4:待领用出库；5:已领用出库；
					
					if(status == '1'){//已入库
						returnText+='<a href="javascript:orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
						returnText+=' | <a href="javascript:apply(\''+orderNo+'\')" class="a_link">领用</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/inventory/order/wareorderlist'
		,pageSizeList:[10, 15, 20, 30, 50]
		,baseParams:{inventoryStatus:1}
	});
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl=/inventory/order/mayapplyindex";
}

/**
 * 批量领用
 * @return
 */
function applys(){
	window.location.href = "/inventory/order/applys";
}

/**
 * 领用操作
 */
function apply(orderNo){
	layer.open({
		type:2,
		title:'领取申请',
		shadeClose:false,
		shade:0.8,
		content:'/inventory/order/applyindex?orderNo='+orderNo,
		area:['400px','240px'],
		close:function(index){
			layer.close(index);
		}
   });
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(), //商品名称
    	category:$('#category').val(),//品类
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val()
    };
}

function doSearch(){
    var s = grid.query(getParams());
}

//监听回车键
$('html').keydown(function(e){
	if(e.which == '13'){
		doSearch();
	}
});
