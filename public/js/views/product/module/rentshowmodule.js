var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
       {header: "R", dataIndex: 'R', width:'30px',sortable:false}
      ,{header: "模块ID", dataIndex: 'MODULEID', width:'80px',sortable:false}
      ,{header: "模块名称", dataIndex: 'MODULENAME', width:'80px',sortable:false}
      ,{header: "模块类型", dataIndex: 'MODULETYPE', width:'80px',sortable:false}
      ,{header: "商品名称", dataIndex: 'MERNAME', width:'80px',sortable:false}
      ,{header: "商品品牌", dataIndex: 'BRANDSNAME', width:'80px',sortable:false}
      ,{header: "日期", dataIndex: 'CREATEDATE', width:'80px',sortable:false}
      ,{header: "状态", dataIndex: '', width:'80px',sortable:false,
          renderer : function(value, data, rowIndex, colIndex, metadata){
              return data['ISENABLE']=='Y'?"启用":"禁用";
            }
      }
      ,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
          //var returnText ='<a href="javascript:void(0);" onclick="edit(\''+data['MERID']+'\')" class="a_link">修改</a>&nbsp;&nbsp;|';
          var status = data['ISENABLE']=='Y'?'N':'Y';
          var returnText = '&nbsp;&nbsp;<a href="javascript:void(0);" onclick="changeStatus(\''+data['MERID']+'\',\''+data['MODULEID']+'\',\''+status+'\')" class="a_link">'+(data['ISENABLE']=='Y'?'禁用':'启用')+'</a>&nbsp;&nbsp;|';
          returnText += '&nbsp;&nbsp;<a href="javascript:void(0);" onclick="delShowProduct(\''+data['MODULEID']+'\', \''+data['MERID']+'\')" class="a_link">删除</a>';
          return returnText;
        }
      }
    ]
    ,url : '/product/module/merlist'
    ,pageSizeList:[10,15,20,30,50]
    ,baseParams:{mersaleType:3}
  });
});


function changeStatus(merId, moduleId, status){
    if(confirm("是否操作？")){
        $.ajax({
            type : 'POST'//请求方式
            ,url : "/product/module/changeshowstatus"  //请求路径
            ,data : {merId:merId, moduleId:moduleId, status:status}  //发送到服务器的数据
            ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async : false //同步请求
            ,timeout :60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success : function(data){
                if(data.flag != '1')
                    alert("操作失败");
                doSearch();
            }
        });
    }
}


function delShowProduct(moduleId, merId){
    if(confirm("是否操作？")){
        $.ajax({
            type : 'POST'//请求方式
            ,url : "/product/module/delshowproduct"  //请求路径
            ,data : {moduleId:moduleId, merId:merId}  //发送到服务器的数据
            ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async : false //同步请求
            ,timeout :60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success : function(data){
                if(data.flag != '1')
                    alert("操作失败");
                doSearch();
            }
        });
    }
}

function getParams(){
    return {
        moduleName:$('#moduleName').val(),
        moduleId:$('#moduleId').val(),
        merSaleType:$('#merSaleType').val()
    };
}

function doSearch(){
    layer.load('数据加载中...', 1);
    grid.query(getParams());
}