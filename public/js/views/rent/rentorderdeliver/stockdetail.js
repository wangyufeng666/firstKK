var grid;
var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:5,
        height:200
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"商品名称", dataIndex:'STOCKNAME',width:'200px',sortable:false,}
            ,{header:"商品颜色", dataIndex:'STOCKCOLOR', width:'80px',sortable:false}
            ,{header:"机器码", dataIndex:'MECHINENO', width:'150px',sortable:false}
            ,{header:"操作", dataIndex:'', width:'50px', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='<a class="a_link" href="javascript:confirmSelect('+JSON.stringify(data).replace(/"/g, '&quot;')+')">选择</a>';
                    return returnText;
                }
            }
        ]
        ,url:'/rent/rentorderdeliver/stockdetaillist'
        ,baseParams:getParams()
        ,pageSizeList:[5,30,50]
    });


});

/**
 * 获取查询指定参数
 * @returns {{seedeetype: (*|jQuery), seedeename: (*|jQuery)}}
 */
function getParams(){
    return {
        stockName:$('#stockName').val(),
        mechineNo:$('#mechineNo').val()
    };
}

/**
 * 监听键盘回车事件
 */
function keyuptosearch(event) {
    if(event.keyCode == 13) {
        $(".keyuptosearch").trigger("click");
    }
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


function confirmSelect(data){
    console.log(data);
    parent.getStockInfo(data);
}








