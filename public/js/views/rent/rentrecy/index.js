var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize :10,
        height:250
        ,cm : [
            {header:"NO.", dataIndex:'R', width:'3%', sortable:false }
            ,{header:"关联时间", dataIndex:'CREATE_DATE', width:'10%', sortable:false}
            ,{header: "租赁单号", dataIndex: 'ORDER_NO', width:'12%',sortable:false}
            ,{header: "回收单号", dataIndex: 'RECY_ORDERNO', width:'12%',sortable:false}
            ,{header: "旧机残值", dataIndex: 'MER_PRICE', width:'5%',sortable:false}
            ,{header:"商品类型", dataIndex:'PRODUCT_TYPE_NAME', width:'5%', sortable:false}
            ,{header:"品牌名称", dataIndex:'BRAND_NAME', width:'5%', sortable:false}
            ,{header:"商品名", dataIndex:'', width:'15%', sortable:false
                ,renderer : function(value, data, rowIndex, colIndex, metadata){
                    return data['PRODUCT_NAME']+' '+data['MODEL_NAME'];
                }
            }
            ,{header: "联系方式", dataIndex: '', width:'10%',sortable:false
                ,renderer : function(value, data, rowIndex, colIndex, metadata){
                    return data['CONTACT_NAME']+'('+data['CONTACT_MOBILE']+')';
                }
            }
            ,{header:"联系地址", dataIndex:'ADDRESS', width:'12%', sortable:false}
            ,{header:"新机价格", dataIndex:'NEW_PRODUCT_PRICE', width:'5%', sortable:false}
            ,{header:"分期期数", dataIndex:'TOTAL_PERIODS', width:'5%', sortable:false}
            ,{header:"每期付费", dataIndex:'PERIOD_PRICE', width:'5%', sortable:false}
            ,{header:"总租金", dataIndex:'TOTAL_PRICE', width:'5%', sortable:false}
        ]
        ,url : '/rent/rentrecy/rentrecypage'
        ,baseParams:initParams()
        ,pageSizeList:[10,15,20,30,50]
    });

});


function initParams(){

    if(backFlag == 'Y'){
        var params = getParams();
        params['start'] = start;
        params['limit'] = limit;
        return params;
    }else{
        return {};
    }
}

/**
 * 订单详情
 * @param order_no
 * @return
 */
function orderInfo(order_no){
    window.location.href = "/rent/installment/orderinfo?order_no="+order_no+"&backUrl="+backUrl;
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
    layer.load('数据加载中...', 1);
    grid.query(getParams());
}
