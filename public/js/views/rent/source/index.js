/*
* @Author: yangzp
* @Date:   2019-04-26 17:49:43
*/
var grid;
var funcs = {};
    funcs.param = {};

funcs.getSourceList = function()
{
    grid = $('#grid').grid({
        pageSize:20,
        height:375
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"来源编码", dataIndex:'SOURCECODE', width:'150px',sortable:false}
            ,{header:"来源名称", dataIndex:'SOURCENAME', width:'150px',sortable:false}
            ,{header:"创建时间", dataIndex:'CREATE_DATE', width:'150px',sortable:false}
            ,{header:"标签", dataIndex:'sourceLabel', width:'150px',sortable:false}
            ,{header:"操作", dataIndex:'', width:'30%', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='';
                        returnText +=' <a class="a_link" href="javascript:funcs.editSource(\''+data['SOURCECODE']+'\')">修改</a>';
                        if(data['showRelation'] == '1') {
                            returnText += ' <a class="a_link" href="javascript:funcs.editSourceLabel(\'' + data['SOURCECODE'] + '\')">关联标签</a>';
                        }
                        return returnText;
                }
            }
        ]
        ,url:'/rent/source/list'
        ,baseParams:funcs.getParams()
        ,pageSizeList:[20,30,50]
    });
}

//搜索
funcs.search = function()
{
    grid.query(funcs.getParams());
}

//查询条件
funcs.getParams = function (){
    return {
        sourceCode:$('#sourceCode').val(),
        sourceName:$('#sourceName').val()
    };
}

//新增
funcs.addSource = function () {
    layer.open({
        type:2,
        title:'编辑来源',
        shadeClose:false,
        shade:0.8,
        content:'/rent/source/create',
        area:['510px','220px'],
        close:function(index){
            layer.close(index);
        }
    });
}


funcs.reload = function (){
    layer.closeAll('iframe');
    grid.reload();
}

funcs.editSource = function (sourceCode) {
    layer.open({
        type:2,
        title:'编辑来源',
        shadeClose:false,
        shade:0.8,
        content:'/rent/source/edit?sourceCode='+sourceCode,
        area:['510px','200px'],
        close:function(index){
            layer.close(index);
        }
    });
}

$(document).ready(function(){
    funcs.getSourceList();
    $(".addSource").click(funcs.addSource);
    $(".search").click(funcs.search);
});

/**
 * 修改来源标签关联
 * @param sourceCode
 */
funcs.editSourceLabel = function(sourceCode){
    var url = '/rent/source/sourcelabelrelationpage?sourceCode=' + sourceCode;
    layer.open({
        type:2,
        title:'关联来源标签',
        shadeClose:false,
        shade:0.8,
        content:url,
        area:['550px','500px'],
        close:function(index){
            layer.close(index);
        }
    });
}

