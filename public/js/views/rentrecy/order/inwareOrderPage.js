var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"下单日期", dataIndex:'ORDERDATE', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var array = [];
					array.push("下单时间："+value);
					array.push("订单编号："+data['ORDERNO']);
					array.push("门店编码："+data['PARTNERCODE']);
					array.push("门店名称："+value);
					array.push("店长信息："+data['P_CONTACTS']+'（ '+data['P_MOBILE']+' ）');
					array.push("商品串号："+data['IMEICODE']);
					return '<span title="'+array.join("\n")+'" ondblclick="showRemark(\''+array.join('<br/>')+'\')">'+value+'</span>';
				}
			}
			,{header:"门店名称", dataIndex:'PARTNERNAME', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var array = [];
					return '<span title="'+array.join("\n")+'" ondblclick="showRemark(\''+array.join('<br/>')+'\')">'+value+'</span>';
				}
			}
			,{header:"上门标记", dataIndex:'VISITFLAG', width:'70px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == '1'){
						return '上门';
					}else{
						return '快递';
					}
				}
			}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header:"租赁模式", dataIndex:'FROMCODE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == 'ZZY'){
						return '有抵押模式';
					}else if(value = 'GOME'){
						return '无抵押模式';
					}
				}
			}
			,{header:"商品名称", dataIndex:'PRODUCT_NAME', sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['BRAND_NAME']+' '+value;
				}
			}
			,{header:"联系方式", dataIndex:'CONTACTS', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = value+'('+data['CONTACTWAY']+')';
					return returnText;
				}
			}
			,{header:"快递单号", dataIndex:'EXPRESSNUM', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value){
						return '<a href="javascript:expressRoute(\''+value+'\', \''+data['ORDERNO']+'\')" class="a_link" title="'+value+'">'+value+'</a>';
					}
				}
			}
			,{header:"回收单", dataIndex:'RECYORDERNO', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value){
						return '<a href="javascript:recyOrderInfo(\''+value+'\')" class="a_link" title="'+value+'">'+value+'</a>';
					}
				}
			}
			,{header:"操作", dataIndex:'ORDERNO', width:'120px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
					returnText += ' | <a href="javascript:outwareApply(\''+value+'\',\''+data['FROMCODE']+'\',\''+data['PARTNERCODE']+'\')" class="a_link">申请出库</a>';
					return returnText;
				}
			}
		]
		,url:'/rentrecy/order/pagelist'
		,baseParams:getParams()
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
			startDate:'%y-{%M-1}-%d'
		});
	});
});

/**
 * 回收订单详情
 * @param recyOrderNo
 * @returns
 */
function recyOrderInfo(recyOrderNo){
    layer.open({
		type:2,
		title:'回收订单详情',
		shadeClose:false,
		shade:0.8,
        content:'/order/order/orderinfo?orderNo='+recyOrderNo+'&layer=Y',
        area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
    });
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(data){
	layer.close(layerIndex);
	layerIndex = layer.open({
		type:1, shade:false, title:false, area:['650px', 'auto'],
		content:'<div class="layer_notice">'+data+'</div>'
	});
}
/**
 * 订单详情
 * @return
 */
function orderInfo(orderNo){
    layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
        content:'/rentrecy/order/orderinfo?orderNo='+orderNo,
        area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
    });
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(),
    	identifyNo:$('#identifyNo').val(),
        orderStatus:$('#orderStatus').val(),
        fromCode:$('#fromCode').val(),
        orderSource:$('#orderSource').val(),
        startDate:$('#startDate').val(),
        imeiCode:$('#imeiCode').val(),
        contactWay:$('#contactWay').val(),
        endDate:$('#endDate').val()
    };
}

function doSearch(){
    grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

//出库申请,请求接口
function outwareApply(orderNo, fromCode, storeCode){
	if(confirm('是否进行出库？')){
		$.post('/rentrecy/order/outwareapply', {orderNo:orderNo, fromCode:fromCode, storeCode:storeCode}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert('出库申请失败：'+data);
				grid.reload();
			}
		});
	}
}