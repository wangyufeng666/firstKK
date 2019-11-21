var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:30,
        height:500
        ,cm:[
            {header:"排序.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"编号", dataIndex:'PKID', width:'250px',sortable:false}
            ,{header:"类型编号", dataIndex:'TYPE', width:'200px',sortable:false}
            ,{header:"类型名称", dataIndex:'TYPENAME', width:'150px',sortable:false}
            ,{header:"键", dataIndex:'KEY', width:'200px',sortable:false}
            ,{header:"键名", dataIndex:'KEYNAME', width:'150px',sortable:false}
            ,{header:"值", dataIndex:'PARAM', width:'200px',sortable:false}
            ,{header:"操作", dataIndex:'', width:'30%', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText = "";
                    if(canAdd) {
                        if (data['ISVALID'] == 'Y') {
                            returnText = '<a class="a_link" href="javascript:isValid(\'' + data['PKID'] + '\',\'N\')">停用</a>';
                        } else {
                            returnText = '<a class="a_link" href="javascript:isValid(\'' + data['PKID'] + '\',\'Y\')">启用</a>';
                        }
                    }
                    if(data['MODES'] != 'enum'){
                        returnText += ' | <a class="a_link" href="javascript:editThis(\''+data['PKID']+'\')">修改</a>';
                    }
                    return returnText;
                }
            }
        ]
        ,url:'/instalment/constant/constantlistdata'
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
        sourceCode:sourceCode,
        type:$('#type').val(),
        keyName:$('#keyName').val()
    };
}


function doSearch(){
    layer.load(2, {time: 3*1000});
    grid.query(getParams());
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
 * 新增Constant
 */
function addConstant(){
    layer.open({
        type:2,
        title:'新增配置',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/constant/addconstant?sourceCode='+sourceCode,
        area:['560px','470px'],
        close:function(index){
            layer.close(index);
        }
    });
}

function addConstantType(){
    layer.open({
        type:2,
        title:'新增配置类型',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/constant/addtype?sourceCode='+sourceCode,
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
function constantList(typeId){
    var backUrl = encodeURIComponent("/instalment/constant/constantlist?backFlag='Y'");
    window.location.href = '/instalment/constant/constantlist?backUrl='+backUrl+"&typeId="+typeId;
}



/**
 * 跳转到修改商品页面
 * @param orderNo
 */
function editThis(pkId){
    layer.open({
        type:2,
        title:'修改',
        shadeClose:false,
        shade:0.8,
        content:"/instalment/constant/editconstant?sourceCode="+sourceCode+"&pkId="+pkId,
        area:['550px','470px'],
        close:function(index){
            layer.close(index);
        }
    });
}

function isValid(pkId,isValid){
    var params = {
        pkId:pkId,
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
        ,url:'/instalment/constant/changevalid'
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