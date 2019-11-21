var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize :10,
        height:250
        ,cm : [
          {header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
          ,{header: "商品分类", dataIndex: 'MERTYPENAME', width:'100px',sortable:false}
          ,{header: "规则名称", dataIndex: 'RULENAME',sortable:false}
          ,{header: "操作", dataIndex: '', width:'200px', sortable:false, 
            renderer : function(value, data, rowIndex, colIndex, metadata){
              var returnText = '<a href="javascript:void(0);" onclick="ruleInfo(\''+data['RULEID']+'\')" class="a_link">查看</a> | ';
              returnText += '<a href="javascript:void(0);" onclick="editRule(\''+data['RULEID']+'\')" class="a_link">修改</a> | ';
              returnText += '<a href="javascript:void(0);" onclick="delRule(\''+data['RULEID']+'\')" class="a_link">删除</a> | ';
              returnText += '<a href="javascript:void(0);" onclick="copyRule(\''+data['RULEID']+'\')" class="a_link">复制</a>  ';
              return returnText;
            }
          }
        ]
        ,url : '/rule/repair/pagelist'
        ,baseParams:initParams()
        ,pageSizeList:[10,15,20,30,50]
    });
    
    $("#addRule").click(function(){
        addRule();
    });
});

function initParams(){
    if(backFlag == 'Y'){
        var params = getParams();
        params['start'] = start;
        params['limit'] = limit;
        return params;
    }else{
        return {};
    }
}

function getParams(){
    var params = [];
    params['ruleName'] = $("#ruleName").val();
    params['merType'] = $("#merType").val();
    return params;
}

/**
 * 规则详情
 * @return
 */
function ruleInfo(ruleId){
    var start = grid.getPageSize()*(grid.getPageNumber()-1);
    window.location.href = '/rule/repair/malfunctionruleinfo?ruleId='+ruleId+'&backUrl='+encodeURI(backUrl)+'&start='+start;
}

/**
 * 添加规则
 * @return
 */
function addRule(){
    var start = grid.getPageSize()*(grid.getPageNumber()-1);
    $.layer({
        type:2,
        title:'添加所属规则',
        iframe:{src : '/rule/repair/addmalfunctionrule?backUrl='+encodeURI(backUrl)+'&start='+start},
        area : ['500', '300'],
        offset : ['50px',''],
        close : function(index){
        layer.close(index);
      }
    });
}

/**
 * 修改
 * @return
 */
function editRule(ruleId){
    var start = grid.getPageSize()*(grid.getPageNumber()-1);
    $.layer({
        type:2,
        title:'修改所属规则',
        iframe:{src : '/rule/repair/editmalfunctionrule?ruleId='+ruleId+'&backUrl='+encodeURI(backUrl)+'&start='+start},
        area : ['400', '300'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}

/**
 * 删除
 */
function delRule(ruleId){
    if(confirm('是否确认删除该规则？')){
        $.ajax({
            type:'POST'//请求方式
            ,url:"/rule/repair/delmalfunctionrule"  //请求路径
            ,data:{ruleId:ruleId} //发送到服务器的数据
            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async:false //同步请求
            ,timeout:60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success:function(data){
                if(data == "Y"){
                    window.location.href = backUrl;
                }else{
                    alert("删除失败");
                    window.location.href = backUrl;
                }
            }
        });
    }
}

/**
 * 搜索
 */
function doSearch(){
    layer.load('数据加载中...', 1);
    grid.query(getParams());
}

