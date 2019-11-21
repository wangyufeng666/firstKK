var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var merName = data['PNAME']+' '+data['MERNAME'];
					var orderPrice = data['ORDERPRICE']+'——'+data['SETTLEPRICE'];
					return '<span title="'+orderNo+'" ondblclick="showRemark(\''+orderNo+'\', \''+merName+'\', \''+orderPrice+'\')">'+data['STRORDERDATE']+'</span>';
				}
			}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'160px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"联系地址", dataIndex:'DIZHI', width:'140px',sortable:false}
			,{header:"订单来源", dataIndex:'', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var channel ='';
					if(data['ORDERTYPE']=='71' || data['ORDERTYPE']=='73'){
						if(data['CHANNEL']=='idle'){
							channel = '闲鱼';
						}else if(data['CHANNEL']=='tmall'){
							channel = '天猫';
						}else if(data['CHANNEL']=='alipay'){
							channel = '支付宝';
						}else if(data['CHANNEL']=='taobao'){
							channel = '淘宝';
						}else if(data['CHANNEL']=='tmall-service'){
							channel = '天猫以旧换新';
						}
					}
					if(channel){
						return data['SOURCENAME']+'('+channel+')';
					}else{
						return data['SOURCENAME'];
					}
				}
			}
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
					var status = data['ORDERSTATUS']+'';
					if(status == '1' || status =='6' || status == '7'){
                        return '<a title="'+value+'" href="javascript:takeGoods(\''+value+'\',\''+status+'\')" class="a_link">收货</a>';
					}
				}
			}
		]
		,url:'/order/initialcheck/pagelist'
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
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	
	//渠道change事件
	$("#partnerCode").change(function(){
		var partnerCode = $(this).val();
		$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
			$("#orderSource").html("<option value=''>请选择来源</option>");
			for(i in data){
				$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
			}
		}, 'json');
	});
});

var flag = false;
/**
 * 订单状态操作
 * @param orderNo
 */
function initialcheck(orderNo,desc){
    $.ajaxSettings.async = false;
    $.post('/order/order/saveoperation', {orderNo:orderNo, operDesc:desc, logLevel:4}, function(data){
        if(data == 'Y'){
            flag = true;
            return true;
        }else{
            alert('操作错误：'+data);
            flag = true;
            return false;
        }
    });
    $.ajaxSettings.async = true;
}

/**
 * 收货
 * @param orderNo
 */
function takeGoods(orderNo,status){
    var desc = ''
	if(confirm('是否确认收货？')){
        if(status == 1){
            desc = '待客户发货';
            initialcheck(orderNo,desc);
            if(flag){
                desc = '客户已发货，待收货';
                initialcheck(orderNo,desc);
                if(flag){
                    saveCheck(orderNo)
                }
            }
        }else if(status == 6){
            desc = '客户已发货，待收货';
            initialcheck(orderNo,desc);
            if(flag){
                saveCheck(orderNo)
            }
        }else{
            saveCheck(orderNo)
		}
	}
}

/**
 * 保存初检信息
 * @param orderNo
 */
function saveCheck(orderNo){
    layer.open({
        type:2,
        title:'订单状态修改',
        content:'/order/initialcheck/saveinitialcheck?orderNo='+orderNo,
        shadeClose:false,
        shade:0.8,
        area:['510px' , '700px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo, merName, orderPrice){
	layer.close(layerIndex);
	$.post('/recycle/order/jsonremark',{orderNo:orderNo}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', 'auto'],
			content:'<div class="layer_notice">订单编码： '+orderNo+'<br/>商品名称：'+merName+'<br/>订单金额：'+orderPrice+'<br/>'+data+'</div>'
		});
	});
}

function getParams(){
	return {
        expressNum:$('#expressNum').val(),
        orderStatus:$('#orderStatus').val(),
        partnerCode:$('#partnerCode').val(),
        orderSource:$('#orderSource').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
		contactWay:$('#contactWay').val()
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	layerIndex = layer.msg('加载中', {icon:16, shade:0.2});
	grid.query(getParams());
}

function reloads(){
    layer.closeAll('iframe');
    grid.reload();
}

//回车搜索
$("#expressNum").change(function(){
    doSearch();
})

//回车搜索
function keyPress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}
document.onkeypress = keyPress;
