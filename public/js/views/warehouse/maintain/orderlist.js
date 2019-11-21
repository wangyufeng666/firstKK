var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header: "NO.", dataIndex: 'R', width:'3%',sortable:false} 
           ,{header: "维修日期", dataIndex: 'MAINTAINDATE', width:'16%',sortable:false}
           ,{header: "品类", dataIndex: 'MERTYPE', width:'8%',sortable:false}
           ,{header: "品牌", dataIndex: 'PNAME', width:'8%',sortable:false}
           ,{header: "商品名称", dataIndex: 'MERNAME', width:'10%',sortable:false}
           ,{header: "订单来源", dataIndex: 'ORDERSOURCE', width:'8%',sortable:false}
           ,{header: "交易方式", dataIndex: 'CHULITYPE', width:'8%',sortable:false}
	]
    ,url : '/warehouse/maintain/maintainorderpagelist'
    ,baseParams:{isAll:'all'}
  });
});

function getParams(){
    return {
    	orderType:$('#orderType').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        category:$('#category').val()
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