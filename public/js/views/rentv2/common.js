var toast;

/**
 * 显示加载
 */
function loading(that){
    toast = that.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
}

/**
 * 加载完成
 */
function loadingCompleted(){
    if(toast){
        toast.close();
    }
}

/**
 * 失败消息
 * @param that
 * @param msg
 */
function fail(that,msg){
    that.$message({
        showClose: true,
        message: msg,
        type: 'error'
    });
}

/**
 * 成功消息
 * @param that
 * @param msg
 */
function success(that,msg){
    that.$message({
        showClose: true,
        message: msg,
        type: 'success'
    });
}

/**
 * 跳转页面
 * @param url
 */
function goPage(url){
    window.location.href = url;
}

/**
 * 弹出全屏页面
 * @param title
 * @param url
 */
function popUpPage(title,url){
    var index = layer.open({
         type: 2
        ,title: title
        ,content: url
        ,area: ['100%','100%']
        ,shade: 0.8
        ,shadeClose: false
        ,resize: false
        ,cancel: function(index, layero){
            layer.close(index);
        }
    });
}

/**
 * post 请求
 * @param url
 * @param data
 * @param that
 * @returns {Promise}
 */
function post(url,data,that){
    if(that){
        loading(that)
    }
    return new Promise(function(resolve, reject){
        $.post(url, data, function (res) {
            console.log(res);
            if (res.code === '1000') {
                resolve(res.data);
            } else {
                reject(res.msg);
            }
            loadingCompleted();
        }, "json");
    });
}

/**
 * GET 请求
 * @param url
 * @param data
 * @returns {Promise}
 */
function get(url,data){
    return new Promise(function(resolve, reject){
        $.get(url, data, function (res) {
            console.log(res);
            resolve(res);
        });
    });
}

function getJsonp(url,data){
    return new Promise(function(resolve, reject){
        $.get(url, data, function (res) {
            console.log(res);
            resolve(res);
        },'jsonp');
    });
}

function toCall(data){
    var url = 'http://sh.ccic2.com/interface/PreviewOutcall';
    $.get(url, data, function (res) {
        alert(res);
    },'jsonp');
}

/**
 * 查询数据
 * @param that
 * @param url
 * @param data
 */
function query(that,url,data){
    var params = {};
    // 客服操作
    if(data.status == '10'){  // 客服待审核
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            settlementMethod:data.settlementMethod,
            terminalSource:data.terminalSource,
            sourceCode:data.sourceCode
        };
    }else if(data.status == '66'){ // 租赁中
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            settlementMethod:data.settlementMethod,
            giveBackStatus:data.giveBackStatus,
            terminalSource:data.terminalSource,
            sourceCode:data.sourceCode,
            imei:data.imei
        }
    }else if(data.status == '69'){ // 待结清
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            settlementMethod:data.settlementMethod,
            giveBackStatus:data.giveBackStatus,
            terminalSource:data.terminalSource,
            sourceCode:data.sourceCode,
            deviceStatus:data.deviceStatus
        }
    }else if(data.status == '71'){ // 买断待审核
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            settlementMethod:data.settlementMethod,
            terminalSource:data.terminalSource,
            sourceCode:data.sourceCode
        }
    }else if(data.status == '72'){ // 买断审核未通过
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            settlementMethod:data.settlementMethod,
            terminalSource:data.terminalSource,
            sourceCode:data.sourceCode
        }
    }else if(data.status == '11'){ // 运营待审核
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            settlementMethod:data.settlementMethod,
            terminalSource:data.terminalSource,
            sourceCode:data.sourceCode
        }
    }else if(data.status == '77'){ // 已买断
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            settlementMethod:data.settlementMethod,
            terminalSource:data.terminalSource,
            sourceCode:data.sourceCode,
            buyoutOperation:data.buyoutOperation,
            isUnFreeze:data.isUnFreeze
        }
    }else if(data.status == '99'){ // 已取消
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            terminalSource:data.terminalSource,
            sourceCode:data.sourceCode
        }
    }else if(data.status == '12'){ // 采购待审核
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName
        }
    }else if(data.status == '13'){ // 待采购
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName
        }
        // 仓库操作
    }else if(data.status == '3'){ // 待发货
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName
        }
    }else if(data.status == '4'){ // 待收货
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            imei:data.imei
        }
    }else if(data.status == '68'){ // 已检测
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            imei:data.imei
        }
    }else if(data.status == '70'){ // todo 已结清
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            settlementMethod:data.settlementMethod,
            imei:data.imei,
            terminalSource:data.terminalSource,
            sourceCode:data.sourceCode,
            isUnFreeze:data.isUnFreeze,
            deviceStatus:data.deviceStatus
        }
        // 检测操作
    }else if(data.status == '67'){ // todo 待检测
        params = {
            currentPage:data.currentPage,
            pageSize:data.pageSize,
            status:data.status,
            createStartDate:data.createStartDate,
            createEndDate:data.createEndDate,
            orderNo:data.orderNo,
            mobile:data.mobile,
            productType:data.productType,
            productName:data.productName,
            imei:data.imei
        }
    }
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
 * 关闭所有打开页面
 */
function closePage(){
    layer.closeAll();
    // layer.closeAll('iframe');
}

/**
 * 打开页面
 * @param title
 * @param url
 * @param width
 * @param height
 */
function openPage(title,url,width,height) {
    console.log(layer);
    var area = 'auto';
    if(width && !height){
        area = [width];
    }else if(width && height){
        area = [width,height];
    }
    layer.open({
        type:2,
        title:title,
        shadeClose:false,
        shade:0.8,
        content:url,
        area:area,
        close:function(index){
            layer.close(index);
        }
    });
}