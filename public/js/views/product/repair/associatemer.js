var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize :10,
        height:250
        ,cm : [
          {header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
          ,{header: "商品名称", dataIndex: 'SPNAME', width:'250px',sortable:false}
          ,{header: "商品别名", dataIndex: 'NICKNAME', width:'250px',sortable:false}
          ,{header: "品牌", dataIndex: 'PINPAI', width:'50px',sortable:false}
          ,{header: "类型", dataIndex: 'MERTYPE', width:'50px',sortable:false}
        ]
        ,baseParams:{merType:merType}
        ,url : '/product/repair/associatemerlist'
        ,pageSizeList:[10,15,20,30,50]
        ,onRowDblclick:function(e, grid, target){
            var rowInfo = grid.getSelections()[0];
            var merId = rowInfo['SPID'];
            var merName = rowInfo['SPNAME'];
            var keywords = rowInfo['KEYWORDS'];
            var nickName = rowInfo['NICKNAME'];
            var brandName = rowInfo['PINPAI'];
            var imgPath = rowInfo['MERIMG'];
            var pcode = rowInfo['PCODE'];
            $('#merName', window.parent.document).val(merName);
            $('#keywords', window.parent.document).text(keywords);
            $('#nickName', window.parent.document).val(nickName);
            $('#associateMerName', window.parent.document).text(brandName + " " + merName);
            $('#associateMerId', window.parent.document).val(merId);
            $('#imgPath', window.parent.document).val(imgPath);
            $('#brands', window.parent.document).val(pcode)
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    });
    
    $("#search-btn").click(function(){
        doSearch();
    });
});

function getParams(){
    var params = [];
    params['merType'] = merType;
    params['merName'] = $("#merName").val();
    return params;
}

/**
 * 搜索
 */
function doSearch(){
    layer.load('数据加载中...', 1);
    grid.query(getParams());
}

