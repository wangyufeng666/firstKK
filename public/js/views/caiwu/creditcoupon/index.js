var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm : [
        	{header: "No.", dataIndex: 'R', width:'40px',sortable:false} 
    	   ,{header: "联系方式", dataIndex: 'CONTACTWAY', width:'80px',sortable:false}
           ,{header: "订单号", dataIndex: 'ORDERNO', width:'80px',sortable:false}
           ,{header: "下单日期", dataIndex: 'WINDATE', width:'100px',sortable:false}
           ,{header: "兑换码", dataIndex: 'PRIZECODE', width:'100px',sortable:false}
           ,{header: "券码状态", dataIndex: 'PRIZESTATUS', width:'80px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					if(value == '1'){
						return '<font color="green">未使用</font>';
					}else if(value == '2'){
						return '<font color="red">已使用</font>';
					}else if(value == '3'){
						return '<font color="red">已作废</font>';
					}
				}
           }
    ]
    ,url : '/caiwu/creditcoupon/orderpagelist'
    ,pageSizeList:[20,30,50]
  });
});

function getParams(){
    return {
    	contacts:$('#contacts').val(),
    	prizeCode:$('#prizeCode').val(), 
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
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