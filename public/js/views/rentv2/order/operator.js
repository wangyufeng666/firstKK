/**
 * 运营审核通过
 * @param that
 * @param params
 */
function operatorPassed(that,params){
    var url = '/rentv2/order/operatorauditpassed';
    post(url,params,that)
        .then(function (value) {
            success(that,'审核通过');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}

/**
 * 取消订单
 * @param that
 * @param params
 */
function cancelOrder(that,params){
    var url = '/rentv2/order/cancelorder';
    post(url,params,that)
        .then(function (value) {
            success(that,'订单取消成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}