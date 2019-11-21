var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:10,
        height:250
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px', sortable:false }
            ,{header:"租赁单号", dataIndex:'ORDER_NO', width:'120px',sortable:false}
            ,{header:"下单时间", dataIndex:'CREATEDATE', width:'100px',sortable:false}

            ,{header:"联系方式", dataIndex:'CONTACT_NAME', width:'140px', sortable:false
                ,renderer:function(value, data, rowIndex, colIndex, metadata){
                    return value+'（'+data['CONTACT_MOBILE']+'）';
                }
            }
            

            ,{header:"用户淘宝昵称", dataIndex:'CUSTOMER_ACCOUNT_NAME', width:'100px', sortable:false}
            ,{header:"地址", dataIndex:'ADDRESS', width:'140px', sortable:false}
            ,{header:"每期租金", dataIndex:'PERIOD_PRICE', width:'80px', sortable:false}
            ,{header:"总期数", dataIndex:'TOTAL_PERIODS', width:'80px', sortable:false}
            ,{header:"总租金", dataIndex:'TOTAL_PRICE', width:'80px', sortable:false}
            ,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px', sortable:false}
            ,{header:"操作", dataIndex:'ORDER_NO', width:'30%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:orderInfo(\''+value+'\')">详情</a>';
				  	return returnText;
				}
		   	}
        ]
        ,url:'/rent/taobaoorder/pagelist'
        ,baseParams:initParams()
        ,pageSizeList:[10,15,20,30,50]
    });
    
    /**
     * 上传订单按钮
     */
    $('#btnUploadOrders').click(function(){
    	layer.open({
    		type:2,
    		title:'订单导入',
    		shadeClose:false,
    		shade:0.8,
    		content:"/rent/taobaoorder/orderimportpage",
    		area:['100%','100%'],
    		close:function(index){
    			layer.close(index);
    		}
       });
    });
});

function initParams(){
    return getParams();
}

/**
 * 订单详情
 * @param order_no
 * @return
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
		content:"/rent/installment/orderinfo?order_no="+orderNo+'&layer=Y',
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
   });
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

function getParams(){
    return {
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        mobile:$('#mobile').val(),
        rentOrderNo:$('#rentOrderNo').val(),
        recyOrderNo:$('#recyOrderNo').val(),
        product_name:$('#product_name').val(),
        merType:$('#merType').val()
    };
}

/**
 * 导出
 */
function exprotOrder(){
    var param = '';
    param += '&startCreateDate=' + $('#startCreateDate').val();
    param += '&endCreateDate=' + $('#endCreateDate').val();
    param += '&mobile=' + $('#mobile').val();
    param += '&rentOrderNo=' + $('#rentOrderNo').val();
    param += '&recyOrderNo=' + $('#recyOrderNo').val();
    param += '&product_name=' + $('#product_name').val();
    param += '&merType=' + $('#merType').val();
    window.location.href = '/rent/rentrecy/exprotorder?'+param;
    return false; //截取返回false就不会保存网页了
}

function doSearch(){
    grid.query(getParams());
}
