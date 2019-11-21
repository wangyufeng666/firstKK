var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:15,
        height:375
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"编号", dataIndex:'KEY', width:'250px',sortable:false}
            ,{header:"终端", dataIndex:'KEYNAME', width:'400px',sortable:false}
            ,{header:"操作", dataIndex:'', width:'30%', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='<a class="a_link" href="javascript:constantList(\''+data['KEY']+'\')">详情</a>';
                    return returnText;
                }
            }
        ]
        ,url:'/instalment/constant/typelistdata'
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
function addConstantType(){
    layer.open({
        type:2,
        title:'新增Banner类型',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/constant/addconstanttype',
        area:['550px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}


/**
 * constant列表
 * @param sourceCode
 */
function constantList(sourceCode){
    var backUrl = encodeURIComponent("/instalment/constant/typelist?backFlag='Y'");
    window.location.href = '/instalment/constant/constantlist?backUrl='+backUrl+"&sourceCode="+sourceCode;
}

