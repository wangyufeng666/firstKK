var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:30,
        height:500
        ,cm:[
            {header:"排序.", dataIndex:'SEQ', width:'40px',sortable:false}
            ,{header:"编号", dataIndex:'ID', width:'250px',sortable:false}
            ,{header:"URL", dataIndex:'URL', width:'400px',sortable:false}
            ,{header:"图片", dataIndex:'IMG_PATH', width:'200px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='<img class="bannerImg" src="'+value+'" >';
                    return returnText;
                }
            }
            ,{header:"是否有效", dataIndex:'IS_VALID', width:'150px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText = "";
                    if(value == 'Y'){
                        returnText ='<span style="color:blue;">启用</span>';
                    }else{
                        returnText ='<span style="color:red;">禁用</span>';
                    }
                    return returnText;
                }
            }
            ,{header:"操作", dataIndex:'', width:'30%', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText = "";
                    if(data['IS_VALID'] == 'Y'){
                        returnText ='<a class="a_link" href="javascript:isValid(\''+data['ID']+'\',\'N\')">停用</a>';
                    }else{
                        returnText ='<a class="a_link" href="javascript:isValid(\''+data['ID']+'\',\'Y\')">启用</a>';
                    }

                    returnText += ' | <a class="a_link" href="javascript:editThis(\''+data['ID']+'\')">修改</a>';
                    return returnText;
                }
            }
        ]
        ,url:'/instalment/banner/bannerlistdata'
        ,baseParams:getParams()
        ,pageSizeList:[15,30,50]
    });
});

/**
 * 获取查询指定参数
 * @returns {{seedeetype: (*|jQuery), seedeename: (*|jQuery)}}
 */
function getParams(){
    return {
        typeId:typeId
    };
}

/**
 *  返回
 */
function goBack(){
    window.location.href = backUrl;
}

/**
 * 关闭弹框
 */
function closeLayer(){
    layer.closeAll('iframe');
}

/**
 * 重新加载
 */
function reload(){
    layer.closeAll('iframe');
    grid.reload();
}

/**
 * 新增Banner类型
 */
function addBanner(){
    layer.open({
        type:2,
        title:'新增Banner类型',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/banner/addbanner?typeId='+typeId,
        area:['560px','470px'],
        close:function(index){
            layer.close(index);
        }
    });
}


/**
 * banner列表
 * @param sendeeid
 */
function bannerList(typeId){
    var backUrl = encodeURIComponent("/instalment/banner/typelist?backFlag='Y'");
    window.location.href = '/instalment/banner/bannerlist?backUrl='+backUrl+"&typeId="+typeId;
}



/**
 * 跳转到修改商品页面
 * @param orderNo
 */
function editThis(bannerId){
    layer.open({
        type:2,
        title:'修改',
        shadeClose:false,
        shade:0.8,
        content:"/instalment/banner/addbanner?typeId="+typeId+"&isEdit=2&bannerId="+bannerId,
        area:['550px','470px'],
        close:function(index){
            layer.close(index);
        }
    });
}

function isValid(bannerId,isValid){
    var params = {
        bannerId:bannerId,
        isValid:isValid
    };
    var message = '';
    if(isValid == 'Y'){
        message = '启用成功';
    }else{
        message = '停用成功';
    }
    $.ajax({
        type:'POST'
        ,url:'/instalment/banner/changevalid'
        ,data:params
        ,cache:false
        ,async:false
        ,timeout:60000
        ,success: function (data) {
            if(data.code){
                layer.msg(message);
                reload();
            }else{
                layer.msg(data.text);
            }
        }
    });
}