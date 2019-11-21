var grid, layerIndex = '0';
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"创建时间", dataIndex:'CREATEDATE',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系人", dataIndex:'CONTACTS', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTS']+'('+data['CONTACTWAY']+')';
				}
			}
			,{header:"联系地址", dataIndex:'CONTACTADDRESS',width:'100px', sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME',width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['CHANNELNAME']+')';
				}
			}
			,{header:"订单类型", dataIndex:'ORDER_TYPE_NAME',width:'95px', sortable:false}
			,{header:"支付方式", dataIndex:'IDLE_PAY_TYPE_NAME',width:'80px', sortable:false}
			,{header:"快递单号", dataIndex:'EXPRESSNUM', width:'90px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['EXPRESSNUM']){
						return '<a class="a_link" href="http://www.sf-express.com/cn/sc/dynamic_function/waybill/#search/bill-number/'+value+'" target="_blank">'+value+'</a>';
					}
				}
			}
			,{header:"快递公司", dataIndex:'EXPRESSPARTNERNAME', width:'80px',sortable:false}
			,{header:"快递状态", dataIndex:'EXPRESSSTATUSNAME', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'ORDERNO', width:'170px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
					var status = data['EXPRESSSTATUS'];
					
					if(status == '2' || status == '3'){//待寄回
						returnText+=' | <a href="javascript:returnBack(\''+value+'\')" class="a_link">确认寄回</a>';
						returnText += '| <a href="javascript:returnCancle(\''+value+'\')" class="a_link">取消寄回</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/order/expressreturn/pagelist'
		,pageSizeList:[15,20,30,50]
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
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
			maxDate:'%y-{%M+1}-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
});


/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){

    layer.open({
        type:2,
        title:'订单详情',
        shadeClose:false,
        shade:0.8,
        content:"/order/order/orderinfo?orderNo="+orderNo,
        area:['100%','100%'],
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
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        category:$('#category').val(),
        merType:$('#merType').val(),
        address:$('#address').val()
    };
}

function doSearch(){
	layerIndex = layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}

function returnBack(orderNo){
	layer.open({
		type:2,
		title:'确认寄回',
        shadeClose:false,
        shade:0.8,
        content:'/order/order/expressnum?orderNo='+orderNo+'&statusFlag=2',
		area:['600px', '450px'],
        close:function(index){
        	layer.close(index);
        }
	});
}

function returnCancle(orderNo){
	if(confirm('确认取消寄回吗？')){
		$.post('/order/expressreturn/cancle',{orderNo:orderNo},function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert("取消失败，请从新操作！");
			}
		});
	}
}

function downloadBackOrder(){
	var param = '';
	param += 'merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merType=' + $('#merType').val();
	param += '&address=' + $('#address').val();
	window.location.href = '/order/expressreturn/backorderexport?'+param;
	return false; //截取返回false就不会保存网页了
}