var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		     {header: "序号", dataIndex: 'R', width:'60px',sortable:false}
		     ,{header: "券码", dataIndex: 'COUPONCODE', width:'100px',sortable:false}
		     ,{header: "类型名", dataIndex: 'TYPENAME', width:'70px',sortable:false}
		     ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'130px',sortable:false}
		     ,{header: "有效时间", dataIndex: '', width:'160px',sortable:false,
		         renderer : function(value, data, rowIndex, colIndex, metadata){
	                    return data['STARTDATE']+'~'+data['ENDDATE'];
	                }
		     }
		     ,{header: "是否有效", dataIndex: '', width:'60px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    return data['ISENABLE']=='Y'?'<font color="green">有效</font>':'<font color="red">作废</font>';
                }
		     }
               ,{header: "批次编号", dataIndex: 'BATCHCODE', width:'100px',sortable:false}
               ,{header: "关联商品名", dataIndex: 'NICKNAME', width:'',sortable:false}
	]
    ,url : '/caiwu/ydmcoupon/detaillist'
    ,baseParams:{isAll:'all'}
  });
});

function getParams(){
    return {
        batchCode:$("#batchCode").val(),
        typeName:$("#typeName").val(),
        startCreateDate:$("#startCreateDate").val(),
        endCreateDate:$("#endCreateDate").val(),
        startDate:$("#startDate").val(),
        endDate:$("#endDate").val()
    };
}

function getParamsAsThisPage(){
    return {
        batchCode:$("#batchCode").val(),
        typeName:$("#typeName").val(),
        startCreateDate:$("#startCreateDate").val(),
        endCreateDate:$("#endCreateDate").val(),
        startDate:$("#startDate").val(),
        endDate:$("#endDate").val(),
        start:(grid.getPageNumber()-1)*10
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function doSearchAsThisPsge(){
    layer.load('数据加载中...', 1);
    grid.query(getParamsAsThisPage());
}