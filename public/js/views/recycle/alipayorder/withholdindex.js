var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    
{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
,{header: "创建日期", dataIndex: 'CREATEDATE', width:'100px',sortable:false}
,{header: "订单编号", dataIndex: 'ORDERNO', width:'150px',sortable:false}
,{header: "代扣编号", dataIndex: 'YDMTRADENO', width:'200px',sortable:false}
,{header: "支付编号", dataIndex: 'YDMPAYNO', width:'200px',sortable:false}
,{header: "代扣时间", dataIndex: 'WITH_STARTDATE', width:'100px',sortable:false}
,{header: "付款时间", dataIndex: 'WITH_DATE', width:'100px',sortable:false}
,{header: "支付状态", dataIndex: 'RESULT_CODE', width:'80px',sortable:false,
	renderer : function(value, data, rowIndex, colIndex, metadata){
		if(data['RESULT_CODE'] == 'ORDER_WILLPROCESS'){
			var returnText = '待扣款';
		}else if(data['RESULT_CODE'] == 'ORDER_INPROCESS'){
			var returnText = '扣款中';
		}else if(data['RESULT_CODE'] == 'TRADE_SUCCESS'){
			var returnText = '扣款成功';
		}else if(data['RESULT_CODE'] == 'ORDER_FAIL'){
			var returnText = '扣款失败';
		}else if(data['RESULT_CODE'] == 'ORDER_SUCCESS_PAY_INPROCESS'){
			var returnText = '待短信确认';
		}
		return returnText;
	}
}/*
,{header: "操作", dataIndex: '', width:'150px', sortable:false,

				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="infos(\''+data['PKID']+'\')">详情</a>';
				  	return returnText;
				}
           	}*/
        ]
        ,url : '/recycle/alipayorder/withholdpagelist'
        ,baseParams:{orderno:$('#orderno').val(),ydmtradeno:$('#ydmtradeno').val(),ydmpayno:$('#ydmpayno').val(),
        with_startdate_start:$('#with_startdate_start').val(),with_startdate_end:$('#with_startdate_end').val(),
        createdate_start:$('#createdate_start').val(),createdate_end:$('#createdate_end').val(),result_code:$('#result_code').val()}
	});
});


/**
 * 详情
 */
function infos(pkid){
	//window.location.href = "/recycle/alipayorder/withholdinfo?pkid="+pkid;
}

function goBack(){
	window.history.go(-1);
}
function getParams(){
    return {
    	orderno:$('#orderno').val(), 
    	ydmtradeno:$('#ydmtradeno').val(),
    	ydmpayno:$('#ydmpayno').val(),
    	with_startdate_start:$('#with_startdate_start').val(),
    	with_startdate_end:$('#with_startdate_end').val(),
    	createdate_start:$('#createdate_start').val(),
    	createdate_end:$('#createdate_end').val(),
    	result_code:$('#result_code').val()
    };
}
function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
