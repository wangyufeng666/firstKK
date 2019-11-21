/**
 * 客服审核通过
 * @param that
 * @param params
 */
function customerServiceAuditPassed(that,params){
    var url = '/rentv2/order/customerserviceauditpassed';
    post(url,params,that)
    .then(function (value) {
        that.customerServiceAuditParam.params.orderNo = '';
        that.customerServiceAuditParam.params.account = '';
        that.customerServiceAuditParam.params.accountSource = '';
        that.customerServiceAuditParam.show = false;
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
 */
function cancelOrder(that,params){
    console.log(params);
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

/**
 * 买断操作
 * @param that
 * @param params
 */
function buyout(that,params){
    console.log(params);
    var url = '/rentv2/order/buyout';
    post(url,params,that)
        .then(function (value) {
            that.buyOffParam.params.orderNo = '';
            that.buyOffParam.params.amount = 0;
            that.buyOffParam.show = false;
            success(that,'操作成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}

/**
 * 待结清确认
 * @param that
 * @param params
 */
function settlementConfirm(that,params){
    console.log(params);
    var url = '/rentv2/order/settlementconfirm';
    post(url,params,that)
        .then(function (value) {
            that.settlementParam.params.orderNo = '';
            that.settlementParam.params.amount = 0;
            that.settlementParam.show = false;
            success(that,'操作成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}

/**
 * 待结清成功
 * @param that
 * @param params
 */
function settlementSuccess(that,params){
    console.log(params);
    var url = '/rentv2/order/settlementsuccess';
    post(url,params,that)
        .then(function (value) {
            that.settlementSuccessParam.params.orderNo = '';
            that.settlementSuccessParam.params.amount = 0;
            that.settlementSuccessParam.params.tradeNo = '';
            that.settlementSuccessParam.params.account = '';
            that.settlementSuccessParam.show = false;
            success(that,'操作成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}

/**
 * 待结清扣款
 * @param that
 * @param params
 */
function settlementWithhold(that,params){
    var url = '/rentv2/order/settlementwithhold';
    post(url,params,that)
        .then(function (value) {
            success(that,'操作成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}

/**
 * 买断审核通过
 * @param that
 * @param params
 */
function buyoutAuditPassed(that,params){
    var url = '/rentv2/order/buyoutauditpassed';
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
 * 买断审核不通过
 * @param that
 * @param params
 */
function buyoutAuditFail(that,params){
    var url = '/rentv2/order/buyoutauditfail';
    post(url,params,that)
        .then(function (value) {
            success(that,'操作成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}


/**
 * 买断成功
 * @param that
 * @param params
 */
function buyoutSuccess(that,params){
    var url = '/rentv2/order/buyoutsuccess';
    post(url,params,that)
        .then(function (value) {
            that.buyoutSuccessParam.params.orderNo = '';
            that.buyoutSuccessParam.params.amount = 0;
            that.buyoutSuccessParam.params.tradeNo = '';
            that.buyoutSuccessParam.show = false;
            success(that,'买断成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}

/**
 * 买断扣款
 * @param that
 * @param params
 */
function buyoutWithhold(that,params){
    var url = '/rentv2/order/buyoutwithhold';
    post(url,params,that)
        .then(function (value) {
            success(that,'扣款成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}

/**
 * 已结清完结
 * @param that
 * @param params
 */
function settlementComplete(that,params){
    var url = '/rentv2/order/settlementcomplete';
    post(url,params,that)
        .then(function (value) {
            success(that,'完结成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}

/**
 * 买断完结
 * @param that
 * @param params
 */
function buyoutComplete(that,params){
    var url = '/rentv2/order/buyoutcomplete';
    post(url,params,that)
        .then(function (value) {
            success(that,'完结成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}