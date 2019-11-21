var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "商品名", dataIndex: 'MERNAME', width:'80px',sortable:false}
      ,{header: "日期", dataIndex: 'CREATETIME', width:'80px',sortable:false}

      ,{header: "押金", dataIndex: 'DEPOSIT', width:'80px',sortable:false}
      ,{header: "3日租金", dataIndex: 'THREEDAYRENT', width:'80px',sortable:false}
      ,{header: "7日租金", dataIndex: 'SEVENDAYRENT', width:'80px',sortable:false}
      ,{header: "15日租金", dataIndex: 'FIFTEENDAYRENT', width:'80px',sortable:false}
      ,{header: "续租价格", dataIndex: 'RELETPRICE', width:'80px',sortable:false}
      ,{header: "分类", dataIndex: 'RENTMERTYPENAME', width:'80px',sortable:false}
      ,{header: "关键词", dataIndex: 'KEYWORDS', width:'80px',sortable:false}
      ,{header: "副标题", dataIndex: 'SUBTITLE', width:'80px',sortable:false}
      ,{header: "状态", dataIndex: 'PRICE', width:'80px',sortable:false,
          renderer : function(value, data, rowIndex, colIndex, metadata){
              return data['ENABLE']=='Y'?"启用":"禁用";
            }
      }
      ,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
          var returnText ='<a href="javascript:void(0);" onclick="edit(\''+data['MERID']+'\')" class="a_link">修改</a>&nbsp;&nbsp;|';
          var enable = data['ENABLE']=='Y'?'N':'Y';
          returnText += '&nbsp;&nbsp;<a href="javascript:void(0);" onclick="enable(\''+data['MERID']+'\',\''+enable+'\', '+rowIndex+')" class="a_link">'+(data['ENABLE']=='Y'?'禁用':'启用')+'</a>&nbsp;&nbsp;|';
          returnText += '&nbsp;&nbsp;<a href="javascript:void(0);" onclick="delProduct(\''+data['MERID']+'\')" class="a_link">删除</a>';
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

function delProduct(merId){
    if(confirm("是否删除商品？")){
        $.ajax({
            type : 'POST'//请求方式
            ,url : "/product/secondhand/delproduct"  //请求路径
            ,data : {merId:merId}  //发送到服务器的数据
            ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async : false //同步请求
            ,timeout :60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success : function(data){
                if(data!='Y')
                    alert("删除失败");
                doSearch();
            }
        });
    }
}

function enable(merId,enable, rowIndex){
    var date = grid.getData()['result'][rowIndex];
    if(date['DEPOSIT'] != null && date['THREEDAYRENT'] != null && date['SEVENDAYRENT'] != null && date['FIFTEENDAYRENT'] != null && date['RELETPRICE'] != null){
        if(confirm("是否操作？")){
            $.ajax({
                type : 'POST'//请求方式
                ,url : "/product/secondhand/enable"  //请求路径
                ,data : {merId:merId, enable:enable}  //发送到服务器的数据
                ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
                ,async : false //同步请求
                ,timeout :60000//默认超时60秒
                ,dataType:'json' //预期服务器返回的数据类型
                ,success : function(data){
                    if(data!='Y')
                        alert("删除失败");
                    doSearch();
                }
            });
        }
    }else{
        alert('请完善设备信息');
    }
}

function edit(merId){
    window.location.href = '/product/rent/editrentproduct?merId='+merId;
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}