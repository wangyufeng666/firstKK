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
 * post 请求
 * @param url
 * @param data
 * @returns {Promise}
 */
function post(url,data){
    return new Promise(function(resolve, reject){
        $.post(url, data, function (res) {
            console.log(res);
            if (res.code === '1000') {
                resolve(res.data);
            } else {
                reject(res.msg);
            }
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

function toCall(data){
    var url = 'http://sh.ccic2.com/interface/PreviewOutcall';
    $.get(url, data, function (res) {
        alert(res);
    });
}

/**
 * 查询数据
 * @param that
 * @param url
 * @param data
 */
function query(that,url,data){
    post(url,data)
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

function queryAll(that,url,data){
    post(url,data)
        .then(function(res){
            that.tableData = res;
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