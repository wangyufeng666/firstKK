/**
 * 功能描述：
 * @createdate 2019/4/28 13:53
 * @version    V1.0.1
 * @author     yangzp
 * @copyright  2019 上海晨骏网络科技有限公司 版权所有
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
            ,{header:"来源编码", dataIndex:'PARENT_CODE', width:'100px',sortable:false}
            ,{header:"来源名称", dataIndex:'PARENT_NAME', width:'100px',sortable:false}
            ,{header:"外部编号", dataIndex:'OUT_CODE', width:'100px',sortable:false}
            ,{header:"子来源编码", dataIndex:'SOURCECODE', width:'100px',sortable:false}
            ,{header:"子来源名称", dataIndex:'SOURCENAME', width:'100px',sortable:false}
            ,{header:"小程序APPId", dataIndex:'ALIPAY_APPID', width:'100px',sortable:false}
            ,{header:"支付方式", dataIndex:'PAYTYPE', width:'100px',sortable:false}
            ,{header:"轮播图编号", dataIndex:'BANNER_ID', width:'100px',sortable:false}
            ,{header:"标签", dataIndex:'LABEL_NAME', width:'100px',sortable:false}
            ,{header:"是否买断", dataIndex:'SHOW_BUF_OFF', width:'100px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['SHOW_BUF_OFF']*1 == 1){
                        return '否';
                    }else{
                        return '是';
                    }
                }
            }
            ,{header:"是否预授权", dataIndex:'IS_FUND_AUTH', width:'100px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['IS_FUND_AUTH']*1 == 1){
                        return '否';
                    }else{
                        return '是';
                    }
                }
            }
            ,{header:"操作", dataIndex:'', width:'10%', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='';
                    returnText +=' <a class="a_link" href="javascript:funcs.editSourceInfo(\''+data['PKID']+'\')">修改</a>';
                    returnText +=' <a class="a_link" href="javascript:funcs.detail(\''+data['PKID']+'\')">详情</a>';
                    returnText +=' | <a class="a_link" href="javascript:funcs.editSourceLabel(\''+data['SOURCECODE']+'\')">关联标签</a>';
                    return returnText;
                }
            }
        ]
        ,url:'/rent/sourceinfo/list'
        ,baseParams:funcs.getParams()
        ,pageSizeList:[20,30,50]
    });
}


funcs.reload = function (){
    layer.closeAll('iframe');
    grid.reload();
}


//搜索
funcs.search = function()
{
    grid.query(funcs.getParams());
}

//查询条件
funcs.getParams = function (){
    return {
        parentCode:$('#parentCode').val(),
        sourceCode:$('#sourceCode').val(),
        sourceName:$('#sourceName').val()
    };
}

//编辑
funcs.editSourceInfo = function (pkId) {
    layer.open({
        type:2,
        title:'编辑子来源',
        shadeClose:false,
        shade:0.8,
        content:'/rent/sourceinfo/edit?pkId='+pkId,
        area:['510px','650px'],
        close:function(index){
            layer.close(index);
        }
    });
}

//新增
funcs.addSourceInfo = function () {
    layer.open({
        type:2,
        title:'添加子来源',
        shadeClose:false,
        shade:0.8,
        content:'/rent/sourceinfo/create',
        area:['500px','650px'],
        close:function(index){
            layer.close(index);
        }
    });
}

//详情
funcs.detail = function(pkId)
{
    layer.open({
        type:2,
        title:'子来源详情',
        shadeClose:false,
        shade:0.8,
        content:'/rent/sourceinfo/detail?pkId='+pkId,
        area:['550px','800px'],
        close:function(index){
            layer.close(index);
        }
    });
}



$(document).ready(function(){
    funcs.getSourceList();
    $(".search").click(funcs.search);
    $(".addSourceInfo").click(funcs.addSourceInfo);
    $(".showSourceLabel").click(funcs.showSourceLabel);
});

/**
 * 显示来源标签
 */
funcs.showSourceLabel = function () {
    window.location.href = '/rent/sourceinfo/sourcelabelpage';
}

/**
 * 修改来源标签关联
 * @param sourceCode
 */
funcs.editSourceLabel = function(sourceCode){
    var url = '/rent/sourceinfo/sourcelabelrelationpage?sourceCode=' + sourceCode;
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