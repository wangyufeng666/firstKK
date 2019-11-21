function queryAllOrder(that,url,data){
    var params = {
        currentPage:data.currentPage,
        pageSize:data.pageSize,
        createStartDate:data.createStartDate,
        createEndDate:data.createEndDate,
        orderNo:data.orderNo,
        mobile:data.mobile,
        productType:data.productType,
        productName:data.productName,
        imei:data.imei,
        terminalSource:data.terminalSource,
        sourceCode:data.sourceCode
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


function download(that,data){
    var param = '';
    param += 'orderNo='+data['orderNo'];
    param += '&createStartDate='+data['createStartDate'];
    param += '&createEndDate=' + data['createEndDate'];
    param += '&mobile=' + data['mobile'];
    param += '&productType=' + data['productType'];
    param += '&productName=' + data['productName'];
    param += '&terminalSource=' + data['terminalSource'];
    param += '&sourceCode=' + data['sourceCode'];
    param += '&imei=' + data['imei'];
    window.location.href = '/rentv2/order/downordertable?'+param;
    loadingCompleted();
    return false; //截取返回false就不会保存网页了
}