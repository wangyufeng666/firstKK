var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [ 
{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
,{header: "消费单号", dataIndex: 'ORDERCODE', width:'150px',sortable:false}
,{header: "消费日期", dataIndex: 'CREATETIME', width:'120px',sortable:false}
,{header: "消费人手机号", dataIndex: 'MOBILE',width:'80px',sortable:false}
,{header: "消费人", dataIndex: 'PAYEE',width:'100px',sortable:false}
,{header: "消费金额", dataIndex: 'PRICE',width:'80px',sortable:false}
,{header: "消费来源", dataIndex: 'SOURCETXT',width:'80px',sortable:false}
,{header: "IP", dataIndex: 'IP',width:'120px',sortable:false}
,{header: "消费类型", dataIndex: 'CONSUMPTIONTXT', width:'80px',sortable:false,}
,{header: "操作", dataIndex: '', width:'150px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="info(\''+data['ORDERCODE']+'\')">详情</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/yonghu/spend/pagelist'
        ,baseParams:{ordercode:$('#ordercode').val(),mobile:$('#mobile').val(),payee:$('#payee').val(),
        	createtime_start:$('#createtime_start').val(),createtime_end:$('#createtime_end').val(),
        	types:$('#types').val(),status:$('#status').val(),consumption:$('#consumption').val()}
	});
});

/**
 * 详情
 */
function info(ordercode){
	window.location.href = "/yonghu/spend/orderinfo/ordercode/"+ordercode;
}

function getParams(){
    return {
    	ordercode:$('#ordercode').val(), 
    	mobile:$('#mobile').val(),
    	payee:$('#payee').val(),
    	createtime_start:$('#createtime_start').val(),
    	createtime_end:$('#createtime_end').val(),
    	types:$('#types').val(),
    	status:$('#status').val(),
    	consumption:$('#consumption').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}