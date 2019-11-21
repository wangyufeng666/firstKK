var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:15,
        height:375
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"编号", dataIndex:'ID', width:'250px',sortable:false}
            ,{header:"名称", dataIndex:'NAME', width:'400px',sortable:false}
            ,{header:"创建时间", dataIndex:'CREATEDATE', width:'150px',sortable:false}
            ,{header:"操作", dataIndex:'', width:'30%', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='<a class="a_link" href="javascript:bannerList(\''+data['ID']+'\')">详情</a>';
                    returnText += ' | <a class="a_link" href="javascript:editThis(\''+data['ID']+'\')">修改</a>';
                    returnText += ' | <a class="a_link" href="javascript:syncThis(\''+data['ID']+'\')">同步</a>';
                    return returnText;
                }
            }
        ]
        ,url:'/instalment/banner/typelistdata'
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
        typeName:$('#typeName').val()
    };
}

/**
 * 根据条件查询收票人
 */
function doSearch(){
    grid.query(getParams());
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
function addBannerType(){
    layer.open({
        type:2,
        title:'新增Banner类型',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/banner/addbannertype',
        area:['550px','300px'],
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
function editThis(typeId){
    layer.open({
        type:2,
        title:'修改',
        shadeClose:false,
        shade:0.8,
        content:"/instalment/banner/editbannertype?typeId="+typeId,
        area:['550px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}

function syncThis(typeId){
    layer.confirm('确认同步?',function(index){
        var params = {
            'typeId':typeId
        }
        $.ajax({
            type:'POST'
            ,url:'/redis/rent/syncbanner'
            ,data:params
            ,cache:false
            ,async:false
            ,timeout:60000
            ,success: function (data) {
                if(data == 'Y'){
                    layer.msg('同步成功');
                    layer.close(index);
                }else{
                    layer.msg('同步失败');
                }
            }
        });

    });
}