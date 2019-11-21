var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :50,
		height:500
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'30px', sortable:false}
		   ,{header:"订单编号", dataIndex:'ORDERNO', width:'95px', sortable:false}
           ,{header:"导入日期", dataIndex:'CREATEDATE', width:'90px', sortable:false}
           ,{header:"快递单号", dataIndex:'EXPRESSNO', width:'85px', sortable:false}
           ,{header:"联系人", dataIndex:'CONTACTS', width:'60px', sortable:false}
           ,{header:"联系电话", dataIndex:'CONTACTWAY', width:'80px', sortable:false}
       ]
       ,url : '/import/import/expresslist'
       ,baseParams:{isAll:'all'}
	});
});

function getParams(){
    return {
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val()
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