var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :30,
		height:500
		,cm : [
		   {header:"检测师", dataIndex:'WORKERNAME', width:'50px', sortable:false}
		   ,{header:"总计", dataIndex:'COUNTS', width:'30px', sortable:false}
		   ,{header:"笔记本", dataIndex:'BJBCOUNTS', width:'30px', sortable:false}
           ,{header: "占比", dataIndex: 'BJBRATE', width:'30px',sortable:false}
           ,{header: "相机", dataIndex: 'XJCOUNTS', width:'30px',sortable:false}
           ,{header: "占比", dataIndex: 'XJRATE', width:'30px',sortable:false}
           ,{header: "手机平板", dataIndex: 'SJCOUNTS', width:'30px',sortable:false}
           ,{header: "占比", dataIndex: 'SJRATE', width:'30px',sortable:false}
           ,{header: "智能设备", dataIndex: 'ZNSBCOUNTS', width:'30px',sortable:false}
           ,{header: "占比", dataIndex: 'ZNSBRATE', width:'30px',sortable:false}
           ,{header: "台式机", dataIndex: 'TSJCOUNTS', width:'30px',sortable:false}
           ,{header: "占比", dataIndex: 'TSJRATE', width:'30px',sortable:false}
           ,{header: "电脑配件", dataIndex: 'DNPJCOUNTS', width:'30px',sortable:false}
           ,{header: "占比", dataIndex: 'DNPJRATE', width:'30px',sortable:false}
           ,{header: "其他", dataIndex: 'QTCOUNTS', width:'30px',sortable:false}
           ,{header: "占比", dataIndex: 'QTRATE', width:'30px',sortable:false}
       ]
       ,url : '/report/inspection/statisticspagelist'
       ,baseParams:getParams()
	});
});



function getParams(){
    return {
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        areaId:$('#areaId').val()
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

function inspectionbillStatistics(){
    var param = '';
    param += '&startCreateDate=' + $('#startCreateDate').val();
    param += '&endCreateDate=' + $('#endCreateDate').val();
    param += '&areaId=' + $('#areaId').val();
    window.location.href = '/report/inspection/inspectionstatistics?'+param;
    return false;
}