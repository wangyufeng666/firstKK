var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:10
        ,height:250
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"订单编号", dataIndex:'ORDERNO', width:'160px',sortable:false}
            ,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
            ,{header:"商品品牌", dataIndex:'PNAME', width:'80px',sortable:false}
            ,{header:"商品名称", dataIndex:'MERNAME', width:'160px',sortable:false}
            ,{header:"联系人", dataIndex:'LIANXIREN', width:'100px',sortable:false}
            ,{header:"联系方式", dataIndex:'LIANXIDH', width:'100px', sortable:false}
            ,{header:"操作", dataIndex:'RELATION', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var order_no = data['ORDERNO'];
                    var status = data['ORDERSTATUS'];
                    if(value == '1'){
                        var returnText = '<a title="\'+order_no+\'" href="javascript:relation(\''+order_no+'\',\''+status+'\')" class="a_link">关联</a>';
                        return returnText;
                    }
                }
            }
        ]
        ,url:'/rent/rentrecy/pagelist'
    });
});

function relation(recyOrderNo,status){
    if(confirm('确认关联此订单吗？')){
        layer.open({
            type:2,
            title:'订单提交',
            shadeClose:false,
            shade:0.8,
            content:'/rent/rentrecy/relation?recyOrderNo='+recyOrderNo+'&rentOrderNo='+rentOrderNo+'&flag='+status,
            area:['400px','300px'],
            close:function(index){
                layer.close(index);
            }
        });
    }

}


function getParams(){
    return {
        recyOrderNo:$('#recyOrderNo').val(),
        contacts:$('#contacts').val(),
        contactWay:$('#contactWay').val()
    };
}

function doSearch(){
    grid.query(getParams());
}

/**
 * 重新加载
 */
function reload(){
    layer.closeAll('iframe');
    grid.reload();
}

function relationSuccess(){
    layer.closeAll('iframe');
    grid.reload();
    parent.closeLayer();
}