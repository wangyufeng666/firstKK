var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
      ,{header: "商品分类", dataIndex: 'MERTYPE', width:'100px',sortable:false}
      ,{header: "规则名称", dataIndex: 'RULENAME',sortable:false}
      ,{header: "规则类型", dataIndex: 'RULETYPENAME', sortable:false}
      ,{header: "规则明细", dataIndex: 'RULEDETAILNAME', sortable:false}
      ,{header: "操作", dataIndex: '', width:'200px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText = '<a href="javascript:void(0);" onclick="relate(\''+data['RULEDETAILID']+'\')" class="a_link">关联</a>  ';
          return returnText;
        }
      }
    ]
    ,url : '/rule/ruledetail/pagelist'
  });
});


/**
 * 规则详情
 * @param orderNo
 * @return
 */
function relate(ruledetailId,ruleId,ruletypeId){
	window.location.href = "/rule/ruledetail/ruleinfo?ruledetailId="+ruledetailId;
}

function getParams(){
    return {
        ruleName:$('#ruleName').val(),
        merType:$('#merType').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}