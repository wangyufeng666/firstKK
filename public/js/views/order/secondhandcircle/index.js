var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize :10,
        height:250
        ,cm : [
           {header: "序号", dataIndex: 'R', width:'1%',sortable:false}
           ,{header: "品类", dataIndex: 'CARTNO', width:'10%',sortable:false}
           ,{header: "联系方式", dataIndex: '', width:'8%',sortable:false,
               renderer : function(value, data, rowIndex, colIndex, metadata){
                    return data['CONTACTNAME']+"("+data['PHONENUM']+")";
                }
           }
           ,{header: "地址", dataIndex: 'ADDRESS', width:'5%',sortable:false}
           ,{header: "订单时间", dataIndex: 'CREATEDATE', width:'5%',sortable:false}
           ,{header: "原价", dataIndex: 'SALEPRICE', width:'5%',sortable:false}
           ,{header: "折扣价", dataIndex: 'SETTLESALEPRICE', width:'5%',sortable:false}
           ,{header: "预约时间", dataIndex: 'APPOINTVISITDATE', width:'5%',sortable:false}
           ,{header: "状态", dataIndex: 'STATUSNAME', width:'5%',sortable:false}
           ,{header: "操作", dataIndex: '', width:'7%', sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText ="";
                    var tmp='';
                    switch(data['STATUS']){
                    case '1':
                        tmp = '确认';
                        break;
                    case '2':
                        tmp = '上门';
                        break;
                    case '3':
                        tmp = '交易完成';
                        break;
                    case '4':
                    case '99':
                        break;
                    }
                    if(tmp != '')
                        returnText +='<a class="a_link" href="javascript:void(0);" onclick="orderOperation(\''+data['CARTNO']+'\')">'+tmp+'</a>&nbsp;|&nbsp;';
                    
                    returnText += '<a class="a_link" href="javascript:void(0);" onclick="cartInfo(\''+data['CARTNO']+'\')">查看详情</a>';
                    if(data['STATUS'] != '99' && data['STATUS'] !== '4')
                    returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="stopCart(\''+data['CARTNO']+'\')">终止</a>';
                    return returnText;
                }
           }
    ]
    ,url : '/order/secondhandcircle/sechondhandlist'
  });
});

function getParams(){
    return {
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        cartNo:$('#cartNo').val(),
        address:$('#address').val(),
        contactName:$('#contactName').val(),
        phoneNum:$('#phoneNum').val(),
        status:$('#status').val(),
    };
}

function doSearch(){
    layer.load('数据加载中...', 1);
    grid.query(getParams());
}


function orderOperation(cartNo){
    $.layer({
        type : 2,
        title : '订单状态修改',
        iframe : {src : '/order/secondhandcircle/operation?cartNo='+cartNo},
        area : ['500' , '320'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}

function cartInfo(cartNo){
    window.location.href = "/order/secondhandcircle/cartinfo?cartNo="+cartNo;
}

function stopCart(cartNo){
    $.layer({
        type : 2,
        title : '订单状态修改',
        iframe : {src : '/order/secondhandcircle/stopcartpage?cartNo='+cartNo},
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