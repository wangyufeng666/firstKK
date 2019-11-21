function saveRemarks(that,params){
    var url = '/rentv2/order/saveremarks';
    post(url,params)
        .then(function (value) {
            success(that,'添加成功');
            window.location.reload();
        })
        .catch(function (reason) {
            fail(that,reason);
        });
}