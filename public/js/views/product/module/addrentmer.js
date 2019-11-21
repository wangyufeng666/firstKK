var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "品牌", dataIndex: 'BRANDSNAME', width:'80px',sortable:false}
      ,{header: "商品名", dataIndex: 'MERNAME', width:'80px',sortable:false}
      ,{header: "日期", dataIndex: 'CREATETIME', width:'80px',sortable:false}
      ,{header: "分类", dataIndex: 'RENTMERTYPENAME', width:'80px',sortable:false}
      ,{header: "状态", dataIndex: 'PRICE', width:'80px',sortable:false,
          renderer : function(value, data, rowIndex, colIndex, metadata){
              return data['ENABLE']=='Y'?"启用":"禁用";
            }
      }
      ,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
          var returnText ='<a href="javascript:void(0);" onclick="addToShowModule(\''+data['MERID']+'\')" class="a_link">添加</a>';
          return returnText;
        }
      }
    ]
    ,url : '/product/rent/rentlist'
    ,pageSizeList:[10,15,20,30,50]
  });
});

function getParams(){
    return {
        keywords:$('#keywords').val(),
    };
}

function doSearch(){
    layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function addToShowModule(merId){
    $.layer({
        type : 2,
        title : '订单状态修改',
        iframe : {src : '/product/module/addrentproduct?merId='+merId},
        area : ['500' , '320'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}