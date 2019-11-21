function withholdList(that,url,data){
    var params = {
        currentPage:data.currentPage,
        pageSize:data.pageSize,
        withholdStartDate:data.withholdStartDate,
        withholdEndDate:data.withholdEndDate,
        withholdNo:data.withholdNo,
        orderNo:data.orderNo,
        withholdStatus:data.withholdStatus,
        createStartDate:data.createStartDate,
        createEndDate:data.createEndDate
    };

    post(url,params)
        .then(function(res){
            that.tableData = res.list;
            that.total = res.count;
            loadingCompleted();
        })
        .catch(function(err){
            loadingCompleted();
            fail(that,err);
        })
}

/**
 * 确认代扣
 * @param that
 * @param params
 */
function confirmWithhold(that,params){
    console.log(params);
    var url = '/rentv2/withhold/confirmwithhold';
    post(url,params)
        .then(function (value) {
            success(that,'操作成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}

/**
 * 用户自行还款
 * @param that
 * @param params
 */
function confirmUserRepayment(that,params){
    console.log(params);
    var url = '/rentv2/withhold/confirmuserrepayment';
    post(url,params)
        .then(function (value) {
            that.userRepayment.params.orderNo = '';
            that.userRepayment.params.withholdNo = '';
            that.userRepayment.params.amount = 0;
            that.userRepayment.params.tradeNo = '';
            that.userRepayment.params.account = '';
            that.userRepayment.params.paymentDate = '';
            that.userRepayment.show = false;
            success(that,'操作成功');
            that.onQuery();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}


function download(that,data){
    var param = '';
    param += 'mobile='+data['mobile'];
    param += '&withholdStartDate='+data['withholdStartDate'];
    param += '&withholdEndDate=' + data['withholdEndDate'];
    param += '&withholdNo=' + data['withholdNo'];
    param += '&orderNo=' + data['orderNo'];
    param += '&withholdStatus=' + data['withholdStatus'];
    param += '&createStartDate=' + data['createStartDate'];
    param += '&createEndDate=' + data['createEndDate'];
    window.location.href = '/rentv2/withhold/downwithholdlist?'+param;
    return false; //截取返回false就不会保存网页了
}