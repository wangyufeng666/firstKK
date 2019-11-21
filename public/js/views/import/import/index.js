var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'30px', sortable:false}
		   ,{header:"订单编号", dataIndex:'ORDERNO', width:'95px', sortable:false}
		   ,{header:"品类", dataIndex:'CATEGORYID', width:'70px', sortable:false}
		   ,{header:"品牌", dataIndex:'BRAND', width:'80px', sortable:false}
           ,{header:"商品名称", dataIndex:'MERNAME', width:'100px', sortable:false}
           ,{header:"下单日期", dataIndex:'ORDERDATE', width:'90px', sortable:false}
           ,{header:"联系人", dataIndex:'CONTACT', width:'85px', sortable:false}
           ,{header:"订单金额", dataIndex:'ORDERPRICE', width:'60px', sortable:false}
           ,{header:"结算金额", dataIndex:'SETTLEPRICE', width:'60px', sortable:false}
           ,{header:"支付类型", dataIndex:'PAYTYPE', width:'75px', sortable:false}
           ,{header:"订单来源", dataIndex:'ORDERSOURCE', width:'80px', sortable:false}
           ,{header:"结算日期", dataIndex:'SETTLETIME', width:'90px', sortable:false}
       ]
       ,url : '/import/import/importlist'
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