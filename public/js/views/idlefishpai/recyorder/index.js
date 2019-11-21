var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'160PX',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a class="a_link" title="'+value+'" href="javascript:recyOrderInfo(\''+value+'\')">'+value+'</a>';
				}
			}
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var partnerOrderNo = data['YHDBILLCODE'];
					var merName = data['PNAME']+' '+data['MERNAME'];
					var orderPrice = data['ORDERPRICE']+'——'+data['SETTLEPRICE'];
					return '<span title="'+orderNo+'" ondblclick="showRemark(\''+orderNo+'\', \''+partnerOrderNo+'\', \''+merName+'\', \''+orderPrice+'\')">'+data['STRORDERDATE']+'</span>';
				}
			}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'LIANXIDH', width:'140px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['LIANXIREN']+')';
				}
			} 
			,{header:"订单地址", dataIndex:'DIZHI', width:'140px',sortable:false}
//			,{header:"结算类型", dataIndex:'EVENTNAME', width:'80px',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"操作", dataIndex:'ORDERNO', width:'80px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:orderInfo(\''+value+'\')" class="a_link" title="'+value+'">查看</a>';
				}
			}
		]
		,url:'/idlefishpai/recyorder/pagelist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
	});
	
	//日期验证
	$('#startDate').click(function(){
		WdatePicker({
			onpicked:function(){$('#endDate').trigger('click');},
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
			endDate:'%y-{%M-1}-%d'
		});
	});
});

function initParams(){
	return getParams();
}

/**
 * 回收订单信息
 * @param orderNo
 * @returns
 */
function recyOrderInfo(orderNo){
	layer.open({
		type:2,
		title:'回收订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/order/order/orderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
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
        content:'/idlefishpai/recyorder/taborderinfo?orderNo='+orderNo,
        shadeClose:false,
        shade:0.8,
        area:['100%' , '100%'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 检测操作
 * @param orderId
 * @return
 */
function orderInspection(orderNo){
    layer.open({
        type:2,
        title:'订单检测',
        content:'/order/order/orderinspection?orderNo='+orderNo,
        shadeClose:false,
        shade:0.8,
        area:['100%' , '100%'],
        close:function(index){
            layer.close(index);
        }
    });
}

function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
        contactWay:$('#contactWay').val(),
        orderStatus:$('#orderStatus').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        category:$('#category').val(),
        merType:$('#merType').val(),
        partnerOrderNo:$('#partnerOrderNo').val(),
        address:$('#address').val()
    };
}

function doSearch(){
    grid.query(getParams());
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo,partnerOrderNo, merName, orderPrice){
    layer.close(layerIndex);
    $.post('/recycle/order/jsonremark',{orderNo:orderNo}, function(data){
        layerIndex = layer.open({
            type:1, shade:false, title:false, area:['650px', 'auto'],
            content:'<div class="layer_notice">订单编码： '+orderNo+'<br/>商品名称：'+merName+'<br/>订单金额：'+orderPrice+'<br/>'+data+'</div>'
        });
    });
}

/**
 * 订单电话确认/上门/发货/收货/
 * @param orderNo
 * @return
 */
function orderOperation(orderNo){
    layer.open({
        type:2,
        title:'订单状态修改',
        content:'/order/order/operation?orderNo='+orderNo,
        shadeClose:false,
        shade:0.8,
        area:['500px' , '320px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 下载报表
 * @param msg
 */
function downLoad(){
    var data = getParams();
    window.location.href='/idlefishpai/recyorder/export?'+$.param(data);
}

function errorBox(msg){
    layer.msg(msg);
}

function reload(){
    layer.closeAll();
    grid.reload();
}
