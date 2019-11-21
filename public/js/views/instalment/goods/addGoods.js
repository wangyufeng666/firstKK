/**
 * 获取品牌列表
 * @param categoryCode
 * @returns {Array}
 */
function getBrandList(categoryCode){
    var index = layer.load(1,{shade: [0.1,'#fff']});
    var brandList = [];
    $.ajax({
        type: "POST",
        url: "/rent/pinpai/allbrandbytype",
        data: {categoryCode:categoryCode},
        async:false, // 同步请求
        dataType: "json",
        timeout: 30000,
        cache:false,
        success: function(result){
            layer.close(index);
            if(result.code === '1000'){
                brandList = result.data;
            }else{
                errorBox(result.msg);
            }
        },
        error: function(){
            layer.close(index);
            layer.alert('网络错误');
        }
    });
    return brandList;
}

/**
 * 获取属性列表
 * @param categoryCode
 * @returns {Array}
 */
function getAttrList(categoryCode){
    var attrList = [];
    var index = layer.load(1,{shade: [0.1,'#fff']});
    $.ajax({
        type: "POST",
        url: "/instalment/attribute/getattrlist",
        data: {categoryCode:categoryCode},
        async:false, // 同步请求
        dataType: "json",
        timeout: 30000,
        cache:false,
        success: function(result){
            layer.close(index);
            if(result.code === '1000'){
                attrList = result.data;
            }else{
                errorBox(result.msg);
            }
        },
        error: function(){
            layer.close(index);
            layer.alert('网络错误');
        }
    });
    return attrList;
}

/**
 * 错误信息
 * @param msg
 */
function errorBox(msg){
    layer.msg(msg,{icon: 5,time: 2000});
}

/**
 * 成功信息
 * @param msg
 */
function successBox(msg){
    layer.msg(msg,{icon: 6,time: 2000});
}

/**
 * 显示属性
 */
function showAttr(){
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        // area: '516px',
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: true,
        content: $('#attrList')
    });
}

var attrs = [];
$().ready(function(){
    $("#goodsForm").validate({
        rules: {
            productName: {
                required: true,
                maxlength: 50
            },
            categoryCode: {
                required: true
            },
            brandCode: {
                required: true
            },
            seq: {
                digits:true,
                min:1,
                max:999999
            },
            homeImg: {
                maxlength:512
            },
            smallImg: {
                maxlength:512
            },
            detailImg: {
                maxlength:512
            },
            bannerImg1: {
                maxlength:512
            },
            bannerImg2: {
                maxlength:512
            },
            bannerImg3: {
                maxlength:512
            },
            remarks: {
                maxlength: 200,
            }
        },
        messages: {
            productName: {
                required: "请输入商品名称",
                maxlength: "最多输入50个字符"
            },
            categoryCode: {
                required: "请选择商品类型"
            },
            brandCode: {
                required: "请选择商品品牌"
            },
            seq: {
                digits: '必须为整数',
                min:'最小值为1',
                max:'最大值为999999'
            },
            homeImg: {
                maxlength: "最多512字符"
            },
            smallImg: {
                maxlength: "最多512字符"
            },
            detailImg: {
                maxlength: "最多512字符"
            },
            bannerImg1: {
                maxlength: "最多512字符"
            },
            bannerImg2: {
                maxlength: "最多512字符"
            },
            bannerImg3: {
                maxlength: "最多512字符"
            },
            remarks: {
                required: "最多200个字符"
            }
        }
    });
});


/**
 * 添加图片页面
 * @param imgType
 * @param files
 */
function addImg(imgType,files){
    var content = '/instalment/file/uploadimg?imgType='+imgType + '&files=' + encodeURIComponent(files);
    layer.open({
        type:2,
        title:'添加图片',
        shadeClose:false,
        shade:0.8,
        content:content,
        area:['500px' , '350px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 设置图片路径
 * @param path
 * @param type
 */
function setImgPath(path,type){
    switch(type){
        case 'PRODUCT_BANNER':
            addGoodsApp.params.homeImg = path;   // 商品首页图
            break;
        case 'PRODUCT_MAIN':
            addGoodsApp.params.smallImg = path;  // 商品小图
            break;
        case 'PRODUCT_CAROUSEL1':
            addGoodsApp.params.bannerImg1 = path;  // 商品轮播图1
            break;
        case 'PRODUCT_CAROUSEL2':
            addGoodsApp.params.bannerImg2 = path;  // 商品轮播图2
            break;
        case 'PRODUCT_CAROUSEL3':
            addGoodsApp.params.bannerImg3 = path;  // 商品轮播图3
            break;
        case 'PRODUCT_DETAIL':
            addGoodsApp.params.detailImg = path; // 商品详情图
            break;
        default:
            break;
    }
    layer.closeAll();
}

/**
 * 关闭所有弹窗
 * @param text
 */
function closeAll(text){
    layer.closeAll();
    layer.msg(text);
}

/**
 * 保存商品信息
 * @param params
 */
function saveGoods(params){
    var index = layer.load(1,{shade: [0.1,'#fff']});
    if($('#goodsForm').valid()) {
        $.ajax({
            type: "POST",
            url: "/instalment/goods/savegoods",
            data: params,
            dataType: "json",
            timeout: 30000,
            cache:false,
            success: function(data){
                if(data.code === '1000'){
                    successBox('保存成功');
                    window.parent.location.href = window.parent.location.href;
                }else{
                    layer.close(index);
                    errorBox('保存失败');
                }
            },
            error: function(){
                layer.close(index);
                errorBox('网络错误');
            }
        });
    }else{
        layer.close(index);
    }
}