var grid;
$().ready(function () {
    grid = $('#grid').grid({
        pageSize: 10,
        height: 250
        , cm: [
            {checkbox: true},
            {header: "No.", dataIndex: 'R', width: '3%', sortable: false}
            , {header: "创建日期", dataIndex: 'CREATEDATE', width: '10%', sortable: false}
            , {header: "订单编号", dataIndex: 'ORDER_NO', width: '12%', sortable: false}
            , {header: "联系方式", dataIndex: 'contactWay', width: '13%', sortable: false}
            , {header: "芝麻订单号", dataIndex: 'ZM_ORDERNO', width: '15%', sortable: false}
            , {header: "支付编号", dataIndex: 'RENTPAYNO', width: '15%', sortable: false}
            , {header: "扣款金额", dataIndex: 'PAYPRICE', width: '10%', sortable: false}
            , {
                header: "操作", dataIndex: '', width: '20%', sortable: false,
                renderer: function (value, data, rowIndex, colIndex, metadata) {
                    var orderNo = data['ORDER_NO'];
                    var payPrice = data['PAYPRICE'];
                    var returnText = '<a class="a_link" href="javascript:orderInfo(\'' + orderNo + '\')">查看</a>';
                    returnText += ' | <a class="a_link" href="javascript:settlement(\'' + orderNo + '\',\'' + payPrice + '\')">扣款</a>';
                    return returnText;
                }
            }
        ]
        , url: '/rent/withhold/settlementwithhold'
        , baseParams: initParams()
        , pageSizeList: [10, 15, 20, 30, 50]
    });
});

/**
 * 初始化查询参数
 * @returns {{orderno: *, contactWay: *}}
 */
function initParams() {
    var params = getParams();
    params['start'] = start;
    params['limit'] = limit;
    return params;
}

/**
 * 查询参数
 * @returns {{orderno: *|jQuery, contactWay: *|jQuery}}
 */
function getParams() {
    return {
        orderno: $('#orderno').val(),
        contactWay: $('#contactWay').val(),
    };
}

/**
 * 订单详情
 * @param order_no
 * @return
 */
function orderInfo(order_no) {
    window.location.href = "/rent/installment/orderinfo?order_no=" + order_no + "&backUrl=" + backUrl;
}

/**
 * 代扣
 * @param orderNo
 * @param payPrice
 */
function settlement(orderNo, payPrice) {
    if (confirm('是否确认代扣' + payPrice + '元?')) {
        $.post("/rent/withhold/confirmsettlement", {orderNo: orderNo}, function (data) {
            if (data['code'] == '1000') {
                alert('订单结算成功');
                doSearch();
            } else {
                alert(data['msg']);
            }
        });
    }
}

/**
 * 查询
 */
function doSearch() {
    layer.load(2, {time: 2 * 1000});
    grid.query(getParams());
}

/**
 * 刷新
 */
function reload() {
    layer.closeAll();
    grid.reload();
}