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
					if(data['SOURCES'] == '1011'){
						array.push("门店编码："+data['PARTNERCODE']);
						array.push("门店名称："+data['PARTNERNAME']);
						array.push("店长信息："+data['P_CONTACTS']+'（ '+data['P_MOBILE']+' ）');
					}
					array.push("商品串码："+data['IMEICODE']);
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
			,{header:"操作状态", dataIndex:'OPERSTATUSNAME', width:'70px',sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'80px',sortable:false}
			,{header:"租赁模式", dataIndex:'FROMCODE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SOURCES'] == '1011'){
						if(value == 'ZZY'){
							return '有抵押模式';
						}else if(value = 'GOME'){
							return '无抵押模式';
						}
					}else{
						return null;
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
			,{header:"快递单号", dataIndex:'EXPRESSNUM', width:'100px',sortable:false}
			,{header:"回收单", dataIndex:'RECYORDERNO', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value){
						return '<a href="javascript:recyOrderInfo(\''+value+'\')" class="a_link" title="'+value+'">'+value+'</a>';
					}
				}
			}
			,{header:"操作", dataIndex:'ORDERNO', width:'150px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
					returnText += ' | <a href="javascript:orderImgs(\''+value+'\')" class="a_link">照片</a>';
					returnText += ' | <a href="javascript:orderFinsish(\''+value+'\')" class="a_link">完成</a>';
					var status = data['OPERSTATUS'];
					if(status == '4'){
						returnText += ' | <a href="javascript:orderCall(\''+value+'\')" class="a_link">呼叫</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/rentrecy/order/callpagelist'
		,baseParams:{}
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
function orderCall(orderNo){
    layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
        content:'/rentrecy/order/orderquote?orderNo='+orderNo,
        area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
    });
}


function orderFinsish(orderNo){
	if(confirm('是否确认完结当前订单？')){
		$.post('/rentrecy/order/orderfinish',{orderNo:orderNo}, function(data){
			if(data == 'Y'){
				grid.reload();
			}
		});
	}
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

/**
 * 订单拍照留档图片
 * @return
 */
function orderImgs(orderNo){
    layer.open({
		type:2,
		title:'订单拍照留档',
		shadeClose:false,
		shade:0.8,
        content:'/rentrecy/order/orderimgs?orderNo='+orderNo,
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