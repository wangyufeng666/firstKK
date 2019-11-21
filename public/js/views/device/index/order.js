var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'70PX',sortable:false}
			,{header: "设备编号", dataIndex: 'DEVICEID', sortable:false}
			,{header: "订单编号", dataIndex: 'DINGDANNO', width:'200px',sortable:false}
            ,{header: "订单价格", dataIndex: 'DINGDANPRICE',width:'100px',sortable:false}
            ,{header: "结算价格", dataIndex: 'SETTLEPRICE',width:'100px',sortable:false}
			,{header: "姓名", dataIndex: 'LIANXIREN',width:'150px',sortable:false}
            ,{header: "联系方式", dataIndex: 'LIANXIDH',width:'150px',sortable:false}
            ,{header: "创建时间", dataIndex: 'DINGDANSHIJ',width:'150px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'100px',sortable:false}

        ]
        ,url : '/device/index/orderinfo'
        ,baseParams:initParams()
        ,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
    if(backFlag == 'Y'){
        var params = getParams();
        params['start'] = start;
        params['limit'] = limit;
        return params;
    }else{
        return {deviceid:$('#deviceid').val()};
    }
}

function getParams(){
    return {
        deviceid:$('#deviceid').val(),
        dingdanshij1:$('#dingdanshij1').val(),
        dingdanshij2:$('#dingdanshij2').val(),
        dingdanno:$('#dingdanno').val(),
        dingdanstatus:$('#dingdanstatus').val()
    };
}



function doSearch(){
    var index = layer.load('数据加载中...',1);
    grid.query(getParams());
    layer.close(index);
}